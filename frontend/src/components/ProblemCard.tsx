import type { Problem, School } from '../types';
import Badge from './Badge';
import Tex from './Tex';

interface ProblemCardProps {
  problem: Problem;
  school: School;
  onClick: () => void;
}

export default function ProblemCard({ problem, school, onClick }: ProblemCardProps) {
  const diffStars = '\u2605'.repeat(problem.difficulty) + '\u2606'.repeat(3 - problem.difficulty);
  return (
    <button onClick={onClick} style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 0, cursor: 'pointer',
      textAlign: 'left', overflow: 'hidden',
      transition: 'all 180ms', width: '100%',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
            color: school.color, letterSpacing: '0.04em',
          }}>문제 {String(problem.num).padStart(2, '0')}</span>
          <Badge tone="muted" size="sm">{problem.topic}</Badge>
        </div>
        <span style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700, letterSpacing: 0.5 }}>{diffStars}</span>
      </div>
      <div style={{
        padding: '18px 16px', textAlign: 'center',
        fontSize: 15, color: 'var(--text-primary)',
      }}>
        <Tex>{problem.latex}</Tex>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderTop: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{problem.type}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
          풀이 보기
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </span>
      </div>
    </button>
  );
}
