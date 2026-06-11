/** "(1) 등차수열 ..." → "등차수열 ..."  · 번호가 없으면 원문 유지. */
export function stripFormulaNumber(title: string): string {
  return title.replace(/^\(\d+\)\s+/, '');
}

/**
 * 타이틀이 이미 수식 본문을 그대로 담고 있는지 판정.
 * 그래프 블록처럼 title이 곧 수식인 경우 contentMd의 첫 수식 미리보기는 중복.
 */
export function titleContainsLatex(title: string, latex: string): boolean {
  if (!latex) return false;
  const norm = (s: string) => s.replace(/\s+/g, '');
  return norm(stripFormulaNumber(title)).includes(norm(latex));
}
