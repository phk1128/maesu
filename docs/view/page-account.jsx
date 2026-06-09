// 편입 수학 - 로그인 & 마이페이지 (v2)

// ═══════════════════════════════════════════
// 로그인
// ═══════════════════════════════════════════
function LoginPage({ go, signIn }) {
  const [agreed, setAgreed] = React.useState(false);

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 36 }}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => go(-1)} style={{
          background: 'none', border: 'none', padding: 8, cursor: 'pointer', color: 'var(--text-secondary)',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, padding: '20px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 48 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'var(--primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: 700,
            fontSize: 28, letterSpacing: '-0.02em', marginBottom: 24,
            boxShadow: '0 8px 24px -8px rgba(217,119,87,0.4)',
          }}>편</div>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
            color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em',
          }}>환영합니다</h1>
          <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
            로그인하면 학습 기록이 잔디로 쌓여요
          </p>
        </div>

        {/* 미리보기 잔디 */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 14, marginBottom: 28,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>학습 잔디 미리보기</div>
          <div style={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            {Array.from({ length: 18 }).map((_, w) => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Array.from({ length: 7 }).map((_, d) => {
                  const r = Math.random();
                  const colors = ['#EEEAE5', '#F2D7C5', '#E8AE89', '#DC8657', '#B45C36'];
                  const level = r < 0.4 ? 0 : r < 0.6 ? 1 : r < 0.8 ? 2 : r < 0.92 ? 3 : 4;
                  return <div key={d} style={{ width: 10, height: 10, borderRadius: 2, background: colors[level] }}></div>;
                })}
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => agreed && signIn()} style={{
          width: '100%', height: 54,
          background: agreed ? '#FEE500' : '#FEE50080', color: '#000',
          border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 600, cursor: agreed ? 'pointer' : 'not-allowed',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 12,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.3 4.7 6.7l-1.2 4.4c-.1.3.3.6.6.4l5.2-3.4c.2 0 .4 0 .7 0 5.5 0 10-3.5 10-7.8S17.5 3 12 3z"/>
          </svg>
          카카오로 시작하기
        </button>

        <button onClick={() => setAgreed(!agreed)} style={{
          width: '100%', background: 'none', border: 'none',
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '10px 0', cursor: 'pointer', textAlign: 'left',
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4, flexShrink: 0,
            border: `1.5px solid ${agreed ? 'var(--primary)' : 'var(--border-strong)'}`,
            background: agreed ? 'var(--primary)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 1,
          }}>
            {agreed && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>}
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>(필수)</span> 이용약관 및 개인정보처리방침에 동의합니다.
          </span>
        </button>

        <div style={{ flex: 1 }}></div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 12px', lineHeight: 1.55 }}>
          처음이신가요? 카카오 로그인으로 자동 회원가입됩니다.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 마이페이지
// ═══════════════════════════════════════════
function MyPage({ go, user, isPro, favorites, history, signOut }) {
  if (!user) {
    return (
      <div style={{ paddingBottom: 110 }}>
        <AppHeader title="내정보" large />
        <div style={{ padding: '32px 24px' }}>
          <EmptyState
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>}
            title="로그인하면 더 편해요"
            body="즐겨찾기 공식과 학습 기록을 저장할 수 있어요."
            action={<PrimaryButton size="md" onClick={() => go('login')}>카카오로 시작하기</PrimaryButton>}
          />
        </div>
      </div>
    );
  }

  const daysSince = Math.max(1, Math.floor((Date.now() - user.joinedAt) / 86400000));
  const totalProblems = history.filter(h => h.type === 'problem').length;
  const totalAnalyze = history.filter(h => h.type === 'analyze').length + history.filter(h => h.type === 'variation').length;

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="내정보" large />

      {/* 프로필 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 18,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 999, background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em',
          }}>{user.initial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{user.name}</span>
              {isPro && <ProBadge size="sm" />}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              학습 {daysSince}일째 · 현재 연속 {CURRENT_STREAK}일 🔥
            </div>
          </div>
        </div>
      </div>

      {/* 잔디 */}
      <div style={{ padding: '0 20px 24px' }}>
        <ContributionGrid data={CONTRIB_GRID} totalStudied={TOTAL_STUDIED} streak={CURRENT_STREAK} />
      </div>

      {/* 통계 */}
      <div style={{ padding: '0 20px 28px' }}>
        <SectionHeader icon="📊" label="학습 현황" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <StatCard label="즐겨찾기" value={favorites.length} unit="공식" />
          <StatCard label="푼 기출" value={totalProblems} unit="문제" />
          {window.__HIDE_AI__
            ? <StatCard label="학습 공식" value={history.filter(h => h.type === 'formula').length} unit="개" />
            : <StatCard label="AI 분석" value={totalAnalyze} unit="회" />}
        </div>
      </div>

      {/* Pro 안내 */}
      {!isPro && !window.__HIDE_AI__ && (
        <div style={{ padding: '0 20px 28px' }}>
          <SectionHeader icon="🔓" label="Pro 구독" />
          <div style={{
            background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
            color: '#fff', borderRadius: 14, padding: 18,
          }}>
            <div style={{ fontSize: 11, color: '#E89B7C', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>PRO</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.015em' }}>AI 기능을 무제한으로</h3>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', margin: '0 0 14px', lineHeight: 1.55 }}>
              AI 기출 분석 · AI 기출 변형 · 풀이 단계 설명
            </p>
            <PrimaryButton size="md" onClick={() => go('paywall')} style={{ width: '100%', background: 'var(--primary)' }}>
              월 9,900원에 시작하기
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* 즐겨찾기 공식 */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionHeader icon="❤️" label="즐겨찾기 공식" />
          {favorites.length > 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{favorites.length}개</span>}
        </div>
        {favorites.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px dashed var(--border-strong)',
            borderRadius: 12, padding: '24px 16px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55 }}>
              자주 보는 공식을 저장해두세요.
            </p>
            <SecondaryButton size="sm" onClick={() => go('formulas')}>공식 보러가기</SecondaryButton>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {favorites.slice(0, 3).map(id => {
              const f = getFormula(id);
              if (!f) return null;
              return <FormulaRow key={id} formula={f} compact onClick={() => go('formula-detail', { id })} />;
            })}
            {favorites.length > 3 && (
              <button onClick={() => go('formulas')} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 8,
                fontSize: 12.5, color: 'var(--text-secondary)', textAlign: 'center',
              }}>전체 {favorites.length}개 보기 →</button>
            )}
          </div>
        )}
      </div>

      {/* 설정 */}
      <div style={{ padding: '0 20px 0' }}>
        <SectionHeader icon="⚙️" label="설정" />
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <SettingRow label="알림 설정" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>} />
          <SettingRow label="결제 / 구독 관리" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>} />
          <SettingRow label="문의하기" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>} />
          <SettingRow label="버전 정보" right={<span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v0.2.0 beta</span>} isLast />
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
        <button onClick={signOut} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: 'var(--text-muted)', padding: 8,
        }}>로그아웃</button>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '14px 12px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '-0.005em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{unit}</span>
      </div>
    </div>
  );
}

function SettingRow({ label, right, isLast }) {
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

// ═══════════════════════════════════════════
// 페이월 (Pro 구독)
// ═══════════════════════════════════════════
function PaywallPage({ go, unlockPro }) {
  return (
    <div style={{ paddingBottom: 110, background: 'linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 50%, var(--bg) 100%)', minHeight: '100%' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, padding: '12px 16px',
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <button onClick={() => go(-1)} style={{
          background: 'rgba(255,255,255,0.1)', border: 'none', padding: 8, borderRadius: 999, cursor: 'pointer',
          color: '#fff', backdropFilter: 'blur(8px)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div style={{ padding: '0 24px 0', textAlign: 'center', color: '#fff' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'rgba(217,119,87,0.18)', color: '#E89B7C',
          padding: '4px 10px', borderRadius: 999,
          fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 20,
        }}>PRO</div>

        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 600,
          color: '#fff', margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.2,
        }}>AI와 함께라면<br/>편입 수학이 쉬워져요</h1>
        <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px', lineHeight: 1.55 }}>
          AI 기출 분석 + AI 기출 변형을<br/>무제한으로 이용하세요
        </p>

        {/* 가격 카드 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 18, padding: 20, marginBottom: 18,
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 600, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>9,900원</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>/ 월</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>VAT 포함 · 언제든 해지 가능</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🎯', text: 'AI 기출 분석 무제한 (사진 → 공식 + 풀이)' },
              { icon: '⏱️', text: 'AI 기출 변형 무제한 (학교별 실전 모드)' },
              { icon: '✍️', text: '단계별 상세 풀이' },
              { icon: '📊', text: '학습 분석 리포트' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{b.icon}</span>
                <span style={{ fontSize: 13, color: '#fff', lineHeight: 1.5, letterSpacing: '-0.005em' }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <PrimaryButton onClick={() => { unlockPro(); go('home'); }} style={{ width: '100%', background: 'var(--primary)' }}>
          7일 무료 체험 시작
        </PrimaryButton>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '12px 0 0', lineHeight: 1.55 }}>
          7일 후 자동 결제. 체험 기간 중 언제든 해지 가능합니다.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { LoginPage, MyPage, PaywallPage });
