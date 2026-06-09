import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'muted' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const tones: Record<string, { bg: string; color: string }> = {
  default: { bg: '#F5E6DC', color: '#A8543A' },
  muted:   { bg: '#F0EEEA', color: '#6B6B6B' },
  success: { bg: '#E5EFE7', color: '#3D6849' },
  warning: { bg: '#F5ECD5', color: '#8A6F1B' },
  info:    { bg: '#E1ECF5', color: '#3F6F95' },
};

const sizes: Record<string, { p: string; f: number }> = {
  sm: { p: '2px 8px', f: 11 },
  md: { p: '3px 10px', f: 12 },
  lg: { p: '5px 12px', f: 13 },
};

export default function Badge({ children, tone = 'default', size = 'md' }: BadgeProps) {
  const { bg, color } = tones[tone];
  const { p, f } = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: p, fontSize: f, fontWeight: 500,
      background: bg, color, borderRadius: 6, letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}
