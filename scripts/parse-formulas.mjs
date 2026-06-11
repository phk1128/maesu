#!/usr/bin/env node
// 편입수학_카테고리분류.md → 정규 데이터 변환기
//
// 기획서(docs/edu-math-service-plan.md) §2.3 "화면 블록 = 저장 단위" 모델에 맞춰
// 원본 마크다운을 categories(14 세부단원) + formulas(블록) 구조로 파싱한다.
//
// 산출물:
//   1) scripts/out/formulas.json                       — 정규 JSON (검수/재사용용)
//   2) frontend/src/data/formulas.generated.ts         — 프론트 정적 데이터
//   3) backend/src/main/resources/db/data.sql          — categories/formulas 시드 SQL
//
// 블록 두 유형:
//   - 수식 블록: ###/#### 리프 헤딩 + 다중 LaTeX/표/리스트 본문 → content_md
//   - 그래프 블록: `**(n)** $수식$` 캡션 + 인라인 <svg> → 개별 블록(svg 1개)
//
// 사용: node scripts/parse-formulas.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'docs/data/편입수학_카테고리분류.md');
const AREA = '미적분';

// ── 유틸 ───────────────────────────────────────────────
const stripDollar = (s) => s.replace(/\$\$?/g, '').trim();
const stripBold = (s) => s.replace(/\*\*/g, '').trim();
// §4.4: SVG 내부 빈 줄 제거 (마크다운 렌더러가 HTML 블록을 끊는 버그 방지)
const collapseSvgBlankLines = (svg) => svg.replace(/\n[ \t]*\n+/g, '\n').trim();
// 세부단원/리스트 헤딩의 "1.9 " 같은 교재 절번호 접두 제거
const cleanTitle = (s) => stripBold(s).replace(/^\d+\.\d+\s+/, '').trim();

function slugUnit(i) { return `u${String(i + 1).padStart(2, '0')}`; }
function slugFormula(i) { return `f${String(i + 1).padStart(4, '0')}`; }

// ── 1) 헤딩 단위 세그먼트화 ──────────────────────────────
const raw = readFileSync(SRC, 'utf8');
const lines = raw.split('\n');

const segments = []; // { level, title, body: string[] }
let cur = null;
for (const line of lines) {
  const m = /^(#{1,4})\s+(.*)$/.exec(line);
  if (m) {
    cur = { level: m[1].length, title: m[2].trim(), body: [] };
    segments.push(cur);
  } else if (cur) {
    cur.body.push(line);
  }
}

// ── 2) 카테고리(세부단원) + 블록 추출 ────────────────────
const units = [];      // { id, name, order }
const formulas = [];   // { id, unit, title, contentMd, svg, order }
let unitIndex = -1;
let curUnit = null;

const isHeading = (s) => /^#{1,4}\s+/.test(s);
const bodyText = (body) =>
  body.filter((l) => l.trim() !== '---').join('\n').trim();

function extractSvgs(text) {
  const svgs = [];
  const rest = text.replace(/<svg[\s\S]*?<\/svg>/g, (mm) => {
    svgs.push(collapseSvgBlankLines(mm));
    return '';
  });
  return { svgs, rest: rest.replace(/\n{3,}/g, '\n\n').trim() };
}

function pushFormula(unit, title, contentMd, svg) {
  formulas.push({
    id: slugFormula(formulas.length),
    unit: unit.id,
    title,
    contentMd: contentMd.trim(),
    svg: svg || null,
    order: formulas.filter((f) => f.unit === unit.id).length + 1,
  });
}

// 그래프 그룹(캡션 다수)을 개별 블록으로 분해
function splitGraphBlocks(unit, body) {
  const text = body.join('\n');
  // 캡션 위치로 분할
  const captionRe = /^\*\*\((\d+)\)\*\*\s*(.*)$/;
  const blocks = [];
  let current = null;
  for (const line of body) {
    const cm = captionRe.exec(line);
    if (cm) {
      if (current) blocks.push(current);
      current = { n: cm[1], caption: cm[2].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) blocks.push(current);

  for (const b of blocks) {
    const { svgs } = extractSvgs(b.lines.join('\n'));
    const captionLatex = b.caption; // 보통 `$...$`
    const title = `(${b.n}) ${stripDollar(captionLatex)}`.trim();
    pushFormula(unit, title, captionLatex, svgs[0] || null);
  }
  return blocks.length > 0;
  void text;
}

// Level-3에 직접 body가 있으면 그 아래 Level-4 형제들의 내용을 #### 헤더와 함께
// 한 카드의 contentMd로 흡수한다. (예: 3.6 적분의 응용 — (1) 직교좌표계 카드 안에
// 면적·곡선의 길이·회전체 부피·표면적이 한꺼번에 들어감)
// Level-3에 직접 body가 없으면 컨테이너로 보고 Level-4 자식들이 각자 카드가 된다.
let i = 0;
while (i < segments.length) {
  const seg = segments[i];

  if (seg.level === 1) { i++; continue; }

  if (seg.level === 2) {
    unitIndex += 1;
    curUnit = { id: slugUnit(unitIndex), name: cleanTitle(seg.title), order: unitIndex + 1 };
    units.push(curUnit);
    i++;
    continue;
  }

  if (!curUnit) { i++; continue; }

  if (seg.level === 3) {
    const bt = bodyText(seg.body);
    const cleanedTitle = cleanTitle(seg.title);
    // "(N) ..." 번호 접두사가 있으면 하나의 카드 단위로 본다 (본문이 없어도 자식 흡수)
    const isNumbered = /^\(\d+\)/.test(cleanedTitle);

    // 그래프 캡션이 body에 직접 있으면 개별 그래프 블록으로 분해
    if (bt && /^\*\*\(\d+\)\*\*/m.test(bt)) {
      splitGraphBlocks(curUnit, seg.body);
      i++;
      continue;
    }

    // 다음 Level-2/3까지의 Level-4 자식들을 수집
    const children = [];
    let j = i + 1;
    while (j < segments.length && segments[j].level >= 4) {
      if (segments[j].level === 4) children.push(segments[j]);
      j++;
    }

    const shouldAbsorb = isNumbered || (bt && children.length > 0) || (bt && children.length === 0);
    // 컨테이너 케이스: 본문이 없고 (N) 번호도 없으며 자식이 존재 → 자식들이 개별 카드가 됨
    if (!shouldAbsorb) {
      i++;
      continue;
    }

    const parts = [];
    if (bt) parts.push(bt);
    for (const child of children) {
      const childBt = bodyText(child.body);
      if (!childBt) continue;
      parts.push(`#### ${cleanTitle(child.title)}\n\n${childBt}`);
    }
    const { svgs, rest } = extractSvgs(parts.join('\n\n'));
    pushFormula(curUnit, cleanedTitle, rest, svgs[0] || null);
    for (let k = 1; k < svgs.length; k++) {
      pushFormula(curUnit, `${cleanedTitle} (그래프 ${k + 1})`, '', svgs[k]);
    }
    i = j; // 흡수한 자식들은 건너뛴다
    continue;
  }

  if (seg.level === 4) {
    const bt = bodyText(seg.body);
    if (!bt) { i++; continue; }

    if (/^\*\*\(\d+\)\*\*/m.test(bt)) {
      splitGraphBlocks(curUnit, seg.body);
      i++;
      continue;
    }

    const { svgs, rest } = extractSvgs(bt);
    const title = cleanTitle(seg.title);
    pushFormula(curUnit, title, rest, svgs[0] || null);
    for (let k = 1; k < svgs.length; k++) {
      pushFormula(curUnit, `${title} (그래프 ${k + 1})`, '', svgs[k]);
    }
    i++;
    continue;
  }

  i++;
}

// unit별 count
for (const u of units) u.count = formulas.filter((f) => f.unit === u.id).length;

// ── 3) 산출물 작성 ──────────────────────────────────────
const canonical = { area: AREA, units, formulas };

const outDir = resolve(ROOT, 'scripts/out');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'formulas.json'), JSON.stringify(canonical, null, 2));

// 3a) 프론트 TS
const tsHeader = `// 자동 생성 파일 — 편집 금지. \`node scripts/parse-formulas.mjs\` 로 재생성.
// 원본: docs/data/편입수학_카테고리분류.md (기획서 §2.3 블록 모델)

export interface GeneratedUnit {
  id: string;
  name: string;
  order: number;
  count: number;
}

export interface GeneratedFormula {
  id: string;
  unit: string;      // GeneratedUnit.id
  title: string;
  contentMd: string; // 마크다운 + LaTeX($...$, $$...$$) + 표
  svg: string | null;
  order: number;
}

export const CALCULUS_AREA = ${JSON.stringify(AREA)};

export const CALCULUS_UNITS: GeneratedUnit[] = ${JSON.stringify(units, null, 2)};

export const CALCULUS_FORMULAS: GeneratedFormula[] = ${JSON.stringify(formulas, null, 2)};
`;
writeFileSync(resolve(ROOT, 'frontend/src/data/formulas.generated.ts'), tsHeader);

// 3b) 백엔드 시드 SQL (Postgres). 단일 따옴표만 이스케이프(표준 문자열, 백슬래시 리터럴).
const sq = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);

const sqlParts = [];
sqlParts.push('-- 자동 생성 시드 — node scripts/parse-formulas.mjs 로 재생성.');
sqlParts.push('-- 원본: docs/data/편입수학_카테고리분류.md');
sqlParts.push('');
sqlParts.push('-- categories (세부단원, 영역=미적분)');
units.forEach((u, i) => {
  sqlParts.push(
    `INSERT INTO categories (id, area, name, sort_order) VALUES (${i + 1}, ${sq(AREA)}, ${sq(u.name)}, ${u.order}) ` +
      `ON CONFLICT (id) DO UPDATE SET area = EXCLUDED.area, name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;`,
  );
});
sqlParts.push('');
sqlParts.push('-- 삭제된 id 정리: 이번 시드에 없는 행은 제거 (formulas 먼저)');
sqlParts.push(`DELETE FROM formulas WHERE id > ${formulas.length};`);
sqlParts.push(`DELETE FROM categories WHERE id > ${units.length};`);
sqlParts.push('');
sqlParts.push('-- formulas (공식/그래프 블록)');
const unitDbId = new Map(units.map((u, i) => [u.id, i + 1]));
formulas.forEach((f, i) => {
  sqlParts.push(
    `INSERT INTO formulas (id, category_id, title, content_md, svg, sort_order) VALUES (${i + 1}, ${unitDbId.get(f.unit)}, ${sq(f.title)}, ${sq(f.contentMd)}, ${sq(f.svg)}, ${f.order}) ` +
      `ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, title = EXCLUDED.title, content_md = EXCLUDED.content_md, svg = EXCLUDED.svg, sort_order = EXCLUDED.sort_order;`,
  );
});
sqlParts.push('');
// 시퀀스 보정 (명시 id 삽입 후)
sqlParts.push("SELECT setval(pg_get_serial_sequence('categories','id'), (SELECT MAX(id) FROM categories));");
sqlParts.push("SELECT setval(pg_get_serial_sequence('formulas','id'),   (SELECT MAX(id) FROM formulas));");
sqlParts.push('');

const sqlOut = resolve(ROOT, 'backend/src/main/resources/db/data.sql');
mkdirSync(dirname(sqlOut), { recursive: true });
writeFileSync(sqlOut, sqlParts.join('\n'));

// ── 요약 ───────────────────────────────────────────────
console.log(`area=${AREA}`);
console.log(`units=${units.length}`);
console.log(`formulas=${formulas.length}`);
const withSvg = formulas.filter((f) => f.svg).length;
console.log(`  with svg = ${withSvg}`);
console.log('unit breakdown:');
for (const u of units) console.log(`  ${u.order.toString().padStart(2)} ${u.name} — ${u.count}`);
