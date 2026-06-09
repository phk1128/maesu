// 편입 수학 - 홈 (v2): 4개 메인 타일 허브

function Logo({ small }) {
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

// ── 편입 시험 D-day 카운트다운 (내가 설정한 학교) ──────────
function ExamCountdown({ user, school, onOpenSchedule, onSetSchool }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // 설정한 학교가 없을 때
  if (!school) {
    return (
      <button onClick={onSetSchool} style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '20px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'all 180ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.015em' }}>
            목표 학교를 설정해보세요
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            시험일까지 며칠 남았는지 매일 보여드릴게요
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    );
  }

  const info = examDdayInfo(school, now);
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div
      onClick={onOpenSchedule}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '18px 18px 16px',
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        transition: 'all 180ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* 학교 색상 액센트 (왼쪽 바) */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 4, background: school.color }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingLeft: 4 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
          fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: school.color }}></span>
          {school.name}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>내 목표 학교</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11.5, color: 'var(--primary)', fontWeight: 600 }}>
          전체 일정
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </span>
      </div>

      {/* 큰 D-숫자 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2, paddingLeft: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>D-</span>
        <span style={{
          fontFamily: 'var(--font-serif)', fontSize: 50, fontWeight: 700,
          color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 0.95,
        }}>{info.days}</span>
        <span style={{ fontSize: 15, color: 'var(--text-secondary)', marginLeft: 2 }}>일 남았어요</span>
      </div>

      {/* 시:분:초 실시간 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, paddingLeft: 4 }}>
        {[
          { v: pad(info.hours), l: '시간' },
          { v: pad(info.mins), l: '분' },
          { v: pad(info.secs), l: '초' },
        ].map((u, i) => (
          <React.Fragment key={u.l}>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 9, padding: '7px 0', flex: 1, textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 19, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em', lineHeight: 1 }}>{u.v}</div>
              <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3 }}>{u.l}</div>
            </div>
            {i < 2 && <span style={{ color: 'var(--border-strong)', fontWeight: 700, fontSize: 16 }}>:</span>}
          </React.Fragment>
        ))}
      </div>

      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4,
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          시험일 <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{info.dateStr}</span>
          <span style={{ marginLeft: 4 }}>({info.weekday})</span>
        </span>
        <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, letterSpacing: '-0.005em' }}>
          {user ? `${user.name}님, 화이팅! 🔥` : '화이팅! 🔥'}
        </span>
      </div>
    </div>
  );
}

function HomePage({ go, user, signIn, primarySchool, setPrimarySchool, hideAI }) {
  const school = SCHOOLS.find(s => s.id === primarySchool);
  return (
    <div style={{ paddingBottom: 100, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 인사 */}
      <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo />
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600,
            color: 'var(--text-primary)', letterSpacing: '-0.01em',
          }}>편입수학</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button style={{
            background: 'none', border: 'none', padding: 8, cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.5 0"/>
            </svg>
          </button>
          {user ? (
            <button onClick={() => go('mypage')} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 999, background: 'var(--primary-light)',
                color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 13,
              }}>{user.initial}</div>
            </button>
          ) : (
            <button onClick={() => go('login')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
              padding: '6px 10px',
            }}>로그인</button>
          )}
        </div>
      </div>

      {/* 편입 시험 D-day 카운트다운 */}
      <div style={{ padding: '14px 20px 18px' }}>
        <ExamCountdown
          user={user}
          school={school}
          onOpenSchedule={() => go('exam-schedule')}
          onSetSchool={() => go('exam-schedule', { setMode: true })}
        />
      </div>

      {/* 잔디 (로그인 상태) */}
      {user && (
        <div style={{ padding: '0 20px 20px' }}>
          <ContributionGrid data={CONTRIB_GRID} totalStudied={TOTAL_STUDIED} streak={CURRENT_STREAK} />
        </div>
      )}

      {/* 메인 타일 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
          color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 4,
        }}>학습 메뉴</div>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 14px', letterSpacing: '-0.02em',
        }}>무엇을 학습할까요?</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FeatureTile
            title="공식"
            subtitle={`${FORMULAS.length}개 핵심 공식 정리`}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>}
            onClick={() => go('formulas')}
            visual={<TileChips items={FORMULA_TREE.slice(0, 3).map(c => c.name)} />}
          />
          <FeatureTile
            title="기출"
            subtitle="학교별·연도별 문제"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>}
            onClick={() => go('exams')}
            visual={<TileChips items={SCHOOLS.slice(0, 3).map(s => s.name)} />}
          />
          {hideAI ? (
            <>
              <FeatureTile
                comingSoon
                title="AI 기출 분석"
                subtitle="문제 사진 → 필요한 공식"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.9H20l-5 3.7 1.9 5.9L12 14.8 6.1 18.5 8 12.6 3 8.9h6.1z"/></svg>}
              />
              <FeatureTile
                comingSoon
                title="AI 기출 변형"
                subtitle="변형 문제 · 실전 타이머"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 1h6M12 6V4"/></svg>}
              />
            </>
          ) : (
            <>
              <FeatureTile
                title="AI 기출 분석"
                subtitle="문제 사진 → 필요한 공식"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.9H20l-5 3.7 1.9 5.9L12 14.8 6.1 18.5 8 12.6 3 8.9h6.1z"/></svg>}
                onClick={() => go('analyze')}
                locked accent
                visual={<TileMiniAnalyze />}
              />
              <FeatureTile
                title="AI 기출 변형"
                subtitle="변형 문제 · 타이머"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 1h6M12 6V4"/></svg>}
                onClick={() => go('variations')}
                locked accent
                visual={<TileMiniTimer />}
              />
            </>
          )}
        </div>
      </div>

    </div>
  );
}

function TileChips({ items }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {items.map(i => (
        <span key={i} style={{
          padding: '2px 7px', background: 'var(--bg)', color: 'var(--text-secondary)',
          fontSize: 10, fontWeight: 500, borderRadius: 4, letterSpacing: '-0.005em',
        }}>{i}</span>
      ))}
      <span style={{
        padding: '2px 7px', color: 'var(--text-muted)',
        fontSize: 10, fontWeight: 500,
      }}>+</span>
    </div>
  );
}

function TileMiniAnalyze() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 6,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5-9 9"/>
      </svg>
      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.005em' }}>이미지 업로드</span>
    </div>
  );
}

function TileMiniTimer() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 6,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
        color: '#E89B7C', letterSpacing: '0.02em',
      }}>15:00</span>
      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)' }}>실전 타이머</span>
    </div>
  );
}

// ═══════════════════════════════════════════
// 시험 일정 (2번째 뎁스): 학교별 D-day 리스트 + 목표 학교 설정
// ═══════════════════════════════════════════
function ExamSchedulePage({ go, primarySchool, setPrimarySchool }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // D-day 가까운 순 정렬 (지난 시험은 뒤로)
  const sorted = [...SCHOOLS]
    .map(s => ({ school: s, info: examDdayInfo(s, now) }))
    .sort((a, b) => {
      if (a.info.passed !== b.info.passed) return a.info.passed ? 1 : -1;
      return a.info.target - b.info.target;
    });

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="시험 일정" showBack onBack={() => go(-1)} />

      <div style={{ padding: '12px 20px 20px' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>학교별 D-day</h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          학교를 누르면 목표 학교로 설정돼요. 홈에서 매일 확인할 수 있어요.
        </p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(({ school, info }, idx) => {
          const isPrimary = school.id === primarySchool;
          const isNext = idx === 0 && !info.passed;
          return (
            <button key={school.id} onClick={() => { setPrimarySchool(school.id); }} style={{
              background: isPrimary ? 'var(--primary-light)' : 'var(--surface)',
              border: `1px solid ${isPrimary ? '#EAD3C2' : 'var(--border)'}`,
              borderRadius: 16, padding: 0, cursor: 'pointer',
              textAlign: 'left', overflow: 'hidden', position: 'relative',
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { if (!isPrimary) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { if (!isPrimary) e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <div style={{ width: 5, background: school.color }}></div>
                <div style={{ flex: 1, padding: '14px 16px' }}>
                  {/* 상단: 학교명 + 뱃지 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{
                      fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600,
                      color: 'var(--text-primary)', letterSpacing: '-0.015em',
                    }}>{school.name}</span>
                    {isPrimary && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        background: 'var(--primary)', color: '#fff',
                        padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
                      }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4 2.3-7.4-6-4.4h7.6z"/></svg>
                        내 목표
                      </span>
                    )}
                    {!isPrimary && isNext && (
                      <span style={{
                        background: 'var(--primary-light)', color: '#A8543A',
                        padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                      }}>가장 임박</span>
                    )}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                      {info.tag || school.tag}
                    </span>
                  </div>

                  {/* D-day + 날짜 */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      {info.passed ? (
                        <span style={{
                          fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600,
                          color: 'var(--text-muted)', letterSpacing: '-0.02em',
                        }}>종료</span>
                      ) : (
                        <>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>D-</span>
                          <span style={{
                            fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 700,
                            color: school.color, letterSpacing: '-0.03em', lineHeight: 0.9,
                          }}>{info.days}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 2 }}>일</span>
                        </>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}>{info.dateStr}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>
                        ({info.weekday}) {!info.passed && `${pad(info.hours)}:${pad(info.mins)}:${pad(info.secs)} 남음`}
                      </div>
                    </div>
                  </div>

                  {/* 진행 바 (1년 기준 근접도) */}
                  {!info.passed && (
                    <div style={{ marginTop: 12, height: 4, background: isPrimary ? 'rgba(217,119,87,0.15)' : 'var(--bg)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.max(4, Math.min(100, (1 - info.days / 365) * 100))}%`,
                        height: '100%', background: school.color, borderRadius: 999,
                        opacity: 0.8,
                      }}></div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          시험 일정은 각 학교 모집요강 기준이며, 실제 일정과 다를 수 있어요.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { HomePage, ExamSchedulePage });
