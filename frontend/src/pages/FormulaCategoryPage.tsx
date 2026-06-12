import { useState, useEffect } from 'react';
import type { GoFn } from '../types';
import { getAreaById } from '../data/formulas';
import { fetchCategories, fetchFormulasByCategory, type CategoryDto, type FormulaDto } from '../api/formulas';
import AppHeader from '../components/AppHeader';
import TexTitle from '../components/TexTitle';

interface FormulaCategoryPageProps {
  go: GoFn;
  params: Record<string, unknown>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function FormulaCategoryPage({ go, params, favorites, toggleFavorite }: FormulaCategoryPageProps) {
  const area = getAreaById(params.catId as string);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [formulaMap, setFormulaMap] = useState<Record<number, FormulaDto[]>>({});
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(cats => {
        const filtered = cats.filter(c => c.area === area?.name);
        setCategories(filtered);
        // 모든 카테고리 공식을 미리 로드 (캐시되므로 부담 없음)
        for (const cat of filtered) {
          fetchFormulasByCategory(cat.id)
            .then(formulas => setFormulaMap(prev => ({ ...prev, [cat.id]: formulas })))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [area?.name]);

  if (!area) return null;

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title={area.name} showBack onBack={() => go(-1)} />

      <div style={{
        padding: '12px 20px 20px', position: 'relative',
        borderBottom: '0.5px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: area.color,
        }}></div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>{area.name}</h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, letterSpacing: '-0.005em' }}>{area.desc}</p>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 12,
        }}>세부단원</div>

        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>불러오는 중...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categories.map(cat => {
              const isOpen = activeCat === cat.id;
              const formulas = formulaMap[cat.id];
              return (
                <div key={cat.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, overflow: 'hidden',
                }}>
                  <button onClick={() => setActiveCat(isOpen ? null : cat.id)} style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '14px 16px', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{cat.name}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {formulas ? `${formulas.length}개` : ''}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '4px 12px 12px', borderTop: '0.5px solid var(--border)', background: 'var(--bg)' }}>
                      {!formulas ? (
                        <div style={{ padding: 16, textAlign: 'center', fontSize: 12.5, color: 'var(--text-muted)' }}>불러오는 중...</div>
                      ) : formulas.length === 0 ? (
                        <div style={{ padding: 16, textAlign: 'center', fontSize: 12.5, color: 'var(--text-muted)' }}>공식이 없습니다</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 8 }}>
                          {formulas.map(f => {
                            const fid = String(f.id);
                            const isFav = favorites.includes(fid);
                            return (
                              <div key={f.id} onClick={() => go('formula-detail', { id: f.id, categoryId: f.categoryId })} style={{
                                background: 'var(--surface)', border: '1px solid var(--border)',
                                borderRadius: 12, padding: '12px 14px',
                                cursor: 'pointer', transition: 'all 150ms',
                                display: 'flex', alignItems: 'center', gap: 12,
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                              >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600,
                                    color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 4,
                                  }}><TexTitle>{f.title}</TexTitle></div>
                                </div>
                                {f.svg && (
                                  <span title="그래프" style={{
                                    flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: 22, height: 22, borderRadius: 6,
                                    background: 'var(--primary-light)',
                                  }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                      <line x1="4" y1="20" x2="20" y2="20" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" />
                                      <line x1="4" y1="20" x2="4" y2="4" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" />
                                      <path d="M5 16 Q 10 6, 14 11 T 19 6" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                  </span>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(fid); }} style={{
                                  background: 'none', border: 'none', padding: 4, cursor: 'pointer', flexShrink: 0,
                                  color: isFav ? 'var(--primary)' : 'var(--text-muted)',
                                }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                                  </svg>
                                </button>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" /></svg>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
