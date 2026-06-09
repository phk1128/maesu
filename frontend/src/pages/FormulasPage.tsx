import type { GoFn } from '../types';
import { FORMULA_TREE } from '../data/mock';
import AppHeader from '../components/AppHeader';

interface FormulasPageProps {
  go: GoFn;
}

export default function FormulasPage({ go }: FormulasPageProps) {
  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="공식" large />
      <div style={{ padding: '0 20px 24px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55 }}>
        편입 수학의 핵심을 4개 분야로 정리했어요.
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FORMULA_TREE.map(cat => {
          const total = cat.subparts.reduce((s, sp) => s + sp.count, 0);
          return (
            <button key={cat.id} onClick={() => go('formula-category', { catId: cat.id })} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 0, cursor: 'pointer',
              textAlign: 'left', overflow: 'hidden',
              transition: 'all 180ms',
              display: 'flex', alignItems: 'stretch',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 6, background: cat.color }}></div>
              <div style={{ flex: 1, padding: '16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600,
                    color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.015em',
                  }}>{cat.name}</h3>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)',
                  }}>{total}개</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', letterSpacing: '-0.005em' }}>{cat.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cat.subparts.map(sp => (
                    <span key={sp.id} style={{
                      padding: '3px 8px', background: 'var(--bg)', color: 'var(--text-secondary)',
                      fontSize: 11, fontWeight: 500, borderRadius: 5, letterSpacing: '-0.005em',
                    }}>{sp.name}</span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
