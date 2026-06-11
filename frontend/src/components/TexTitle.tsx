import type { CSSProperties, ReactNode } from 'react';
import Tex from './Tex';
import { stripFormulaNumber } from '../utils/formulaTitle';

interface TexTitleProps {
  children: string;
  style?: CSSProperties;
}

/**
 * 공식 타이틀 렌더러.
 * - "(N)" 번호 접두사는 제거 (정렬은 order 필드가 담당)
 * - 본문에 $...$ 가 있으면 인라인 수식으로 파싱
 * - $ 없이 한글이 섞인 경우 일반 텍스트 (KaTeX에 던지지 않음 → 빨간 에러 방지)
 * - 그 외(LaTeX 명령·기호만 있는 경우)는 KaTeX 렌더
 */
export default function TexTitle({ children, style }: TexTitleProps) {
  return <span style={style}>{renderMixedContent(stripFormulaNumber(children))}</span>;
}

function renderMixedContent(text: string): ReactNode {
  if (text.includes('$')) {
    return parseInlineMath(text).map((seg, i) =>
      seg.type === 'math'
        ? <Tex key={i}>{seg.content}</Tex>
        : <span key={i}>{seg.content}</span>
    );
  }
  const hasHangul = /[ㄱ-힝]/.test(text);
  const hasLatex = /[\\{}^_]/.test(text);
  if (hasHangul && !hasLatex) {
    return <span>{text}</span>;
  }
  return <Tex>{text}</Tex>;
}

function parseInlineMath(text: string): Array<{ type: 'text' | 'math'; content: string }> {
  const segments: Array<{ type: 'text' | 'math'; content: string }> = [];
  const regex = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'math', content: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}
