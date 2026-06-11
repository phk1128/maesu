import { useState, useEffect } from 'react';
import type { GoFn } from '../types';
import { AREAS } from '../data/formulas';
import { fetchCategories, type CategoryDto } from '../api/formulas';
import AppHeader from '../components/AppHeader';

interface FormulasPageProps {
  go: GoFn;
}

export default function FormulasPage({ go }: FormulasPageProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // 영역별로 카테고리를 그룹핑
  const areasWithCategories = AREAS.map(area => {
    const cats = categories.filter(c => c.area === area.name);
    return { ...area, categories: cats, totalFormulas: cats.length };
  });

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="공식" large />
      <div style={{ padding: '0 20px 24px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55 }}>
        편입 수학의 핵심을 4개 분야로 정리했어요.
      </div>

      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>불러오는 중...</div>
      ) : (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {areasWithCategories.map(area => (
            <button key={area.id} onClick={() => go('formula-category', { catId: area.id })} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 0, cursor: 'pointer',
              textAlign: 'left', overflow: 'hidden',
              transition: 'all 180ms',
              display: 'flex', alignItems: 'stretch',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 6, background: area.color }}></div>
              <div style={{ flex: 1, padding: '16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600,
                    color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.015em',
                  }}>{area.name}</h3>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)',
                  }}>{area.categories.length > 0 ? `${area.categories.length}개 단원` : '준비 중'}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', letterSpacing: '-0.005em' }}>{area.desc}</p>
                {area.categories.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {area.categories.map(c => (
                      <span key={c.id} style={{
                        padding: '3px 8px', background: 'var(--bg)', color: 'var(--text-secondary)',
                        fontSize: 11, fontWeight: 500, borderRadius: 5, letterSpacing: '-0.005em',
                      }}>{c.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
