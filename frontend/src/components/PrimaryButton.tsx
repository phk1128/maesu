import type { CSSProperties, ReactNode, MouseEventHandler } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: CSSProperties;
  icon?: ReactNode;
}

const sizeMap: Record<string, { h: number; f: number; p: string }> = {
  sm: { h: 36, f: 13, p: '0 14px' },
  md: { h: 44, f: 14, p: '0 18px' },
  lg: { h: 52, f: 15, p: '0 22px' },
};

export default function PrimaryButton({ children, onClick, size = 'lg', disabled, style = {}, icon }: PrimaryButtonProps) {
  const s = sizeMap[size];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: s.h, padding: s.p, fontSize: s.f, fontWeight: 600,
      background: disabled ? '#E0DCD6' : 'var(--primary)',
      color: '#fff', border: 'none', borderRadius: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      letterSpacing: '-0.01em',
      transition: 'all 150ms ease',
      boxShadow: disabled ? 'none' : '0 1px 2px rgba(217,119,87,0.18)',
      ...style,
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--primary-hover)'; }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = (style as Record<string, string>).background || 'var(--primary)'; }}
    >
      {children}
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </button>
  );
}
