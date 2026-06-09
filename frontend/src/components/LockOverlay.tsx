import PrimaryButton from './PrimaryButton';

interface LockOverlayProps {
  title: string;
  body: string;
  onSubscribe?: () => void;
  onClose?: () => void;
}

export default function LockOverlay({ title, body, onSubscribe, onClose }: LockOverlayProps) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 150,
      background: 'rgba(26,26,26,0.55)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', background: 'var(--surface)',
        borderRadius: '24px 24px 0 0',
        padding: '20px 24px 32px',
        boxShadow: '0 -12px 48px rgba(0,0,0,0.18)',
        animation: 'slideUp 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* drag handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 999, background: 'var(--border-strong)',
          margin: '0 auto 18px',
        }}></div>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
            color: '#F5E6DC',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, position: 'relative',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span style={{
              position: 'absolute', top: -6, right: -10,
              background: 'var(--primary)', color: '#fff',
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
              letterSpacing: '0.06em',
            }}>PRO</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600,
            color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em',
          }}>{title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55, letterSpacing: '-0.005em' }}>
            {body}
          </p>
        </div>

        <div style={{
          background: 'var(--bg)', borderRadius: 12, padding: '14px 16px',
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span style={{
              fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1,
            }}>9,900원</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>/ 월</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>VAT 포함</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            ✓ AI 기출 분석 무제한 · ✓ AI 기출 변형 무제한 · ✓ 풀이 단계별 설명
          </div>
        </div>

        <PrimaryButton onClick={onSubscribe} style={{ width: '100%' }}>
          Pro 구독하고 시작하기
        </PrimaryButton>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: 'var(--text-muted)', padding: '12px 8px 0',
          width: '100%', textAlign: 'center', letterSpacing: '-0.01em',
        }}>나중에 하기</button>
      </div>
    </div>
  );
}
