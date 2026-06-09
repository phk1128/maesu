---
name: backend-build
description: "편입수학 백엔드 빌드 오케스트레이터. Spring Boot + Kotlin으로 Entity, Repository, Service, Controller, 시드 데이터, Spring AI 연동을 생성하고 검증한다. '백엔드 만들어줘', 'API 구현', '엔티티 생성', '시드 데이터', '테이블 만들어', '자동 태깅 구현', 'AI 챗봇', 'DB 스키마', '백엔드 Phase 1/2/3' 등의 요청 시 사용. 후속 작업: '다시 빌드', 'API 수정', '엔티티 수정', '백엔드 업데이트', '빌드 에러 수정', '엔드포인트 추가', '테스트 추가', '백엔드 보완', '이전 결과 개선' 요청 시에도 반드시 이 스킬을 사용."
---

# Backend Build Orchestrator

편입수학 백엔드(Spring Boot + Kotlin)의 전체 구현을 조율하는 오케스트레이터. 기획서(`../docs/edu-math-service-plan.md`)를 기반으로 Entity, API, 시드 데이터, AI 연동까지 단계적으로 구현하고 검증한다.

## 실행 모드: 서브 에이전트

## 에이전트 구성

| 에이전트 | 정의 파일 | 역할 | 출력 |
|---------|----------|------|------|
| backend-builder | `.claude/agents/backend-builder.md` | Spring Boot 코드 생성/수정 | `src/` Kotlin 소스 |
| qa-reviewer | `.claude/agents/qa-reviewer.md` | 빌드·테스트·기획서 정합성 검증 및 수정 | 검증 결과 + 수정된 파일 |

## 프로젝트 Phase 매핑

기획서 §9의 작업 순서에 따라 사용자 요청을 Phase로 매핑한다:

| 프로젝트 Phase | 핵심 작업 | 키워드 |
|---------------|----------|--------|
| Phase 1 (MVP) | DDL Entity, categories/formulas/tags 시드, 3개 API (§7.1~7.3) | 엔티티, 시드, MVP, 공식 목록, 태그 검색, 추천 |
| Phase 2 (문제 기능) | problems CRUD, 자동 태깅 API (Spring AI + Claude), 키워드 검색 | 문제 등록, 자동 태깅, OCR, 검색 |
| Phase 3 (고도화) | AI 챗봇 (SSE 스트리밍), pgvector 임베딩, 추가 영역 콘텐츠 | 챗봇, 임베딩, 벡터, 스트리밍 |

## 워크플로우

### Phase 0: 컨텍스트 확인

1. `src/main/kotlin/com/colosseum/backend/` 디렉토리의 현재 상태를 확인한다:
   - **초기 상태** (BackendApplication.kt만 존재) → 초기 실행. Phase 1로 진행
   - **코드 존재** + 사용자가 부분 수정 요청 → 부분 재실행. backend-builder에 수정 대상만 전달
   - **코드 존재** + 사용자가 새 기능 요청 → 확장 실행. 기존 코드 위에 추가 구현
2. 기획서 `../docs/edu-math-service-plan.md` 읽기
3. 사용자 요청을 프로젝트 Phase로 매핑

### Phase 1: 준비

1. 사용자 요청 분석 — 구현할 범위 결정
2. 기존 코드가 있으면 현재 구현 상태 파악 (어떤 Entity/API가 이미 존재하는지)
3. backend-builder에 전달할 구체적 작업 목록 작성

### Phase 2: 백엔드 빌드 (backend-builder 에이전트)

backend-builder 에이전트를 호출한다. 프로젝트 Phase에 따라 프롬프트를 조정한다.

**Phase 1 MVP 예시:**
```
Agent(
  prompt: ".claude/agents/backend-builder.md의 지침을 따라 작업하라.
    기획서: ../docs/edu-math-service-plan.md
    콘텐츠 원본: ../docs/data/편입수학_카테고리분류.md
    
    다음을 구현하라:
    1. 공통 — BaseEntity(created_at, updated_at), API 응답 래퍼, 예외 처리
    2. Entity — categories, formulas, tags, formula_tags (기획서 §3.2 DDL 기반)
    3. Repository — 기획서 §7의 3개 핵심 쿼리를 JPQL/네이티브 쿼리로 구현
    4. Service — 공식 목록 조회, 태그 기반 검색, 문제→공식 추천
    5. Controller — REST API 엔드포인트 (GET /api/categories/{id}/formulas 등)
    6. 시드 데이터 — categories 14행 INSERT SQL, tags 시드 SQL (기획서 §6.2)
    7. application.yml — PostgreSQL 연결 설정 (로컬 개발용)
    
    완료 후 ./gradlew compileKotlin을 실행하여 컴파일 에러가 없는지 확인하라.",
  model: "opus"
)
```

**Phase 2 문제 기능 예시:**
```
Agent(
  prompt: ".claude/agents/backend-builder.md의 지침을 따라 작업하라.
    기획서: ../docs/edu-math-service-plan.md
    
    기존 코드 위에 다음을 추가 구현하라:
    1. Entity — problems, problem_tags, problem_formulas (§3.2)
    2. Repository — 문제 CRUD + 문제→공식 추천 쿼리 (§7.1)
    3. Service — 문제 등록, 자동 태깅 (Spring AI + Claude API, §8)
    4. Controller — POST /api/problems, GET /api/problems/{id}/formulas
    5. AI 연동 — Spring AI로 Claude API 호출, 태그 추출 프롬프트 (§8.3)
    
    기존 Entity/Service와의 연관관계를 올바르게 설정하라.",
  model: "opus"
)
```

**Phase 3 고도화 예시:**
```
Agent(
  prompt: ".claude/agents/backend-builder.md의 지침을 따라 작업하라.
    기획서: ../docs/edu-math-service-plan.md
    
    기존 코드 위에 다음을 추가 구현하라:
    1. AI 챗봇 — SSE 스트리밍 엔드포인트, Spring AI ChatClient
    2. pgvector — formulas.embedding 컬럼 추가, VectorStore 설정
    3. 임베딩 기반 추천 — 태그 매칭 + 벡터 유사도 가중합 랭킹
    
    기존 추천 로직(태그 기반)을 유지하면서 임베딩 결과를 보강하는 방식으로 구현하라.",
  model: "opus"
)
```

### Phase 3: QA 검증 (qa-reviewer 에이전트)

Phase 2 완료 후 qa-reviewer 에이전트를 호출한다:

```
Agent(
  prompt: ".claude/agents/qa-reviewer.md의 지침을 따라 작업하라.
    기획서: ../docs/edu-math-service-plan.md
    검증 대상: src/ 디렉토리의 모든 코드
    
    검증 항목:
    1. ./gradlew build 성공 확인
    2. Entity가 DDL(§3.2)의 모든 테이블/컬럼을 반영하는지 대조
    3. 필드 정책(§3.3) 준수 여부 확인
    4. 핵심 쿼리(§7)가 Repository에 올바르게 구현되었는지 확인
    5. Controller 응답 DTO ↔ Entity 필드 간 shape 일치 확인
    6. 외래키 관계가 JPA 연관관계로 올바르게 매핑되었는지 확인
    
    문제 발견 시 직접 수정하고 재빌드하라.",
  model: "opus"
)
```

### Phase 4: 결과 보고

1. qa-reviewer의 검증 결과를 사용자에게 요약 보고
2. 생성/수정된 파일 목록과 패키지 구조 제시
3. 다음 단계 안내:
   - DB가 없으면 PostgreSQL 설정 안내
   - 시드 데이터 실행 방법 안내
   - `./gradlew bootRun`으로 서버 시작 안내

## 데이터 흐름

```
[오케스트레이터]
    │
    ├── Phase 2: Agent(backend-builder)
    │       입력: 기획서 + 콘텐츠 원본 + 작업 지시
    │       출력: src/ (Entity, Repository, Service, Controller, 설정, 시드)
    │
    └── Phase 3: Agent(qa-reviewer)
            입력: src/ (Phase 2 산출물) + 기획서 (대조용)
            출력: 검증 결과 + 수정된 파일
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| backend-builder 컴파일 실패 | builder가 자체 수정 시도. 실패 시 qa-reviewer에서 재수정 |
| qa-reviewer 빌드 실패 | qa-reviewer가 직접 수정 (최대 3회). 실패 시 남은 에러 보고 |
| 기획서에 없는 요구사항 | 기획서 §10 의사결정 기록 참고하여 합리적 추론 |
| DB 연결 실패 (테스트 시) | 컴파일 검증만 수행, DB 연결 테스트는 건너뜀 |
| 의존성 충돌 | build.gradle.kts 수정 후 재빌드 |

## 테스트 시나리오

### 정상 흐름 (Phase 1 MVP)
1. 사용자: "백엔드 Phase 1 구현해줘"
2. Phase 0: src/에 BackendApplication.kt만 존재 → 초기 실행
3. Phase 1: 기획서 읽기 → Phase 1 MVP 범위 결정
4. Phase 2: backend-builder가 Entity 6개, Repository, Service, Controller, 시드 SQL, 설정 생성 → compileKotlin 성공
5. Phase 3: qa-reviewer가 빌드·기획서 대조 → 모두 통과
6. Phase 4: 결과 요약 + DB 설정 안내

### 에러 흐름
1. Phase 2에서 backend-builder가 JPA 연관관계 매핑 오류로 컴파일 실패
2. backend-builder가 자체 수정 시도하지만 실패
3. qa-reviewer에게 전달 → qa-reviewer가 Entity 관계 수정
4. 재빌드 성공
5. 결과 보고에 "Entity 연관관계 수정됨" 명시
