---
name: project-progress-formula-memorization
description: 공식암기 기능(docs/data 공식 → 프론트 표시) 풀스택 구현 진행 체크포인트
metadata: 
  node_type: memory
  type: project
  originSessionId: 04c8f091-2163-4727-8bc4-db4d35754165
---

# 공식암기 기능 구현 체크포인트 (2026-06-11)

## 목표
`docs/data/편입수학_카테고리분류.md`의 공식들을 프론트엔드 "공식암기"에 기획서(`docs/edu-math-service-plan.md`)에 맞게 표시.
사용자 선택: **풀스택(백엔드 시드/API + 프론트 연동) + 블록 충실 렌더**.

## 핵심 설계 결정
- **데이터 구조**: 미적분 영역 1개, **14개 세부단원(##)**, **139개 공식 블록**(SVG 57개 포함).
- **3단 매핑**: 프론트 기존 UI(영역→세부단원→공식)에 그대로 매핑. 미적분 영역의 subpart = 14 세부단원, 그 안에 블록.
- **블록 2유형**: ①수식 블록(`###`/`####` 리프 = 제목+다중 LaTeX/표/리스트 → content_md) ②그래프 블록(`**(n)** $수식$`+SVG, 기획서 §2.3대로 개별 분리).
- **importance(중요도) 미사용** — 기획서 §10 결정 준수. 실데이터엔 별점 적용 안 함.
- **백엔드**: `ddl-auto: validate` + 원격 Supabase DB 사용 중. DB 접속 불가하여 컴파일 검증까지만. 원격 prod에 시드 오실행 방지 위해 `sql.init` 비활성 기본 예정.
- KaTeX가 index.html에 없음 → CDN 추가 필요(기존 Tex 컴포넌트는 `window.katex` 사용).

## 완료한 것
1. **하네스 갱신**(이전 작업): backend/CLAUDE.md + backend-builder/qa-reviewer/SKILL에 헥사고날·DDD·OOP·클린코드·Spring Boot 4.x 공식문서(context7) 참조 지침 추가.
2. **파서 작성**: `scripts/parse-formulas.mjs` — md → ① `scripts/out/formulas.json` ② `frontend/src/data/formulas.generated.ts`(730KB) ③ `backend/src/main/resources/db/data.sql`(categories 14 + formulas 139 INSERT). SVG 빈줄 제거(§4.4), 단일따옴표 이스케이프, ON CONFLICT, setval 포함. **실행 검증 완료**(units=14, formulas=139, svg=57).
3. **백엔드 도메인(작성 중)**: `formula/domain/Area.kt`, `Category.kt` 작성 완료(순수 Kotlin, DDD 애그리거트 루트, 식별자 동등성).

## 다음에 해야 할 것 (Task #3~#6)
- **백엔드 헥사고날 나머지**:
  - `formula/domain/`: `Formula.kt`(애그리거트 루트), `FormulaContent.kt`(VO: contentMd+svg).
  - `formula/application/port/in/`: GetCategories, GetFormulasByCategory(§7.2), (선택)GetFormula.
  - `formula/application/port/out/`: CategoryRepository, FormulaRepository 포트.
  - `formula/application/service/`: FormulaQueryService.
  - `formula/adapter/in/web/`: CategoryController, FormulaController + DTO(ApiResponse 래퍼는 common).
  - `formula/adapter/out/persistence/`: CategoryJpaEntity, FormulaJpaEntity, Spring Data Repository, PersistenceAdapter, 매퍼(JPA↔도메인 분리).
  - `common/`: ApiResponse, GlobalExceptionHandler.
  - `src/main/resources/schema.sql`(§3.2 DDL, IF NOT EXISTS) + data.sql 위치 설정. 초기화 방법 문서화(sql.init 기본 never).
- **엔드포인트**: GET /api/categories, GET /api/categories/{id}/formulas, GET /api/formulas/{id}.
- **프론트(Task #5)**: Formula 타입을 블록 모델(contentMd, svg)로 확장. content_md(마크다운+KaTeX 다중수식+표) + SVG 렌더 컴포넌트 신규 작성(라이브러리 없음→경량 직접 구현). index.html에 KaTeX CDN 추가. FormulaRow/FormulaCategoryPage/FormulaDetailPage를 14단원·블록 구조로 갱신. mock.ts의 FORMULA_TREE/getFormulasBy/getFormula를 generated 데이터로 교체. API 클라이언트(`src/api/`) 추가 + VITE_API_BASE 있으면 API, 없으면 생성 데이터 폴백.
- **검증(Task #6)**: `./gradlew compileKotlin`, `npm run build` 통과 확인. QA 체크리스트(헥사고날/DDD/기획서 정합성).

## 주의사항
- 파서 산출물은 자동생성 — 수정 시 `node scripts/parse-formulas.mjs` 재실행.
- 백엔드 패키지: `com.colosseum.backend.formula.{domain,application,adapter}` (헥사고날, 의존성 adapter→application→domain).
- `적분법` 세부단원은 56개 적분이 한 블록(### 3.1 적분 공식)에 묶임 — 기획서 블록 모델대로 정상.
