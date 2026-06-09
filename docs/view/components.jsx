// 편입 수학 - 공통 컴포넌트

const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// ── KaTeX 수식 렌더러 ───────────────────────────
function Tex({ children, block = false, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.katex) {
      try {
        window.katex.render(children, ref.current, {
          throwOnError: false,
          displayMode: block,
        });
      } catch (e) {
        ref.current.textContent = children;
      }
    }
  }, [children, block]);
  return <span ref={ref} style={{ ...(block ? { display: 'block', textAlign: 'center' } : {}), ...style }} />;
}

// ── 상단 헤더 ───────────────────────────
function AppHeader({ title, showBack, onBack, right, transparent = false, large = false }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: transparent ? 'transparent' : 'rgba(250,249,247,0.85)',
      backdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)',
      WebkitBackdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)',
      borderBottom: transparent ? 'none' : '0.5px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 52, padding: '0 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 36 }}>
          {showBack && (
            <button onClick={onBack} style={{
              background: 'none', border: 'none', padding: 8, margin: '-8px 0 -8px -8px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-primary)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          )}
        </div>
        {!large && (
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600,
            color: 'var(--text-primary)', letterSpacing: '-0.01em',
          }}>{title}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 36, justifyContent: 'flex-end' }}>
          {right}
        </div>
      </div>
      {large && title && (
        <div style={{
          padding: '4px 20px 16px',
          fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>{title}</div>
      )}
    </div>
  );
}

// ── 하단 탭 ───────────────────────────
function BottomTab({ active, onChange }) {
  const tabs = [
    { id: 'home', label: '홈', icon: <path d="M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10"/> },
    { id: 'formulas', label: '공식', icon: <><path d="M4 6h16M4 12h16M4 18h10"/></> },
    { id: 'exams', label: '기출', icon: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></> },
    { id: 'mypage', label: '내정보', icon: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></> },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 22, background: 'rgba(250,249,247,0.92)',
      backdropFilter: 'saturate(180%) blur(14px)',
      WebkitBackdropFilter: 'saturate(180%) blur(14px)',
      borderTop: '0.5px solid var(--border)',
      zIndex: 30,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 4px 4px' }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          const color = isActive
            ? 'var(--primary)'
            : 'var(--text-muted)';
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              background: 'none', border: 'none', padding: '6px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', flex: 1, minHeight: 48,
              color,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                {t.icon}
              </svg>
              <span style={{ fontSize: 10.5, fontWeight: isActive ? 600 : 500, letterSpacing: '-0.01em' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 뱃지 ───────────────────────────
function Badge({ children, tone = 'default', size = 'md' }) {
  const tones = {
    default: { bg: '#F5E6DC', color: '#A8543A' },
    muted:   { bg: '#F0EEEA', color: '#6B6B6B' },
    success: { bg: '#E5EFE7', color: '#3D6849' },
    warning: { bg: '#F5ECD5', color: '#8A6F1B' },
    info:    { bg: '#E1ECF5', color: '#3F6F95' },
  };
  const sizes = {
    sm: { p: '2px 8px', f: 11 },
    md: { p: '3px 10px', f: 12 },
    lg: { p: '5px 12px', f: 13 },
  };
  const { bg, color } = tones[tone];
  const { p, f } = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: p, fontSize: f, fontWeight: 500,
      background: bg, color, borderRadius: 6, letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ── 별점 (중요도) ───────────────────────────
function Stars({ level, size = 12 }) {
  const labels = { 3: '필수', 2: '유용', 1: '참고' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: size, color: 'var(--text-secondary)' }}>
      <span style={{ color: level === 1 ? 'var(--text-muted)' : 'var(--primary)', letterSpacing: 1, fontWeight: 700 }}>
        {'★'.repeat(level)}{'☆'.repeat(3 - level)}
      </span>
      <span style={{ fontSize: size - 1, color: 'var(--text-muted)' }}>{labels[level]}</span>
    </span>
  );
}

// ── 공식 카드 (목록용) ───────────────────────────
function FormulaCard({ formula, onClick, isFavorite, onToggleFavorite }) {
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
        <Badge tone="default" size="sm">{formula.category}</Badge>
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

// ── 빈 상태 ───────────────────────────
function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--primary-light)', color: 'var(--primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>{icon}</div>
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600,
        margin: '0 0 6px', color: 'var(--text-primary)',
      }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.55 }}>{body}</p>
      {action}
    </div>
  );
}

// ── Primary 버튼 ───────────────────────────
function PrimaryButton({ children, onClick, size = 'lg', disabled, style = {}, icon }) {
  const sizes = {
    sm: { h: 36, f: 13, p: '0 14px' },
    md: { h: 44, f: 14, p: '0 18px' },
    lg: { h: 52, f: 15, p: '0 22px' },
  };
  const s = sizes[size];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: s.h, padding: s.p, fontSize: s.f, fontWeight: 600,
      background: disabled ? '#E0DCD6' : 'var(--primary)',
      color: '#fff', border: 'none', borderRadius: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      letterSpacing: '-0.01em',
      transition: 'all 150ms ease',
      boxShadow: disabled ? 'none' : '0 1px 2px rgba(217,119,87,0.18)',
      ...style,
    }}
    onMouseEnter={e => !disabled && (e.currentTarget.style.background = 'var(--primary-hover)')}
    onMouseLeave={e => !disabled && (e.currentTarget.style.background = 'var(--primary)')}
    >
      {children}
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </button>
  );
}

function SecondaryButton({ children, onClick, size = 'lg', style = {} }) {
  const sizes = {
    sm: { h: 36, f: 13, p: '0 14px' },
    md: { h: 44, f: 14, p: '0 18px' },
    lg: { h: 52, f: 15, p: '0 22px' },
  };
  const s = sizes[size];
  return (
    <button onClick={onClick} style={{
      height: s.h, padding: s.p, fontSize: s.f, fontWeight: 500,
      background: 'var(--surface)', color: 'var(--text-primary)',
      border: '1px solid var(--border)', borderRadius: 12,
      cursor: 'pointer', letterSpacing: '-0.01em',
      transition: 'all 150ms ease',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >{children}</button>
  );
}

// ── 토스트 ───────────────────────────
function Toast({ message, show }) {
  return (
    <div style={{
      position: 'absolute', bottom: 96, left: '50%',
      transform: `translateX(-50%) translateY(${show ? 0 : 10}px)`,
      background: 'rgba(26,26,26,0.92)', color: '#fff',
      padding: '10px 18px', borderRadius: 999,
      fontSize: 13, fontWeight: 500,
      opacity: show ? 1 : 0, pointerEvents: 'none',
      transition: 'all 240ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 100, whiteSpace: 'nowrap',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
    }}>{message}</div>
  );
}

Object.assign(window, {
  Tex, AppHeader, BottomTab, Badge, Stars, FormulaCard, EmptyState,
  PrimaryButton, SecondaryButton, Toast,
});
