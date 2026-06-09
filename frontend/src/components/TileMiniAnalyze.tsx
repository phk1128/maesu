export default function TileMiniAnalyze() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 6,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5-9 9" />
      </svg>
      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.005em' }}>이미지 업로드</span>
    </div>
  );
}
