import type { CSSProperties, ReactNode, MouseEventHandler } from 'react';

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}

const sizeMap: Record<string, { h: number; f: number; p: string }> = {
  sm: { h: 36, f: 13, p: '0 14px' },
  md: { h: 44, f: 14, p: '0 18px' },
  lg: { h: 52, f: 15, p: '0 22px' },
};

export default function SecondaryButton({ children, onClick, size = 'lg', style = {} }: SecondaryButtonProps) {
  const s = sizeMap[size];
  return (
    <button onClick={onClick} style={{
      height: s.h, padding: s.p, fontSize: s.f, fontWeight: 500,
      background: 'var(--surface)', color: 'var(--text-primary)',
      border: '1px solid var(--border)', borderRadius: 12,
      cursor: 'pointer', letterSpacing: '-0.01em',
      transition: 'all 150ms ease',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >{children}</button>
  );
}
