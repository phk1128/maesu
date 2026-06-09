import type { GoFn } from '../types';
import { SCHOOLS, PROBLEMS } from '../data/mock';
import AppHeader from '../components/AppHeader';

interface ExamsPageProps {
  go: GoFn;
}

export default function ExamsPage({ go }: ExamsPageProps) {
  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="기출" large />
      <div style={{ padding: '0 20px 24px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55 }}>
        학교를 고르고, 연도별 기출문제를 풀어보세요.
      </div>

      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {SCHOOLS.map(s => {
          const problemCount = PROBLEMS.filter(p => p.school === s.id).length;
          return (
            <button key={s.id} onClick={() => go('exam-school', { schoolId: s.id })} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 0, cursor: 'pointer',
              textAlign: 'left', overflow: 'hidden',
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                height: 72, background: s.color, padding: 14,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
              }}>
                <svg width="80" height="80" viewBox="0 0 80 80" style={{
                  position: 'absolute', top: -10, right: -10, opacity: 0.12,
                }}>
                  <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="40" cy="40" r="20" stroke="white" strokeWidth="1.5" fill="none"/>
                </svg>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.06em',
                }}>{s.id.toUpperCase()}</div>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600,
                  color: '#fff', letterSpacing: '-0.015em', lineHeight: 1.1,
                }}>{s.name}</div>
              </div>
              <div style={{ padding: '10px 14px 14px' }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 4 }}>{s.tag}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    {s.years.length}개년 · {problemCount}문제
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
