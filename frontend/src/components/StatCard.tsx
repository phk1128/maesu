interface StatCardProps {
  label: string;
  value: number;
  unit: string;
}

export default function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '14px 12px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '-0.005em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{unit}</span>
      </div>
    </div>
  );
}
