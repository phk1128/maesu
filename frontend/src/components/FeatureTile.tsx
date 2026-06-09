import type { ReactNode } from 'react';
import ProBadge from './ProBadge';

interface FeatureTileProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onClick?: () => void;
  locked?: boolean;
  accent?: boolean;
  visual?: ReactNode;
  comingSoon?: boolean;
}

export default function FeatureTile({ title, subtitle, icon, onClick, locked, accent, visual, comingSoon }: FeatureTileProps) {
  if (comingSoon) {
    return (
      <div style={{
        width: '100%', background: 'var(--surface)',
        border: '1px dashed var(--border-strong)',
        borderRadius: 16, padding: 16,
        textAlign: 'left', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 14, minHeight: 28,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'var(--bg)', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{icon}</div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', background: 'var(--primary-light)', color: '#A8543A',
            borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
          }}>
            <span style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--primary)' }}></span>
            출시 예정
          </span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600,
          margin: '0 0 4px', letterSpacing: '-0.015em', color: 'var(--text-secondary)',
        }}>{title}</h3>
        <p style={{
          fontSize: 12.5, margin: 0, lineHeight: 1.5,
          color: 'var(--text-muted)', letterSpacing: '-0.005em',
        }}>{subtitle}</p>
      </div>
    );
  }

  return (
    <button onClick={onClick} style={{
      width: '100%', background: accent ? 'linear-gradient(140deg, #1F1F1F 0%, #2A2A2A 100%)' : 'var(--surface)',
      border: `1px solid ${accent ? '#1F1F1F' : 'var(--border)'}`,
      borderRadius: 16, padding: 16, cursor: 'pointer',
      textAlign: 'left', position: 'relative', overflow: 'hidden',
      transition: 'all 180ms ease',
      color: accent ? '#fff' : 'var(--text-primary)',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 14, minHeight: 28,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: accent ? 'rgba(217,119,87,0.18)' : 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        {locked && <ProBadge size="sm" />}
      </div>
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600,
        margin: '0 0 4px', letterSpacing: '-0.015em',
        color: accent ? '#fff' : 'var(--text-primary)',
      }}>{title}</h3>
      <p style={{
        fontSize: 12.5, margin: '0 0 12px', lineHeight: 1.5,
        color: accent ? 'rgba(255,255,255,0.65)' : 'var(--text-secondary)',
        letterSpacing: '-0.005em',
      }}>{subtitle}</p>
      {visual}
    </button>
  );
}
