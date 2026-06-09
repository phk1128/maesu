import { useRef, useEffect, type CSSProperties } from 'react';

interface TexProps {
  children: string;
  block?: boolean;
  style?: CSSProperties;
}

export default function Tex({ children, block = false, style = {} }: TexProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    if (ref.current && w.katex) {
      try {
        (w.katex as { render: (s: string, el: HTMLElement, opts: Record<string, unknown>) => void }).render(children, ref.current, {
          throwOnError: false,
          displayMode: block,
        });
      } catch {
        if (ref.current) ref.current.textContent = children;
      }
    }
  }, [children, block]);
  return (
    <span
      ref={ref}
      style={{
        ...(block ? { display: 'block', textAlign: 'center' as const } : {}),
        fontFamily: 'var(--font-mono)',
        fontSize: 'inherit',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
