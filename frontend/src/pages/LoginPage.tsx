import { useState } from 'react';
import type { GoFn } from '../types';

interface LoginPageProps {
  go: GoFn;
  signIn: () => void;
}

export default function LoginPage({ go, signIn }: LoginPageProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 36 }}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => go(-1)} style={{
          background: 'none', border: 'none', padding: 8, cursor: 'pointer', color: 'var(--text-secondary)',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, padding: '20px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 48 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'var(--primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: 700,
            fontSize: 28, letterSpacing: '-0.02em', marginBottom: 24,
            boxShadow: '0 8px 24px -8px rgba(217,119,87,0.4)',
          }}>편</div>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
            color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em',
          }}>환영합니다</h1>
          <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
            로그인하면 학습 기록이 잔디로 쌓여요
          </p>
        </div>

        {/* 미리보기 잔디 */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 14, marginBottom: 28,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>학습 잔디 미리보기</div>
          <div style={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            {Array.from({ length: 18 }).map((_, w) => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Array.from({ length: 7 }).map((_, d) => {
                  const colors = ['#EEEAE5', '#F2D7C5', '#E8AE89', '#DC8657', '#B45C36'];
                  // Deterministic pattern based on position
                  const seed = (w * 7 + d) * 2654435761;
                  const r = ((seed >>> 0) % 100) / 100;
                  const level = r < 0.4 ? 0 : r < 0.6 ? 1 : r < 0.8 ? 2 : r < 0.92 ? 3 : 4;
                  return <div key={d} style={{ width: 10, height: 10, borderRadius: 2, background: colors[level] }}></div>;
                })}
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => agreed && signIn()} style={{
          width: '100%', height: 54,
          background: agreed ? '#FEE500' : '#FEE50080', color: '#000',
          border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 600, cursor: agreed ? 'pointer' : 'not-allowed',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 12,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.3 4.7 6.7l-1.2 4.4c-.1.3.3.6.6.4l5.2-3.4c.2 0 .4 0 .7 0 5.5 0 10-3.5 10-7.8S17.5 3 12 3z"/>
          </svg>
          카카오로 시작하기
        </button>

        <button onClick={() => setAgreed(!agreed)} style={{
          width: '100%', background: 'none', border: 'none',
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '10px 0', cursor: 'pointer', textAlign: 'left',
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4, flexShrink: 0,
            border: `1.5px solid ${agreed ? 'var(--primary)' : 'var(--border-strong)'}`,
            background: agreed ? 'var(--primary)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 1,
          }}>
            {agreed && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>}
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>(필수)</span> 이용약관 및 개인정보처리방침에 동의합니다.
          </span>
        </button>

        <div style={{ flex: 1 }}></div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 12px', lineHeight: 1.55 }}>
          처음이신가요? 카카오 로그인으로 자동 회원가입됩니다.
        </p>
      </div>
    </div>
  );
}
