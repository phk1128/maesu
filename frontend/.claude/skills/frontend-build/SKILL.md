---
name: frontend-build
description: "편입수학 프론트엔드 빌드 오케스트레이터. docs/view/ 프로토타입 JSX를 React+TypeScript 컴포넌트로 변환하고 검증한다. '화면 만들어줘', '컴포넌트 변환', '프로토타입 구현', 'UI 빌드', '화면 구현', '페이지 만들어' 등의 요청 시 사용. 후속 작업: '다시 빌드', '컴포넌트 수정', 'UI 수정', '화면 업데이트', '빌드 에러 수정', '누락된 컴포넌트 추가' 요청 시에도 반드시 이 스킬을 사용."
---

# Frontend Build Orchestrator

`../docs/view/` 프로토타입 JSX를 React+TypeScript 컴포넌트로 변환하고, 빌드·린트·프로토타입 대조 검증까지 수행하는 오케스트레이터.

## 실행 모드: 서브 에이전트

## 에이전트 구성

| 에이전트 | 정의 파일 | 역할 | 출력 |
|---------|----------|------|------|
| ui-builder | `.claude/agents/ui-builder.md` | 프로토타입 → React+TS 변환 | `src/` 컴포넌트들 |
| qa-reviewer | `.claude/agents/qa-reviewer.md` | 빌드·린트·누락 검증 및 수정 | 검증 결과 + 수정된 파일 |

## 워크플로우

### Phase 0: 컨텍스트 확인

1. `src/` 디렉토리의 현재 상태를 확인한다:
   - **초기 상태** (Vite 기본 scaffold만 존재: `App.tsx`, `main.tsx`) → 초기 실행. Phase 1로 진행
   - **컴포넌트 존재** + 사용자가 부분 수정 요청 → 부분 재실행. ui-builder에 수정 대상만 전달
   - **컴포넌트 존재** + 사용자가 전체 재빌드 요청 → 기존 파일 백업 후 Phase 1 진행
2. `../docs/view/` 프로토타입 파일 존재 여부 확인

### Phase 1: 준비

1. 프로토타입 파일 목록 확인: `../docs/view/*.jsx`
2. 각 프로토타입 파일의 컴포넌트 목록 파악
3. 변환 대상 결정 (사용자 지정 또는 전체)

### Phase 2: UI 빌드 (ui-builder 에이전트)

ui-builder 에이전트를 호출한다:

```
Agent(
  prompt: ".claude/agents/ui-builder.md의 지침을 따라 작업하라.
    프로토타입 파일: ../docs/view/page-home.jsx, ../docs/view/components2.jsx
    기획서: ../docs/edu-math-service-plan.md
    
    다음을 생성하라:
    1. src/styles/theme.css — 프로토타입의 CSS 변수 테마
    2. src/types/ — SCHOOLS, FORMULAS 등 데이터 타입
    3. src/data/ — mock 데이터
    4. src/components/ — 공통 컴포넌트 (AppHeader, PrimaryButton, Logo 등)
    5. src/pages/ — 페이지 컴포넌트 (HomePage, ExamSchedulePage)
    6. src/App.tsx — 라우팅 설정
    7. src/main.tsx, src/index.css — 엔트리 포인트 업데이트
    
    완료 후 npm run build를 실행하여 에러가 없는지 확인하라.",
  model: "opus"
)
```

### Phase 3: QA 검증 (qa-reviewer 에이전트)

Phase 2 완료 후 qa-reviewer 에이전트를 호출한다:

```
Agent(
  prompt: ".claude/agents/qa-reviewer.md의 지침을 따라 작업하라.
    원본 프로토타입: ../docs/view/page-home.jsx, ../docs/view/components2.jsx
    검증 대상: src/ 디렉토리의 모든 컴포넌트
    
    검증 항목:
    1. npm run build 성공 확인
    2. npm run lint 통과 확인
    3. 프로토타입의 모든 컴포넌트가 존재하는지 대조
    4. CSS 변수 누락 확인
    5. 타입과 mock 데이터 일치 확인
    
    문제 발견 시 직접 수정하고 재빌드하라.",
  model: "opus"
)
```

### Phase 4: 결과 보고

1. qa-reviewer의 검증 결과를 사용자에게 요약 보고
2. 생성된 컴포넌트 목록과 파일 구조 제시
3. `npm run dev`로 개발 서버를 실행하여 확인하도록 안내

## 데이터 흐름

```
[오케스트레이터]
    │
    ├── Phase 2: Agent(ui-builder)
    │       입력: ../docs/view/*.jsx (프로토타입)
    │       출력: src/ (컴포넌트, 테마, 타입, mock 데이터)
    │
    └── Phase 3: Agent(qa-reviewer)
            입력: src/ (Phase 2 산출물) + ../docs/view/*.jsx (원본 대조)
            출력: 검증 결과 + 수정된 파일
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| ui-builder 실패 | 에러 메시지 확인 후 1회 재시도. 재실패 시 사용자에게 보고 |
| qa-reviewer 빌드 실패 | qa-reviewer가 직접 수정 시도 (최대 3회). 실패 시 남은 에러 목록 보고 |
| 프로토타입 파일 미존재 | 사용자에게 경로 확인 요청 후 중단 |
| 부분 재실행 시 기존 코드 충돌 | 기존 파일을 읽고 변경 사항만 반영 |

## 테스트 시나리오

### 정상 흐름
1. 사용자: "docs/view 프로토타입 기반으로 React 화면 만들어줘"
2. Phase 0: src/에 Vite scaffold만 존재 → 초기 실행
3. Phase 1: page-home.jsx, components2.jsx 확인 → 전체 변환
4. Phase 2: ui-builder가 테마, 타입, 컴포넌트, 페이지 생성 → npm run build 성공
5. Phase 3: qa-reviewer가 빌드·린트·프로토타입 대조 → 모두 통과
6. Phase 4: 결과 요약 보고

### 에러 흐름
1. Phase 2에서 ui-builder가 빌드 에러 발생
2. ui-builder가 자체 수정 시도하지만 실패
3. qa-reviewer에게 전달 → qa-reviewer가 수정 시도
4. 3회 시도 후에도 1개 에러 남음
5. 남은 에러를 사용자에게 보고하고 수동 수정 요청