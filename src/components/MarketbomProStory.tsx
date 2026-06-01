import { type CSSProperties, useEffect, useRef, useState } from 'react';

const MAX_SCENE = 3;

const HUB_COLOR = '#60a5fa';
const ORDER_COLOR = '#fbbf24';
const DELIVERY_COLOR = '#4ade80';
const CUSTOMER_COLOR = '#fb923c';

const CUSTOMERS = [
  { label: '거래처 A', stagger: 0 },
  { label: '거래처 B', stagger: 0.07 },
  { label: '거래처 C', stagger: 0.14 },
  { label: '거래처 D', stagger: 0.21 },
];

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 1 = restaurant side (right), 0 = hub side (left). Animates during scene 1.
function getOrderX(progress: number, stagger: number): number {
  const sceneP = Math.min(1, progress * 3);
  const denom = 1 - stagger * 3;
  const t = Math.max(0, Math.min(1, (sceneP - stagger) / (denom > 0 ? denom : 1)));
  return 1 - easeInOut(t);
}

// 0 = hub side (left), 1 = restaurant side (right). Animates during scene 3.
function getDeliveryX(progress: number, stagger: number): number {
  const sceneP = Math.max(0, Math.min(1, (progress - 2 / 3) * 3));
  const denom = 1 - stagger * 3;
  const t = Math.max(0, Math.min(1, (sceneP - stagger) / (denom > 0 ? denom : 1)));
  return easeInOut(t);
}

// ── Static sub-components ─────────────────────────────────────────────────────

function HubIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 28" fill="none" className="marketbom-hub-icon">
      <title>마켓봄 프로 플랫폼</title>
      <rect x="2" y="2" width="28" height="20" rx="2" stroke={color} strokeWidth="1.2" fill={`${color}14`} />
      <rect x="5" y="5" width="22" height="14" rx="0.5" fill={`${color}08`} stroke={color} strokeWidth="0.6" />
      <line x1="7" y1="9" x2="13" y2="9" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <line x1="7" y1="12" x2="11" y2="12" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <line x1="7" y1="15" x2="14" y2="15" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <line x1="16.5" y1="8.5" x2="18" y2="10.5" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
      <line x1="18" y1="10.5" x2="21" y2="7" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
      <line x1="16.5" y1="12" x2="18" y2="14" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
      <line x1="18" y1="14" x2="21" y2="10.5" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M10,22 L22,22 L24,26 L8,26 Z" fill={`${color}10`} stroke={color} strokeWidth="0.8" />
      <line x1="6" y1="26" x2="26" y2="26" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function CustomerIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 28" fill="none" className="marketbom-customer-icon">
      <title>거래처 음식점</title>
      <path d="M2,26 L2,11 L16,3 L30,11 L30,26 Z" stroke={color} strokeWidth="1.2" fill={`${color}14`} strokeLinejoin="round" />
      <rect x="11" y="16" width="10" height="10" rx="0.5" fill={`${color}20`} stroke={color} strokeWidth="0.9" />
      <line x1="9" y1="7" x2="9" y2="12" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M7,7 Q9,5 11,7" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <line x1="9" y1="12" x2="9" y2="15" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <div
      className="inline-block marketbom-badge"
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
          className="flex items-start marketbom-callout-li"
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

// ── Main component ─────────────────────────────────────────────────────────────

export default function MarketbomProStory() {
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
      @keyframes marketbom-hint-bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(5px); }
      }

      /* Default (desktop) */
      .marketbom-hub-icon      { width: 4rem; height: 3.5rem; }
      .marketbom-customer-icon { width: 2.8rem; height: 2.4rem; }
      .marketbom-hub           { width: 7.5rem; }
      .marketbom-customer      { width: 4rem; }
      .marketbom-track-row     { height: 2.75rem; }
      .marketbom-order-icon    { font-size: 1rem; }

      /* ≤ 900px */
      @media (max-width: 900px) {
        .marketbom-inner   { gap: 2rem !important; }
        .marketbom-callout { min-height: 240px !important; }
      }

      /* ≤ 700px: stack vertically */
      @media (max-width: 700px) {
        .marketbom-inner         { flex-direction: column !important; align-items: stretch !important; gap: 1.5rem !important; padding: 0 1.25rem !important; }
        .marketbom-diagram       { width: 100% !important; max-width: 100% !important; }
        .marketbom-hub           { width: 5.5rem !important; }
        .marketbom-hub-icon      { width: 3rem !important; height: 2.6rem !important; }
        .marketbom-customer-icon { width: 2.2rem !important; height: 1.9rem !important; }
        .marketbom-customer      { width: 3.2rem !important; }
        .marketbom-track-row     { height: 2.25rem !important; }
        .marketbom-callout       { min-height: 200px !important; width: 100% !important; max-width: 100% !important; }
        .marketbom-callout-title { font-size: 1rem !important; }
        .marketbom-callout-desc  { font-size: 0.8125rem !important; line-height: 1.7 !important; }
        .marketbom-callout-li    { font-size: 0.775rem !important; }
        .marketbom-badge         { font-size: 0.625rem !important; }
      }

      /* ≤ 480px */
      @media (max-width: 480px) {
        .marketbom-inner         { padding: 0 1rem !important; gap: 1rem !important; }
        .marketbom-hub           { width: 4.5rem !important; padding: 0.6rem 0.5rem !important; }
        .marketbom-hub-icon      { width: 2.5rem !important; height: 2.2rem !important; }
        .marketbom-callout-title { font-size: 0.9375rem !important; }
        .marketbom-callout-desc  { font-size: 0.75rem !important; line-height: 1.65 !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        .marketbom-diagram *, .marketbom-callout * { transition: none !important; animation: none !important; }
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

  const hubStatusColor = scene === 3 ? DELIVERY_COLOR : scene === 2 ? HUB_COLOR : 'rgba(255,255,255,0.2)';
  const hubStatusLabel = scene === 3 ? '출고 처리 중' : scene === 2 ? `${CUSTOMERS.length}건 수신` : '대기 중';

  return (
    <section
      aria-label="마켓봄 프로 발주 수신 플로우 인터랙티브 설명"
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
              radial-gradient(ellipse 60% 50% at 15% 50%, rgba(96,165,250,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 85% 50%, rgba(251,146,60,0.06) 0%, transparent 60%),
              hsl(var(--background))`,
            borderTop: '1px solid hsl(var(--border))',
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >
          {/* ── Inner layout ── */}
          <div
            className="marketbom-inner flex items-center"
            style={{ width: '100%', maxWidth: '60rem', padding: '0 2rem', gap: '4rem' }}
          >
            {/* ── Diagram Side ── */}
            <div
              className="marketbom-diagram shrink-0 flex flex-col"
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
                B2B 식자재 유통 플랫폼 — 유통사 관점
              </div>

              {/* ── Hub + Tracks + Customers ── */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.75rem' }}>

                {/* Hub Panel */}
                <div
                  className="marketbom-hub"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '1rem 0.75rem',
                    borderRadius: '1rem',
                    background: scene >= 2 ? `${HUB_COLOR}12` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${scene >= 2 ? `${HUB_COLOR}40` : 'rgba(255,255,255,0.08)'}`,
                    transition: 'background 0.5s ease, border-color 0.5s ease',
                    flexShrink: 0,
                  }}
                >
                  <HubIcon color={HUB_COLOR} />
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: scene >= 2 ? HUB_COLOR : 'rgba(255,255,255,0.4)',
                    transition: 'color 0.5s ease',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}>
                    마켓봄 프로
                  </span>
                  <span style={{
                    fontSize: '0.63rem',
                    fontWeight: 600,
                    color: hubStatusColor,
                    transition: 'color 0.4s ease',
                    whiteSpace: 'nowrap',
                  }}>
                    {hubStatusLabel}
                  </span>
                </div>

                {/* Track rows + Customers */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.55rem', justifyContent: 'center' }}>
                  {CUSTOMERS.map((customer) => {
                    const orderX = getOrderX(progress, customer.stagger);
                    const deliveryX = getDeliveryX(progress, customer.stagger);
                    const orderVisible = scene === 1 && orderX > 0.03 && orderX < 0.97;
                    const deliveryVisible = scene === 3;

                    return (
                      <div key={customer.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                        {/* Track */}
                        <div className="marketbom-track-row" style={{ flex: 1, position: 'relative' }}>

                          {/* Base line */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'rgba(255,255,255,0.07)',
                            transform: 'translateY(-50%)',
                          }} />

                          {/* Scene 2: glow line showing received orders */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: `linear-gradient(to right, ${HUB_COLOR}50, ${HUB_COLOR}10)`,
                            transform: 'translateY(-50%)',
                            opacity: scene === 2 ? 1 : 0,
                            transition: 'opacity 0.5s ease',
                          }} />

                          {/* Order document (scene 1) */}
                          <div
                            className="marketbom-order-icon"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: `${orderX * 100}%`,
                              transform: 'translate(-50%, -50%)',
                              opacity: orderVisible ? 1 : 0,
                              filter: `drop-shadow(0 0 5px ${ORDER_COLOR}99)`,
                              zIndex: 1,
                              lineHeight: 1,
                              userSelect: 'none',
                              transition: 'opacity 0.15s ease',
                            }}
                          >
                            📋
                          </div>

                          {/* Delivery truck (scene 3) */}
                          <div
                            className="marketbom-order-icon"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: `${deliveryX * 100}%`,
                              transform: 'translate(-50%, -50%)',
                              opacity: deliveryVisible ? 1 : 0,
                              filter: `drop-shadow(0 0 5px ${DELIVERY_COLOR}99)`,
                              zIndex: 1,
                              lineHeight: 1,
                              userSelect: 'none',
                              transition: 'opacity 0.2s ease',
                            }}
                          >
                            🚚
                          </div>
                        </div>

                        {/* Customer icon */}
                        <div
                          className="marketbom-customer"
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}
                        >
                          <CustomerIcon color={CUSTOMER_COLOR} />
                          <span style={{
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            color: CUSTOMER_COLOR,
                            whiteSpace: 'nowrap',
                          }}>
                            {customer.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress step badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[
                  { label: '발주 수신', color: CUSTOMER_COLOR, threshold: 1 },
                  { label: '발주 확인', color: HUB_COLOR, threshold: 2 },
                  { label: '출고 처리', color: DELIVERY_COLOR, threshold: 3 },
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
                  background: `linear-gradient(to right, ${CUSTOMER_COLOR}, ${HUB_COLOR}, ${DELIVERY_COLOR})`,
                  borderRadius: '2px',
                  transition: 'width 0.1s linear',
                }} />
              </div>
            </div>

            {/* ── Callout Side ── */}
            <div className="flex-1 min-w-0 relative marketbom-callout" style={{ minHeight: '260px' }}>

              {/* Scene 1: 발주 수신 */}
              <div style={calloutStyle(1)}>
                <Badge color={CUSTOMER_COLOR} bg={`${CUSTOMER_COLOR}18`}>발주 수신</Badge>
                <h3
                  className="marketbom-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  새벽 6시, 수십 개 거래처의 발주가 한꺼번에 들어온다
                </h3>
                <p
                  className="marketbom-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  전화·팩스 시대에는 직원이 한 통씩 받아 수기로 적었습니다. 마감 시간이 지나도 전화는 계속 왔고, 받아 적다 빠뜨린 품목이 배송 당일에야 발견되곤 했습니다. 마켓봄 프로는 이 모든 발주를 실시간 디지털 데이터로 전환합니다.
                </p>
                <CalloutList items={[
                  '음식점 사장님이 앱에서 직접 발주',
                  '유통사는 실시간으로 발주 수신',
                  '전화·팩스 없이 자동 기록',
                ]} />
              </div>

              {/* Scene 2: 발주 확인 */}
              <div style={calloutStyle(2)}>
                <Badge color={HUB_COLOR} bg={`${HUB_COLOR}18`}>발주 확인</Badge>
                <h3
                  className="marketbom-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  한 화면에서 모든 거래처의 발주를 한눈에
                </h3>
                <p
                  className="marketbom-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  유통사 담당자는 웹이나 모바일 앱 어느 환경에서도 발주를 확인하고 출고 수량을 수정할 수 있습니다. 거래처별·상품별로 정렬된 발주 목록은 창고 출고 준비의 첫 번째 신호입니다.
                </p>
                <CalloutList items={[
                  '거래처별 발주 목록 실시간 조회',
                  '출고 수량·단가 인라인 수정',
                  '자동발주 처리로 반복 주문 부담 절감',
                ]} />
              </div>

              {/* Scene 3: 출고 처리 */}
              <div style={calloutStyle(3)}>
                <Badge color={DELIVERY_COLOR} bg={`${DELIVERY_COLOR}18`}>출고 처리</Badge>
                <h3
                  className="marketbom-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  출고 지시서 한 장으로 배송 시작
                </h3>
                <p
                  className="marketbom-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  발주 확인 → 출고 지시 → 배송 → 세금계산서 발행. 전 과정이 하나의 플랫폼 안에서 이어집니다. 수기 장부와 전화 통화로 채워졌던 유통사의 하루가, 데이터로 관리되는 워크플로우로 전환됩니다.
                </p>
                <CalloutList items={[
                  '출고 지시서 자동 생성·정렬',
                  '배송 상태 실시간 추적',
                  '정산·세금계산서 자동 연동',
                ]} />
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
            <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', opacity: 0.4, animation: 'marketbom-hint-bounce 1.6s ease-in-out infinite' }}>
              ↓
            </span>
          </div>
        </div>
      </div>

      <noscript>
        <p style={{ padding: '1rem', fontSize: '0.875rem', color: '#71717a', border: '1px solid #27272a', borderRadius: '0.5rem', marginTop: '1rem' }}>
          마켓봄 프로 발주 수신 플로우: 거래처 발주 수신 → 담당자 확인·수정 → 출고 지시·배송. Nuxt.js, Vue.js, GraphQL Apollo 기반.
        </p>
      </noscript>
    </section>
  );
}
