import type { User, GoFn } from '../types';
import { SCHOOLS, FORMULAS, FORMULA_TREE, CONTRIB_GRID, TOTAL_STUDIED, CURRENT_STREAK } from '../data/mock';
import Logo from '../components/Logo';
import ExamCountdown from '../components/ExamCountdown';
import ContributionGrid from '../components/ContributionGrid';
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
  const school = SCHOOLS.find(s => s.id === primarySchool);
  return (
    <div style={{ paddingBottom: 100, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 인사 */}
      <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo />
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600,
            color: 'var(--text-primary)', letterSpacing: '-0.01em',
          }}>편입수학</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button style={{
            background: 'none', border: 'none', padding: 8, cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.5 0"/>
            </svg>
          </button>
          {user ? (
            <button onClick={() => go('mypage')} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 999, background: 'var(--primary-light)',
                color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 13,
              }}>{user.initial}</div>
            </button>
          ) : (
            <button onClick={() => go('login')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
              padding: '6px 10px',
            }}>로그인</button>
          )}
        </div>
      </div>

      {/* 편입 시험 D-day 카운트다운 */}
      <div style={{ padding: '14px 20px 18px' }}>
        <ExamCountdown
          user={user}
          school={school}
          onOpenSchedule={() => go('exam-schedule')}
          onSetSchool={() => go('exam-schedule', { setMode: true })}
        />
      </div>

      {/* 잔디 (로그인 상태) */}
      {user && (
        <div style={{ padding: '0 20px 20px' }}>
          <ContributionGrid data={CONTRIB_GRID} totalStudied={TOTAL_STUDIED} streak={CURRENT_STREAK} />
        </div>
      )}

      {/* 메인 타일 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
          color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 4,
        }}>학습 메뉴</div>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 14px', letterSpacing: '-0.02em',
        }}>무엇을 학습할까요?</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FeatureTile
            title="공식"
            subtitle={`${FORMULAS.length}개 핵심 공식 정리`}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>}
            onClick={() => go('formulas')}
            visual={<TileChips items={FORMULA_TREE.slice(0, 3).map(c => c.name)} />}
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
