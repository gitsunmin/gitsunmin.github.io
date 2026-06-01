import { type CSSProperties, useEffect, useRef, useState } from 'react';

const MAX_SCENE = 3;

const TIMELINE_ITEMS = [
  { year: '2023', color: '#818cf8', features: ['블로그', '경력', '검색'] },
  { year: '2024', color: '#34d399', features: ['Works', 'IPhoneFolder', 'Three.js', 'TIL'] },
  { year: '2025~', color: '#fb923c', features: ['Rec Room', 'Frame Studio', 'Loom'] },
];

const ISLAND_BLOCKS: { label: string; type: 'static' | 'island'; span: 1 | 2; color?: string }[] = [
  { label: 'Header', type: 'static', span: 2 },
  { label: 'TechFilterBar', type: 'island', span: 2, color: '#818cf8' },
  { label: 'WorkCard', type: 'island', span: 1, color: '#34d399' },
  { label: 'DarkModeToggle', type: 'island', span: 1, color: '#60a5fa' },
  { label: 'Footer', type: 'static', span: 2 },
];

const EXPERIMENTS = [
  { label: 'Frame Studio', icon: '🖼️', color: '#818cf8' },
  { label: 'Rec Room', icon: '🎙️', color: '#34d399' },
  { label: 'Loom', icon: '🎨', color: '#fbbf24' },
  { label: 'Interview', icon: '💬', color: '#60a5fa' },
  { label: 'QR Code', icon: '📱', color: '#a78bfa' },
  { label: 'TIL', icon: '📖', color: '#fb923c' },
];

const STAGGER = ['0s', '0.07s', '0.14s', '0.21s', '0.28s', '0.35s'];

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <div
      className="inline-block gitsunmin-badge"
      style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        padding: '0.25em 0.75em',
        borderRadius: '2em',
        width: 'fit-content',
        background: bg,
        color,
      }}
    >
      {children}
    </div>
  );
}

function CalloutList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col m-0 p-0 list-none" style={{ gap: '0.5rem' }}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gitsunmin-callout-li"
          style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))', gap: '0.5rem' }}
        >
          <span
            className="shrink-0 rounded-full"
            style={{ width: '0.3rem', height: '0.3rem', marginTop: '0.45em', background: 'currentColor', opacity: 0.4 }}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function GitsunminStory() {
  const [scene, setSceneState] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(1);

  function setScene(s: number) {
    sceneRef.current = s;
    setSceneState(s);
  }

  useEffect(() => {
    function handleScroll() {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const scrolledInto = -rect.top;
      if (scrolledInto < 0) return;
      const segmentHeight = window.innerHeight;
      const newScene = Math.max(1, Math.min(MAX_SCENE, Math.floor(scrolledInto / segmentHeight) + 1));
      if (newScene !== sceneRef.current) setScene(newScene);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gitsunmin-hint-bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(5px); }
      }
      .gitsunmin-inner   { gap: 4rem; }
      .gitsunmin-diagram { width: 44%; max-width: 440px; height: 22rem; }
      .gitsunmin-callout { min-height: 260px; }

      @media (max-width: 700px) {
        .gitsunmin-inner   { flex-direction: column !important; gap: 1.5rem !important; padding: 0 1.25rem !important; }
        .gitsunmin-diagram { width: 100% !important; max-width: 100% !important; height: 18rem !important; }
        .gitsunmin-callout { width: 100% !important; max-width: 100% !important; min-height: 180px !important; }
        .gitsunmin-callout-title { font-size: 1rem !important; }
        .gitsunmin-callout-desc  { font-size: 0.8125rem !important; line-height: 1.7 !important; }
        .gitsunmin-callout-li    { font-size: 0.775rem !important; }
        .gitsunmin-badge         { font-size: 0.625rem !important; }
      }
      @media (max-width: 480px) {
        .gitsunmin-inner   { padding: 0 1rem !important; gap: 1rem !important; }
        .gitsunmin-callout-title { font-size: 0.9375rem !important; }
        .gitsunmin-callout-desc  { font-size: 0.75rem !important; line-height: 1.65 !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        .gitsunmin-diagram *, .gitsunmin-callout * { transition: none !important; animation: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const diagramPanelStyle = (s: number): CSSProperties => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.875rem',
    opacity: scene === s ? 1 : 0,
    transform: scene === s ? 'none' : 'translateY(0.5rem)',
    transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
    pointerEvents: scene === s ? 'auto' : 'none',
  });

  const calloutPanelStyle = (s: number): CSSProperties => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.875rem',
    opacity: scene === s ? 1 : 0,
    transform: scene === s ? 'none' : 'translateY(1rem)',
    transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
    pointerEvents: scene === s ? 'auto' : 'none',
  });

  return (
    <section
      aria-label="gitsunmin.github.io 인터랙티브 소개"
      style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', width: '100vw' }}
    >
      <div
        ref={outerRef}
        style={{ height: `calc(${MAX_SCENE} * 100svh)`, minHeight: `calc(${MAX_SCENE} * 560px)` }}
      >
        <div
          className="sticky top-0 overflow-hidden flex flex-col items-center justify-center"
          style={{
            height: '100svh',
            minHeight: '560px',
            background: `
              radial-gradient(ellipse 65% 55% at 15% 50%, rgba(129,140,248,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 65% 55% at 85% 50%, rgba(251,146,60,0.06) 0%, transparent 60%),
              hsl(var(--background))`,
            borderTop: '1px solid hsl(var(--border))',
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >
          {/* Inner layout */}
          <div
            className="gitsunmin-inner flex items-center"
            style={{ width: '100%', maxWidth: '60rem', padding: '0 2rem' }}
          >

            {/* ── Left: Diagram ── */}
            <div className="gitsunmin-diagram shrink-0 relative">

              {/* Scene 1: Timeline */}
              <div style={diagramPanelStyle(1)}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', opacity: 0.45 }}>
                  성장 히스토리
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '0.5rem' }}>
                  {TIMELINE_ITEMS.map((item, idx) => (
                    <div
                      key={item.year}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                        opacity: scene === 1 ? 1 : 0,
                        transform: scene === 1 ? 'none' : 'translateX(-0.5rem)',
                        transition: `opacity 0.45s ease ${STAGGER[idx]}, transform 0.45s ease ${STAGGER[idx]}`,
                      }}
                    >
                      {/* Timeline axis */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '0.15rem' }}>
                        <div style={{
                          width: '0.7rem', height: '0.7rem', borderRadius: '50%',
                          background: item.color,
                          boxShadow: `0 0 8px ${item.color}80`,
                        }} />
                        {idx < TIMELINE_ITEMS.length - 1 && (
                          <div style={{
                            width: '1.5px',
                            height: '3.5rem',
                            background: `linear-gradient(to bottom, ${item.color}50, ${TIMELINE_ITEMS[idx + 1].color}25)`,
                            marginTop: '0.2rem',
                          }} />
                        )}
                      </div>
                      {/* Year + chips */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingBottom: idx < TIMELINE_ITEMS.length - 1 ? '0.5rem' : 0 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.color, lineHeight: 1 }}>
                          {item.year}
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {item.features.map((f) => (
                            <span
                              key={f}
                              style={{
                                fontSize: '0.63rem', fontWeight: 600,
                                padding: '0.2em 0.55em', borderRadius: '2em',
                                background: `${item.color}14`, color: item.color,
                                border: `1px solid ${item.color}30`,
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scene 2: Astro Islands */}
              <div style={diagramPanelStyle(2)}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', opacity: 0.45 }}>
                  Astro Island Architecture
                </div>
                {/* Browser chrome */}
                <div style={{ borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
                  {/* Title bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                        <div key={c} style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', background: c }} />
                      ))}
                    </div>
                    <div style={{ flex: 1, height: '1.1rem', borderRadius: '0.2rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }}>
                      <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.28)' }}>gitsunmin.github.io</span>
                    </div>
                  </div>
                  {/* Page blocks */}
                  <div style={{ padding: '0.6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                    {ISLAND_BLOCKS.map((block, i) => {
                      const active = scene === 2 && block.type === 'island';
                      const color = block.color ?? 'transparent';
                      const delay = `${i * 0.07}s`;
                      return (
                        <div
                          key={`${block.label}-${i}`}
                          style={{
                            gridColumn: block.span === 2 ? '1 / -1' : undefined,
                            padding: '0.4rem 0.55rem',
                            borderRadius: '0.3rem',
                            background: active ? `${color}14` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${active ? `${color}35` : 'rgba(255,255,255,0.07)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.3rem',
                            transition: `background 0.5s ease ${delay}, border-color 0.5s ease ${delay}`,
                          }}
                        >
                          <span style={{ fontSize: '0.58rem', fontWeight: 600, color: active ? color : 'rgba(255,255,255,0.28)', transition: `color 0.5s ease ${delay}`, whiteSpace: 'nowrap' }}>
                            {block.label}
                          </span>
                          <span style={{
                            fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.04em',
                            padding: '0.12em 0.4em', borderRadius: '1em',
                            background: active ? `${color}20` : 'rgba(255,255,255,0.05)',
                            color: active ? color : 'rgba(255,255,255,0.2)',
                            transition: `all 0.5s ease ${delay}`,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}>
                            {block.type === 'island' ? 'Island' : 'Static'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                  {[
                    { bg: 'rgba(255,255,255,0.1)', label: '정적 HTML' },
                    { bg: '#818cf8', label: 'React Island' },
                  ].map(({ bg, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.32)' }}>
                      <div style={{ width: '0.6rem', height: '0.6rem', borderRadius: '0.15rem', background: bg }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scene 3: Experiments */}
              <div style={diagramPanelStyle(3)}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', opacity: 0.45 }}>
                  실험실
                </div>
                <div style={{
                  borderRadius: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '1.25rem',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {EXPERIMENTS.map((exp, i) => (
                      <div
                        key={exp.label}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.4rem',
                          opacity: scene === 3 ? 1 : 0,
                          transform: scene === 3 ? 'none' : 'scale(0.8) translateY(0.5rem)',
                          transition: `opacity 0.4s cubic-bezier(0.16,1,0.3,1) ${STAGGER[i]}, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${STAGGER[i]}`,
                        }}
                      >
                        <div style={{
                          width: '3rem', height: '3rem',
                          borderRadius: '0.75rem',
                          background: `${exp.color}18`,
                          border: `1px solid ${exp.color}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.25rem',
                        }}>
                          {exp.icon}
                        </div>
                        <span style={{ fontSize: '0.57rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.3 }}>
                          {exp.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Callouts ── */}
            <div className="flex-1 min-w-0 relative gitsunmin-callout">

              {/* Callout 1: Timeline */}
              <div style={calloutPanelStyle(1)}>
                <Badge color="#818cf8" bg="rgba(129,140,248,0.12)">성장</Badge>
                <h3
                  className="gitsunmin-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  이력서가 아닌, 실험의 기록
                </h3>
                <p
                  className="gitsunmin-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  2023년 단순한 블로그로 시작해 지금까지 518개 이상의 커밋을 쌓아왔습니다.
                  새로운 브라우저 API나 라이브러리가 생기면 이 사이트에서 가장 먼저 써보는 것이 목표입니다.
                </p>
                <CalloutList items={[
                  '2023 — 블로그, 경력 포트폴리오, 검색',
                  '2024 — Works, IPhoneFolder, Three.js, TIL',
                  '2025~ — Rec Room, Frame Studio, Loom',
                ]} />
              </div>

              {/* Callout 2: Islands */}
              <div style={calloutPanelStyle(2)}>
                <Badge color="#34d399" bg="rgba(52,211,153,0.12)">아키텍처</Badge>
                <h3
                  className="gitsunmin-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  JS는 꼭 필요한 곳에만
                </h3>
                <p
                  className="gitsunmin-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  Astro Island Architecture로 정적 HTML을 최대화합니다.
                  TechFilterBar, WorkCard, DarkModeToggle 등 인터랙션이 필요한 컴포넌트에만 React를 선택적으로 하이드레이션해 Lighthouse 성능 점수 90+을 유지합니다.
                </p>
                <CalloutList items={[
                  '빌드 타임 정적 HTML 생성으로 첫 로드 최소화',
                  'client:load / client:visible 선택적 하이드레이션',
                  'Lighthouse 성능 점수 90+',
                ]} />
              </div>

              {/* Callout 3: Experiments */}
              <div style={calloutPanelStyle(3)}>
                <Badge color="#fb923c" bg="rgba(251,146,60,0.12)">실험실</Badge>
                <h3
                  className="gitsunmin-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  직접 만들고 싶은 UI를 실험하는 공간
                </h3>
                <p
                  className="gitsunmin-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  포트폴리오 사이트 자체가 실험의 결과물입니다.
                  MediaRecorder API, Canvas, 색상 대비 알고리즘까지 — 브라우저가 지원하는 기능이라면 직접 다뤄봅니다.
                </p>
                <CalloutList items={[
                  'Frame Studio — Canvas 기반 이미지 프레임 편집',
                  'Rec Room — MediaRecorder + 오디오 웨이브폼 시각화',
                  'Loom — 배경·글자색 동적 대비 실험',
                ]} />
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none flex flex-col items-center"
            style={{
              bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
              gap: '0.3rem',
              opacity: scene > 1 ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', opacity: 0.5, letterSpacing: '0.05em' }}>
              스크롤하여 탐색
            </span>
            <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', opacity: 0.4, animation: 'gitsunmin-hint-bounce 1.6s ease-in-out infinite' }}>
              ↓
            </span>
          </div>

          {/* Scene dots */}
          <div
            className="absolute flex"
            style={{ bottom: '2rem', right: '2rem', gap: '0.4rem' }}
            aria-hidden="true"
          >
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                style={{
                  width: scene === dot ? '1rem' : '0.4rem',
                  height: '0.4rem',
                  borderRadius: scene === dot ? '0.25rem' : '50%',
                  background: scene === dot ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.3s ease, width 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <noscript>
        <p style={{ padding: '1rem', fontSize: '0.875rem', color: '#71717a', border: '1px solid #27272a', borderRadius: '0.5rem', marginTop: '1rem' }}>
          gitsunmin.github.io: Astro 기반 개인 블로그·포트폴리오·실험실 (2023년부터 운영, 518+ 커밋)
        </p>
      </noscript>
    </section>
  );
}
