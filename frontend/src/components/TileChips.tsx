interface TileChipsProps {
  items: string[];
}

export default function TileChips({ items }: TileChipsProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {items.map(i => (
        <span key={i} style={{
          padding: '2px 7px', background: 'var(--bg)', color: 'var(--text-secondary)',
          fontSize: 10, fontWeight: 500, borderRadius: 4, letterSpacing: '-0.005em',
        }}>{i}</span>
      ))}
      <span style={{
        padding: '2px 7px', color: 'var(--text-muted)',
        fontSize: 10, fontWeight: 500,
      }}>+</span>
    </div>
  );
}
