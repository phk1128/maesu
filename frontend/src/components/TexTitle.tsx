import type { CSSProperties } from 'react';
import Tex from './Tex';

interface TexTitleProps {
  children: string;
  style?: CSSProperties;
}

/**
 * 공식 타이틀 렌더러.
 * - "(N) LaTeX수식" → 번호는 텍스트, 수식은 KaTeX
 * - "$x$축 회전체" 등 인라인 $..$ → KaTeX
 * - 일반 텍스트 → 그대로
 */
export default function TexTitle({ children, style }: TexTitleProps) {
  // Pattern 1: "(N) rest" — numbered formula, rest is LaTeX
  const numbered = children.match(/^(\(\d+\))\s+(.+)$/);
  if (numbered) {
    return (
      <span style={style}>
        <span>{numbered[1]} </span>
        <Tex>{numbered[2]}</Tex>
      </span>
    );
  }

  // Pattern 2: contains $...$ inline math
  if (children.includes('$')) {
    const segments = parseInlineMath(children);
    return (
      <span style={style}>
        {segments.map((seg, i) =>
          seg.type === 'math'
            ? <Tex key={i}>{seg.content}</Tex>
            : <span key={i}>{seg.content}</span>
        )}
      </span>
    );
  }

  // Pattern 3: plain text
  return <span style={style}>{children}</span>;
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
