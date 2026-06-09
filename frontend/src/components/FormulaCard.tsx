import type { Formula } from '../types';
import Badge from './Badge';
import Tex from './Tex';

interface FormulaCardProps {
  formula: Formula;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function FormulaCard({ formula, onClick, isFavorite, onToggleFavorite }: FormulaCardProps) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 16, cursor: 'pointer',
      transition: 'all 180ms ease',
      position: 'relative',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <Badge tone="default" size="sm">{formula.category || formula.cat}</Badge>
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(formula.id); }} style={{
          background: 'none', border: 'none', padding: 4, margin: -4, cursor: 'pointer',
          color: isFavorite ? 'var(--primary)' : 'var(--text-muted)',
          transform: isFavorite ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), color 200ms',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600,
        color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.01em',
      }}>{formula.title}</h3>
      <div style={{
        background: 'var(--bg)', borderRadius: 8, padding: '10px 12px',
        marginBottom: 10, overflowX: 'auto', textAlign: 'center',
        fontSize: 14,
      }}>
        <Tex>{formula.latex}</Tex>
      </div>
      <p style={{
        fontSize: 13, color: 'var(--text-secondary)', margin: 0,
        lineHeight: 1.55, letterSpacing: '-0.01em',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{formula.short}</p>
    </div>
  );
}
