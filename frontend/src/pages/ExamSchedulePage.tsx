import type { GoFn } from '../types';
import { SCHOOLS } from '../data/mock';
import { examDdayInfo } from '../utils/exam';
import AppHeader from '../components/AppHeader';
import { useNow } from '../utils/useNow';

interface ExamSchedulePageProps {
  go: GoFn;
  primarySchool: string | null;
  setPrimarySchool: (id: string) => void;
}

export default function ExamSchedulePage({ go, primarySchool, setPrimarySchool }: ExamSchedulePageProps) {
  const now = useNow();

  const sorted = [...SCHOOLS]
    .map(s => ({ school: s, info: examDdayInfo(s, now) }))
    .sort((a, b) => {
      if (a.info.passed !== b.info.passed) return a.info.passed ? 1 : -1;
      return a.info.target - b.info.target;
    });

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="시험 일정" showBack onBack={() => go(-1)} />

      <div style={{ padding: '12px 20px 20px' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>학교별 D-day</h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          학교를 누르면 목표 학교로 설정돼요. 홈에서 매일 확인할 수 있어요.
        </p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(({ school, info }, idx) => {
          const isPrimary = school.id === primarySchool;
          const isNext = idx === 0 && !info.passed;
          return (
            <button key={school.id} onClick={() => { setPrimarySchool(school.id); }} style={{
              background: isPrimary ? 'var(--primary-light)' : 'var(--surface)',
              border: `1px solid ${isPrimary ? '#EAD3C2' : 'var(--border)'}`,
              borderRadius: 16, padding: 0, cursor: 'pointer',
              textAlign: 'left', overflow: 'hidden', position: 'relative',
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { if (!isPrimary) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { if (!isPrimary) e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <div style={{ width: 5, background: school.color }}></div>
                <div style={{ flex: 1, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{
                      fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600,
                      color: 'var(--text-primary)', letterSpacing: '-0.015em',
                    }}>{school.name}</span>
                    {isPrimary && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        background: 'var(--primary)', color: '#fff',
                        padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
                      }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4 2.3-7.4-6-4.4h7.6z"/></svg>
                        내 목표
                      </span>
                    )}
                    {!isPrimary && isNext && (
                      <span style={{
                        background: 'var(--primary-light)', color: '#A8543A',
                        padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                      }}>가장 임박</span>
                    )}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                      {school.tag}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      {info.passed ? (
                        <span style={{
                          fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600,
                          color: 'var(--text-muted)', letterSpacing: '-0.02em',
                        }}>종료</span>
                      ) : (
                        <>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>D-</span>
                          <span style={{
                            fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 700,
                            color: school.color, letterSpacing: '-0.03em', lineHeight: 0.9,
                          }}>{info.days}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 2 }}>일</span>
                        </>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}>{info.dateStr}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>
                        ({info.weekday}) {!info.passed && `${pad(info.hours)}:${pad(info.mins)}:${pad(info.secs)} 남음`}
                      </div>
                    </div>
                  </div>

                  {!info.passed && (
                    <div style={{ marginTop: 12, height: 4, background: isPrimary ? 'rgba(217,119,87,0.15)' : 'var(--bg)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.max(4, Math.min(100, (1 - info.days / 365) * 100))}%`,
                        height: '100%', background: school.color, borderRadius: 999,
                        opacity: 0.8,
                      }}></div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          시험 일정은 각 학교 모집요강 기준이며, 실제 일정과 다를 수 있어요.
        </p>
      </div>
    </div>
  );
}
