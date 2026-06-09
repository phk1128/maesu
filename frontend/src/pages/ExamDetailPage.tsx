import { useState, useEffect } from 'react';
import type { GoFn } from '../types';
import { SCHOOLS, PROBLEMS, ANALYSIS_RESULT } from '../data/mock';
import AppHeader from '../components/AppHeader';
import Badge from '../components/Badge';
import ProBadge from '../components/ProBadge';
import Tex from '../components/Tex';

interface ExamDetailPageProps {
  go: GoFn;
  params: Record<string, unknown>;
  markStudied: ((type: string, id: string) => void) | null;
  hideAI?: boolean;
}

export default function ExamDetailPage({ go, params, markStudied, hideAI }: ExamDetailPageProps) {
  const problem = PROBLEMS.find(p => p.id === params.id);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (problem && markStudied) markStudied('problem', problem.id);
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!problem) return null;
  const school = SCHOOLS.find(s => s.id === problem.school);
  if (!school) return null;
  const diffStars = '\u2605'.repeat(problem.difficulty) + '\u2606'.repeat(3 - problem.difficulty);

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title={`${school.name} ${problem.year}`} showBack onBack={() => go(-1)} />

      <div style={{ padding: '12px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
            color: school.color, letterSpacing: '0.04em',
          }}>문제 {String(problem.num).padStart(2, '0')}</span>
          <Badge tone="muted" size="sm">{problem.topic}</Badge>
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: 0.5 }}>{diffStars}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600,
          color: 'var(--text-secondary)', margin: '0 0 16px', letterSpacing: '-0.015em',
        }}>다음을 구하시오.</h1>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '32px 16px', textAlign: 'center',
          fontSize: 19, overflow: 'auto',
        }}>
          <Tex block>{problem.latex}</Tex>
        </div>
      </div>

      {!hideAI && (
      <div style={{ padding: '0 20px 16px' }}>
        <button onClick={() => go('analyze', { preset: problem })} style={{
          width: '100%', background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
          border: 'none', borderRadius: 14, padding: '14px 16px',
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 12,
          color: '#fff',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(217,119,87,0.18)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4 2.3-7.4-6-4.4h7.6z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>AI 기출 분석으로 풀어보기</span>
              <ProBadge size="sm" />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>필요한 공식과 풀이 단계까지</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      )}

      <div style={{ padding: '8px 20px 0' }}>
        <button onClick={() => setShowSolution(!showSolution)} style={{
          width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>모범 풀이</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{showSolution ? '접기' : '펼치기'}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms', transform: showSolution ? 'rotate(180deg)' : 'rotate(0)' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {showSolution && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderTop: 'none', borderRadius: '0 0 12px 12px',
            padding: 16, marginTop: -6,
          }}>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
              아래는 일반적인 풀이 전개입니다. 자세한 단계와 공식 추천이 필요하다면 AI 기출 분석을 이용해보세요.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(ANALYSIS_RESULT.solution || []).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: 999,
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 11,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 14 }}><Tex>{s.math}</Tex></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
