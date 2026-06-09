import type { GoFn } from '../types';
import PrimaryButton from '../components/PrimaryButton';

interface PaywallPageProps {
  go: GoFn;
  unlockPro: () => void;
}

export default function PaywallPage({ go, unlockPro }: PaywallPageProps) {
  return (
    <div style={{ paddingBottom: 110, background: 'linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 50%, var(--bg) 100%)', minHeight: '100%' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, padding: '12px 16px',
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <button onClick={() => go(-1)} style={{
          background: 'rgba(255,255,255,0.1)', border: 'none', padding: 8, borderRadius: 999, cursor: 'pointer',
          color: '#fff', backdropFilter: 'blur(8px)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div style={{ padding: '0 24px 0', textAlign: 'center', color: '#fff' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'rgba(217,119,87,0.18)', color: '#E89B7C',
          padding: '4px 10px', borderRadius: 999,
          fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 20,
        }}>PRO</div>

        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 600,
          color: '#fff', margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.2,
        }}>AI와 함께라면<br/>편입 수학이 쉬워져요</h1>
        <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px', lineHeight: 1.55 }}>
          AI 기출 분석 + AI 기출 변형을<br/>무제한으로 이용하세요
        </p>

        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 18, padding: 20, marginBottom: 18,
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 600, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>9,900원</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>/ 월</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>VAT 포함 · 언제든 해지 가능</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🎯', text: 'AI 기출 분석 무제한 (사진 → 공식 + 풀이)' },
              { icon: '⏱️', text: 'AI 기출 변형 무제한 (학교별 실전 모드)' },
              { icon: '✍️', text: '단계별 상세 풀이' },
              { icon: '📊', text: '학습 분석 리포트' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{b.icon}</span>
                <span style={{ fontSize: 13, color: '#fff', lineHeight: 1.5, letterSpacing: '-0.005em' }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <PrimaryButton onClick={() => { unlockPro(); go('home'); }} style={{ width: '100%', background: 'var(--primary)' }}>
          7일 무료 체험 시작
        </PrimaryButton>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '12px 0 0', lineHeight: 1.55 }}>
          7일 후 자동 결제. 체험 기간 중 언제든 해지 가능합니다.
        </p>
      </div>
    </div>
  );
}
