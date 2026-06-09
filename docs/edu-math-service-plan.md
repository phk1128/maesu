# 편입수학 웹서비스 — 데이터 & 매칭 기획서

> **목적**: 편입수학 공식 자료(pomula1 기반)를 웹에서 학습 가능한 형태로 제공하고, 기출문제가 주어졌을 때 관련 공식을 자동으로 보여주는 기능을 구현한다.
> **문서 성격**: 데이터 구조와 핵심 매칭 로직에 대한 설계 결정 기록. AI 에이전트가 이 문서만 읽고 후속 작업(시드 생성, API 구현, 자동 태깅)을 수행할 수 있도록 작성됨.
> **버전**: v1 · 2026-06-09

---

## 1. 프로젝트 컨텍스트

### 1.1 서비스 개요
- **타깃**: 편입수학(편입학사 수학 시험) 수험생
- **핵심 기능**:
  1. 공식 레퍼런스 (4대 영역 × 세부단원으로 분류된 공식·그래프)
  2. 기출문제 풀이 + **문제별 관련 공식 자동 노출**
  3. (Phase 3) AI 챗봇 학습 도우미
- **무료 서비스** — 광고/유료화 없음

### 1.2 기술 스택
| 레이어 | 기술 |
|---|---|
| 프론트엔드 | Next.js 16.2 · Tailwind · shadcn/ui · KaTeX |
| 백엔드 | Java + Spring Boot · Spring AI |
| DB | PostgreSQL (pgvector는 Phase 3에 도입 예정) |
| AI/OCR | Claude API (자동 태깅) · Mathpix (사용자 OCR, Phase 2) |
| 프로토타이핑 | Lovable |
| 콘텐츠 출처 | Areum Math 편입수학 교재 |

### 1.3 현재 자료 상태
- 원본: `pomula1.md` (Areum Math 편입수학 수식·그래프 원본, ~1,890줄)
- 정리본: `편입수학_카테고리분류.md`
  - 4대 영역 중 **미적분(Calculus)** 영역만 포함
  - 14개 세부단원, 약 100개 공식 블록, 57개 SVG 그래프
  - SVG는 텍스트(마크업)로 인라인 보존됨

---

## 2. 콘텐츠 구조

### 2.1 4대 영역 (지침서 표준)
모든 공식은 다음 4개 영역 중 정확히 하나에 귀속.

1. **미적분 (Calculus)** — 현재 데이터 전부 여기 속함
2. **선형대수 (Linear Algebra)** — 미수집
3. **다변수미적분 (Multivariable Calculus)** — 미수집
4. **공업수학 (Engineering Math)** — 미수집

### 2.2 미적분 세부단원 (14개)
순서가 학습 순서이기도 함.

1. 함수 그래프
2. 수열·급수
3. 지수·로그
4. 곱셈공식·인수분해
5. 삼각함수·역삼각함수
6. 쌍곡선함수
7. 미분법 기초
8. 극한
9. 미분의 응용
10. 적분법
11. 적분의 기본정리
12. 이상적분
13. 극좌표
14. 적분의 응용(넓이·길이·부피·표면적)

### 2.3 콘텐츠 블록 단위
**중요**: "공식 1개"가 아니라 **"화면에 한 덩어리로 노출되는 블록"**이 단위.

| 블록 예시 | 구성 |
|---|---|
| `(13) y = sin x` | 제목 + SVG 1개 |
| `삼각함수의 가법공식` | 제목 + LaTeX 수식 6개(①~⑥) |
| `특수각 삼각비` | 제목 + 마크다운 표 |

이유: 가법공식의 ①~⑥을 행으로 쪼개면 화면 표시·검색·태깅이 모두 비효율적. 화면 단위 = 저장 단위로 일치시킨다.

---

## 3. 데이터베이스 스키마

### 3.1 전체 ER 구조 (텍스트)

```
categories (세부단원, 14행)
    ↓ 1:N
formulas (공식 블록, ~100행, content_md + svg)
    ↓ N:M ← formula_tags ─→ tags (태그 마스터)
                              ↑ N:M ← problem_tags
                                       ↓
                                   problems (기출문제)
                                       ↓ N:M (선택)
                                   problem_formulas (확정 매핑)
```

### 3.2 DDL

```sql
-- (1) 세부단원
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    area        TEXT NOT NULL,        -- '미적분' (4대 영역)
    name        TEXT NOT NULL,        -- '삼각함수·역삼각함수'
    sort_order  INT  NOT NULL,        -- 영역 내 순서
    UNIQUE (area, name)
);

-- (2) 공식/그래프 블록
CREATE TABLE formulas (
    id           SERIAL PRIMARY KEY,
    category_id  INT  NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title        TEXT NOT NULL,        -- '(3) 삼각함수의 가법공식'
    content_md   TEXT NOT NULL,        -- LaTeX 포함 마크다운 본문
    svg          TEXT,                 -- 그래프 SVG (없으면 NULL)
    sort_order   INT  NOT NULL,        -- 세부단원 내 순서
    search_tsv   tsvector,             -- 전문검색용 (Phase 2)
    -- embedding   vector(1536),        -- Phase 3: pgvector 도입 시 활성화
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_formulas_category ON formulas(category_id, sort_order);
CREATE INDEX idx_formulas_tsv      ON formulas USING GIN(search_tsv);

-- (3) 태그 마스터
CREATE TABLE tags (
    id    SERIAL PRIMARY KEY,
    name  TEXT UNIQUE NOT NULL,        -- '로피탈', '테일러전개', '치환적분'
    kind  TEXT NOT NULL DEFAULT 'topic' -- 'topic' | 'technique' | 'object'
);

-- (4) 공식 ↔ 태그
CREATE TABLE formula_tags (
    formula_id INT NOT NULL REFERENCES formulas(id) ON DELETE CASCADE,
    tag_id     INT NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
    PRIMARY KEY (formula_id, tag_id)
);

-- (5) 기출문제
CREATE TABLE problems (
    id          SERIAL PRIMARY KEY,
    source      TEXT,                  -- '2023 건국대 편입 1번'
    body_md     TEXT NOT NULL,         -- 문제 본문 (LaTeX 포함)
    answer_md   TEXT,                  -- 풀이/정답 (선택)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (6) 문제 ↔ 태그 (자동 또는 수동 태깅 결과)
CREATE TABLE problem_tags (
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    tag_id     INT NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
    confidence REAL DEFAULT 1.0,       -- LLM 자동 태깅 시 신뢰도 (0~1)
    source     TEXT DEFAULT 'manual',  -- 'manual' | 'llm'
    PRIMARY KEY (problem_id, tag_id)
);

-- (7) 문제 ↔ 공식 (확정 매핑, 선택)
-- 사람이 검수해서 "이 문제엔 이 공식들이 정답" 확정한 데이터.
-- 평가 데이터셋 및 콜드 스타트 보정용.
CREATE TABLE problem_formulas (
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    formula_id INT NOT NULL REFERENCES formulas(id) ON DELETE CASCADE,
    relevance  SMALLINT NOT NULL DEFAULT 3, -- 1(약)~5(강)
    PRIMARY KEY (problem_id, formula_id)
);
```

### 3.3 필드별 정책

| 필드 | 정책 |
|---|---|
| `formulas.content_md` | LaTeX은 `$...$` 인라인, `$$...$$` 디스플레이로 저장. 프론트에서 KaTeX 렌더. |
| `formulas.svg` | SVG 마크업 전체를 `TEXT`로 저장. **S3 미사용** (§4 참조). |
| `formulas.sort_order` | id 의존 금지. 세부단원 내 명시적 순서 유지. |
| `tags.name` | 한글로 통일 (`'로피탈'`, `'테일러전개'`). 공백·하이픈 금지. |
| `problem_tags.confidence` | LLM 자동 태깅 결과는 0.0~1.0. 수동 태깅은 1.0. |

---

## 4. 그래프(SVG) 저장 전략

### 4.1 결정
**SVG는 DB의 `TEXT` 컬럼에 인라인 저장한다. S3는 사용하지 않는다.**

### 4.2 근거
- SVG는 **바이너리 파일이 아니라 텍스트 마크업**임. 평균 7~12KB, 전체 57개 합쳐도 ~700KB.
- HTML에 인라인 임베드가 가장 빠른 렌더 경로. 외부 요청 0회.
- DB-S3 정합성 관리(한쪽만 업데이트되는 사고) 부담 없음.
- 백업·마이그레이션·검색이 DB 한 곳에서 끝남.

### 4.3 S3 도입 조건 (지금은 아님)
다음 중 하나가 생기면 그때 도입:
- 그래프를 PNG로 굽기 (인쇄/공유용 OG 이미지)
- 사용자 업로드 손글씨 풀이 사진
- PDF 교재 파일 저장

### 4.4 SVG 작성 시 주의
- **SVG 마크업 내부에 빈 줄을 절대 넣지 말 것.** 마크다운 렌더러가 빈 줄을 만나면 HTML 블록을 끊어 `<path>`를 별도 문단으로 분리해버려 곡선이 사라짐. (실제 발생한 버그)
- 시드 데이터 변환 시 `re.sub(r'\n[ \t]*\n+', '\n', svg_block)`로 빈 줄 제거 처리할 것.

---

## 5. 문제 → 공식 매칭 전략

### 5.1 결정
**Phase 1: 태그 기반 매칭. Phase 3: 임베딩(pgvector) 보강.**

### 5.2 후보 방식 비교

| 방식 | 정확도 | 구현 난이도 | 비용 | 채택 |
|---|---|---|---|---|
| A. 태그 기반 (규칙) | 중상 | 낮음 | 없음 | ✅ Phase 1 |
| B. 전문검색 (PostgreSQL FTS) | 중 | 낮음 | 없음 | 보조 |
| C. 임베딩 의미 검색 (pgvector) | 상 | 중 | 임베딩 API 비용 | Phase 3 |

### 5.3 태그 기반을 채택하는 이유
- 편입수학은 **주제 도메인이 명확하고 폐쇄적**(극한·미분·적분·급수…). 의미 검색의 강점인 "예상 못한 의미적 연결"이 거의 발생하지 않음.
- 공식은 100개 규모로 작아서 태그 수작업이 현실적.
- 문제 자동 태깅은 Claude API로 충분히 정확도 확보 가능.
- 인프라 단순(추가 확장 없음) → MVP 속도 ↑

### 5.4 향후 확장 시나리오
- **Phase 2**: `search_tsv` 컬럼으로 키워드 보조 검색. 태그 결과가 부족할 때 fallback.
- **Phase 3**: `embedding vector(1536)` 컬럼 추가. 태그 매칭 결과 + 임베딩 유사도를 가중합하여 랭킹.
- 스키마는 이 확장을 모두 수용하도록 이미 설계됨(컬럼만 ALTER로 추가).

---

## 6. 태그 체계

### 6.1 태그 종류 (`tags.kind`)
- `topic` — 주제/단원 수준 (`'극한'`, `'미분의 응용'`)
- `technique` — 풀이 기법 (`'로피탈'`, `'치환적분'`, `'부분적분'`)
- `object` — 등장 객체 (`'삼각함수'`, `'쌍곡선함수'`, `'매개변수곡선'`)

### 6.2 태그 시드 (초안)

**topic**: 수열, 급수, 극한, 연속, 미분, 미분가능성, 도함수, 극값, 변곡점, 정적분, 부정적분, 이상적분, 곡선의길이, 회전체부피, 회전체표면적, 평면넓이, 극좌표, 매개변수, 그래프

**technique**: 로피탈, 테일러전개, 매클로린전개, 치환적분, 부분적분, 부분분수, 삼각치환, 로그미분법, 음함수미분, 합성함수미분, 라이프니츠, 점화식적분, Wallis공식

**object**: 삼각함수, 역삼각함수, 쌍곡선함수, 역쌍곡선함수, 지수함수, 로그함수, 감마함수, 가우스적분, 파선형, 성망형, 심장형, 장미곡선, 연주형

### 6.3 태그 부여 원칙
- 공식 1개당 평균 2~4개 태그 부여.
- 너무 광범위한 태그(예: '미분')만 달지 말고, **반드시 technique 또는 object 태그를 1개 이상** 포함.
- 예: "정적분의 미분 공식" → `[정적분, 도함수, 합성함수미분]`

---

## 7. 핵심 쿼리

### 7.1 문제 → 관련 공식 추천

```sql
-- 문제의 태그와 겹치는 공식, 겹친 태그 수가 많은 순
SELECT
    f.id, f.title, f.content_md, f.svg,
    COUNT(*) AS matched_tags
FROM problems p
JOIN problem_tags pt ON pt.problem_id = p.id
JOIN formula_tags ft ON ft.tag_id = pt.tag_id
JOIN formulas f      ON f.id = ft.formula_id
WHERE p.id = :problem_id
GROUP BY f.id
ORDER BY matched_tags DESC, f.sort_order ASC
LIMIT 10;
```

### 7.2 특정 세부단원의 공식 목록 (페이지 로딩용)

```sql
SELECT id, title, content_md, svg
FROM formulas
WHERE category_id = :category_id
ORDER BY sort_order;
```

### 7.3 태그로 공식 직접 검색

```sql
SELECT f.id, f.title
FROM formulas f
JOIN formula_tags ft ON ft.formula_id = f.id
JOIN tags t          ON t.id = ft.tag_id
WHERE t.name = ANY(:tag_names)
GROUP BY f.id
HAVING COUNT(DISTINCT t.id) = array_length(:tag_names, 1) -- AND 조건
ORDER BY f.sort_order;
```

---

## 8. 자동 태깅 워크플로우

### 8.1 공식 태깅 (1회성, MVP 시드)
1. 카테고리 분류 마크다운(`편입수학_카테고리분류.md`)을 블록 단위로 파싱.
2. 각 블록을 Claude API에 전달 → 태그 후보 JSON 응답.
3. 사람이 검수 후 `formula_tags`에 INSERT.

### 8.2 문제 태깅 (지속)
1. 사용자가 문제 등록(텍스트 또는 OCR).
2. 백엔드(Spring AI)가 Claude API에 문제 본문 + 태그 마스터 전달.
3. 응답을 `problem_tags`에 INSERT (`source='llm'`, `confidence` 기록).
4. 인기 문제는 운영자가 후검수 → `confidence=1.0, source='manual'`로 업데이트.

### 8.3 Claude API 프롬프트 (초안)

```
당신은 편입수학 문제 분류 전문가입니다.

[사용 가능한 태그 목록]
topic: 극한, 연속, 미분, 정적분, 이상적분, ...
technique: 로피탈, 치환적분, 부분적분, 테일러전개, ...
object: 삼각함수, 쌍곡선함수, 매개변수곡선, ...

[문제]
<문제 본문 LaTeX 포함>

위 문제를 푸는 데 필요한 태그를 위 목록에서만 골라 JSON으로 반환하세요.
형식: {"tags": ["태그1", "태그2", ...], "confidence": 0.0~1.0}
규칙:
- topic, technique, object 각각 최소 1개 이상 포함
- 너무 일반적인 태그(예: '미분')만 달지 말고 구체적 technique/object를 포함
- 확신이 없으면 confidence를 낮추세요
```

---

## 9. 작업 순서 (액션 아이템)

### Phase 1 — MVP
- [ ] DDL 실행 (위 §3.2)
- [ ] `categories` 14행 INSERT
- [ ] `편입수학_카테고리분류.md` → `formulas` 시드 변환 (Python 스크립트)
- [ ] `tags` 시드 INSERT (§6.2)
- [ ] 공식별 태그 자동 생성 → 사람 검수 → `formula_tags` INSERT
- [ ] 프론트: 세부단원별 공식 목록 페이지 (Lovable로 시안)
- [ ] 백엔드: §7의 3개 쿼리 API화

### Phase 2 — 문제 기능
- [ ] `problems` 등록 UI + Mathpix OCR
- [ ] 자동 태깅 API (§8.3)
- [ ] 문제 상세 페이지에 "관련 공식" 섹션 (§7.1 쿼리)
- [ ] `search_tsv` 채우기 + 키워드 fallback

### Phase 3 — 고도화
- [ ] 선형대수·다변수미적분·공업수학 콘텐츠 추가
- [ ] AI 챗봇 (스트리밍 SSE)
- [ ] pgvector 도입 + 임베딩 기반 랭킹 보강

---

## 10. 의사결정 기록 (참고)

| 결정 | 채택안 | 기각안 | 이유 |
|---|---|---|---|
| SVG 저장 위치 | DB inline (TEXT) | S3 | 텍스트 마크업, 700KB 규모, 외부 요청 불필요 |
| 콘텐츠 단위 | 화면 블록 | 수식 1개 = 1행 | 가법공식 ①~⑥ 분리 시 검색·렌더 모두 비효율 |
| 문제→공식 매칭 | 태그 기반 | 임베딩 우선 | 도메인이 폐쇄적·소규모, MVP 속도 우선 |
| 공식 중요도 표기 | 미사용 | ★★★ 등급 | "전부 중요한 공식"이라는 사업적 판단 |
| 영역 분류 | 미적분만 1차 적용 | 4영역 동시 | 원본 자료가 미적분만 디지털화됨 |

---

## 11. 참고 파일

- `pomula1.md` — Areum Math 원본 (SVG 빈 줄 버그 수정본)
- `편입수학_카테고리분류.md` — 4대 영역·세부단원 구조로 재배열된 작업본 (이 기획서의 콘텐츠 소스)
