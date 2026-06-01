import { type CSSProperties, useEffect, useRef, useState } from 'react';

const MAX_SCENE = 3;

const PEBBLES = [
  { text: '당신 잘못이 아니에요 :)', rotation: '-1.2deg', borderRadius: '45% 55% 58% 42% / 40% 60% 40% 60%', bg: '#d4c4b0' },
  { text: '억울한 마음이 당연해요', rotation: '2.1deg', borderRadius: '52% 48% 45% 55% / 58% 42% 58% 42%', bg: '#c4b49e' },
  { text: '저도 비슷한 경험이에요', rotation: '-1.8deg', borderRadius: '55% 45% 48% 52% / 42% 55% 45% 58%', bg: '#d0bca8' },
  { text: '그런 날은 정말 힘들죠', rotation: '1.5deg', borderRadius: '38% 62% 56% 44% / 48% 42% 58% 52%', bg: '#c8b49c' },
];

const PEBBLE_BOTTOM = ['8.8em', '12.5em', '16.2em', '19.9em'];

const GUIDE_ITEMS = [
  { label: '🪨 원석', labelBg: 'rgba(196,168,130,0.22)', labelColor: '#5a3a22', text: '고민을 글로 담아\n익명으로 내려놓아요' },
  { label: '💬 조약돌', labelBg: 'rgba(212,196,176,0.3)', labelColor: '#5a3a22', text: '경험에서 나온 진심 어린\n응원을 전해요' },
  { label: '📋 탁본', labelBg: 'rgba(180,196,160,0.3)', labelColor: '#3a5a22', text: '소중한 위로를 탁본으로\n영원히 간직해요' },
];

function computeState(progress: number) {
  if (progress < 0.40) {
    return { scene: 1, pebbles: Math.min(4, Math.floor(progress / 0.08)), overlay: -1 };
  }
  if (progress < 0.70) {
    return { scene: 2, pebbles: 4, overlay: Math.min(2, Math.floor((progress - 0.40) / 0.10)) };
  }
  return { scene: 3, pebbles: 4, overlay: -1 };
}

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <div
      className="inline-block dolsup-badge"
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
          className="dolsup-callout-li"
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))' }}
        >
          <span style={{ flexShrink: 0, width: '0.3rem', height: '0.3rem', marginTop: '0.45em', borderRadius: '50%', background: 'currentColor', opacity: 0.4 }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function DoldeulsForestStory() {
  const [scene, setScene] = useState(1);
  const [pebbleCount, setPebbleCount] = useState(0);
  const [overlayIndex, setOverlayIndex] = useState(-1);
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
        setPebbleCount(state.pebbles);
        setOverlayIndex(state.overlay);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dolsup-hint-bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(5px); }
      }

      .dolsup-phone {
        font-size: min(
          15px,
          calc((100svh - 4rem) / 41.4),
          calc((100vw - 32px) / 46)
        );
      }

      @media (max-width: 900px) {
        .dolsup-inner   { gap: 2.5rem !important; }
        .dolsup-callout { min-height: 240px !important; }
      }

      @media (max-width: 700px) {
        .dolsup-inner      { flex-direction: column !important; align-items: stretch !important; gap: 1.5rem !important; padding: 0 1.25rem !important; }
        .dolsup-phone-side { max-width: 100% !important; width: 100% !important; align-items: center !important; }
        .dolsup-phone      { font-size: min(13px, calc((100vw - 64px) / 20)) !important; }
        .dolsup-callout    { min-height: 180px !important; width: 100% !important; max-width: 100% !important; }
        .dolsup-callout-title { font-size: 1rem !important; }
        .dolsup-callout-desc  { font-size: 0.8125rem !important; line-height: 1.7 !important; }
        .dolsup-callout-li    { font-size: 0.775rem !important; }
        .dolsup-badge         { font-size: 0.625rem !important; }
      }

      @media (max-width: 480px) {
        .dolsup-inner  { padding: 0 1rem !important; gap: 1rem !important; }
        .dolsup-phone  { font-size: min(11px, calc((100vw - 48px) / 20)) !important; }
        .dolsup-callout-title { font-size: 0.9375rem !important; }
        .dolsup-callout-desc  { font-size: 0.75rem !important; line-height: 1.65 !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        .dolsup-phone *, .dolsup-callout * { transition: none !important; animation: none !important; }
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

  return (
    <section
      aria-label="돌들의 숲 서비스 인터랙티브 설명"
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
              radial-gradient(ellipse 60% 50% at 18% 60%, rgba(196,168,130,0.09) 0%, transparent 60%),
              radial-gradient(ellipse 50% 60% at 82% 40%, rgba(160,196,140,0.06) 0%, transparent 60%),
              hsl(var(--background))`,
            borderTop: '1px solid hsl(var(--border))',
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >
          {/* ── Inner layout ── */}
          <div
            className="dolsup-inner flex items-center"
            style={{ width: '100%', maxWidth: '60rem', padding: '0 2rem', gap: '4rem' }}
          >
            {/* ── Phone Side ── */}
            <div
              className="dolsup-phone-side shrink-0 flex flex-col"
              style={{ gap: '1.25rem', alignItems: 'flex-start' }}
            >
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'hsl(var(--muted-foreground))',
                opacity: 0.45,
              }}>
                익명 P2P 힐링 커뮤니티
              </div>

              {/* Phone Frame */}
              <div
                className="dolsup-phone"
                style={{
                  position: 'relative',
                  width: '20em',
                  height: '41.4em',
                  borderRadius: '3.14em',
                  border: '2px solid rgba(196,168,130,0.45)',
                  background: '#faf7f3',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,.13), 0 6px 20px rgba(0,0,0,.07)',
                  flexShrink: 0,
                }}
              >
                {/* Dynamic Island */}
                <div style={{
                  position: 'absolute',
                  top: '0.8em',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6.4em',
                  height: '1.8em',
                  borderRadius: '999px',
                  background: '#1a1611',
                  zIndex: 100,
                  pointerEvents: 'none',
                }} />

                {/* ── Stack View (씬 1 & 2) ── */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  paddingTop: '3.4em',
                  overflow: 'hidden',
                  opacity: scene < 3 ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                  pointerEvents: scene < 3 ? 'auto' : 'none',
                }}>
                  {/* Guide overlay (씬 2) */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: scene === 2 ? 'rgba(0,0,0,0.42)' : 'rgba(0,0,0,0)',
                    zIndex: 40,
                    pointerEvents: 'none',
                    transition: 'background 0.4s ease',
                  }} />

                  {/* Guide callout card (씬 2) */}
                  {GUIDE_ITEMS.map((item, i) => (
                    <div
                      key={item.label}
                      style={{
                        position: 'absolute',
                        top: '5.8em',
                        left: '0.8em',
                        right: '0.8em',
                        background: 'rgba(250,247,243,0.96)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: '1.2em',
                        border: '1px solid rgba(196,168,130,0.28)',
                        padding: '0.9em 1.1em',
                        zIndex: 55,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5em',
                        opacity: scene === 2 && overlayIndex === i ? 1 : 0,
                        transform: scene === 2 && overlayIndex === i ? 'translateY(0)' : 'translateY(-0.8em)',
                        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                        pointerEvents: 'none',
                      }}
                    >
                      <span style={{
                        display: 'inline-block',
                        padding: '0.3em 1.2em',
                        borderRadius: '999px',
                        fontSize: '1.0em',
                        fontWeight: 700,
                        background: item.labelBg,
                        color: item.labelColor,
                      }}>
                        {item.label}
                      </span>
                      <p style={{
                        fontSize: '0.95em',
                        lineHeight: 1.6,
                        color: '#5a3a22',
                        textAlign: 'center',
                        margin: 0,
                        whiteSpace: 'pre-line',
                      }}>
                        {item.text}
                      </p>
                    </div>
                  ))}

                  {/* Pebble group (spotlight in 씬 2 overlay 1) */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: scene === 2 && overlayIndex === 1 ? 45 : 10,
                  }}>
                    {PEBBLES.map((pebble, i) => (
                      <div
                        key={pebble.text}
                        style={{
                          position: 'absolute',
                          left: '0.8em',
                          right: '0.8em',
                          height: '4.4em',
                          bottom: PEBBLE_BOTTOM[i],
                          opacity: pebbleCount >= i + 1 ? 1 : 0,
                          transform: pebbleCount >= i + 1
                            ? `rotate(${pebble.rotation})`
                            : `translateY(-2em) rotate(${pebble.rotation})`,
                          transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      >
                        <div style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: pebble.borderRadius,
                          background: pebble.bg,
                          padding: '0.7em 1em',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 -2px 8px rgba(0,0,0,.08)',
                        }}>
                          <span style={{
                            fontSize: '0.85em',
                            lineHeight: 1.6,
                            color: '#3d2b1f',
                            textAlign: 'center',
                            fontWeight: 500,
                          }}>
                            {pebble.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Foundation stone — 원석 (spotlight in 씬 2 overlay 0) */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '9.5em',
                    zIndex: scene === 2 && overlayIndex === 0 ? 45 : 30,
                    borderRadius: '5.6em 7.2em 0 0 / 2.2em 3em 0 0',
                    background: '#c9b89a',
                    boxShadow: '0 -4px 12px rgba(0,0,0,.11), inset 0 5px 10px rgba(255,255,255,.13), inset 0 -8px 16px rgba(0,0,0,.21)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.8em 1.4em 1.4em',
                    boxSizing: 'border-box',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '0.8em',
                      left: '18%',
                      width: '27%',
                      height: '0.8em',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,.13)',
                      filter: 'blur(3px)',
                      pointerEvents: 'none',
                    }} />
                    <p style={{
                      fontSize: '0.9em',
                      lineHeight: 1.7,
                      color: 'rgba(255,255,255,.9)',
                      fontWeight: 500,
                      position: 'relative',
                      zIndex: 1,
                      margin: 0,
                      textAlign: 'center',
                    }}>
                      오늘 회사에서 억울한 지적을<br />받았어요. 말도 못하고...
                    </p>
                  </div>
                </div>

                {/* ── Guidelines View (씬 3) ── */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  paddingTop: '3.4em',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: scene === 3 ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                  pointerEvents: scene === 3 ? 'auto' : 'none',
                }}>
                  <div style={{
                    padding: '0.5em 1.2em 0.4em',
                    borderBottom: '1px solid rgba(196,168,130,0.22)',
                    fontSize: '1.1em',
                    fontWeight: 600,
                    color: '#3d2b1f',
                    background: '#faf7f3',
                    flexShrink: 0,
                  }}>
                    돌숲에서는
                  </div>
                  <div style={{
                    flex: 1,
                    padding: '1.2em 1.4em',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2em',
                    overflow: 'hidden',
                    background: '#faf7f3',
                  }}>
                    <p style={{ fontSize: '1.3em', fontWeight: 700, color: '#8b3a2a', margin: 0, letterSpacing: '-0.01em' }}>
                      이것만은 안 돼요
                    </p>
                    {['욕설·혐오 표현', '허위 사실·광고', '자해·자살 조장'].map((rule) => (
                      <div key={rule} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8em', fontSize: '1.2em', lineHeight: 1.5, color: '#4a3728', fontWeight: 500 }}>
                        <span style={{ color: '#a83a2a', fontWeight: 700, flexShrink: 0 }}>✕</span>
                        {rule}
                      </div>
                    ))}
                    <p style={{ fontSize: '1.0em', color: '#7a6050', textAlign: 'center', lineHeight: 1.7, marginTop: 'auto', marginBottom: 0, paddingBottom: '0.5em' }}>
                      그 밖에는 자유롭게 이야기해요
                    </p>
                  </div>
                </div>
              </div>

              {/* Scene progress dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'center' }}>
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    style={{
                      height: '5px',
                      borderRadius: '999px',
                      background: scene === s
                        ? 'rgba(196,168,130,0.5)'
                        : scene > s
                          ? 'rgba(196,168,130,0.85)'
                          : 'rgba(196,168,130,0.2)',
                      width: scene === s ? '48px' : '5px',
                      transition: 'width 0.45s cubic-bezier(0.16,1,0.3,1), background 0.35s ease',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Callout Side ── */}
            <div className="flex-1 min-w-0 relative dolsup-callout" style={{ minHeight: '260px' }}>

              {/* Callout 1: 원석 & 조약돌 */}
              <div style={calloutStyle(1)}>
                <Badge color="#8b6040" bg="rgba(196,168,130,0.18)">원석 & 조약돌</Badge>
                <h3
                  className="dolsup-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  고민을 내려놓으면,<br />위로가 하나씩 쌓여요
                </h3>
                <p
                  className="dolsup-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  익명으로 고민이나 소원을 <strong>원석</strong>으로 올리면, 다른 사람들이 위로의 말을
                  {' '}<strong>조약돌</strong>로 하나씩 얹어줍니다. 조약돌이 지정 개수에 도달하면 돌탑이 완결됩니다.
                </p>
                <CalloutList items={[
                  '원석: 10~500자, 태그 1개 필수, 완결 조건 선택',
                  '조약돌: 10~300자, 1인 1원석 1조약돌',
                  '30일 후 자동 삭제 — 이야기에 생명주기를 부여',
                ]} />
              </div>

              {/* Callout 2: 탁본 & 쪽지 */}
              <div style={calloutStyle(2)}>
                <Badge color="#3a5a22" bg="rgba(160,196,130,0.15)">탁본 & 쪽지</Badge>
                <h3
                  className="dolsup-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  소중한 위로를<br />영원히 간직해요
                </h3>
                <p
                  className="dolsup-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  전통 탁본(拓本)처럼 마음에 남는 글을 스냅샷으로 보관합니다.
                  원본이 삭제되어도 탁본은 사라지지 않습니다.
                  원석 작성자는 마음에 드는 조약돌에 <strong>쪽지</strong>를 끼워 감사를 전할 수 있습니다.
                </p>
                <CalloutList items={[
                  '탁본: 원본 삭제 후에도 영구 보존',
                  '한지·화선지 느낌의 베이지 그라데이션 UI',
                  '쪽지: 조약돌에 첨부되는 단방향 감사 메시지',
                ]} />
              </div>

              {/* Callout 3: 완전 익명 & 안전 */}
              <div style={calloutStyle(3)}>
                <Badge color="#8b3a2a" bg="rgba(196,130,110,0.14)">완전 익명 & 안전</Badge>
                <h3
                  className="dolsup-callout-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}
                >
                  신뢰할 수 있는<br />익명의 공간
                </h3>
                <p
                  className="dolsup-callout-desc"
                  style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}
                >
                  닉네임·프로필 없이 익명 캐릭터(쉐도우)로만 활동합니다.
                  조약돌 작성·출석 체크·탁본 받기로 <strong>선함 포인트</strong>를 쌓고,
                  커뮤니티 원칙을 함께 지킵니다.
                </p>
                <CalloutList items={[
                  'Apple App Store Guideline 1.2 (UGC Safety) 충족',
                  '콘텐츠 차단·사용자 차단·신고·이의 신청',
                  '만 19세 이상, 이메일·소셜 로그인(Apple·Google)',
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
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', opacity: 0.5, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              스크롤하여 탐색
            </span>
            <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', opacity: 0.4, animation: 'dolsup-hint-bounce 1.6s ease-in-out infinite' }}>
              ↓
            </span>
          </div>
        </div>
      </div>

      <noscript>
        <p style={{ padding: '1rem', fontSize: '0.875rem', color: '#71717a', border: '1px solid #27272a', borderRadius: '0.5rem', marginTop: '1rem' }}>
          돌들의 숲: 익명 커뮤니티. 원석(고민)에 조약돌(위로)을 쌓고, 탁본으로 영원히 간직해요.
        </p>
      </noscript>
    </section>
  );
}
