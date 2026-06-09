export default function TileMiniTimer() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 6,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
        color: '#E89B7C', letterSpacing: '0.02em',
      }}>15:00</span>
      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)' }}>실전 타이머</span>
    </div>
  );
}
