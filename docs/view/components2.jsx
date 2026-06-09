// 편입 수학 - 새 컴포넌트 (v2)

// ─────────────────────────────────────
// Pro 잠금 뱃지
// ─────────────────────────────────────
function ProBadge({ size = 'sm' }) {
  const sizes = {
    sm: { p: '2px 6px', f: 10, gap: 3, icon: 9 },
    md: { p: '3px 8px', f: 11, gap: 4, icon: 11 },
  };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      padding: s.p, background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
      color: '#F5E6DC', borderRadius: 5,
      fontSize: s.f, fontWeight: 700, letterSpacing: '0.04em',
    }}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      PRO
    </span>
  );
}

// ─────────────────────────────────────
// 잠금 오버레이 (Pro 기능에 씌움)
// ─────────────────────────────────────
function LockOverlay({ title, body, onSubscribe, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 150,
      background: 'rgba(26,26,26,0.55)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', background: 'var(--surface)',
        borderRadius: '24px 24px 0 0',
        padding: '20px 24px 32px',
        boxShadow: '0 -12px 48px rgba(0,0,0,0.18)',
        animation: 'slideUp 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* drag handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 999, background: 'var(--border-strong)',
          margin: '0 auto 18px',
        }}></div>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
            color: '#F5E6DC',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, position: 'relative',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span style={{
              position: 'absolute', top: -6, right: -10,
              background: 'var(--primary)', color: '#fff',
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
              letterSpacing: '0.06em',
            }}>PRO</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600,
            color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em',
          }}>{title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55, letterSpacing: '-0.005em' }}>
            {body}
          </p>
        </div>

        <div style={{
          background: 'var(--bg)', borderRadius: 12, padding: '14px 16px',
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span style={{
              fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1,
            }}>9,900원</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>/ 월</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>VAT 포함</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            ✓ AI 기출 분석 무제한 · ✓ AI 기출 변형 무제한 · ✓ 풀이 단계별 설명
          </div>
        </div>

        <PrimaryButton onClick={onSubscribe} style={{ width: '100%' }}>
          Pro 구독하고 시작하기
        </PrimaryButton>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: 'var(--text-muted)', padding: '12px 8px 0',
          width: '100%', textAlign: 'center', letterSpacing: '-0.01em',
        }}>나중에 하기</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// 잔디 컨트리뷰션 그리드
// ─────────────────────────────────────
function ContributionGrid({ data, totalStudied, streak }) {
  const colors = ['#EEEAE5', '#F2D7C5', '#E8AE89', '#DC8657', '#B45C36']; // 0~4 level
  const weeks = data.length;
  const cell = 11, gap = 3;
  const gridWidth = weeks * cell + (weeks - 1) * gap;
  const gridHeight = 7 * cell + 6 * gap;

  // 월 라벨: 각 주의 첫째 날이 새 달이면 표시
  const monthLabels = [];
  let lastMonth = -1;
  data.forEach((week, wi) => {
    const firstDay = week[0]?.date;
    if (firstDay) {
      const m = firstDay.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ wi, label: `${m + 1}월` });
        lastMonth = m;
      }
    }
  });

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '16px 16px 14px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '-0.005em' }}>지난 18주 학습</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1,
            }}>{totalStudied}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>회 학습</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>현재 연속</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600,
            color: 'var(--primary)', letterSpacing: '-0.02em',
          }}>
            🔥 {streak}일
          </div>
        </div>
      </div>

      {/* 월 라벨 */}
      <div style={{ position: 'relative', height: 12, marginBottom: 4, marginLeft: 0 }}>
        {monthLabels.map((m, i) => (
          <span key={i} style={{
            position: 'absolute', left: m.wi * (cell + gap),
            fontSize: 9.5, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>{m.label}</span>
        ))}
      </div>

      {/* 그리드 */}
      <div style={{ overflowX: 'auto', paddingBottom: 4, marginLeft: -16, paddingLeft: 16, marginRight: -16, paddingRight: 16 }}>
        <svg width={gridWidth} height={gridHeight} style={{ display: 'block' }}>
          {data.map((week, wi) =>
            week.map((cellData, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * (cell + gap)}
                y={di * (cell + gap)}
                width={cell} height={cell}
                rx={2.5}
                fill={cellData.future ? 'transparent' : colors[cellData.level]}
                stroke={cellData.future ? 'transparent' : (cellData.level === 0 ? 'rgba(0,0,0,0.02)' : 'none')}
                strokeWidth="0.5"
              />
            ))
          )}
        </svg>
      </div>

      {/* 범례 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4,
        marginTop: 8, fontSize: 10, color: 'var(--text-muted)',
      }}>
        <span style={{ marginRight: 2 }}>적게</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }}></div>
        ))}
        <span style={{ marginLeft: 2 }}>많이</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// 카테고리 큰 카드 (홈 4타일용)
// ─────────────────────────────────────
function FeatureTile({ title, subtitle, icon, onClick, locked, accent, visual, comingSoon }) {
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

// ─────────────────────────────────────
// 작은 공식 행 (서브파트, 분석 결과 등)
// ─────────────────────────────────────
function FormulaRow({ formula, onClick, isFavorite, onToggleFavorite, compact }) {
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
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      )}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
    </div>
  );
}

Object.assign(window, {
  ProBadge, LockOverlay, ContributionGrid, FeatureTile, FormulaRow,
});
