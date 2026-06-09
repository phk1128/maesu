import { useState } from 'react';
import type { GoFn } from '../types';
import { FORMULA_TREE, getFormulasBy } from '../data/mock';
import AppHeader from '../components/AppHeader';
import FormulaRow from '../components/FormulaRow';

interface FormulaCategoryPageProps {
  go: GoFn;
  params: Record<string, unknown>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function FormulaCategoryPage({ go, params, favorites, toggleFavorite }: FormulaCategoryPageProps) {
  const cat = FORMULA_TREE.find(c => c.id === params.catId);
  const [activeSub, setActiveSub] = useState<string | null>(cat?.subparts[0]?.id || null);
  if (!cat) return null;

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title={cat.name} showBack onBack={() => go(-1)} />

      <div style={{
        padding: '12px 20px 20px', position: 'relative',
        borderBottom: '0.5px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: cat.color,
        }}></div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>{cat.name}</h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, letterSpacing: '-0.005em' }}>{cat.desc}</p>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 12,
        }}>세부 파트</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cat.subparts.map(sp => {
            const isOpen = activeSub === sp.id;
            const formulas = getFormulasBy(cat.id, sp.id);
            return (
              <div key={sp.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, overflow: 'hidden',
              }}>
                <button onClick={() => setActiveSub(isOpen ? null : sp.id)} style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 16px', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: `${cat.color}18`, color: cat.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 13,
                    flexShrink: 0,
                  }}>{sp.name.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 2 }}>{sp.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{formulas.length}개 공식</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {isOpen && (
                  <div style={{ padding: '4px 12px 12px', borderTop: '0.5px solid var(--border)', background: 'var(--bg)' }}>
                    {formulas.length === 0 ? (
                      <div style={{ padding: 16, textAlign: 'center', fontSize: 12.5, color: 'var(--text-muted)' }}>곧 공식이 추가됩니다</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 8 }}>
                        {formulas.map(f => (
                          <FormulaRow
                            key={f.id} formula={f} compact
                            onClick={() => go('formula-detail', { id: f.id })}
                            isFavorite={favorites.includes(f.id)}
                            onToggleFavorite={toggleFavorite}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
