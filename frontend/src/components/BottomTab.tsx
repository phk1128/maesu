interface BottomTabProps {
  active: string | null;
  onChange: (tab: string) => void;
}

export default function BottomTab({ active, onChange }: BottomTabProps) {
  const tabs = [
    { id: 'home', label: '홈', icon: <path d="M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10"/> },
    { id: 'formulas', label: '공식', icon: <><path d="M4 6h16M4 12h16M4 18h10"/></> },
    { id: 'exams', label: '기출', icon: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></> },
    { id: 'mypage', label: '내정보', icon: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></> },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 22, background: 'rgba(250,249,247,0.92)',
      backdropFilter: 'saturate(180%) blur(14px)',
      WebkitBackdropFilter: 'saturate(180%) blur(14px)',
      borderTop: '0.5px solid var(--border)',
      zIndex: 30,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 4px 4px' }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          const color = isActive ? 'var(--primary)' : 'var(--text-muted)';
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              background: 'none', border: 'none', padding: '6px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', flex: 1, minHeight: 48,
              color,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                {t.icon}
              </svg>
              <span style={{ fontSize: 10.5, fontWeight: isActive ? 600 : 500, letterSpacing: '-0.01em' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
