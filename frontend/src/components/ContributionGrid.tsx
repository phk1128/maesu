import type { ContribWeek } from '../types';

interface ContributionGridProps {
  data: ContribWeek[];
  totalStudied: number;
  streak: number;
}

export default function ContributionGrid({ data, totalStudied, streak }: ContributionGridProps) {
  const colors = ['#EEEAE5', '#F2D7C5', '#E8AE89', '#DC8657', '#B45C36'];
  const weeks = data.length;
  const cell = 11, gap = 3;
  const gridWidth = weeks * cell + (weeks - 1) * gap;
  const gridHeight = 7 * cell + 6 * gap;

  // 월 라벨
  const monthLabels: { wi: number; label: string }[] = [];
  let lastMonth = -1;
  data.forEach((week, wi) => {
    const firstDay = week[0]?.date;
    if (firstDay) {
      const m = firstDay.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ wi, label: `${m + 1}월` });
        lastMonth = m;
      }
    }
  });

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '16px 16px 14px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '-0.005em' }}>지난 18주 학습</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1,
            }}>{totalStudied}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>회 학습</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>현재 연속</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600,
            color: 'var(--primary)', letterSpacing: '-0.02em',
          }}>
            🔥 {streak}일
          </div>
        </div>
      </div>

      {/* 월 라벨 */}
      <div style={{ position: 'relative', height: 12, marginBottom: 4, marginLeft: 0 }}>
        {monthLabels.map((m, i) => (
          <span key={i} style={{
            position: 'absolute', left: m.wi * (cell + gap),
            fontSize: 9.5, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>{m.label}</span>
        ))}
      </div>

      {/* 그리드 */}
      <div style={{ overflowX: 'auto', paddingBottom: 4, marginLeft: -16, paddingLeft: 16, marginRight: -16, paddingRight: 16 }}>
        <svg width={gridWidth} height={gridHeight} style={{ display: 'block' }}>
          {data.map((week, wi) =>
            week.map((cellData, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * (cell + gap)}
                y={di * (cell + gap)}
                width={cell} height={cell}
                rx={2.5}
                fill={cellData.future ? 'transparent' : colors[cellData.level]}
                stroke={cellData.future ? 'transparent' : (cellData.level === 0 ? 'rgba(0,0,0,0.02)' : 'none')}
                strokeWidth="0.5"
              />
            ))
          )}
        </svg>
      </div>

      {/* 범례 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4,
        marginTop: 8, fontSize: 10, color: 'var(--text-muted)',
      }}>
        <span style={{ marginRight: 2 }}>적게</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }}></div>
        ))}
        <span style={{ marginLeft: 2 }}>많이</span>
      </div>
    </div>
  );
}
