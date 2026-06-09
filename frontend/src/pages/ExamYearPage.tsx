import type { GoFn } from '../types';
import { SCHOOLS, getProblems } from '../data/mock';
import AppHeader from '../components/AppHeader';
import ProblemCard from '../components/ProblemCard';

interface ExamYearPageProps {
  go: GoFn;
  params: Record<string, unknown>;
}

export default function ExamYearPage({ go, params }: ExamYearPageProps) {
  const school = SCHOOLS.find(s => s.id === params.schoolId);
  const year = params.year as number;
  const probs = getProblems(params.schoolId as string, year);
  if (!school) return null;

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title={`${school.name} ${year}`} showBack onBack={() => go(-1)} />

      <div style={{ padding: '12px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: school.color }}></span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{school.name}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>{year}학년도</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
          총 {probs.length}문제 · 카드를 눌러 풀이 보기
        </p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {probs.map(p => (
          <ProblemCard key={p.id} problem={p} school={school} onClick={() => go('exam-detail', { id: p.id })} />
        ))}
      </div>
    </div>
  );
}
