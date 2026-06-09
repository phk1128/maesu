import type { GoFn } from '../types';
import { SCHOOLS, getProblems } from '../data/mock';
import AppHeader from '../components/AppHeader';

interface ExamSchoolPageProps {
  go: GoFn;
  params: Record<string, unknown>;
}

export default function ExamSchoolPage({ go, params }: ExamSchoolPageProps) {
  const school = SCHOOLS.find(s => s.id === params.schoolId);
  if (!school) return null;

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title={school.name} showBack onBack={() => go(-1)} />

      <div style={{
        background: school.color, padding: '16px 20px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{
          position: 'absolute', top: -40, right: -40, opacity: 0.08,
        }}>
          <circle cx="90" cy="90" r="84" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="90" cy="90" r="60" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="90" cy="90" r="36" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', marginBottom: 6 }}>
          {school.id.toUpperCase()}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600,
          color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>{school.name}</h1>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>{school.tag}</span>
          <span style={{ width: 3, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.5)' }}></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{school.years.length}개년</span>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 12,
        }}>연도 선택</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {school.years.map(year => {
            const probs = getProblems(school.id, year);
            return (
              <button key={year} onClick={() => go('exam-year', { schoolId: school.id, year })} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '16px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600,
                  color: school.color, letterSpacing: '-0.02em', minWidth: 60,
                }}>{year}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.01em' }}>
                    {year}학년도 편입 수학
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {probs.length}문제
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
