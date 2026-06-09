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

## 하네스: 프론트엔드 빌드

**목표:** docs/view/ 프로토타입 JSX를 React+TypeScript 컴포넌트로 변환하고 검증하는 자동화 파이프라인

**트리거:** 화면 구현, 컴포넌트 변환, UI 빌드, 프로토타입 기반 작업 요청 시 `frontend-build` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-06-09 | 초기 구성 | 전체 | - |