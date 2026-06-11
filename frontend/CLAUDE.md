# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

편입수학(transfer math exam) 학습 웹서비스의 프론트엔드. React 19 + TypeScript + Vite 기반.

백엔드는 `../backend/` (Spring Boot + Kotlin + Gradle). 기획서는 `../docs/edu-math-service-plan.md`, UI 프로토타입은 `../docs/view/`에 JSX로 존재.

## Commands

- `npm run dev` — 개발 서버 (Vite HMR)
- `npm run build` — TypeScript 체크 + 프로덕션 빌드 (`tsc -b && vite build`)
- `npm run lint` — ESLint 실행
- `npm run preview` — 빌드 결과 로컬 프리뷰

## Tech Stack

- React 19, TypeScript 6, Vite 8
- ESLint with react-hooks + react-refresh plugins

## Architecture Notes

- 아직 초기 scaffold 상태. `../docs/view/`의 프로토타입 JSX를 React 컴포넌트로 변환하는 작업이 진행 예정.
- 프로토타입은 CSS 변수 기반 테마 사용 (`--primary`, `--surface`, `--border`, `--text-primary` 등).
- 프로토타입에서 참조하는 전역 데이터: `SCHOOLS`, `FORMULAS`, `FORMULA_TREE`, `CONTRIB_GRID` 등 — 실제 구현 시 타입 정의 및 API 연동 필요.
- 수학 수식 렌더링에 KaTeX 사용 예정 (기획서 기준).

## Coding Principles

코드를 작성·수정하는 모든 작업에서 다음 원칙을 따른다. 하네스의 서브에이전트(ui-builder, qa-reviewer)에도 동일하게 적용된다.

1. **클린 코드** — 의미 있는 이름, 단일 책임, 작은 함수, 중복 제거, 매직 넘버는 상수로. 주석은 *왜*가 비자명할 때만 작성하고 *무엇*은 코드로 드러낸다.
2. **React 공식 문서 기준** — React 19의 훅·새 API(`use`, `useOptimistic`, `useActionState`, Server Components 등)나 동작이 헷갈리면 추측하지 말고 `context7` MCP로 공식 문서를 조회한다. 사용 도구: `mcp__plugin_context7_context7__query-docs` 에 `/reactjs/react.dev` 검색. Vite·TypeScript도 동일.
3. **컴포넌트 위생** — 파일당 하나의 컴포넌트, `props` 타입 명시, 200줄 초과 시 분리 검토, 비즈니스 로직과 표현 분리, 인라인 스타일은 테마/CSS 변수로 추출. JSX 중첩이 깊어지면 하위 컴포넌트로 분리한다.

> 프로토타입 변환 작업에서는 "시각적 일치"가 최우선이므로, 위 원칙 3과 충돌할 경우 시각적 일치를 택하고 트레이드오프를 짧은 주석으로 남긴다.

## 하네스: 프론트엔드 빌드

**목표:** docs/view/ 프로토타입 JSX를 React+TypeScript 컴포넌트로 변환하고 검증하는 자동화 파이프라인

**트리거:** 화면 구현, 컴포넌트 변환, UI 빌드, 프로토타입 기반 작업 요청 시 `frontend-build` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-06-09 | 초기 구성 | 전체 | - |
| 2026-06-09 | Coding Principles 섹션 추가 (클린 코드 / React 공식 문서 참고 / 컴포넌트 위생). ui-builder·qa-reviewer에도 반영 | CLAUDE.md, ui-builder.md, qa-reviewer.md | 작업 품질 가이드라인 명시 |