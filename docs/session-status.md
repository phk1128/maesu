# 세션 체크포인트 (2026-06-12)

## 이번 세션에서 완료한 것

### 1. 데이터 정리
- 적분 응용 카테고리 중복 공식 삭제 (Supabase DB, ID 134~139), 시퀀스 리셋

### 2. Supabase Auth — 카카오 OAuth (커밋 `7235af6`)
- `@supabase/supabase-js` SDK 추가, `frontend/src/lib/supabase.ts` 클라이언트
- `LoginPage.tsx` — 카카오 공식 심볼 버튼 + `supabase.auth.signInWithOAuth`
- `App.tsx` — `onAuthStateChange` 리스너, 로그인 시 홈 이동
- 카카오 비즈앱 전환 완료, `account_email` 선택 동의
- Backend: `spring-boot-starter-oauth2-resource-server` (JWKS ES256 검증)
- `SecurityConfig.kt` — 커스텀 `JwtDecoder` 빈 (ES256 알고리즘 명시)

### 3. 북마크 (구 즐겨찾기) 영속화 (커밋 `7235af6`, `d94f6b9`)
- `user_favorites` 테이블 + favorite 헥사고날 모듈
- `GET /api/favorites`, `POST /api/favorites/{formulaId}` (토글)
- 비로그인 시 "로그인이 필요합니다" 토스트, optimistic update + rollback
- 하트 아이콘 → 책갈피 아이콘, "즐겨찾기" → "북마크" 전체 변경
- `FavoritesPage.tsx` 신규 — 북마크 전체 목록 (해제 가능)
- MyPage: 타일 형태로 변경, 클릭 시 FavoritesPage 이동
- `GET /api/formulas/popular` — 북마크 수 기준 인기 공식 Top 3

### 4. 학습 잔디 (Study Logs) 실데이터 (커밋 `d94f6b9`)
- `study_logs` 테이블 — `UNIQUE(user_id, activity_type, target_id, studied_at)`, `ON CONFLICT DO NOTHING`
- `studylog` 헥사고날 모듈 — `POST /api/study-logs`, `GET /api/study-logs/grid?weeks=18`
- `markStudied` → `recordStudy()` API 호출 + grid 재조회
- MyPage: mock `CONTRIB_GRID` → API 기반 실데이터 잔디
- `buildContribGrid` 유틸 추출 (`frontend/src/utils/studyGrid.ts`)
- 타임존 버그 수정, 입력 검증 (activityType 화이트리스트, weeks 상한 52)

### 5. 대학교 시험 일정 (커밋 `d94f6b9`)
- `universities` (16개), `exam_schedules` (32개) 테이블 + 시드 데이터
- `university` 헥사고날 모듈 — `GET /api/universities?mathType=수학단독`
- 2026학년도 시험일 입력, 2027학년도 미발표(null)
- ExamCountdown: API 기반 슬라이드 카드 (4초 자동, 터치 스와이프, 인디케이터)
- 작년 시험일정 표시 (배경 박스, mono 폰트)

### 6. UI/UX 대규모 개선 (커밋 `d94f6b9`)
- 폰트: SUIT Variable(본문) + Pretendard(제목), Noto Serif KR 제거
- 홈 상단: Logo 박스 → "MAESU" 텍스트, 우측 사람 아바타 아이콘
- 홈: 잔디 제거 → "중요 공식 Top 3" + "학습 메뉴"
- 푸터: 공식/기출 탭 제거 (홈 + 내정보만)
- AppHeader `title` ReactNode 지원 (공식 LaTeX 헤더)
- 카테고리: 앞글자 박스 제거, 공식 미리 로드 (... 표시 제거), 개수 오른쪽 표시
- MyPage: "내정보" → "My Page", 결제/버전 정보 제거
- 설정: 톱니바퀴 제거, 알림 종 아이콘, DM 문의(인스타 그라데이션 로고)
- `<title>` → "편입수학"

### 7. 배포 (커밋 `7f40142`)
- API base URL 환경변수 분리 (`VITE_API_BASE_URL`)
- **Vercel 프론트엔드 배포 완료** (maesu's projects)
- GitHub push 완료

## 현재 아키텍처

### Backend 모듈 구조 (헥사고날)
```
com.colosseum.backend/
├── common/          — ApiResponse, GlobalExceptionHandler
├── config/          — SecurityConfig (ES256 JWKS JwtDecoder)
├── formula/         — 공식 CRUD + GET /api/formulas/popular
├── favorite/        — 북마크 토글 + 인기 공식 집계
├── studylog/        — 학습 기록 + 잔디 grid API
└── university/      — 대학교 + 시험 일정
```

### DB 테이블
| 테이블 | 설명 |
|--------|------|
| `categories` | 공식 카테고리 (14개) |
| `formulas` | 공식 (133개) |
| `user_favorites` | 유저 북마크 (user_id UUID, formula_id) |
| `study_logs` | 학습 기록 (user_id, activity_type, target_id, studied_at) |
| `universities` | 편입수학 시행 대학교 (16개) |
| `exam_schedules` | 학년도별 시험 일정 (32개) |

### API 엔드포인트
| 엔드포인트 | 인증 | 설명 |
|-----------|------|------|
| `GET /api/categories` | 공개 | 카테고리 목록 |
| `GET /api/categories/{id}/formulas` | 공개 | 카테고리별 공식 |
| `GET /api/formulas/{id}` | 공개 | 공식 상세 |
| `GET /api/formulas/popular` | 공개 | 인기 공식 Top N |
| `GET /api/universities?mathType=` | 공개 | 대학 + 시험 일정 |
| `GET /api/favorites` | 인증 | 내 북마크 목록 |
| `POST /api/favorites/{formulaId}` | 인증 | 북마크 토글 |
| `POST /api/study-logs` | 인증 | 학습 기록 저장 |
| `GET /api/study-logs/grid?weeks=` | 인증 | 잔디 grid 데이터 |

### 환경 설정
- **Supabase**: `whyumsehphqhenqvxwuo` (maesuDB), Kakao Auth, "Allow users without email" ON
- **카카오 개발자**: 비즈앱, account_email 선택 동의
- **JWT**: ECC P-256, JWKS `https://whyumsehphqhenqvxwuo.supabase.co/auth/v1/.well-known/jwks.json`
- **Backend 환경변수**: `DB_PASSWORD`
- **Frontend 환경변수**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`
- **Vercel**: 프론트 배포 완료 (백엔드 미연결)
- **CloudFront**: `d10g4nh94fyj2h.cloudfront.net` (백엔드용)

### 8. 백엔드 배포 파이프라인 (커밋 `6ee9486`)
- `backend/Dockerfile` — `eclipse-temurin:21-jre-alpine`
- `backend/docker-compose.yml` — `maesu-backend` 컨테이너
- `.github/workflows/deploy.yml` — main push 시 자동 배포 (빌드 → Docker Hub → EC2)
- `SecurityConfig.kt` — CORS 설정 (localhost:5173, maesu.vercel.app)
- `backend/config/checkstyle/checkstyle.xml` — Checkstyle 린터 (메서드 15줄, 파라미터 3개, depth 2, star import 금지)

### GitHub Secrets 설정 필요
| Secret | 설명 |
|--------|------|
| `DOCKERHUB_USERNAME` | Docker Hub 사용자명 |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token |
| `EC2_HOST` | EC2 퍼블릭 IP |
| `EC2_USERNAME` | `ec2-user` 또는 `ubuntu` |
| `EC2_PRIVATE_KEY` | EC2 SSH 키 (pem, `-----BEGIN...` ~ `-----END...` 까지) |
| `DB_PASSWORD` | Supabase DB 비밀번호 |

## 다음에 해야 할 것
- **GitHub Secrets 설정** → push하면 자동 배포
- **Vercel `VITE_API_BASE_URL`** = `https://d10g4nh94fyj2h.cloudfront.net` 설정 후 Redeploy
- 공식 상세 LaTeX 미리보기 제거 (FormulaDetailPage "같은 단원 다른 공식")
- 백엔드 N+1 제거 (loadById JOIN FETCH)
- 백엔드 페이로드 분리 (목록에서 svg/contentMd 제외)
- MyPage 학습 통계 서버 연동 (현재 history는 메모리, study_logs와 이중 관리)
- 커스텀 도메인 설정

## 주의사항
- 정식 작업 경로: `/Users/phk/IdeaProjects/maesu`
- 프론트 공식 캐시: 세션 메모리 캐시 (새로고침 시 초기화, 의도된 동작)
- `.env.local`은 git 미포함
- EC2 SSH 키에 `%` 기호 넣지 말 것 (터미널 표시 기호일 뿐)
