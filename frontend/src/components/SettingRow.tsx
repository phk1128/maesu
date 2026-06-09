import type { ReactNode } from 'react';

interface SettingRowProps {
  label: string;
  right?: ReactNode;
  isLast?: boolean;
}

export default function SettingRow({ label, right, isLast }: SettingRowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 14px', cursor: 'pointer',
      borderBottom: isLast ? 'none' : '0.5px solid var(--border)',
      fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.01em',
    }}>
      <span>{label}</span>
      {right}
    </div>
  );
}
