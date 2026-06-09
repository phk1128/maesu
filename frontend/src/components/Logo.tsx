interface LogoProps {
  small?: boolean;
}

export default function Logo({ small }: LogoProps) {
  const s = small ? 22 : 28;
  return (
    <div style={{
      width: s, height: s, borderRadius: 7, background: 'var(--primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: 700,
      fontSize: small ? 13 : 15, letterSpacing: '-0.02em',
    }}>편</div>
  );
}
