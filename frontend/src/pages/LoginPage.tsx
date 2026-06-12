import type { GoFn } from '../types';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  go: GoFn;
}

export default function LoginPage({ go }: LoginPageProps) {
  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 36 }}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => go(-1)} style={{
          background: 'none', border: 'none', padding: 8, cursor: 'pointer', color: 'var(--text-secondary)',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, padding: '20px 28px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* 미리보기 잔디 */}
        <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.55 }}>
          로그인하면 학습 기록이 잔디로 쌓여요
        </p>
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
                  const seed = (w * 7 + d) * 2654435761;
                  const r = ((seed >>> 0) % 100) / 100;
                  const level = r < 0.4 ? 0 : r < 0.6 ? 1 : r < 0.8 ? 2 : r < 0.92 ? 3 : 4;
                  return <div key={d} style={{ width: 10, height: 10, borderRadius: 2, background: colors[level] }}></div>;
                })}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleKakaoLogin} style={{
          width: '100%', height: 54,
          background: '#FEE500',
          color: 'rgba(0,0,0,0.85)',
          border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 12,
        }}>
          <svg width="22" height="22" viewBox="0 0 256 256" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M128 36C70.562 36 24 72.713 24 117.665C24 146.566 43.17 172.094 72.292 186.381L61.146 224.867C60.333 227.654 63.554 229.876 65.987 228.276L111.489 198.136C116.878 198.72 122.394 199.33 128 199.33C185.438 199.33 232 162.617 232 117.665C232 72.713 185.438 36 128 36Z" fill="black"/>
          </svg>
          카카오 로그인
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 12px', lineHeight: 1.55 }}>
          처음이신가요? 카카오 로그인으로 자동 회원가입됩니다.
        </p>
      </div>
    </div>
  );
}
