import { useState } from 'react';
import type { GoFn, User, HistoryEntry } from '../types';
import type { StudyGridResponse } from '../api/formulas';
import { buildContribGrid } from '../utils/studyGrid';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import ContributionGrid from '../components/ContributionGrid';
import ProBadge from '../components/ProBadge';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import SettingRow from '../components/SettingRow';
import PrimaryButton from '../components/PrimaryButton';

interface MyPageProps {
  go: GoFn;
  user: User | null;
  isPro: boolean;
  favorites: string[];
  history: HistoryEntry[];
  signOut: () => void;
  hideAI?: boolean;
  studyGrid: StudyGridResponse | null;
}

export default function MyPage({ go, user, isPro, favorites, history, signOut, hideAI, studyGrid }: MyPageProps) {
  const [now] = useState(() => Date.now());
  const daysSince = user ? Math.max(1, Math.floor((now - user.joinedAt) / 86400000)) : 0;

  if (!user) {
    return (
      <div style={{ paddingBottom: 110 }}>
        <AppHeader title="My Page" large />
        <div style={{ padding: '32px 24px' }}>
          <EmptyState
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>}
            title="로그인하면 더 편해요"
            body="북마크한 공식과 학습 기록을 저장할 수 있어요."
            action={
              <button onClick={() => go('login')} style={{
                height: 46, padding: '0 24px',
                background: '#FEE500', color: 'rgba(0,0,0,0.85)',
                border: 'none', borderRadius: 12,
                fontSize: 14.5, fontWeight: 600, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="18" height="18" viewBox="0 0 256 256" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M128 36C70.562 36 24 72.713 24 117.665C24 146.566 43.17 172.094 72.292 186.381L61.146 224.867C60.333 227.654 63.554 229.876 65.987 228.276L111.489 198.136C116.878 198.72 122.394 199.33 128 199.33C185.438 199.33 232 162.617 232 117.665C232 72.713 185.438 36 128 36Z" fill="black"/>
                </svg>
                카카오 로그인
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const { grid, totalStudied, streak } = buildContribGrid(studyGrid);
  const totalProblems = history.filter(h => h.type === 'problem').length;
  const totalAnalyze = history.filter(h => h.type === 'analyze').length + history.filter(h => h.type === 'variation').length;

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="My Page" large />

      {/* 프로필 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 18,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={{
              width: 52, height: 52, borderRadius: 999, objectFit: 'cover', flexShrink: 0,
            }} />
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: 999, background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em',
            }}>{user.initial}</div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{user.nickname || user.name}</span>
              {isPro && <ProBadge size="sm" />}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              학습 {daysSince}일째 · 현재 연속 {streak}일 🔥
            </div>
          </div>
        </div>
      </div>

      {/* 잔디 */}
      <div style={{ padding: '0 20px 24px' }}>
        <ContributionGrid data={grid} totalStudied={totalStudied} streak={streak} />
      </div>

      {/* 통계 */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <StatCard label="북마크" value={favorites.length} unit="공식" />
          <StatCard label="푼 기출" value={totalProblems} unit="문제" />
          {hideAI
            ? <StatCard label="학습 공식" value={totalStudied} unit="개" />
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

      {/* 북마크 */}
      <div style={{ padding: '0 20px 28px' }}>
        <div onClick={() => favorites.length > 0 ? go('favorites') : go('formulas')} style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
          transition: 'border-color 150ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 2 }}>
              북마크 공식
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {favorites.length > 0 ? `${favorites.length}개 저장됨` : '저장된 공식이 없어요'}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>

      {/* 설정 */}
      <div style={{ padding: '0 20px 0' }}>
        <SectionHeader label="설정" />
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <SettingRow label={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.5 0"/>
              </svg>
              알림 설정
            </span>
          } right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>} />
          <SettingRow label={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFDC80"/>
                    <stop offset="25%" stopColor="#F77737"/>
                    <stop offset="50%" stopColor="#E1306C"/>
                    <stop offset="75%" stopColor="#C13584"/>
                    <stop offset="100%" stopColor="#833AB4"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)"/>
                <circle cx="12" cy="12" r="5" stroke="url(#ig)"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig)" stroke="none"/>
              </svg>
              DM으로 문의하기
            </span>
          } right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>} isLast />
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
