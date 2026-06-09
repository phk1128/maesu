import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--primary-light)', color: 'var(--primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>{icon}</div>
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600,
        margin: '0 0 6px', color: 'var(--text-primary)',
      }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.55 }}>{body}</p>
      {action}
    </div>
  );
}
