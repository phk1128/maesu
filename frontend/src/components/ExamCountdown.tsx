import { useState, useEffect, useRef, useCallback } from 'react';
import type { UniversityExamDto } from '../api/formulas';
import { fetchUniversities } from '../api/formulas';

export default function ExamCountdown() {
  const [universities, setUniversities] = useState<UniversityExamDto[]>([]);
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUniversities().then(setUniversities).catch(() => {});
  }, []);

  const count = universities.length;

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % count);
      setIsTransitioning(true);
    }, 4000);
  }, [count]);

  useEffect(() => {
    startAutoPlay();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startAutoPlay]);

  const goTo = useCallback((idx: number) => {
    if (count === 0) return;
    setCurrent(((idx % count) + count) % count);
    setIsTransitioning(true);
    startAutoPlay();
  }, [count, startAutoPlay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsTransitioning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    setDragOffset(e.touches[0].clientX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragOffset) > 50) {
      goTo(current + (dragOffset < 0 ? 1 : -1));
    } else {
      setIsTransitioning(true);
    }
    setTouchStartX(null);
    setDragOffset(0);
    startAutoPlay();
  };

  if (count === 0) return null;

  const containerWidth = containerRef.current?.offsetWidth ?? 300;
  const translateX = -(current * containerWidth) + dragOffset;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        borderRadius: 16, overflow: 'hidden',
        position: 'relative', userSelect: 'none', touchAction: 'pan-y',
      }}
    >
      {/* 슬라이드 트랙 */}
      <div style={{
        display: 'flex',
        transform: `translateX(${translateX}px)`,
        transition: isTransitioning ? 'transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
      }}>
        {universities.map((uni) => {
          const curr = uni.currentYear;
          const prev = uni.previousYear;
          const hasDate = curr?.examDate != null;

          return (
            <div key={uni.id} style={{
              width: containerWidth, flexShrink: 0,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '20px 18px 16px',
              position: 'relative', overflow: 'hidden',
              boxSizing: 'border-box',
            }}>
              {/* 학교 색상 바 */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, width: 4,
                background: uni.color,
              }} />

              <div style={{ paddingLeft: 4 }}>
                {/* 학교명 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: uni.color }} />
                  <span style={{
                    fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}>{uni.name}</span>
                  {curr && (
                    <span style={{
                      fontSize: 11, color: uni.color, fontWeight: 600,
                      background: `${uni.color}14`, padding: '2px 7px', borderRadius: 4,
                    }}>{curr.mathType}</span>
                  )}
                </div>

                {/* 올해 일정 */}
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700,
                  color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {hasDate ? `D-${daysUntil(curr!.examDate!)}` : '미발표'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {hasDate
                    ? `${curr!.academicYear}학년도 시험일 ${curr!.examDate}`
                    : `${curr?.academicYear ?? '2027'}학년도 시험일정이 아직 공개되지 않았습니다`
                  }
                </div>

                {/* 작년 일정 참고 */}
                {prev?.examDate && (
                  <div style={{
                    marginTop: 12, padding: '10px 12px',
                    background: 'var(--bg)', borderRadius: 10,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}>작년 시험 일정</span>
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                    }}>{prev.examDate}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 인디케이터 */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 5, marginTop: 12,
      }}>
        {universities.map((u, i) => (
          <button
            key={u.id}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 18 : 6, height: 6,
              borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer',
              background: i === current ? u.color : 'var(--border-strong)',
              transition: 'all 300ms',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
}
