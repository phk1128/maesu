import type { ContribWeek } from '../types';
import type { StudyGridResponse } from '../api/formulas';

function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildContribGrid(gridData: StudyGridResponse | null, weeks: number = 18): {
  grid: ContribWeek[];
  totalStudied: number;
  streak: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const sundayEnd = new Date(today);
  sundayEnd.setDate(today.getDate() + (6 - dow));

  const countMap = new Map(gridData?.dailyCounts.map(d => [d.date, d.count]) ?? []);

  const grid: ContribWeek[] = [];
  for (let w = 0; w < weeks; w++) {
    const week: ContribWeek = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(sundayEnd);
      date.setDate(sundayEnd.getDate() - ((weeks - 1 - w) * 7 + (6 - d)));
      const future = date > today;
      const dateStr = formatLocalDate(date);
      const count = future ? 0 : (countMap.get(dateStr) || 0);
      week.push({ date, level: countToLevel(count), future });
    }
    grid.push(week);
  }

  return {
    grid,
    totalStudied: gridData?.totalStudied ?? 0,
    streak: gridData?.streak ?? 0,
  };
}
