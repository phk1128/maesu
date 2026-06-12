import { useState, useEffect } from 'react';
import type { User, GoFn } from '../types';
import type { FormulaDto } from '../api/formulas';
import { fetchPopularFormulas } from '../api/formulas';
import { SCHOOLS } from '../data/mock';
import { AREAS } from '../data/formulas';
import ExamCountdown from '../components/ExamCountdown';
import TexTitle from '../components/TexTitle';
import FeatureTile from '../components/FeatureTile';
import TileChips from '../components/TileChips';
import TileMiniAnalyze from '../components/TileMiniAnalyze';
import TileMiniTimer from '../components/TileMiniTimer';

interface HomePageProps {
  go: GoFn;
  user: User | null;
  signIn: () => void;
  primarySchool: string | null;
  setPrimarySchool: (id: string) => void;
  hideAI?: boolean;
}

export default function HomePage({ go, user, signIn: _signIn, primarySchool, setPrimarySchool: _setPrimarySchool, hideAI }: HomePageProps) {
  void _signIn;
  void _setPrimarySchool;
  void primarySchool;

  const [popular, setPopular] = useState<FormulaDto[]>([]);
  useEffect(() => {
    fetchPopularFormulas().then(setPopular).catch(() => {});
  }, []);
  return (
    <div style={{ paddingBottom: 100, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 */}
      <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 18, fontWeight: 700, color: 'var(--text-primary)',
          letterSpacing: '0.04em',
        }}>MAESU</span>
        <button onClick={() => go(user ? 'mypage' : 'login')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            background: user ? 'var(--primary-light)' : 'var(--border)',
            color: user ? 'var(--primary)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
            </svg>
          </div>
        </button>
      </div>

      {/* 편입 시험 D-day 카운트다운 */}
      <div style={{ padding: '14px 20px 18px' }}>
        <ExamCountdown />
      </div>

      {/* 인기 북마크 공식 Top 3 */}
      {popular.length > 0 && (
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 10 }}>
            중요 공식 Top 3
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {popular.map((f, i) => (
              <div key={f.id} onClick={() => go('formula-detail', { id: f.id, categoryId: f.categoryId })} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'border-color 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}><TexTitle>{f.title}</TexTitle></div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 메인 타일 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 10 }}>학습 메뉴</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FeatureTile
            title="공식"
            subtitle="핵심 공식 정리"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>}
            onClick={() => go('formulas')}
            visual={<TileChips items={AREAS.slice(0, 3).map(a => a.name)} />}
          />
          <FeatureTile
            title="기출"
            subtitle="학교별·연도별 문제"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>}
            onClick={() => go('exams')}
            visual={<TileChips items={SCHOOLS.slice(0, 3).map(s => s.name)} />}
          />
          {hideAI ? (
            <>
              <FeatureTile
                comingSoon
                title="AI 기출 분석"
                subtitle="문제 사진 → 필요한 공식"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.9H20l-5 3.7 1.9 5.9L12 14.8 6.1 18.5 8 12.6 3 8.9h6.1z"/></svg>}
              />
              <FeatureTile
                comingSoon
                title="AI 기출 변형"
                subtitle="변형 문제 · 실전 타이머"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 1h6M12 6V4"/></svg>}
              />
            </>
          ) : (
            <>
              <FeatureTile
                title="AI 기출 분석"
                subtitle="문제 사진 → 필요한 공식"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.9H20l-5 3.7 1.9 5.9L12 14.8 6.1 18.5 8 12.6 3 8.9h6.1z"/></svg>}
                onClick={() => go('analyze')}
                locked accent
                visual={<TileMiniAnalyze />}
              />
              <FeatureTile
                title="AI 기출 변형"
                subtitle="변형 문제 · 타이머"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 1h6M12 6V4"/></svg>}
                onClick={() => go('variations')}
                locked accent
                visual={<TileMiniTimer />}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
