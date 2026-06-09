import { useState } from 'react';
import type { GoFn, User, HistoryEntry } from '../types';
import { CONTRIB_GRID, TOTAL_STUDIED, CURRENT_STREAK, getFormula } from '../data/mock';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ContributionGrid from '../components/ContributionGrid';
import ProBadge from '../components/ProBadge';
import FormulaRow from '../components/FormulaRow';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import SettingRow from '../components/SettingRow';

interface MyPageProps {
  go: GoFn;
  user: User | null;
  isPro: boolean;
  favorites: string[];
  history: HistoryEntry[];
  signOut: () => void;
  hideAI?: boolean;
}

export default function MyPage({ go, user, isPro, favorites, history, signOut, hideAI }: MyPageProps) {
  const [now] = useState(() => Date.now());
  const daysSince = user ? Math.max(1, Math.floor((now - user.joinedAt) / 86400000)) : 0;

  if (!user) {
    return (
      <div style={{ paddingBottom: 110 }}>
        <AppHeader title="내정보" large />
        <div style={{ padding: '32px 24px' }}>
          <EmptyState
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>}
            title="로그인하면 더 편해요"
            body="즐겨찾기 공식과 학습 기록을 저장할 수 있어요."
            action={<PrimaryButton size="md" onClick={() => go('login')}>카카오로 시작하기</PrimaryButton>}
          />
        </div>
      </div>
    );
  }

  const totalProblems = history.filter(h => h.type === 'problem').length;
  const totalAnalyze = history.filter(h => h.type === 'analyze').length + history.filter(h => h.type === 'variation').length;

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="내정보" large />

      {/* 프로필 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 18,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 999, background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em',
          }}>{user.initial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{user.name}</span>
              {isPro && <ProBadge size="sm" />}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              학습 {daysSince}일째 · 현재 연속 {CURRENT_STREAK}일 🔥
            </div>
          </div>
        </div>
      </div>

      {/* 잔디 */}
      <div style={{ padding: '0 20px 24px' }}>
        <ContributionGrid data={CONTRIB_GRID} totalStudied={TOTAL_STUDIED} streak={CURRENT_STREAK} />
      </div>

      {/* 통계 */}
      <div style={{ padding: '0 20px 28px' }}>
        <SectionHeader icon="📊" label="학습 현황" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <StatCard label="즐겨찾기" value={favorites.length} unit="공식" />
          <StatCard label="푼 기출" value={totalProblems} unit="문제" />
          {hideAI
            ? <StatCard label="학습 공식" value={history.filter(h => h.type === 'formula').length} unit="개" />
            : <StatCard label="AI 분석" value={totalAnalyze} unit="회" />}
        </div>
      </div>

      {/* Pro 안내 */}
      {!isPro && !hideAI && (
        <div style={{ padding: '0 20px 28px' }}>
          <SectionHeader icon="🔓" label="Pro 구독" />
          <div style={{
            background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
            color: '#fff', borderRadius: 14, padding: 18,
          }}>
            <div style={{ fontSize: 11, color: '#E89B7C', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>PRO</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.015em' }}>AI 기능을 무제한으로</h3>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', margin: '0 0 14px', lineHeight: 1.55 }}>
              AI 기출 분석 · AI 기출 변형 · 풀이 단계 설명
            </p>
            <PrimaryButton size="md" onClick={() => go('paywall')} style={{ width: '100%', background: 'var(--primary)' }}>
              월 9,900원에 시작하기
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* 즐겨찾기 공식 */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionHeader icon="❤️" label="즐겨찾기 공식" />
          {favorites.length > 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{favorites.length}개</span>}
        </div>
        {favorites.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px dashed var(--border-strong)',
            borderRadius: 12, padding: '24px 16px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55 }}>
              자주 보는 공식을 저장해두세요.
            </p>
            <SecondaryButton size="sm" onClick={() => go('formulas')}>공식 보러가기</SecondaryButton>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {favorites.slice(0, 3).map(id => {
              const f = getFormula(id);
              if (!f) return null;
              return <FormulaRow key={id} formula={f} compact onClick={() => go('formula-detail', { id })} />;
            })}
            {favorites.length > 3 && (
              <button onClick={() => go('formulas')} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 8,
                fontSize: 12.5, color: 'var(--text-secondary)', textAlign: 'center',
              }}>전체 {favorites.length}개 보기 →</button>
            )}
          </div>
        )}
      </div>

      {/* 설정 */}
      <div style={{ padding: '0 20px 0' }}>
        <SectionHeader icon="⚙️" label="설정" />
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <SettingRow label="알림 설정" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>} />
          <SettingRow label="결제 / 구독 관리" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>} />
          <SettingRow label="문의하기" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>} />
          <SettingRow label="버전 정보" right={<span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v0.2.0 beta</span>} isLast />
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
        <button onClick={signOut} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: 'var(--text-muted)', padding: 8,
        }}>로그아웃</button>
      </div>
    </div>
  );
}
