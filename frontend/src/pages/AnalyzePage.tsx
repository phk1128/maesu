import { useState, useRef, useMemo } from 'react';
import type { GoFn } from '../types';
import { PROBLEMS, ANALYSIS_RESULT, getFormula } from '../data/mock';
import AppHeader from '../components/AppHeader';
import LockOverlay from '../components/LockOverlay';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import Tex from '../components/Tex';

interface ImageData {
  src?: string;
  name?: string;
  latex?: string;
  school?: string;
  year?: number;
  demo?: boolean;
}

interface AnalyzePageProps {
  go: GoFn;
  isPro: boolean;
  unlockPro: () => void;
  params: Record<string, unknown>;
  markStudied: ((type: string, id: string | number) => void) | null;
}

function getInitialImage(params: Record<string, unknown>): ImageData | null {
  if (params?.preset) {
    const preset = params.preset as { latex: string; school: string; year: number };
    return { latex: preset.latex, school: preset.school, year: preset.year };
  }
  return null;
}

export default function AnalyzePage({ go, isPro, unlockPro, params, markStudied }: AnalyzePageProps) {
  const [image, setImage] = useState<ImageData | null>(() => getInitialImage(params));
  const [phase, setPhase] = useState<'input' | 'loading' | 'result'>('input');
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState<typeof ANALYSIS_RESULT | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string | null>>({});
  const [lockDismissed, setLockDismissed] = useState(false);
  const showLock = !isPro && !lockDismissed;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages = useMemo(() => [
    { label: '이미지에서 문제 추출', desc: '수식과 텍스트를 인식하고 있어요' },
    { label: '문제 구조 파악', desc: '식의 형태와 유형을 분석 중이에요' },
    { label: '관련 공식 검색', desc: '500+ 공식 중에서 후보를 추리고 있어요' },
    { label: '풀이 단계 생성', desc: '단계별 풀이를 만들고 있어요' },
  ], []);

  const startAnalysis = () => {
    if (!image || !isPro) {
      if (!isPro) { setLockDismissed(false); }
      return;
    }
    setPhase('loading');
    setStageIdx(0);
    let i = 0;
    const tick = () => {
      i++;
      if (i < stages.length) {
        setStageIdx(i);
        setTimeout(tick, 800);
      } else {
        setTimeout(() => {
          setResult(ANALYSIS_RESULT);
          setPhase('result');
          if (markStudied) markStudied('analyze', Date.now());
        }, 600);
      }
    };
    setTimeout(tick, 800);
  };

  const reset = () => {
    setImage(null); setResult(null); setPhase('input'); setFeedback({});
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage({ src: reader.result as string, name: file.name });
    reader.readAsDataURL(file);
  };

  if (phase === 'loading') return <LoadingView stages={stages} stageIdx={stageIdx} image={image} />;
  if (phase === 'result' && result) return <ResultView result={result} go={go} feedback={feedback} setFeedback={setFeedback} reset={reset} image={image} />;

  return (
    <div style={{ paddingBottom: 110, position: 'relative', minHeight: '100%' }}>
      <AppHeader title="AI 기출 분석" large />
      <div style={{ padding: '0 20px 20px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55 }}>
        기출 문제 사진을 올리면 필요한 공식과 풀이를 알려드려요.
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
          color: '#F5E6DC', padding: '6px 12px', borderRadius: 999,
          fontSize: 11.5, fontWeight: 600, letterSpacing: '0.02em',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          PRO 기능
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {image ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 14,
          }}>
            <div style={{
              background: 'var(--bg)', borderRadius: 10, padding: '32px 16px',
              textAlign: 'center', marginBottom: 12, minHeight: 120,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              {image.src ? (
                <img src={image.src} alt="문제" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 6 }} />
              ) : (
                <>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>인식된 문제 (미리보기)</div>
                  <div style={{ fontSize: 17, color: 'var(--text-primary)' }}>
                    <Tex>{image.latex || ''}</Tex>
                  </div>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SecondaryButton size="md" style={{ flex: 1 }} onClick={() => setImage(null)}>
                다시 올리기
              </SecondaryButton>
              <PrimaryButton size="md" style={{ flex: 1.5 }} onClick={startAnalysis}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>}
              >분석 시작</PrimaryButton>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--surface)', border: '2px dashed var(--border-strong)',
            borderRadius: 16, padding: '36px 24px',
            textAlign: 'center', cursor: 'pointer',
          }}
          onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5-9 9"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600,
              color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.015em',
            }}>문제 사진을 올려주세요</h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.55 }}>
              종이 시험지를 찍거나, 스크린샷을 올려도 좋아요.<br/>
              JPG · PNG · HEIC, 최대 10MB
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '8px 14px', fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                color: 'var(--text-primary)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                카메라
              </button>
              <button style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '8px 14px', fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                color: 'var(--text-primary)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                갤러리
              </button>
            </div>
          </div>
        )}

        {!image && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '-0.005em' }}>
              💡 또는 이렇게 시작해보세요
            </div>
            <button onClick={() => {
              const p = PROBLEMS[0];
              setImage({ latex: p.latex, school: p.school, year: p.year, demo: true });
            }} style={{
              width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4 2.3-7.4-6-4.4h7.6z"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>샘플 문제로 체험하기</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>한양대 2024 · 부분적분</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <SectionHeader icon="✨" label="이렇게 분석해드려요" />
          {[
            { icon: '📷', title: '문제 인식', body: '사진 속 수식을 자동으로 인식해요' },
            { icon: '🎯', title: '핵심 공식 추출', body: '풀이에 꼭 필요한 공식 3개를 뽑아요' },
            { icon: '✍️', title: '단계별 풀이', body: '왜 그 공식을 쓰는지, 어떻게 적용하는지' },
          ].map(f => (
            <div key={f.title} style={{
              display: 'flex', gap: 12, padding: '12px 0',
              borderBottom: '0.5px solid var(--border)',
            }}>
              <div style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLock && !isPro && (
        <LockOverlay
          title="AI 기출 분석은 Pro 기능이에요"
          body="문제 사진만 올리면 AI가 필요한 공식과 풀이를 단계별로 분석해드려요."
          onSubscribe={() => { unlockPro(); setLockDismissed(true); }}
          onClose={() => go(-1)}
        />
      )}
    </div>
  );
}

// ─── Loading View ───
function LoadingView({ stages, stageIdx, image }: { stages: { label: string; desc: string }[]; stageIdx: number; image: ImageData | null }) {
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 110 }}>
      <AppHeader title="분석 중" />
      <div style={{
        flex: 1, padding: '20px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', textAlign: 'center',
      }}>
        <div style={{
          width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '14px 16px', marginBottom: 28, textAlign: 'left',
        }}>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>분석 대상</div>
          {image?.src ? (
            <img src={image.src} alt="문제" style={{ maxWidth: '100%', maxHeight: 80, borderRadius: 4 }} />
          ) : (
            <div style={{ fontSize: 14 }}><Tex>{image?.latex || ''}</Tex></div>
          )}
        </div>

        <div style={{
          position: 'relative', width: 96, height: 96,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{ position: 'absolute', animation: 'spin 2.4s linear infinite' }}>
            <circle cx="48" cy="48" r="42" stroke="var(--primary-light)" strokeWidth="2" fill="none"/>
            <circle cx="48" cy="48" r="42" stroke="var(--primary)" strokeWidth="2" fill="none"
              strokeDasharray="60 264" strokeLinecap="round"/>
          </svg>
          <div style={{
            width: 56, height: 56, borderRadius: 999, background: 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse 1.6s ease-in-out infinite',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.9 5.9H20l-5 3.7 1.9 5.9L12 14.8 6.1 18.5 8 12.6 3 8.9h6.1z"/>
            </svg>
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600,
          color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>AI가 문제를 분석하고 있어요</h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 28px' }}>평균 4초 정도 걸려요</p>

        <div style={{
          width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 16,
          display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left',
        }}>
          {stages.map((s, i) => {
            const isDone = i < stageIdx;
            const isActive = i === stageIdx;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                opacity: i > stageIdx ? 0.4 : 1, transition: 'opacity 300ms',
              }}>
                <div style={{ width: 22, flexShrink: 0, paddingTop: 1 }}>
                  {isDone ? (
                    <div style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                    </div>
                  ) : isActive ? (
                    <div style={{ width: 22, height: 22, borderRadius: 999, border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--primary)', animation: 'pulse 1s ease-in-out infinite' }}></div>
                    </div>
                  ) : (
                    <div style={{ width: 22, height: 22, borderRadius: 999, border: '1.5px solid var(--border-strong)' }}></div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '-0.01em' }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Result View ───
function ResultView({ result, go, feedback, setFeedback, reset, image }: {
  result: typeof ANALYSIS_RESULT;
  go: GoFn;
  feedback: Record<string, string | null>;
  setFeedback: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
  reset: () => void;
  image: ImageData | null;
}) {
  const recommended = result.formulas.map(rec => ({ ...rec, full: getFormula(rec.id) })).filter(r => r.full);

  return (
    <div style={{ paddingBottom: 110 }}>
      <AppHeader title="분석 결과" showBack onBack={reset}
        right={<button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>새 분석</button>}
      />

      <div style={{ padding: '12px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: '#22A06B', boxShadow: '0 0 0 3px rgba(34,160,107,0.18)' }}></span>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>분석 완료</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>{result.topic}</span>
        </div>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '16px',
        }}>
          {image?.src ? (
            <img src={image.src} alt="문제" style={{ maxWidth: '100%', maxHeight: 100, borderRadius: 4, display: 'block', margin: '0 auto' }} />
          ) : (
            <div style={{ fontSize: 17, color: 'var(--text-primary)', textAlign: 'center', padding: '6px 0' }}>
              <Tex>{result.problem}</Tex>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '8px 20px 14px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>필요한 공식</h2>
        <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>{recommended.length}개를 추천해드려요</p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recommended.map((r, idx) => (
          <RecommendCard key={r.id} rec={r} idx={idx + 1} go={go}
            feedback={feedback[r.id] || null}
            onFeedback={(v: string) => setFeedback(p => ({ ...p, [r.id]: p[r.id] === v ? null : v }))}
          />
        ))}
      </div>

      <div style={{ padding: '32px 20px 0' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>풀이 단계</h2>
        <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 14px' }}>위 공식을 적용한 풀이예요</p>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 16,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {result.solution.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: 999,
                background: 'var(--primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 11,
              }}>{i + 1}</div>
              <div style={{ flex: 1, paddingTop: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, letterSpacing: '-0.005em' }}>{s.label}</div>
                <div style={{ fontSize: 15 }}><Tex>{s.math}</Tex></div>
              </div>
            </div>
          ))}
          <div style={{
            background: 'var(--primary-light)', borderRadius: 10, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
          }}>
            <span style={{ fontSize: 12, color: '#7A4730', fontWeight: 600 }}>최종 답</span>
            <span style={{ flex: 1, fontSize: 17, color: '#7A4730' }}><Tex>{'\\pi'}</Tex></span>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SecondaryButton onClick={reset} style={{ width: '100%' }}>다른 문제 분석하기</SecondaryButton>
      </div>
    </div>
  );
}

// ─── Recommend Card ───
function RecommendCard({ rec, idx, go, feedback, onFeedback }: {
  rec: { id: string; level: string; reason: string; step: string; full: ReturnType<typeof getFormula> };
  idx: number;
  go: GoFn;
  feedback: string | null;
  onFeedback: (v: string) => void;
}) {
  const f = rec.full!;
  const isEssential = rec.level === 'essential';
  const levelLabel = isEssential ? '필수' : (rec.level === 'useful' ? '유용' : '참고');
  const levelTone = isEssential ? 'default' as const : 'muted' as const;

  return (
    <div style={{
      background: 'var(--surface)',
      border: isEssential ? '1.5px solid #EAD3C2' : '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden', position: 'relative',
    }}>
      {isEssential && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--primary)' }}></div>}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 20, color: isEssential ? 'var(--primary)' : 'var(--text-muted)', letterSpacing: '-0.02em', lineHeight: 1 }}>#{idx}</span>
          <Badge tone={levelTone} size="sm">{levelLabel}</Badge>
        </div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.015em' }}>{f.title}</h3>
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', marginBottom: 10, textAlign: 'center', fontSize: 14, overflow: 'auto' }}>
          <Tex>{f.latex}</Tex>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>왜 필요한가요?</span> {rec.reason}
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'var(--primary-light)', borderRadius: 10, fontSize: 12, color: '#7A4730', lineHeight: 1.55 }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>💡</span>
          <span><span style={{ fontWeight: 600 }}>활용법.</span> {rec.step}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--border)', background: '#FCFBF9' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <FeedbackBtn active={feedback === 'up'} type="up" onClick={() => onFeedback('up')} />
          <FeedbackBtn active={feedback === 'down'} type="down" onClick={() => onFeedback('down')} />
        </div>
        <button onClick={() => go('formula-detail', { id: f.id })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4 }}>
          공식 보기
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}

function FeedbackBtn({ active, type, onClick }: { active: boolean; type: 'up' | 'down'; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: 8,
      background: active ? 'var(--primary-light)' : 'transparent',
      border: `1px solid ${active ? '#EAD3C2' : 'var(--border)'}`,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
    }}>
      {type === 'up' ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H7"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 14V2M9 18.12L10 14H4.17a2 2 0 01-1.92-2.56l2.33-8A2 2 0 016.5 2H17"/>
        </svg>
      )}
    </button>
  );
}
