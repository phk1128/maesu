import { useEffect } from 'react';
import type { GoFn } from '../types';
import { FORMULA_TREE, FORMULAS, getFormula } from '../data/mock';
import AppHeader from '../components/AppHeader';
import FormulaRow from '../components/FormulaRow';
import EmptyState from '../components/EmptyState';
import SecondaryButton from '../components/SecondaryButton';
import SectionHeader from '../components/SectionHeader';
import ProBadge from '../components/ProBadge';
import Tex from '../components/Tex';

interface FormulaDetailPageProps {
  go: GoFn;
  params: Record<string, unknown>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  markStudied: ((type: string, id: string) => void) | null;
  hideAI?: boolean;
}

export default function FormulaDetailPage({ go, params, favorites, toggleFavorite, markStudied, hideAI }: FormulaDetailPageProps) {
  const formula = getFormula(params.id as string);

  useEffect(() => {
    if (formula && markStudied) markStudied('formula', formula.id);
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const levelLabel: Record<number, string> = { 3: '\u2605\u2605\u2605 필수', 2: '\u2605\u2605 유용', 1: '\u2605 참고' };

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

      <div style={{ padding: '12px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>{cat?.name}</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)' }}>{sub?.name}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 600, fontSize: 11 }}>{levelLabel[formula.importance]}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>{formula.title}</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>{formula.short}</p>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '28px 16px', textAlign: 'center',
          fontSize: 19, overflow: 'auto',
        }}>
          <Tex block>{formula.latex}</Tex>
        </div>
      </div>

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

      {!hideAI && (
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
