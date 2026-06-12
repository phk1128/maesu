import type { Formula } from '../types';
import Tex from './Tex';

interface FormulaRowProps {
  formula: Formula;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  compact?: boolean;
}

export default function FormulaRow({ formula, onClick, isFavorite, onToggleFavorite, compact }: FormulaRowProps) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: compact ? '12px 14px' : '14px 14px',
      cursor: 'pointer', transition: 'all 150ms',
      display: 'flex', alignItems: 'center', gap: 12,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600,
            color: 'var(--text-primary)', letterSpacing: '-0.01em',
          }}>{formula.title}</span>
          {formula.importance === 3 && (
            <span style={{ color: 'var(--primary)', fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>★★★</span>
          )}
        </div>
        <div style={{
          fontSize: 12, color: 'var(--text-secondary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          <Tex>{formula.latex}</Tex>
        </div>
      </div>
      {onToggleFavorite && (
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(formula.id); }} style={{
          background: 'none', border: 'none', padding: 4, cursor: 'pointer', flexShrink: 0,
          color: isFavorite ? 'var(--primary)' : 'var(--text-muted)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      )}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" /></svg>
    </div>
  );
}
