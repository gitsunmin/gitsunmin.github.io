import { type CSSProperties, useEffect, useRef, useState } from 'react';

const MAX_SCENE = 3;

const SLOT_ITEMS = ['당근', '달걀', '두부', '마늘', '양파', '감자', '버섯', '시금치', '토마토', '두유'];

const FOOD_CARDS = [
  { emoji: '🥕', name: '당근', comment: '반 썼음', cat: '채소', catColor: '#2D6A4F', catBg: '#D8F3DC' },
  { emoji: '🥚', name: '달걀', comment: '6개 남음', cat: '단백질', catColor: '#c0761e', catBg: '#fdebd0' },
  { emoji: '🧀', name: '치즈', comment: '', cat: '유제품', catColor: '#2980b9', catBg: '#d6eaf8' },
  { emoji: '🧄', name: '마늘', comment: '오른쪽 칸', cat: '채소', catColor: '#2D6A4F', catBg: '#D8F3DC' },
  { emoji: '🍄', name: '버섯', comment: '', cat: '채소', catColor: '#2D6A4F', catBg: '#D8F3DC' },
  { emoji: '🥛', name: '두유', comment: '오픈함', cat: '음료', catColor: '#7d3c98', catBg: '#e8daef' },
  { emoji: '🥬', name: '시금치', comment: '', cat: '채소', catColor: '#2D6A4F', catBg: '#D8F3DC' },
  { emoji: '🧅', name: '양파', comment: '반개', cat: '채소', catColor: '#2D6A4F', catBg: '#D8F3DC' },
  { emoji: '🥩', name: '삼겹살', comment: '냉동', cat: '육류', catColor: '#c0392b', catBg: '#fadbd8' },
];

function computeState(progress: number) {
  if (progress < 0.33) return { scene: 1, cardCount: 0 };
  if (progress < 0.66) return { scene: 2, cardCount: Math.min(9, Math.floor((progress - 0.33) / 0.037)) };
  return { scene: 3, cardCount: 9 };
}

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <div
      className="inline-block namat-badge"
      style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0.25em 0.75em', borderRadius: '2em', width: 'fit-content', background: bg, color }}
    >
      {children}
    </div>
  );
}

function CalloutList({ items }: { items: string[] }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item) => (
        <li
          key={item}
          className="namat-callout-li"
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))' }}
        >
          <span style={{ flexShrink: 0, width: '0.3rem', height: '0.3rem', marginTop: '0.45em', borderRadius: '50%', background: 'currentColor', opacity: 0.4 }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

const FAB = () => (
  <div style={{
    position: 'absolute',
    bottom: '2em',
    right: '1em',
    width: '3em',
    height: '3em',
    borderRadius: '50%',
    background: '#2D6A4F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6em',
    color: 'white',
    fontWeight: 300,
    boxShadow: '0 4px 14px rgba(45,106,79,0.38)',
    pointerEvents: 'none',
  }}>
    +
  </div>
);

const AppHeader = ({ slot, slotIdx }: { slot?: boolean; slotIdx?: number }) => (
  <div style={{
    padding: '0.5em 1.2em 0.55em',
    borderBottom: '1px solid rgba(45,106,79,0.11)',
    background: '#F8F7F2',
    flexShrink: 0,
  }}>
    <div style={{ fontSize: '0.62em', color: 'rgba(45,106,79,0.52)', fontWeight: 600, marginBottom: '0.1em', letterSpacing: '0.04em' }}>
      냉장고 속
    </div>
    {slot && slotIdx !== undefined ? (
      <div style={{ overflow: 'hidden', height: '1.65em', position: 'relative' }}>
        <span
          key={slotIdx}
          style={{
            display: 'block',
            fontSize: '1.3em',
            fontWeight: 700,
            color: '#1C1C1E',
            lineHeight: 1.25,
            animation: 'namat-slot-in 0.42s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          {SLOT_ITEMS[slotIdx]} 남았던가?
        </span>
      </div>
    ) : (
      <div style={{ fontSize: '1.3em', fontWeight: 700, color: '#1C1C1E', lineHeight: 1.25 }}>
        당근 남았던가?
      </div>
    )}
  </div>
);

export default function NamatDeongaStory() {
  const [scene, setScene] = useState(1);
  const [cardCount, setCardCount] = useState(0);
  const [slotIdx, setSlotIdx] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

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
      if (Math.abs(newProgress - progressRef.current) > 0.001) {
        progressRef.current = newProgress;
        const state = computeState(newProgress);
        setScene(state.scene);
        setCardCount(state.cardCount);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scene !== 1) return;
    const timer = setInterval(() => {
      setSlotIdx((prev) => (prev + 1) % SLOT_ITEMS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [scene]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes namat-slot-in {
        from { transform: translateY(110%); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      @keyframes namat-wobble {
        0%   { transform: scale(0.94) rotate(-1.5deg); }
        100% { transform: scale(0.94) rotate( 1.5deg); }
      }
      @keyframes namat-hint-bounce {
        0%, 100% { transform: translateY(0);  }
        50%       { transform: translateY(5px); }
      }

      .namat-phone {
        font-size: min(
          15px,
          calc((100svh - 4rem) / 41.4),
          calc((100vw - 32px) / 46)
        );
      }

      @media (max-width: 900px) {
        .namat-inner   { gap: 2.5rem !important; }
        .namat-callout { min-height: 240px !important; }
      }

      @media (max-width: 700px) {
        .namat-inner      { flex-direction: column !important; align-items: stretch !important; gap: 1.5rem !important; padding: 0 1.25rem !important; }
        .namat-phone-side { max-width: 100% !important; width: 100% !important; align-items: center !important; }
        .namat-phone      { font-size: min(13px, calc((100vw - 64px) / 20)) !important; }
        .namat-callout    { min-height: 180px !important; width: 100% !important; max-width: 100% !important; }
        .namat-callout-title { font-size: 1rem !important; }
        .namat-callout-desc  { font-size: 0.8125rem !important; line-height: 1.7 !important; }
        .namat-callout-li    { font-size: 0.775rem !important; }
        .namat-badge         { font-size: 0.625rem !important; }
      }

      @media (max-width: 480px) {
        .namat-inner  { padding: 0 1rem !important; gap: 1rem !important; }
        .namat-phone  { font-size: min(11px, calc((100vw - 48px) / 20)) !important; }
        .namat-callout-title { font-size: 0.9375rem !important; }
        .namat-callout-desc  { font-size: 0.75rem !important; line-height: 1.65 !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        .namat-phone *, .namat-callout * { transition: none !important; animation: none !important; }
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

  const phoneScene = (c: number): CSSProperties => ({
    position: 'absolute',
    inset: 0,
    paddingTop: '3.4em',
    display: 'flex',
    flexDirection: 'column',
    opacity: scene === c ? 1 : 0,
    transition: 'opacity 0.45s ease',
    pointerEvents: scene === c ? 'auto' : 'none',
  });

  const fridgeGrid: CSSProperties = {
    flex: 1,
    background: '#EAF1F7',
    padding: '0.8em',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5em',
    alignContent: 'start',
    overflow: 'hidden',
  };

  return (
    <section
      aria-label="남았던가 서비스 인터랙티브 설명"
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
              radial-gradient(ellipse 60% 50% at 18% 60%, rgba(82,183,136,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 60% at 82% 40%, rgba(45,106,79,0.06) 0%, transparent 60%),
              hsl(var(--background))`,
            borderTop: '1px solid hsl(var(--border))',
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >
          <div
            className="namat-inner flex items-center"
            style={{ width: '100%', maxWidth: '60rem', padding: '0 2rem', gap: '4rem' }}
          >
            {/* ── Phone Side ── */}
            <div
              className="namat-phone-side shrink-0 flex flex-col"
              style={{ gap: '1.25rem', alignItems: 'flex-start' }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', opacity: 0.45 }}>
                냉장고 식재료 기록 앱
              </div>

              {/* Phone Frame */}
              <div
                className="namat-phone"
                style={{
                  position: 'relative',
                  width: '20em',
                  height: '41.4em',
                  borderRadius: '3.14em',
                  border: '2px solid rgba(45,106,79,0.28)',
                  background: '#F8F7F2',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,.13), 0 6px 20px rgba(0,0,0,.07)',
                  flexShrink: 0,
                }}
              >
                {/* Dynamic Island */}
                <div style={{ position: 'absolute', top: '0.8em', left: '50%', transform: 'translateX(-50%)', width: '6.4em', height: '1.8em', borderRadius: '999px', background: '#111', zIndex: 100, pointerEvents: 'none' }} />

                {/* ── Scene 1: Slot Machine + Empty Fridge ── */}
                <div style={phoneScene(1)}>
                  <AppHeader slot slotIdx={slotIdx} />
                  <div style={fridgeGrid}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        style={{ aspectRatio: '1', borderRadius: '0.75em', background: 'rgba(255,255,255,0.45)', border: '1.5px dashed rgba(45,106,79,0.18)' }}
                      />
                    ))}
                  </div>
                  <FAB />
                </div>

                {/* ── Scene 2: Cards Appearing ── */}
                <div style={phoneScene(2)}>
                  <AppHeader />
                  <div style={fridgeGrid}>
                    {FOOD_CARDS.map((card, i) => (
                      <div
                        key={card.name}
                        style={{
                          opacity: cardCount >= i + 1 ? 1 : 0,
                          transform: cardCount >= i + 1 ? 'scale(1) translateY(0)' : 'scale(0.72) translateY(1em)',
                          transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                          background: '#fff',
                          borderRadius: '0.75em',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        }}
                      >
                        <div style={{ aspectRatio: '1', background: card.catBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8em' }}>
                          {card.emoji}
                        </div>
                        <div style={{ padding: '0.3em 0.4em 0.35em', display: 'flex', flexDirection: 'column', gap: '0.1em' }}>
                          <span style={{ fontSize: '0.56em', fontWeight: 700, color: card.catColor, background: card.catBg, borderRadius: '999px', padding: '0.05em 0.45em', alignSelf: 'flex-start', lineHeight: 1.5 }}>
                            {card.cat}
                          </span>
                          <span style={{ fontSize: '0.62em', color: '#1C1C1E', fontWeight: 600, lineHeight: 1.2 }}>{card.name}</span>
                          {card.comment && (
                            <span style={{ fontSize: '0.54em', color: '#8E8E93', lineHeight: 1.2 }}>{card.comment}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <FAB />
                </div>

                {/* ── Scene 3: Edit Mode + Undo Snackbar ── */}
                <div style={phoneScene(3)}>
                  {/* Header with 완료 */}
                  <div style={{ padding: '0.5em 1.2em 0.55em', borderBottom: '1px solid rgba(45,106,79,0.11)', background: '#F8F7F2', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.62em', color: 'rgba(45,106,79,0.52)', fontWeight: 600, marginBottom: '0.1em', letterSpacing: '0.04em' }}>냉장고 속</div>
                      <div style={{ fontSize: '1.3em', fontWeight: 700, color: '#1C1C1E', lineHeight: 1.25 }}>당근 남았던가?</div>
                    </div>
                    <span style={{ fontSize: '0.88em', fontWeight: 600, color: '#2D6A4F', paddingBottom: '0.1em' }}>완료</span>
                  </div>

                  {/* Wobble Grid (8 cards + 1 deleted slot) */}
                  <div style={fridgeGrid}>
                    {FOOD_CARDS.slice(0, 8).map((card, i) => (
                      <div
                        key={card.name}
                        style={{
                          position: 'relative',
                          animation: `namat-wobble 150ms ease-in-out ${i * 18}ms infinite alternate`,
                        }}
                      >
                        {/* × badge — on wrapper so it can bleed outside the card */}
                        <div style={{ position: 'absolute', top: '-0.28em', left: '-0.28em', width: '1.1em', height: '1.1em', borderRadius: '50%', background: '#C0392B', border: '1.5px solid white', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.56em', color: 'white', fontWeight: 700, lineHeight: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.22)' }}>
                          ✕
                        </div>
                        {/* card — square ratio, content clipped */}
                        <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#fff', borderRadius: '0.75em', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.11)' }}>
                          <div style={{ flex: 1, background: card.catBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8em' }}>
                            {card.emoji}
                          </div>
                          <div style={{ padding: '0.25em 0.4em 0.3em', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.62em', color: '#1C1C1E', fontWeight: 600, lineHeight: 1.2 }}>{card.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Deleted slot */}
                    <div style={{ aspectRatio: '1', borderRadius: '0.75em', background: 'rgba(192,57,43,0.06)', border: '1.5px dashed rgba(192,57,43,0.28)' }} />
                  </div>

                  {/* Undo Snackbar */}
                  <div style={{
                    position: 'absolute',
                    bottom: '2.2em',
                    left: '0.8em',
                    right: '0.8em',
                    background: '#1C1C1E',
                    borderRadius: '0.75em',
                    padding: '0.65em 0.95em',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 50,
                    boxShadow: '0 4px 18px rgba(0,0,0,0.32)',
                    opacity: scene === 3 ? 1 : 0,
                    transform: scene === 3 ? 'translateY(0)' : 'translateY(1em)',
                    transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.4s cubic-bezier(0.16,1,0.3,1) 0.2s',
                  }}>
                    <span style={{ fontSize: '0.76em', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>삼겹살 삭제됨</span>
                    <span style={{ fontSize: '0.76em', color: '#52B788', fontWeight: 700 }}>되돌리기</span>
                  </div>
                </div>
              </div>

              {/* Progress Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'center' }}>
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    style={{
                      height: '5px',
                      borderRadius: '999px',
                      background: scene === s ? 'rgba(45,106,79,0.55)' : scene > s ? 'rgba(45,106,79,0.85)' : 'rgba(45,106,79,0.18)',
                      width: scene === s ? '48px' : '5px',
                      transition: 'width 0.45s cubic-bezier(0.16,1,0.3,1), background 0.35s ease',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Callout Side ── */}
            <div className="hidden md:block flex-1 min-w-0 relative namat-callout" style={{ minHeight: '260px' }}>

              {/* Callout 1 */}
              <div style={calloutStyle(1)}>
                <Badge color="#2D6A4F" bg="rgba(45,106,79,0.1)">음식물 낭비 문제</Badge>
                <h3 className="namat-callout-title" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}>
                  냉장고에 뭐가 있는지<br />기억하시나요?
                </h3>
                <p className="namat-callout-desc" style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                  한국에서 한 해 버려지는 음식물 쓰레기는 약 <strong>500만 톤</strong>, 처리 비용만 8천억 원이 넘습니다.
                  그 중 가장 단순한 원인 — <strong>있는 것을 몰라서 버리는 낭비</strong> — 하나에만 집중했습니다.
                </p>
                <CalloutList items={[
                  '냉장고 안이 보이면, 사지 않아도 될 것을 사지 않게 됩니다',
                  '"있는 것을 알고 쓰는 것" — 그 하나로 충분합니다',
                  '선함의 데이터화 — 선함연구소의 첫 번째 일상 실험',
                ]} />
              </div>

              {/* Callout 2 */}
              <div style={calloutStyle(2)}>
                <Badge color="#2D6A4F" bg="rgba(45,106,79,0.1)">찍고 닫는 2초</Badge>
                <h3 className="namat-callout-title" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}>
                  앱을 열고, 찍고,<br />닫는다. 그게 전부예요
                </h3>
                <p className="namat-callout-desc" style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                  복잡한 카테고리 분류도, 레시피 연동도 없습니다.
                  행동을 바꾸는 가장 확실한 방법은 <strong>마찰을 없애는 것</strong>입니다.
                  사진 한 장이 냉장고 뒤편의 식재료를 기억하게 합니다.
                </p>
                <CalloutList items={[
                  '3열 그리드 — 냉장고 속을 보는 것처럼',
                  '코멘트 추가 가능 — "반 썼음", "오른쪽 선반"',
                  '커스텀 카테고리로 한눈에 구분',
                ]} />
              </div>

              {/* Callout 3 */}
              <div style={calloutStyle(3)}>
                <Badge color="#7d3c98" bg="rgba(125,60,152,0.1)">되돌리기 & 완전 프라이버시</Badge>
                <h3 className="namat-callout-title" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}>
                  실수해도 괜찮고,<br />데이터는 기기 안에만 있어요
                </h3>
                <p className="namat-callout-desc" style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                  삭제해도 <strong>3초 안에 되돌릴 수 있습니다.</strong>
                  모든 사진과 데이터는 기기 내에만 저장되며, 서버로 전송되지 않습니다.
                  계정도, 인터넷 연결도 필요 없습니다.
                </p>
                <CalloutList items={[
                  '롱프레스 편집 모드 — iOS 홈 화면처럼 직관적',
                  '삭제 즉시 되돌리기 Snackbar 3초 표시',
                  '서버 없음 · 로컬 SQLite · 완전 오프라인',
                ]} />
              </div>
            </div>
          </div>

          {/* Scroll Hint */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none flex flex-col items-center"
            style={{ bottom: '1rem', left: '50%', transform: 'translateX(-50%)', gap: '0.3rem', opacity: scene > 1 ? 0 : 1, transition: 'opacity 0.4s ease' }}
          >
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', opacity: 0.5, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              스크롤하여 탐색
            </span>
            <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', opacity: 0.4, animation: 'namat-hint-bounce 1.6s ease-in-out infinite' }}>
              ↓
            </span>
          </div>
        </div>
      </div>

      <noscript>
        <p style={{ padding: '1rem', fontSize: '0.875rem', color: '#71717a', border: '1px solid #27272a', borderRadius: '0.5rem', marginTop: '1rem' }}>
          남았던가: 냉장고 식재료 기록 앱. 찍고 닫는 2초로 음식물 낭비를 줄입니다. 서버 없는 완전 프라이버시.
        </p>
      </noscript>
    </section>
  );
}
