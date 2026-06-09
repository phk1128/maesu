// 편입 수학 - AI 기출 변형 (PRO 잠금 · 타이머)

function VariationsPage({ go, user, isPro, unlockPro, markStudied }) {
  const [selectedSchool, setSelectedSchool] = React.useState(null);
  const [phase, setPhase] = React.useState('select'); // select | timer | result
  const [time, setTime] = React.useState(900); // 15:00
  const [running, setRunning] = React.useState(false);
  const [problemIdx, setProblemIdx] = React.useState(0);
  const [showLock, setShowLock] = React.useState(!isPro);

  React.useEffect(() => { setShowLock(!isPro); }, [isPro]);

  // 타이머
  React.useEffect(() => {
    if (phase !== 'timer' || !running) return;
    if (time <= 0) { setRunning(false); return; }
    const t = setTimeout(() => setTime(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, running, phase]);

  const startSet = (schoolId) => {
    if (!isPro) { setShowLock(true); return; }
    setSelectedSchool(schoolId);
    setPhase('timer');
    setTime(900);
    setRunning(true);
    setProblemIdx(0);
  };

  const finish = () => {
    setRunning(false);
    setPhase('result');
    if (markStudied) markStudied('variation', Date.now());
  };

  const reset = () => {
    setSelectedSchool(null); setPhase('select'); setTime(900); setRunning(false); setProblemIdx(0);
  };

  if (phase === 'timer' && selectedSchool) {
    return <TimerView school={SCHOOLS.find(s => s.id === selectedSchool)} time={time} running={running} setRunning={setRunning} setTime={setTime} problemIdx={problemIdx} setProblemIdx={setProblemIdx} finish={finish} reset={reset} />;
  }
  if (phase === 'result') {
    return <VariationResultView school={SCHOOLS.find(s => s.id === selectedSchool)} timeUsed={900 - time} reset={reset} go={go} />;
  }

  // 학교 선택
  return (
    <div style={{ paddingBottom: 110, position: 'relative', minHeight: '100%' }}>
      <AppHeader title="AI 기출 변형" large />
      <div style={{ padding: '0 20px 20px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55 }}>
        학교 출제 경향을 학습한 AI가 변형 문제를 만들어드려요.
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
          color: '#F5E6DC', padding: '6px 12px', borderRadius: 999,
          fontSize: 11.5, fontWeight: 600,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          PRO 기능
        </div>
      </div>

      {/* 안내 카드 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 14,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 1h6M12 6V4"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.01em' }}>실전처럼 풀어보세요</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              한 세트 5문제 · 15분 타이머<br/>
              풀이 후 학교 출제 경향 분석까지
            </div>
          </div>
        </div>
      </div>

      {/* 학교 선택 */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 12,
        }}>학교 선택</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SCHOOLS.map(s => (
            <button key={s.id} onClick={() => startSet(s.id)} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: s.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 13,
                letterSpacing: '-0.015em', flexShrink: 0,
              }}>{s.name.slice(0, 2)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.01em' }}>{s.name} 변형 세트</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>5문제 · 15분 · {s.tag}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      </div>

      {showLock && !isPro && (
        <LockOverlay
          title="AI 기출 변형은 Pro 기능이에요"
          body="학교별 출제 경향을 학습한 AI가 변형 문제를 만들고, 실전처럼 타이머를 재며 풀 수 있어요."
          onSubscribe={() => { unlockPro(); setShowLock(false); }}
          onClose={() => go(-1)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// 타이머 화면 (실전 모드)
// ═══════════════════════════════════════════
function TimerView({ school, time, running, setRunning, setTime, problemIdx, setProblemIdx, finish, reset }) {
  // 데모용: 해당 학교 문제 5개 (부족하면 다른 학교에서 채움)
  const variationProblems = React.useMemo(() => {
    let base = PROBLEMS.filter(p => p.school === school.id);
    if (base.length < 5) {
      const more = PROBLEMS.filter(p => p.school !== school.id).slice(0, 5 - base.length);
      base = [...base, ...more];
    }
    return base.slice(0, 5).map((p, i) => ({
      ...p, id: `var-${i}`,
      latex: p.latex,
      // 변형 마크
      varied: true,
    }));
  }, [school.id]);

  const mm = String(Math.floor(time / 60)).padStart(2, '0');
  const ss = String(time % 60).padStart(2, '0');
  const urgent = time <= 60;
  const cur = variationProblems[problemIdx];

  const [answer, setAnswer] = React.useState('');

  React.useEffect(() => { setAnswer(''); }, [problemIdx]);

  const next = () => {
    if (problemIdx < variationProblems.length - 1) {
      setProblemIdx(problemIdx + 1);
    } else {
      finish();
    }
  };

  return (
    <div style={{ paddingBottom: 110, background: '#FCFBF9', minHeight: '100%' }}>
      {/* 타이머 헤더 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(252,251,249,0.92)',
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
        borderBottom: '0.5px solid var(--border)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
        }}>
          <button onClick={reset} style={{
            background: 'none', border: 'none', padding: 8, margin: -4, cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 13, fontWeight: 500,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            종료
          </button>

          <div style={{
            fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 22,
            color: urgent ? '#C44536' : 'var(--text-primary)',
            letterSpacing: '0.04em',
            animation: urgent ? 'pulse 1s ease-in-out infinite' : 'none',
          }}>{mm}:{ss}</div>

          <button onClick={() => setRunning(!running)} style={{
            background: running ? 'var(--surface)' : 'var(--primary)',
            border: `1px solid ${running ? 'var(--border)' : 'var(--primary)'}`,
            color: running ? 'var(--text-secondary)' : '#fff',
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            {running ? (
              <><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>일시정지</>
            ) : (
              <><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4l14 8-14 8z"/></svg>재개</>
            )}
          </button>
        </div>

        {/* 진행 도트 */}
        <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 56 }}>
            문제 {problemIdx + 1} / {variationProblems.length}
          </span>
          <div style={{ flex: 1, display: 'flex', gap: 4 }}>
            {variationProblems.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 999,
                background: i < problemIdx ? 'var(--primary)' : (i === problemIdx ? 'var(--primary)' : 'var(--border)'),
                opacity: i === problemIdx ? 0.6 : 1,
              }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* 문제 */}
      <div style={{ padding: '20px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '3px 8px', background: '#F5E6DC', color: '#A8543A',
            borderRadius: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4 2.3-7.4-6-4.4h7.6z"/></svg>
            AI 변형
          </span>
          <Badge tone="muted" size="sm">{cur.topic}</Badge>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{school.name} 풍</span>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '28px 16px', textAlign: 'center',
          fontSize: 19, overflow: 'auto', marginBottom: 16,
        }}>
          <Tex block>{cur.latex}</Tex>
        </div>

        {/* 답 입력 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>답 입력</div>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '4px',
          }}>
            <input
              value={answer} onChange={e => setAnswer(e.target.value)}
              placeholder="답을 입력하세요 (예: π/2, e^2 등)"
              style={{
                width: '100%', padding: '14px 14px', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 14, background: 'transparent',
                color: 'var(--text-primary)', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* 메모장 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>풀이 메모 (선택)</div>
          <div style={{
            background: '#FFFCF5', border: '1px solid #EFE6D2',
            borderRadius: 12,
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 23px, #F5E9CB 23px, #F5E9CB 24px)',
            padding: '4px',
          }}>
            <textarea
              placeholder="여기에 풀이 과정을 적어보세요"
              style={{
                width: '100%', minHeight: 120, padding: '12px 14px', border: 'none', outline: 'none',
                background: 'transparent', resize: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '24px',
                color: 'var(--text-primary)', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* 액션 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <SecondaryButton size="lg" style={{ flex: 1 }} onClick={next}>
            건너뛰기
          </SecondaryButton>
          <PrimaryButton size="lg" style={{ flex: 1.5 }} onClick={next}>
            {problemIdx === variationProblems.length - 1 ? '제출하기' : '다음 문제 →'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 결과 화면
// ═══════════════════════════════════════════
function VariationResultView({ school, timeUsed, reset, go }) {
  const score = 4; // 데모: 5문제 중 4문제 정답
  const total = 5;
  const mm = String(Math.floor(timeUsed / 60)).padStart(2, '0');
  const ss = String(timeUsed % 60).padStart(2, '0');

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="결과" right={
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>다시</button>
      } />

      {/* 점수 */}
      <div style={{ padding: '20px 20px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{school?.name} 변형 세트 완료</div>
        <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="62" stroke="var(--bg)" strokeWidth="10" fill="none"/>
            <circle cx="70" cy="70" r="62" stroke="var(--primary)" strokeWidth="10" fill="none"
              strokeDasharray={`${(score / total) * 390} 390`}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 40, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {score}<span style={{ fontSize: 22, color: 'var(--text-muted)' }}>/{total}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>맞춘 문제</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>소요 시간</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>{mm}:{ss}</span>
        </div>
      </div>

      {/* 분석 */}
      <div style={{ padding: '0 20px 24px' }}>
        <SectionHeader icon="📊" label="문제별 결과" />
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {[
            { num: 1, topic: '미적분', correct: true, time: 180 },
            { num: 2, topic: '선형대수', correct: true, time: 220 },
            { num: 3, topic: '미적분', correct: false, time: 195 },
            { num: 4, topic: '공업수학', correct: true, time: 165 },
            { num: 5, topic: '다변수', correct: true, time: 140 },
          ].map((r, i, arr) => (
            <div key={r.num} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600,
                color: 'var(--text-muted)', width: 22,
              }}>0{r.num}</span>
              <div style={{
                width: 22, height: 22, borderRadius: 999,
                background: r.correct ? '#E5EFE7' : '#FBE7E5',
                color: r.correct ? '#3D6849' : '#C44536',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {r.correct ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                )}
              </div>
              <Badge tone="muted" size="sm">{r.topic}</Badge>
              <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {Math.floor(r.time / 60)}:{String(r.time % 60).padStart(2, '0')}
              </span>
              <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--primary)', fontSize: 11, fontWeight: 600 }}>
                풀이 →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI 코멘트 */}
      <div style={{ padding: '0 20px 24px' }}>
        <SectionHeader icon="🤖" label="AI 코멘트" />
        <div style={{
          background: 'linear-gradient(135deg, #FBF1EA 0%, #F5E6DC 100%)',
          border: '1px solid #EAD3C2',
          borderRadius: 14, padding: 16, fontSize: 13, color: '#5C3E2C', lineHeight: 1.65,
        }}>
          <p style={{ margin: '0 0 10px' }}>
            <strong>잘한 점.</strong> 부분적분과 행렬 계산은 안정적이에요.
          </p>
          <p style={{ margin: 0 }}>
            <strong>더 연습할 부분.</strong> 3번 문제(미적분)에서 시간이 많이 걸렸어요. <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>치환적분</span> 공식을 다시 보면 좋겠어요.
          </p>
        </div>
      </div>

      <div style={{ padding: '0 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton onClick={reset} style={{ width: '100%' }}>다른 학교 도전하기</PrimaryButton>
        <SecondaryButton onClick={() => go('home')} style={{ width: '100%' }}>홈으로</SecondaryButton>
      </div>
    </div>
  );
}

Object.assign(window, { VariationsPage, TimerView, VariationResultView });
