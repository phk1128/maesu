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

이 프로젝트는 **헥사고날 아키텍처(Ports & Adapters)** 를 따른다. 도메인 코어는 프레임워크에 의존하지 않고, 외부 세계(웹/DB/AI)는 포트 인터페이스를 통해서만 도메인과 연결된다.

### 패키지 구조 (Bounded Context별 헥사고날)

```
com.colosseum.backend
├── <context>/                  (category, formula, tag, problem 등 바운디드 컨텍스트)
│   ├── domain/                 순수 Kotlin 도메인 모델·도메인 서비스 (Spring/JPA 어노테이션 금지)
│   ├── application/
│   │   ├── port/in/            인바운드 포트 = UseCase 인터페이스
│   │   ├── port/out/           아웃바운드 포트 = Repository/외부연동 인터페이스
│   │   └── service/            UseCase 구현 = 애플리케이션 서비스 (@Service, 트랜잭션 경계)
│   └── adapter/
│       ├── in/web/             REST Controller + 요청/응답 DTO (인바운드 어댑터)
│       └── out/persistence/    JPA Entity + Spring Data Repository + 아웃바운드 포트 구현
├── common/                     BaseEntity, 공통 응답 래퍼, 예외 처리
└── config/                     WebMvc, JPA, Spring AI 등 설정
```

**의존성 방향 규칙:** `adapter → application → domain` (안쪽으로만). 도메인은 어떤 바깥 계층도 import하지 않는다. JPA Entity ≠ 도메인 모델 — persistence 어댑터에서 매핑한다.

### 매핑·구현 기준

- 기획서 §3.2의 DDL → `adapter/out/persistence`의 JPA Entity로 매핑 (도메인 모델과 분리)
- 기획서 §7의 핵심 쿼리 3개 → 아웃바운드 포트(인터페이스)로 선언, persistence 어댑터에서 구현
- 시드 데이터는 `src/main/resources/` 하위 SQL 파일

## 설계 원칙 (모든 코드에 적용)

- **헥사고날 아키텍처** — 위 의존성 방향 규칙을 엄수. 도메인 순수성 유지.
- **DDD(도메인 주도 설계)** — `<context>` 패키지 = 바운디드 컨텍스트. 도메인 계층은 전술 패턴으로 모델링한다: 애그리거트(Aggregate)와 애그리거트 루트, 엔티티(식별자 기반), 값 객체(Value Object, 불변·동등성 by value), 도메인 이벤트, 도메인 서비스. **Repository(아웃바운드 포트)는 애그리거트 루트 단위로** 정의한다. 코드·이름은 기획서의 용어(유비쿼터스 언어)와 일치시킨다.
- **객체지향(OOP)** — 빈약한 도메인 모델(anemic domain) 지양. 비즈니스 규칙·불변식(invariant)은 애그리거트 루트가 보호한다. SOLID, 캡슐화, 다형성 활용.
- **클린코드** — 의도가 드러나는 이름, 작은 함수, 단일 책임, 부수효과 최소화. (Robert C. Martin, *Clean Code* 원칙)
- **Kotlin 관용구** — [Kotlin 코딩 컨벤션](https://kotlinlang.org/docs/coding-conventions.html) 준수. data class·null safety·확장함수 활용, Java 스타일 지양. (값 객체는 data class, 애그리거트 루트는 식별자 동등성으로 구현)

## 참조 문서 (구현·검증 시 반드시 참고)

라이브러리 API·설정·마이그레이션을 다룰 때는 추측하지 말고 **context7 MCP** (`resolve-library-id` → `query-docs`)로 최신 공식문서를 조회한 뒤 작성한다. 이 프로젝트는 Spring Boot 4.x(= Spring Framework 7.x) 기준이므로 버전에 맞는 문서를 본다.

- Spring Boot 4.x 레퍼런스: https://docs.spring.io/spring-boot/index.html
- Spring Framework 7.x 레퍼런스: https://docs.spring.io/spring-framework/reference/index.html
- Spring Data JPA: https://docs.spring.io/spring-data/jpa/reference/index.html
- Spring AI: https://docs.spring.io/spring-ai/reference/index.html
- Kotlin 코딩 컨벤션: https://kotlinlang.org/docs/coding-conventions.html
- context7 라이브러리 ID 예시: `/spring-projects/spring-boot`, `/spring-projects/spring-framework`, `/spring-projects/spring-ai`

## 하네스: 백엔드 빌드

**목표:** 기획서 기반으로 Spring Boot 백엔드를 단계적으로 구현하고 검증하는 자동화 파이프라인 (Phase 1 MVP ~ Phase 3 고도화)

**트리거:** 백엔드 구현, API 생성, 엔티티 생성, 시드 데이터, 자동 태깅, AI 챗봇 등 백엔드 관련 작업 요청 시 `backend-build` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-06-09 | 초기 구성 | 전체 | - |
| 2026-06-09 | 헥사고날 아키텍처·DDD·OOP·클린코드 원칙 및 Spring Boot 4.x 공식문서(context7) 참조 지침 추가 | CLAUDE.md, backend-builder, qa-reviewer, SKILL | 아키텍처 일관성·코드 품질 강화 |
