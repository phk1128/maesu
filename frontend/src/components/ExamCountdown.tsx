import { Fragment } from 'react';
import type { School, User } from '../types';
import { examDdayInfo } from '../utils/exam';
import { useNow } from '../utils/useNow';

interface ExamCountdownProps {
  user: User | null;
  school: School | undefined;
  onOpenSchedule: () => void;
  onSetSchool: () => void;
}

export default function ExamCountdown({ user, school, onOpenSchedule, onSetSchool }: ExamCountdownProps) {
  const now = useNow();

  // 설정한 학교가 없을 때
  if (!school) {
    return (
      <button onClick={onSetSchool} style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '20px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'all 180ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.015em' }}>
            목표 학교를 설정해보세요
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            시험일까지 며칠 남았는지 매일 보여드릴게요
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    );
  }

  const info = examDdayInfo(school, now);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      onClick={onOpenSchedule}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '18px 18px 16px',
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        transition: 'all 180ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* 학교 색상 액센트 (왼쪽 바) */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 4, background: school.color }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingLeft: 4 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
          fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: school.color }}></span>
          {school.name}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>내 목표 학교</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11.5, color: 'var(--primary)', fontWeight: 600 }}>
          전체 일정
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </span>
      </div>

      {/* 큰 D-숫자 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2, paddingLeft: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>D-</span>
        <span style={{
          fontFamily: 'var(--font-serif)', fontSize: 50, fontWeight: 700,
          color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 0.95,
        }}>{info.days}</span>
        <span style={{ fontSize: 15, color: 'var(--text-secondary)', marginLeft: 2 }}>일 남았어요</span>
      </div>

      {/* 시:분:초 실시간 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, paddingLeft: 4 }}>
        {[
          { v: pad(info.hours), l: '시간' },
          { v: pad(info.mins), l: '분' },
          { v: pad(info.secs), l: '초' },
        ].map((u, i) => (
          <Fragment key={u.l}>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 9, padding: '7px 0', flex: 1, textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 19, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em', lineHeight: 1 }}>{u.v}</div>
              <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3 }}>{u.l}</div>
            </div>
            {i < 2 && <span style={{ color: 'var(--border-strong)', fontWeight: 700, fontSize: 16 }}>:</span>}
          </Fragment>
        ))}
      </div>

      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4,
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          시험일 <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{info.dateStr}</span>
          <span style={{ marginLeft: 4 }}>({info.weekday})</span>
        </span>
        <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, letterSpacing: '-0.005em' }}>
          {user ? `${user.name}님, 화이팅! 🔥` : '화이팅! 🔥'}
        </span>
      </div>
    </div>
  );
}
