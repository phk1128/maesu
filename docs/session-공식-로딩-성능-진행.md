# 공식 로딩 성능 개선 세션 체크포인트 (2026-06-11)

## 목표
공식암기 화면에서 백엔드 데이터 로딩이 느린 문제 해결. 특히 **공식 간 이동 시마다 "불러오는 중..." 스피너**가 뜨는 현상 개선.

## 원인 분석 (확인된 사실)
공식 하나로 이동할 때마다 요청 2번 발생:
1. `GET /formulas/{id}` — 공식 본문
2. `GET /categories/{categoryId}/formulas` — 카테고리 전체 공식(관련 공식 3개 노출용)

게다가 `FormulaDetailPage`가 컴포넌트 `useState`만 써서 **이동마다 처음부터 재요청**, 캐시 없음. 추가 병목:
- **백엔드 N+1**: `FormulaPersistenceAdapter.loadById`가 formulas 조회 후 categories 또 조회 (DB 왕복 2번).
- **인덱스 없음**: `formulas.category_id`에 인덱스 부재 → 카테고리별 조회 시 풀스캔.
- **페이로드 비대**: 공식마다 SVG(1~3KB)가 통째로 응답에 포함.

## 완료한 것
1. **프론트 캐싱** (`frontend/src/api/formulas.ts`)
   - `fetchCategories` / `fetchFormulasByCategory` / `fetchFormula` 에 모듈 레벨 캐시 추가.
   - **Promise 자체를 캐싱** → 결과 캐시 + 동시 요청 dedup 동시 처리.
   - `fetchFormulasByCategory`가 목록 수신 시 **개별 공식도 미리 캐시** → 관련 공식 상세 진입 시 재요청 0번.
   - 실패한 요청은 캐시하지 않음(재시도 가능).
   - 공식 데이터는 정적이라 세션 동안 캐시 안전.
2. **DB 인덱스** — 사용자가 직접 생성:
   `CREATE INDEX idx_formulas_category_id ON formulas(category_id);`
   (참고: `application.yml`의 `spring.sql.init.mode: always` 라서 `schema.sql`에 `CREATE INDEX IF NOT EXISTS`로 넣으면 백엔드 재시작 시 자동 적용됨. Supabase MCP 불필요.)
3. **공식 목록 미리보기 제거** (`frontend/src/pages/FormulaCategoryPage.tsx`)
   - 제목 아래 회색 LaTeX 미리보기 줄 제거(깨져 보이던 "파푸스 정리 = " 등 해결).
   - 미사용 `Tex`, `titleContainsLatex` import 정리. 제목은 `TexTitle`만 유지.

## 다음에 해야 할 것
- **(선택) 상세 페이지 미리보기 제거**: `FormulaDetailPage.tsx`의 "같은 단원 다른 공식" 목록에도 동일한 LaTeX 미리보기가 남아 있음 — 일관성 위해 제거 여부 결정.
- **(선택, 3순위) 백엔드 페이로드 분리**: 목록 응답(`/categories/{id}/formulas`)에서 `svg`/`contentMd` 제외한 요약 DTO 제공, SVG는 상세에서만 → 카테고리 응답 크기 축소.
- **(선택, 4순위) 백엔드 N+1 제거**: `loadById`에서 카테고리 별도 조회 대신 JPQL `LEFT JOIN FETCH`.
- **빌드 검증**: 현재 `frontend/node_modules` 미설치로 타입체크 미실행. `cd frontend && npm install && npm run build`로 확인 필요.

## 주의사항
- 정식 작업 경로는 `/Users/phk/IdeaProjects/maesu` 하나뿐 (과거 WebstormProjects 사본은 2026-06-11 정리됨).
- 프론트 캐시는 세션 메모리 캐시라 새로고침 시 초기화됨(의도된 동작).