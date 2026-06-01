import { type CSSProperties, useEffect, useRef, useState } from 'react';

const MAX_SCENE = 3;

const FOOD_ITEMS = [
  { emoji: '🥬', yRem: -2.2, stagger: 0 },
  { emoji: '🥩', yRem: -0.73, stagger: 0.07 },
  { emoji: '🐟', yRem: 0.73, stagger: 0.14 },
  { emoji: '🥚', yRem: 2.2, stagger: 0.21 },
];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getItemX(progress: number, stagger: number): number {
  const denominator = 1 - stagger * 3;
  const t = Math.max(0, Math.min(1, (progress - stagger) / (denominator > 0 ? denominator : 1)));
  return easeInOut(t);
}

// ── Static sub-components ────────────────────────────────────────────────────

function WarehouseIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 28" fill="none" className="sikbom-node-icon">
      <title>유통사 창고</title>
      <polygon points="16,2 30,10 30,26 2,26 2,10" stroke={color} strokeWidth="1.2" fill={`${color}14`} strokeLinejoin="round" />
      <rect x="11" y="16" width="10" height="10" rx="0.5" fill={`${color}20`} stroke={color} strokeWidth="0.9" />
      <line x1="16" y1="16" x2="16" y2="26" stroke={color} strokeWidth="0.9" />
      <rect x="5" y="14" width="5" height="5" rx="0.4" fill={`${color}15`} stroke={color} strokeWidth="0.7" />
      <rect x="22" y="14" width="5" height="5" rx="0.4" fill={`${color}15`} stroke={color} strokeWidth="0.7" />
    </svg>
  );
}

function RestaurantIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 28" fill="none" className="sikbom-node-icon">
      <title>식당</title>
      <path d="M2,26 L2,11 L16,3 L30,11 L30,26 Z" stroke={color} strokeWidth="1.2" fill={`${color}14`} strokeLinejoin="round" />
      <rect x="11" y="16" width="10" height="10" rx="0.5" fill={`${color}20`} stroke={color} strokeWidth="0.9" />
      <line x1="9" y1="7" x2="9" y2="12" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M7,7 Q9,5 11,7" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <line x1="9" y1="12" x2="9" y2="15" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <line x1="22" y1="7" x2="22" y2="15" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <line x1="20" y1="7" x2="20" y2="10" stroke={color} strokeWidth="0.7" strokeLinecap="round" />
      <line x1="24" y1="7" x2="24" y2="10" stroke={color} strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
}

function NodeBox({ label, sublabel, type, active }: {
  label: string; sublabel: string; type: 'warehouse' | 'restaurant'; active: boolean;
}) {
  const color = type === 'warehouse' ? '#4ade80' : '#fb923c';
  return (
    <div
      className="sikbom-node"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem 0.75rem',
        borderRadius: '1rem',
        background: active ? `${color}12` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
        transition: 'background 0.5s ease, border-color 0.5s ease',
        flexShrink: 0,
      }}
    >
      {type === 'warehouse' ? <WarehouseIcon color={color} /> : <RestaurantIcon color={color} />}
      <span
        style={{ fontSize: '0.875rem', fontWeight: 700, color: active ? color : 'rgba(255,255,255,0.4)', transition: 'color 0.5s ease', whiteSpace: 'nowrap' }}
      >
        {label}
      </span>
      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
        {sublabel}
      </span>
    </div>
  );
}

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <div
      className="inline-block sikbom-badge"
      style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0.25em 0.75em', borderRadius: '2em', width: 'fit-content', background: bg, color }}
    >
      {children}
    </div>
  );
}

function CalloutList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col m-0 p-0 list-none" style={{ gap: '0.5rem' }}>
      {items.map((item) => (
        <li key={item} className="flex items-start sikbom-callout-li" style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))', gap: '0.5rem' }}>
          <span className="shrink-0 rounded-full" style={{ width: '0.3rem', height: '0.3rem', marginTop: '0.45em', background: 'currentColor', opacity: 0.4 }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SikbomStory() {
  const [progress, setProgress] = useState(0);
  const [scene, setScene] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const sceneRef = useRef(1);

  useEffect(() => {
    function handleScroll() {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const scrolledInto = -rect.top;
      if (scrolledInto < 0) return;

      const totalHeight = outer.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const newProgress = Math.max(0, Math.min(1, scrolledInto / totalHeight));

      if (Math.abs(newProgress - progressRef.current) > 0.0005) {
        progressRef.current = newProgress;
        setProgress(newProgress);
        const s = newProgress < 0.33 ? 1 : newProgress < 0.67 ? 2 : 3;
        if (s !== sceneRef.current) {
          sceneRef.current = s;
          setScene(s);
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sikbom-hint-bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(5px); }
      }
      @keyframes sikbom-truck-wobble {
        0%, 100% { transform: translateX(-50%) translateY(-290%); }
        50%       { transform: translateX(-50%) translateY(-310%); }
      }

      /* ── Default (desktop) ── */
      .sikbom-node       { width: 7rem; }
      .sikbom-node-icon  { width: 4rem; height: 3.5rem; }
      .sikbom-track      { height: 11rem; }
      .sikbom-food       { font-size: 1.6rem; }
      .sikbom-truck-icon { font-size: 2rem; }

      /* ── ≤ 900px ── */
      @media (max-width: 900px) {
        .sikbom-inner   { gap: 2.5rem !important; }
        .sikbom-callout { min-height: 240px !important; }
      }

      /* ── ≤ 700px: stack vertically ── */
      @media (max-width: 700px) {
        .sikbom-inner   { flex-direction: column !important; align-items: stretch !important; gap: 1.5rem !important; padding: 0 1.25rem !important; }
        .sikbom-diagram { width: 100% !important; max-width: 100% !important; }
        .sikbom-node    { width: 5.5rem !important; }
        .sikbom-node-icon { width: 3rem !important; height: 2.6rem !important; }
        .sikbom-track   { height: 8rem !important; }
        .sikbom-food    { font-size: 1.25rem !important; }
        .sikbom-truck-icon { font-size: 1.6rem !important; }
        .sikbom-callout { min-height: 200px !important; width: 100% !important; max-width: 100% !important; }
        .sikbom-callout-title { font-size: 1rem !important; }
        .sikbom-callout-desc  { font-size: 0.8125rem !important; line-height: 1.7 !important; }
        .sikbom-callout-li    { font-size: 0.775rem !important; }
        .sikbom-badge         { font-size: 0.625rem !important; }
      }

      /* ── ≤ 480px ── */
      @media (max-width: 480px) {
        .sikbom-inner   { padding: 0 1rem !important; gap: 1rem !important; }
        .sikbom-node    { width: 4.5rem !important; padding: 0.6rem 0.5rem !important; }
        .sikbom-node-icon { width: 2.5rem !important; height: 2.2rem !important; }
        .sikbom-track   { height: 7rem !important; }
        .sikbom-food    { font-size: 1.1rem !important; }
        .sikbom-truck-icon { font-size: 1.4rem !important; }
        .sikbom-callout-title { font-size: 0.9375rem !important; }
        .sikbom-callout-desc  { font-size: 0.75rem !important; line-height: 1.65 !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        .sikbom-diagram *, .sikbom-callout * { transition: none !important; animation: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const calloutStyle = (c: number): CSSProperties => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.875rem',
    opacity: scene === c ? 1 : 0,
    transform: scene === c ? 'none' : 'translateY(1rem)',
    transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
    pointerEvents: scene === c ? 'auto' : 'none',
  });

  const trackFill = Math.max(0, Math.min(1, progress));

  return (
    <section
      aria-label="식봄 B2B 식자재 유통 플랫폼 인터랙티브 설명"
      style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', width: '100vw' }}
    >
      <div
        ref={outerRef}
        style={{ height: `calc(${MAX_SCENE} * 100svh)`, minHeight: `calc(${MAX_SCENE} * 560px)` }}
      >

        {/* ── Sticky Panel ── */}
        <div
          className="sticky top-0 overflow-hidden flex flex-col items-center justify-center"
          style={{
            height: '100svh',
            minHeight: '560px',
            background: `
              radial-gradient(ellipse 65% 55% at 12% 50%, rgba(74,222,128,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 65% 55% at 88% 50%, rgba(251,146,60,0.06) 0%, transparent 60%),
              hsl(var(--background))`,
            borderTop: '1px solid hsl(var(--border))',
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >

          {/* ── Inner layout ── */}
          <div
            className="sikbom-inner flex items-center"
            style={{ width: '100%', maxWidth: '60rem', padding: '0 2rem', gap: '4rem' }}
          >

            {/* ── Diagram Side (no frame) ── */}
            <div
              className="sikbom-diagram shrink-0 flex flex-col"
              style={{ maxWidth: '440px', width: '44%', gap: '1.25rem' }}
            >

              {/* Header label */}
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'hsl(var(--muted-foreground))',
                opacity: 0.45,
              }}>
                B2B 식자재 유통 플랫폼
              </div>

              {/* ── Supply Chain Row ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                {/* 유통사 node */}
                <NodeBox label="유통사" sublabel="식자재 공급" type="warehouse" active={scene === 1} />

                {/* Track area */}
                <div className="sikbom-track" style={{ flex: 1, position: 'relative' }}>

                  {/* Track base line */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: '2px',
                    transform: 'translateY(-50%)',
                  }} />

                  {/* Track progress fill */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    width: `${trackFill * 100}%`,
                    height: '2px',
                    background: 'linear-gradient(to right, rgba(74,222,128,0.7), rgba(251,146,60,0.6))',
                    borderRadius: '2px',
                    transform: 'translateY(-50%)',
                  }} />

                  {/* 식봄 label */}
                  <div style={{
                    position: 'absolute',
                    top: 'calc(50% - 2rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: 'hsl(var(--foreground))',
                    whiteSpace: 'nowrap',
                  }}>
                    식봄
                  </div>

                  {/* Food items */}
                  {FOOD_ITEMS.map((item) => {
                    const ix = getItemX(progress, item.stagger);
                    return (
                      <div
                        key={item.emoji}
                        className="sikbom-food"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: `${ix * 100}%`,
                          transform: `translate(-50%, calc(-50% + ${item.yRem}rem))`,
                          transition: 'left 0.1s linear',
                          opacity: ix > 0.01 && ix < 0.99 ? 1 : 0.3,
                          filter: `drop-shadow(0 0 ${Math.sin(ix * Math.PI) * 6}px rgba(74,222,128,0.65))`,
                          zIndex: 1,
                          lineHeight: 1,
                        }}
                      >
                        {item.emoji}
                      </div>
                    );
                  })}
                </div>

                {/* 식당 node */}
                <NodeBox label="식당" sublabel="음식점 사장님" type="restaurant" active={scene === 3} />
              </div>

              {/* Progress step badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[
                  { label: '발주', color: '#4ade80', threshold: 1 },
                  { label: '배송', color: '#facc15', threshold: 2 },
                  { label: '수령', color: '#fb923c', threshold: 3 },
                ].map(({ label, color, threshold }) => {
                  const active = scene >= threshold;
                  return (
                    <div
                      key={label}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.3em 0.9em',
                        borderRadius: '2em',
                        background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
                        color: active ? color : 'rgba(255,255,255,0.2)',
                        border: `1px solid ${active ? `${color}38` : 'rgba(255,255,255,0.07)'}`,
                        transition: 'all 0.45s ease',
                      }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(to right, #4ade80, #facc15, #fb923c)',
                  borderRadius: '2px',
                  transition: 'width 0.1s linear',
                }} />
              </div>
            </div>

            {/* ── Callout Side ── */}
            <div className="flex-1 min-w-0 relative sikbom-callout" style={{ minHeight: '260px' }}>

              {/* Callout 1: 발주 */}
              <div style={calloutStyle(1)}>
                <Badge color="#4ade80" bg="rgba(74,222,128,0.12)">발주</Badge>
                <h3
                  className="sikbom-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  클릭 한 번으로 실시간 식자재 발주
                </h3>
                <p
                  className="sikbom-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  음식점 사장님이 전화·팩스 없이 식봄 앱에서 식자재를 바로 주문합니다.
                  실시간 가격 확인과 즉시 발주로 기존 발주 방식의 불편함을 해소합니다.
                </p>
                <CalloutList items={['식자재 카탈로그 실시간 가격 조회', '장바구니 기반 간편 주문', '필터기반 상품 검색 지원']} />
              </div>

              {/* Callout 2: 배송 */}
              <div style={calloutStyle(2)}>
                <Badge color="#facc15" bg="rgba(250,204,21,0.12)">배송</Badge>
                <h3
                  className="sikbom-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  유통사에서 식당까지, 식봄이 연결합니다
                </h3>
                <p
                  className="sikbom-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  주문 완료 즉시 유통사에 발주가 전달되고 배송이 시작됩니다.
                  Datadog RUM으로 수집한 실사용 지표를 기반으로 사용자 경험을 지속 개선합니다.
                </p>
                <CalloutList items={['GraphQL + Relay로 데이터 오버페칭 방지', 'Datadog RUM 기반 모니터링']} />
              </div>

              {/* Callout 3: 수령 */}
              <div style={calloutStyle(3)}>
                <Badge color="#fb923c" bg="rgba(251,146,60,0.12)">수령</Badge>
                <h3
                  className="sikbom-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  식자재 도착, 투명한 디지털 거래
                </h3>
                <p
                  className="sikbom-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  식당에 식자재가 안전하게 도착하거나 문제가 발생하면 즉시 배송 상태로 상품의 상태를 확인할 수 있습니다.
                </p>
                <CalloutList items={[]} />
              </div>
            </div>
          </div>

          {/* ── Scroll Hint ── */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none flex flex-col items-center"
            style={{
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              gap: '0.3rem',
              opacity: scene > 1 ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', opacity: 0.5, letterSpacing: '0.05em' }}>
              스크롤하여 탐색
            </span>
            <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', opacity: 0.4, animation: 'sikbom-hint-bounce 1.6s ease-in-out infinite' }}>
              ↓
            </span>
          </div>
        </div>
      </div>

      <noscript>
        <p style={{ padding: '1rem', fontSize: '0.875rem', color: '#71717a', border: '1px solid #27272a', borderRadius: '0.5rem', marginTop: '1rem' }}>
          식봄 B2B 식자재 유통 플랫폼: 유통사 발주 → 식봄 배송 → 식당 수령. Next.js, GraphQL Relay, Datadog RUM 기반.
        </p>
      </noscript>
    </section>
  );
}
