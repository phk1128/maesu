// 편입 수학 - 기출 페이지 (v2): 학교 → 연도 → 문제 카드 → 문제 상세

// ═══════════════════════════════════════════
// 1단계: 학교 목록
// ═══════════════════════════════════════════
function ExamsPage({ go }) {
  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="기출" large />
      <div style={{ padding: '0 20px 24px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55 }}>
        학교를 고르고, 연도별 기출문제를 풀어보세요.
      </div>

      {/* 학교 카드 그리드 */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {SCHOOLS.map(s => {
          const problemCount = PROBLEMS.filter(p => p.school === s.id).length;
          return (
            <button key={s.id} onClick={() => go('exam-school', { schoolId: s.id })} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 0, cursor: 'pointer',
              textAlign: 'left', overflow: 'hidden',
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* 상단 색상 영역 */}
              <div style={{
                height: 72, background: s.color, padding: 14,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
              }}>
                <svg width="80" height="80" viewBox="0 0 80 80" style={{
                  position: 'absolute', top: -10, right: -10, opacity: 0.12,
                }}>
                  <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="40" cy="40" r="20" stroke="white" strokeWidth="1.5" fill="none"/>
                </svg>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.06em',
                }}>{s.id.toUpperCase()}</div>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600,
                  color: '#fff', letterSpacing: '-0.015em', lineHeight: 1.1,
                }}>{s.name}</div>
              </div>
              <div style={{ padding: '10px 14px 14px' }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 4 }}>{s.tag}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    {s.years.length}개년 · {problemCount}문제
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 2단계: 학교 → 연도
// ═══════════════════════════════════════════
function ExamSchoolPage({ go, params }) {
  const school = SCHOOLS.find(s => s.id === params.schoolId);
  if (!school) return null;

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title={school.name} showBack onBack={() => go(-1)} />

      {/* 학교 헤더 */}
      <div style={{
        background: school.color, padding: '16px 20px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{
          position: 'absolute', top: -40, right: -40, opacity: 0.08,
        }}>
          <circle cx="90" cy="90" r="84" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="90" cy="90" r="60" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="90" cy="90" r="36" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', marginBottom: 6 }}>
          {school.id.toUpperCase()}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600,
          color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>{school.name}</h1>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>{school.tag}</span>
          <span style={{ width: 3, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.5)' }}></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{school.years.length}개년</span>
        </div>
      </div>

      {/* 연도 리스트 */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 12,
        }}>연도 선택</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {school.years.map(year => {
            const probs = getProblems(school.id, year);
            return (
              <button key={year} onClick={() => go('exam-year', { schoolId: school.id, year })} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '16px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600,
                  color: school.color, letterSpacing: '-0.02em', minWidth: 60,
                }}>{year}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.01em' }}>
                    {year}학년도 편입 수학
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {probs.length}문제
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 3단계: 연도 → 문제 카드 그리드
// ═══════════════════════════════════════════
function ExamYearPage({ go, params }) {
  const school = SCHOOLS.find(s => s.id === params.schoolId);
  const year = params.year;
  const probs = getProblems(params.schoolId, year);
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

      {/* 문제 카드 그리드 */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {probs.map(p => (
          <ProblemCard key={p.id} problem={p} school={school} onClick={() => go('exam-detail', { id: p.id })} />
        ))}
      </div>
    </div>
  );
}

function ProblemCard({ problem, school, onClick }) {
  const diffStars = '★'.repeat(problem.difficulty) + '☆'.repeat(3 - problem.difficulty);
  return (
    <button onClick={onClick} style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 0, cursor: 'pointer',
      textAlign: 'left', overflow: 'hidden',
      transition: 'all 180ms',
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

// ═══════════════════════════════════════════
// 4단계: 문제 상세 (풀이)
// ═══════════════════════════════════════════
function ExamDetailPage({ go, params, markStudied }) {
  const problem = PROBLEMS.find(p => p.id === params.id);
  const [showSolution, setShowSolution] = React.useState(false);

  React.useEffect(() => {
    if (problem && markStudied) markStudied('problem', problem.id);
  }, [params.id]);

  if (!problem) return null;
  const school = SCHOOLS.find(s => s.id === problem.school);
  const diffStars = '★'.repeat(problem.difficulty) + '☆'.repeat(3 - problem.difficulty);

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title={`${school.name} ${problem.year}`} showBack onBack={() => go(-1)} />

      {/* 문제 헤더 */}
      <div style={{ padding: '12px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
            color: school.color, letterSpacing: '0.04em',
          }}>문제 {String(problem.num).padStart(2, '0')}</span>
          <Badge tone="muted" size="sm">{problem.topic}</Badge>
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: 0.5 }}>{diffStars}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600,
          color: 'var(--text-secondary)', margin: '0 0 16px', letterSpacing: '-0.015em',
        }}>다음을 구하시오.</h1>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '32px 16px', textAlign: 'center',
          fontSize: 19, overflow: 'auto',
        }}>
          <Tex block>{problem.latex}</Tex>
        </div>
      </div>

      {/* AI 분석 CTA */}
      {!window.__HIDE_AI__ && (
      <div style={{ padding: '0 20px 16px' }}>
        <button onClick={() => go('analyze', { preset: problem })} style={{
          width: '100%', background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
          border: 'none', borderRadius: 14, padding: '14px 16px',
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 12,
          color: '#fff',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(217,119,87,0.18)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4 2.3-7.4-6-4.4h7.6z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>AI 기출 분석으로 풀어보기</span>
              <ProBadge size="sm" />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>필요한 공식과 풀이 단계까지</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      )}

      {/* 풀이 보기 (간단한 모범 풀이) */}
      <div style={{ padding: '8px 20px 0' }}>
        <button onClick={() => setShowSolution(!showSolution)} style={{
          width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>모범 풀이</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{showSolution ? '접기' : '펼치기'}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms', transform: showSolution ? 'rotate(180deg)' : 'rotate(0)' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {showSolution && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderTop: 'none', borderRadius: '0 0 12px 12px',
            padding: 16, marginTop: -6,
          }}>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
              아래는 일반적인 풀이 전개입니다. 자세한 단계와 공식 추천이 필요하다면 AI 기출 분석을 이용해보세요.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(ANALYSIS_RESULT.solution || []).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: 999,
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 11,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 14 }}><Tex>{s.math}</Tex></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ExamsPage, ExamSchoolPage, ExamYearPage, ExamDetailPage });
