import type { ReactNode } from 'react';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  transparent?: boolean;
  large?: boolean;
}

export default function AppHeader({ title, showBack, onBack, right, transparent = false, large = false }: AppHeaderProps) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: transparent ? 'transparent' : 'rgba(250,249,247,0.85)',
      backdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)',
      WebkitBackdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)',
      borderBottom: transparent ? 'none' : '0.5px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 52, padding: '0 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 36 }}>
          {showBack && (
            <button onClick={onBack} style={{
              background: 'none', border: 'none', padding: 8, margin: '-8px 0 -8px -8px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-primary)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          )}
        </div>
        {!large && (
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600,
            color: 'var(--text-primary)', letterSpacing: '-0.01em',
          }}>{title}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 36, justifyContent: 'flex-end' }}>
          {right}
        </div>
      </div>
      {large && title && (
        <div style={{
          padding: '4px 20px 16px',
          fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>{title}</div>
      )}
    </div>
  );
}
