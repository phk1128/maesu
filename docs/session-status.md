# 공식 로딩 성능 개선 + 인증/즐겨찾기 세션 체크포인트 (2026-06-12)

## 목표
1. 공식암기 화면에서 백엔드 데이터 로딩이 느린 문제 해결.
2. Supabase Auth(카카오 OAuth) 로그인 + 즐겨찾기 DB 영속화.

## 원인 분석 (확인된 사실)
공식 하나로 이동할 때마다 요청 2번 발생:
1. `GET /formulas/{id}` — 공식 본문
2. `GET /categories/{categoryId}/formulas` — 카테고리 전체 공식(관련 공식 3개 노출용)

게다가 `FormulaDetailPage`가 컴포넌트 `useState`만 써서 **이동마다 처음부터 재요청**, 캐시 없음. 추가 병목:
- **백엔드 N+1**: `FormulaPersistenceAdapter.loadById`가 formulas 조회 후 categories 또 조회 (DB 왕복 2번).
- **인덱스 없음**: `formulas.category_id`에 인덱스 부재 → 카테고리별 조회 시 풀스캔.
- **페이로드 비대**: 공식마다 SVG(1~3KB)가 통째로 응답에 포함.

## 완료한 것

### 성능 개선 (2026-06-11)
1. **프론트 캐싱** (`frontend/src/api/formulas.ts`)
   - `fetchCategories` / `fetchFormulasByCategory` / `fetchFormula` 에 모듈 레벨 캐시 추가.
   - **Promise 자체를 캐싱** → 결과 캐시 + 동시 요청 dedup 동시 처리.
   - `fetchFormulasByCategory`가 목록 수신 시 **개별 공식도 미리 캐시** → 관련 공식 상세 진입 시 재요청 0번.
   - 실패한 요청은 캐시하지 않음(재시도 가능).
   - 공식 데이터는 정적이라 세션 동안 캐시 안전.
2. **DB 인덱스** — 사용자가 직접 생성:
   `CREATE INDEX idx_formulas_category_id ON formulas(category_id);`
3. **공식 목록 미리보기 제거** (`frontend/src/pages/FormulaCategoryPage.tsx`)
   - 제목 아래 회색 LaTeX 미리보기 줄 제거.

### 데이터 정리 (2026-06-12)
4. **적분 응용 중복 공식 삭제** — Supabase DB에서 ID 134~139 (수동 추가분) 삭제, 시퀀스 133으로 리셋.

### Supabase Auth + 즐겨찾기 (2026-06-12, 커밋 `7235af6`)
5. **카카오 OAuth 로그인** (Supabase Auth)
   - `@supabase/supabase-js` 추가, `frontend/src/lib/supabase.ts` 클라이언트 생성.
   - `LoginPage.tsx` — 카카오 공식 심볼 버튼으로 `supabase.auth.signInWithOAuth` 호출.
   - `App.tsx` — `supabase.auth.onAuthStateChange` 리스너로 인증 상태 관리, 로그인 시 홈으로 이동.
   - 카카오 비즈앱 전환 완료 (account_email 선택 동의 설정).
   - `.env.local` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 설정.
6. **Backend JWT 검증**
   - `spring-boot-starter-oauth2-resource-server` 사용 (Supabase JWKS 엔드포인트 기반 ES256 검증).
   - `SecurityConfig.kt` — `/api/favorites/**` authenticated, 나머지 permitAll.
   - Supabase JWT 키가 ECC P-256으로 전환되어 JWKS 방식 채택 (jjwt HMAC 방식 대신).
7. **즐겨찾기 API** (헥사고날 아키텍처)
   - `user_favorites` 테이블 (user_id UUID, formula_id, unique constraint, 인덱스).
   - `GET /api/favorites` — 현재 유저의 즐겨찾기 formula ID 목록.
   - `POST /api/favorites/{formulaId}` — 토글 (추가/제거).
   - domain → port → service → adapter 구조 (기존 formula 모듈과 동일 패턴).
8. **프론트 즐겨찾기 연동**
   - 비로그인 시 하트 클릭 → "로그인이 필요합니다" 토스트.
   - 로그인 시 optimistic update + `toggleFavoriteApi` 호출 (실패 시 롤백).
   - 로그인 성공 시 `fetchFavorites()`로 서버 즐겨찾기 복원.
9. **MyPage 카카오 로그인 버튼** — 공식 심볼 + #FEE500 배경으로 변경.

## 다음에 해야 할 것
- **(선택) 상세 페이지 미리보기 제거**: `FormulaDetailPage.tsx`의 "같은 단원 다른 공식" 목록에도 동일한 LaTeX 미리보기가 남아 있음.
- **(선택) 백엔드 페이로드 분리**: 목록 응답에서 `svg`/`contentMd` 제외한 요약 DTO.
- **(선택) 백엔드 N+1 제거**: `loadById`에서 JPQL `LEFT JOIN FETCH`.
- **로그아웃 테스트**: signOut 플로우 검증.
- **즐겨찾기 E2E 테스트**: 로그인 → 하트 클릭 → 새로고침 → 유지 확인.

## 환경 설정 참고
- **Supabase 프로젝트**: `whyumsehphqhenqvxwuo` (maesuDB)
- **Supabase Auth**: Kakao provider 활성화, "Allow users without email" ON
- **카카오 개발자**: 비즈앱 전환 완료, account_email 선택 동의 설정
- **JWT 서명**: ECC P-256 (JWKS 엔드포인트: `https://whyumsehphqhenqvxwuo.supabase.co/auth/v1/.well-known/jwks.json`)
- **Backend 환경변수**: `DB_PASSWORD` (SUPABASE_JWT_SECRET는 JWKS 방식으로 전환되어 불필요)
- **Frontend 환경변수**: `.env.local`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## 주의사항
- 정식 작업 경로는 `/Users/phk/IdeaProjects/maesu` 하나뿐.
- 프론트 공식 캐시는 세션 메모리 캐시라 새로고침 시 초기화됨(의도된 동작).
- `.env.local`은 git에 포함하지 않음 (anon key는 공개 키이므로 노출 무관하나 관례상 제외).
