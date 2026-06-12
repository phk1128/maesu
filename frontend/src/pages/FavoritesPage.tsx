import { useState, useEffect } from 'react';
import type { GoFn } from '../types';
import type { FormulaDto } from '../api/formulas';
import { fetchFormula } from '../api/formulas';
import AppHeader from '../components/AppHeader';
import TexTitle from '../components/TexTitle';

interface FavoritesPageProps {
  go: GoFn;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function FavoritesPage({ go, favorites, toggleFavorite }: FavoritesPageProps) {
  const [formulas, setFormulas] = useState<FormulaDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) { setFormulas([]); setLoading(false); return; }
    setLoading(true);
    Promise.all(favorites.map(id => fetchFormula(Number(id)).catch(() => null)))
      .then(results => setFormulas(results.filter((f): f is FormulaDto => f !== null)))
      .finally(() => setLoading(false));
  }, [favorites]);

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="북마크 공식" showBack onBack={() => go(-1)} />

      <div style={{ padding: '12px 20px 20px' }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>불러오는 중...</div>
        ) : formulas.length === 0 ? (
          <div style={{
            padding: '60px 0', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔖</div>
            <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', margin: '0 0 4px' }}>북마크한 공식이 없어요</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>공식 상세에서 북마크를 눌러 저장해보세요</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {formulas.map(f => {
              const fid = String(f.id);
              return (
                <div key={f.id} onClick={() => go('formula-detail', { id: f.id, categoryId: f.categoryId })} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'all 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600,
                      color: 'var(--text-primary)', letterSpacing: '-0.01em',
                    }}><TexTitle>{f.title}</TexTitle></div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(fid); }} style={{
                    background: 'none', border: 'none', padding: 4, cursor: 'pointer', flexShrink: 0,
                    color: 'var(--primary)',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
