interface StarsProps {
  level: 1 | 2 | 3;
  size?: number;
}

const labels: Record<number, string> = { 3: '필수', 2: '유용', 1: '참고' };

export default function Stars({ level, size = 12 }: StarsProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: size, color: 'var(--text-secondary)' }}>
      <span style={{ color: level === 1 ? 'var(--text-muted)' : 'var(--primary)', letterSpacing: 1, fontWeight: 700 }}>
        {'★'.repeat(level)}{'☆'.repeat(3 - level)}
      </span>
      <span style={{ fontSize: size - 1, color: 'var(--text-muted)' }}>{labels[level]}</span>
    </span>
  );
}
