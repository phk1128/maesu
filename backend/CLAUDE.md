# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

편입수학(transfer math exam) 학습 웹서비스의 백엔드. Spring Boot 4 + Kotlin + JPA + PostgreSQL 기반.

프론트엔드는 `../frontend/` (React 19 + TypeScript + Vite). 기획서는 `../docs/edu-math-service-plan.md`, 콘텐츠 원본은 `../docs/data/편입수학_카테고리분류.md`.

## Commands

- `./gradlew build` — 전체 빌드 (컴파일 + 테스트)
- `./gradlew compileKotlin` — Kotlin 컴파일만
- `./gradlew bootRun` — 개발 서버 실행
- `./gradlew test` — 테스트 실행

## Tech Stack

- Spring Boot 4.0.6, Kotlin 2.2, Java 21
- Spring Data JPA, PostgreSQL
- Spring AI (Claude API 연동, pgvector)
- Jackson Kotlin Module

## Architecture Notes

- 패키지 구조: `com.colosseum.backend.domain.{entity}/` (Entity, Repository, Service, Controller, DTO)
- 기획서 §3.2의 DDL을 JPA Entity로 매핑
- 기획서 §7의 핵심 쿼리 3개가 Repository에 구현
- 시드 데이터는 `src/main/resources/` 하위 SQL 파일

## 하네스: 백엔드 빌드

**목표:** 기획서 기반으로 Spring Boot 백엔드를 단계적으로 구현하고 검증하는 자동화 파이프라인 (Phase 1 MVP ~ Phase 3 고도화)

**트리거:** 백엔드 구현, API 생성, 엔티티 생성, 시드 데이터, 자동 태깅, AI 챗봇 등 백엔드 관련 작업 요청 시 `backend-build` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-06-09 | 초기 구성 | 전체 | - |
