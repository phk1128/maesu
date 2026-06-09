// 편입 수학 - 공식 페이지 (v2): 카테고리 → 서브파트 → 공식 → 상세

// ═══════════════════════════════════════════
// 1단계: 4개 카테고리
// ═══════════════════════════════════════════
function FormulasPage({ go }) {
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

// ═══════════════════════════════════════════
// 2단계: 카테고리 → 서브파트 (아코디언)
// ═══════════════════════════════════════════
function FormulaCategoryPage({ go, params, favorites, toggleFavorite }) {
  const cat = FORMULA_TREE.find(c => c.id === params.catId);
  const [activeSub, setActiveSub] = React.useState(cat?.subparts[0]?.id || null);
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

// ═══════════════════════════════════════════
// 3단계: 공식 상세
// ═══════════════════════════════════════════
function FormulaDetailPage({ go, params, favorites, toggleFavorite, markStudied }) {
  const formula = getFormula(params.id);

  React.useEffect(() => {
    if (formula && markStudied) markStudied('formula', formula.id);
  }, [params.id]);

  if (!formula) {
    return (
      <div style={{ paddingBottom: 110 }}>
        <AppHeader title="공식" showBack onBack={() => go(-1)} />
        <EmptyState
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>}
          title="공식을 찾을 수 없어요" body=" "
          action={<SecondaryButton onClick={() => go('formulas')}>공식 목록</SecondaryButton>}
        />
      </div>
    );
  }
  const isFav = favorites.includes(formula.id);
  const cat = FORMULA_TREE.find(c => c.id === formula.cat);
  const sub = cat?.subparts.find(s => s.id === formula.sub);
  const related = FORMULAS.filter(f => f.sub === formula.sub && f.id !== formula.id).slice(0, 3);

  const levelLabel = { 3: '★★★ 필수', 2: '★★ 유용', 1: '★ 참고' }[formula.importance];

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader
        title={formula.title}
        showBack onBack={() => go(-1)}
        right={
          <button onClick={() => toggleFavorite(formula.id)} style={{
            background: 'none', border: 'none', padding: 8, margin: '-4px -4px -4px 0', cursor: 'pointer',
            color: isFav ? 'var(--primary)' : 'var(--text-secondary)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        }
      />

      {/* 헤더 */}
      <div style={{ padding: '12px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>{cat?.name}</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)' }}>{sub?.name}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 600, fontSize: 11 }}>{levelLabel}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>{formula.title}</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>{formula.short}</p>
      </div>

      {/* 공식 박스 */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '28px 16px', textAlign: 'center',
          fontSize: 19, overflow: 'auto',
        }}>
          <Tex block>{formula.latex}</Tex>
        </div>
      </div>

      {/* 관련 공식 */}
      {related.length > 0 && (
        <div style={{ padding: '0 20px 24px' }}>
          <SectionHeader icon="🔗" label={`${sub?.name} 다른 공식`} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {related.map(r => (
              <FormulaRow key={r.id} formula={r}
                onClick={() => go('formula-detail', { id: r.id })}
                isFavorite={favorites.includes(r.id)}
                onToggleFavorite={toggleFavorite}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {!window.__HIDE_AI__ && (
      <div style={{ padding: '8px 20px 24px' }}>
        <button onClick={() => go('analyze')} style={{
          width: '100%', background: 'var(--primary-light)',
          border: '1px solid #EAD3C2', borderRadius: 14,
          padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4 2.3-7.4-6-4.4h7.6z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 6 }}>
              이 공식 관련 기출 분석하기
              <ProBadge size="sm" />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>실제 문제에 어떻게 쓰이는지 확인</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{label}</span>
    </div>
  );
}

Object.assign(window, { FormulasPage, FormulaCategoryPage, FormulaDetailPage, SectionHeader });
