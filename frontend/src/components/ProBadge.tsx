interface ProBadgeProps {
  size?: 'sm' | 'md';
}

export default function ProBadge({ size = 'sm' }: ProBadgeProps) {
  const sizes = {
    sm: { p: '2px 6px', f: 10, gap: 3, icon: 9 },
    md: { p: '3px 8px', f: 11, gap: 4, icon: 11 },
  };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      padding: s.p, background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
      color: '#F5E6DC', borderRadius: 5,
      fontSize: s.f, fontWeight: 700, letterSpacing: '0.04em',
    }}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
      PRO
    </span>
  );
}
