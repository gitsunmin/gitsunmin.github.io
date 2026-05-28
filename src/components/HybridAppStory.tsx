import { type CSSProperties, useEffect, useRef, useState } from 'react';

interface BatteryManager {
  level: number;
  charging: boolean;
  addEventListener: (event: string, cb: () => void) => void;
}

const SCENES = { arch: 1, flavor: 2, bridge: 3 } as const;
const MAX_SCENE = 3;
const MAX_FILL = 13;

const ARCH_LAYERS = [
  { bg: 'rgba(84,197,248,0.08)', border: 'rgba(84,197,248,0.22)', delay: '0.06s' },
  { bg: 'rgba(148,163,184,0.07)', border: 'rgba(148,163,184,0.18)', delay: '0.18s' },
  { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.22)', delay: '0.3s' },
];

const FLAVORS = [
  { type: 'vendor' as const, env: 'LOCAL', svc: '마켓봄', id: 'vendor.debug' },
  { type: 'vendor' as const, env: 'TEST', svc: '마켓봄', id: 'vendor.debug -α' },
  { type: 'vendor' as const, env: 'PROD', svc: '마켓봄', id: 'vendor' },
  { type: 'food' as const, env: 'LOCAL', svc: '식봄', id: 'gred.debug' },
  { type: 'food' as const, env: 'TEST', svc: '식봄', id: 'gred.debug -α' },
  { type: 'food' as const, env: 'PROD', svc: '식봄', id: 'gred' },
];

const FLAVOR_DELAYS = ['0.04s', '0.1s', '0.16s', '0.22s', '0.28s', '0.34s'];

const ENV_COLORS: Record<string, { bg: string; color: string }> = {
  LOCAL: { bg: 'rgba(148,163,184,0.2)', color: '#94a3b8' },
  TEST: { bg: 'rgba(234,179,8,0.2)', color: '#ca8a04' },
  PROD: { bg: 'rgba(34,197,94,0.2)', color: '#16a34a' },
};

const CALL_BUBBLES = [
  { fn: 'window.nativeBridge', code: '.getVersion()' },
  { fn: 'window.nativeBridge', code: '.getBuildNumber()' },
  { fn: 'Cookie: ', code: 'MODE=APP' },
];

const RESP_BUBBLES = [
  { fn: 'version: ', code: '"3.2.1"' },
  { fn: 'build: ', code: '"45"' },
  { fn: 'isDebug: ', code: 'false' },
];

const CALL_DELAYS = ['0.05s', '0.15s', '0.25s'];
const RESP_DELAYS = ['0.1s', '0.2s', '0.3s'];

// ── Pure helpers ──────────────────────────────────────────────────────────────

function fadeWhen(active: boolean, delay = '0.35s'): CSSProperties {
  return { opacity: active ? 1 : 0, transition: `opacity 0.4s ease ${delay}` };
}

// ── Static sub-components (defined outside to avoid react-hooks/static-components) ──

function BatteryRect({ fillWidth, fillColor }: { fillWidth: number; fillColor: string }) {
  return (
    <svg viewBox="0 0 20 10" aria-hidden="true" style={{ width: '1.7em', height: '0.85em', flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="15" height="9" rx="1.5" stroke="rgba(255,255,255,0.55)" strokeWidth="0.9" fill="none" />
      <rect x="15.5" y="3" width="3.5" height="4" rx="1" fill="rgba(255,255,255,0.35)" />
      <rect
        x="1.5" y="1.5" height="7" rx="0.8"
        width={fillWidth} fill={fillColor}
        style={{ transition: 'width 0.6s ease, fill 0.6s ease' }}
      />
    </svg>
  );
}

function ScreenHeader({ time, batteryPct, fillWidth, fillColor, title }: {
  time: string; batteryPct: string; fillWidth: number; fillColor: string; title?: string;
}) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '0 0.3em', marginTop: '0.2em' }}>
      <span style={{ fontSize: '0.75em', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.02em' }}>{time}</span>
      <span style={{ fontSize: '0.65em', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>{title}</span>
      <span className="flex items-center" style={{ gap: '0.25em', fontSize: '0.5em' }}>
        <span style={{ fontSize: '1em', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '-0.02em', lineHeight: 1 }}>{batteryPct}</span>
        <BatteryRect fillWidth={fillWidth} fillColor={fillColor} />
      </span>
    </div>
  );
}

function LayerBadge({ type }: { type: 'flutter' | 'webview' | 'webapp' }) {
  const map = {
    flutter: { bg: 'rgba(84,197,248,0.18)', color: '#54C5F8', label: 'Native' },
    webview: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: 'Bridge' },
    webapp: { bg: 'rgba(167,139,250,0.18)', color: '#a78bfa', label: 'Web' },
  };
  const { bg, color, label } = map[type];
  return (
    <div style={{ fontSize: '0.52em', fontWeight: 700, padding: '0.25em 0.6em', borderRadius: '0.4em', letterSpacing: '0.03em', textTransform: 'uppercase', background: bg, color }}>
      {label}
    </div>
  );
}

function Connector({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center" style={{ gap: '0.5em', padding: '0.15em 1em', ...fadeWhen(active) }}>
      <div style={{ flex: 1, height: '0.06em', background: 'rgba(255,255,255,0.1)' }} />
      <span style={{ fontSize: '0.5em', color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: '0.06em', background: 'rgba(255,255,255,0.1)' }} />
    </div>
  );
}

function CalloutList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col m-0 p-0 list-none" style={{ gap: '0.5rem' }}>
      {items.map((item) => (
        <li key={item} className="flex items-start hybrid-callout-li" style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))', gap: '0.5rem' }}>
          <span className="shrink-0 rounded-full" style={{ width: '0.3rem', height: '0.3rem', marginTop: '0.45em', background: 'currentColor', opacity: 0.4 }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <div
      className="inline-block hybrid-callout-badge"
      style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0.25em 0.75em', borderRadius: '2em', width: 'fit-content', background: bg, color }}
    >
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HybridAppStory() {
  const [scene, setSceneState] = useState(1);
  const [time, setTime] = useState('9:41');
  const [battery, setBattery] = useState({ level: 1, charging: false });

  const outerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(1);

  function setScene(s: number) {
    sceneRef.current = s;
    setSceneState(s);
  }

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }
    updateTime();
    const id = setInterval(updateTime, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!('getBattery' in navigator)) return;
    (navigator as unknown as { getBattery: () => Promise<BatteryManager> })
      .getBattery()
      .then((bat) => {
        const update = () => setBattery({ level: bat.level, charging: bat.charging });
        update();
        bat.addEventListener('levelchange', update);
        bat.addEventListener('chargingchange', update);
      })
      .catch(() => { });
  }, []);

  // Scroll-driven scene detection
  useEffect(() => {
    function handleScroll() {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const scrolledInto = -rect.top;
      if (scrolledInto < 0) return;
      const segmentHeight = window.innerHeight;
      const newScene = Math.max(1, Math.min(MAX_SCENE, Math.floor(scrolledInto / segmentHeight) + 1));
      if (newScene !== sceneRef.current) {
        setScene(newScene);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inject @keyframes & responsive rules once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes hybrid-hint-bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(5px); }
      }
      @media (max-width: 700px) {
        .hybrid-inner    { flex-direction: column !important; gap: 1.25rem !important; padding: 0 1.25rem !important; justify-content: center !important; }
        .hybrid-phone    { font-size: min(11px, calc((100svh - 18rem) / 44), calc((100vw - 4rem) / 22)) !important; }
        .hybrid-callouts { min-height: 230px !important; width: 100% !important; max-width: 28rem !important; }
        .hybrid-callout-title { font-size: 1rem !important; }
        .hybrid-callout-desc  { font-size: 0.8125rem !important; line-height: 1.7 !important; }
        .hybrid-callout-li    { font-size: 0.775rem !important; }
        .hybrid-callout-badge { font-size: 0.625rem !important; }
      }
      @media (max-width: 480px) {
        .hybrid-inner    { padding: 0 1rem !important; gap: 1rem !important; }
        .hybrid-phone    { font-size: min(10px, calc((100svh - 18rem) / 44), calc((100vw - 2.5rem) / 22)) !important; }
        .hybrid-callouts { min-height: 210px !important; }
        .hybrid-callout-title { font-size: 0.9375rem !important; }
        .hybrid-callout-desc  { font-size: 0.75rem !important; line-height: 1.65 !important; }
        .hybrid-callout-block { gap: 0.5rem !important; }
        .hybrid-callout-badge { font-size: 0.625rem !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        .hybrid-phone *, .hybrid-callouts * { transition: none !important; animation: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Derived battery display
  const fillWidth = Math.max(0.5, battery.level * MAX_FILL);
  const fillColor = battery.charging ? '#22c55e'
    : battery.level < 0.2 ? '#ef4444'
      : battery.level < 0.4 ? '#eab308'
        : 'rgba(255,255,255,0.65)';
  const batteryPct = `${Math.round(battery.level * 100)}%`;

  // ── Style helpers ──────────────────────────────────────────────────────────

  const phoneViewStyle = (view: keyof typeof SCENES): CSSProperties => {
    const active = scene === SCENES[view];
    return {
      position: 'absolute',
      inset: 0,
      padding: '3.2em 1.2em 2em',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8em',
      opacity: active ? 1 : 0,
      transform: active ? 'none' : 'translateY(0.6em)',
      transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      pointerEvents: active ? 'auto' : 'none',
    };
  };

  const archLayerStyle = (layer: number): CSSProperties => {
    const s1 = scene === 1;
    const cfg = ARCH_LAYERS[layer];
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6em',
      padding: '0.7em 0.8em',
      borderRadius: '0.9em',
      border: `0.08em solid ${s1 ? cfg.border : 'rgba(255,255,255,0.07)'}`,
      background: s1 ? cfg.bg : 'transparent',
      opacity: s1 ? 1 : 0,
      transform: s1 ? 'none' : 'translateY(0.7em)',
      transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      transitionDelay: s1 ? cfg.delay : '0s',
    };
  };

  const flavorChipStyle = (i: number, type: 'vendor' | 'food'): CSSProperties => {
    const s2 = scene === 2;
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.22em',
      padding: '0.65em 0.35em',
      borderRadius: '0.75em',
      border: `0.08em solid ${type === 'vendor' ? 'rgba(249,115,22,0.2)' : 'rgba(34,197,94,0.2)'}`,
      background: type === 'vendor' ? 'rgba(249,115,22,0.09)' : 'rgba(34,197,94,0.09)',
      opacity: s2 ? 1 : 0,
      transform: s2 ? 'none' : 'scale(0.85)',
      transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
      transitionDelay: s2 ? FLAVOR_DELAYS[i] : '0s',
    };
  };

  const bubbleStyle = (type: 'call' | 'resp', i: number): CSSProperties => {
    const s3 = scene === 3;
    const delays = type === 'call' ? CALL_DELAYS : RESP_DELAYS;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.28em',
      padding: '0.28em 0.5em',
      borderRadius: '0.45em',
      fontFamily: 'ui-monospace, monospace',
      background: type === 'call' ? 'rgba(167,139,250,0.08)' : 'rgba(84,197,248,0.08)',
      opacity: s3 ? 1 : 0,
      transform: s3 ? 'none' : (type === 'call' ? 'translateX(-0.5em)' : 'translateX(0.5em)'),
      transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      transitionDelay: s3 ? delays[i] : '0s',
    };
  };

  const calloutStyle = (callout: number): CSSProperties => {
    const active = scene === callout;
    return {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '0.875rem',
      opacity: active ? 1 : 0,
      transform: active ? 'none' : 'translateY(1rem)',
      transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      pointerEvents: active ? 'auto' : 'none',
    };
  };

  // ── Shared props for ScreenHeader ──────────────────────────────────────────
  const headerProps = { time, batteryPct, fillWidth, fillColor };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      aria-label="하이브리드 앱 아키텍처 인터랙티브 설명"
      style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', width: '100vw' }}
    >
      {/* Outer scroll container: MAX_SCENE × 100svh gives scroll space for each scene */}
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
              radial-gradient(ellipse 65% 55% at 12% 50%, rgba(84,197,248,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 65% 55% at 88% 50%, rgba(167,139,250,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 40% 35% at 50% 95%, rgba(84,197,248,0.04) 0%, transparent 60%),
              hsl(var(--background))`,
            borderTop: '1px solid hsl(var(--border))',
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >

          {/* ── Inner layout ── */}
          <div
            className="hybrid-inner flex items-center"
            style={{ width: '100%', maxWidth: '56rem', padding: '0 2rem', gap: '3rem' }}
          >

            {/* ── Phone Side ── */}
            <div className="shrink-0 flex flex-col items-center" style={{ gap: '1rem' }}>

              {/* Phone Frame */}
              <div
                className="hybrid-phone relative overflow-hidden flex flex-col"
                style={{
                  fontSize: 'min(14px, calc((100svh - 8rem) / 44), calc((46vw - 4rem) / 22))',
                  width: '22em', height: '44em',
                  background: '#0f1117',
                  borderRadius: '3em',
                  border: '0.35em solid #2a2a2e',
                  boxShadow: '0 0 0 0.06em #3a3a3e, 0 24px 60px rgba(0,0,0,0.6), inset 0 0 0 0.08em rgba(255,255,255,0.04)',
                }}
              >
                {/* Dynamic Island */}
                <div
                  className="absolute z-10"
                  style={{
                    top: '0.9em', left: '50%', transform: 'translateX(-50%)',
                    width: '6em', height: '1.4em',
                    background: '#0a0a0c', borderRadius: '1em',
                    boxShadow: '0 0 0 0.12em #1a1a1e',
                  }}
                />

                {/* ── Scene 1: Architecture Stack ── */}
                <div style={phoneViewStyle('arch')}>
                  <ScreenHeader {...headerProps} />
                  <div className="flex flex-col justify-center" style={{ flex: 1, gap: 0, padding: '0.3em 0' }}>
                    <div style={archLayerStyle(0)}>
                      <div className="shrink-0 flex items-center justify-center" style={{ width: '2em', height: '2em' }}>
                        <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.4em', height: '1.4em' }}>
                          <title>Architecture</title>
                          <path d="M14.5 2L4 13l3.5 3.5L20 5.5 14.5 2z" fill="#54C5F8" />
                          <path d="M7.5 16.5L4 13l7 7 3.5-3.5-7-7z" fill="#01579B" />
                          <path d="M14.5 16.5L11 20l-3.5-3.5 3.5-3.5 3.5 3.5z" fill="#29B6F6" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-1" style={{ gap: '0.1em' }}>
                        <span style={{ fontSize: '0.72em', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Flutter Shell</span>
                        <span style={{ fontSize: '0.58em', color: 'rgba(255,255,255,0.38)' }}>Dart · Flavor System</span>
                      </div>
                      <LayerBadge type="flutter" />
                    </div>

                    <Connector label="WebView Bridge" active={scene === 1} />

                    <div style={archLayerStyle(1)}>
                      <div className="shrink-0 flex items-center justify-center" style={{ width: '2em', height: '2em' }}>
                        <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.4em', height: '1.4em' }}>
                          <title>Web View</title>
                          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#94a3b8" strokeWidth="1.5" />
                          <path d="M8 9l4 4-4 4M13 17h4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-1" style={{ gap: '0.1em' }}>
                        <span style={{ fontSize: '0.72em', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>InAppWebView</span>
                        <span style={{ fontSize: '0.58em', color: 'rgba(255,255,255,0.38)' }}>window.nativeBridge 주입</span>
                      </div>
                      <LayerBadge type="webview" />
                    </div>

                    <Connector label="HTTP / REST / GraphQL" active={scene === 1} />

                    <div style={archLayerStyle(2)}>
                      <div className="shrink-0 flex items-center justify-center" style={{ width: '2em', height: '2em' }}>
                        <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.4em', height: '1.4em' }}>
                          <title>Web Application</title>
                          <circle cx="12" cy="12" r="3" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-1" style={{ gap: '0.1em' }}>
                        <span style={{ fontSize: '0.72em', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Web Application</span>
                        <span style={{ fontSize: '0.58em', color: 'rgba(255,255,255,0.38)' }}>모든 웹 프레임워크 호환</span>
                      </div>
                      <LayerBadge type="webapp" />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-center" style={{ paddingBottom: '0.4em', ...fadeWhen(scene === 1, '0.45s') }}>
                    <div
                      className="flex items-center"
                      style={{
                        gap: '0.4em', fontSize: '0.56em', color: 'rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.04)', padding: '0.35em 0.8em',
                        borderRadius: '2em', border: '0.08em solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <span className="rounded-full" style={{ width: '0.5em', height: '0.5em', background: '#FF8C00', boxShadow: '0 0 0.3em #FF8C00' }} />
                      Firebase Remote Config
                    </div>
                  </div>
                </div>

                {/* ── Scene 2: Flavor System ── */}
                <div style={phoneViewStyle('flavor')}>
                  <ScreenHeader {...headerProps} title="플레이버 시스템" />
                  <div className="text-center" style={{ fontSize: '0.6em', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
                    2 서비스 × 3 환경 = 6 빌드 타깃
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.45em', flex: 1, alignContent: 'center' }}>
                    {FLAVORS.map(({ type, env, svc, id }, i) => (
                      <div key={i} style={flavorChipStyle(i, type)}>
                        <span style={{ fontSize: '0.48em', fontWeight: 800, letterSpacing: '0.06em', padding: '0.18em 0.5em', borderRadius: '0.3em', background: ENV_COLORS[env].bg, color: ENV_COLORS[env].color }}>{env}</span>
                        <span style={{ fontSize: '0.7em', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{svc}</span>
                        <span className="text-center" style={{ fontSize: '0.45em', color: 'rgba(255,255,255,0.28)', wordBreak: 'break-all' }}>{id}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center" style={fadeWhen(scene === 2, '0.45s')}>
                    <code style={{ fontSize: '0.55em', color: 'rgba(167,139,250,0.8)', background: 'rgba(167,139,250,0.07)', padding: '0.35em 0.8em', borderRadius: '0.5em', border: '0.08em solid rgba(167,139,250,0.15)', fontFamily: 'ui-monospace, monospace' }}>
                      {'sealed class Flavor { ... }'}
                    </code>
                  </div>
                </div>

                {/* ── Scene 3: JS Bridge ── */}
                <div style={phoneViewStyle('bridge')}>
                  <ScreenHeader {...headerProps} title="JS Bridge" />
                  <div className="flex flex-col justify-center" style={{ flex: 1, gap: 0 }}>
                    {/* Web side */}
                    <div
                      className="flex flex-col"
                      style={{ padding: '0.55em 0.65em', borderRadius: '0.85em', border: '0.08em solid rgba(167,139,250,0.18)', background: 'rgba(167,139,250,0.06)', gap: '0.4em' }}
                    >
                      <div style={{ fontSize: '0.56em', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Web Application</div>
                      {CALL_BUBBLES.map(({ fn, code }, i) => (
                        <div key={i} style={bubbleStyle('call', i)}>
                          <span style={{ fontSize: '0.55em', color: 'rgba(255,255,255,0.32)' }}>{fn}</span>
                          <span style={{ fontSize: '0.55em', color: 'rgba(167,139,250,0.9)', fontWeight: 600 }}>{code}</span>
                        </div>
                      ))}
                    </div>
                    {/* Divider */}
                    <div className="flex items-center justify-center" style={{ gap: '0.5em', padding: '0.25em 0' }}>
                      <span style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.2)' }}>⇅</span>
                      <span style={{ fontSize: '0.48em', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>JavaScript Bridge</span>
                    </div>
                    {/* Native side */}
                    <div
                      className="flex flex-col"
                      style={{ padding: '0.55em 0.65em', borderRadius: '0.85em', border: '0.08em solid rgba(84,197,248,0.18)', background: 'rgba(84,197,248,0.06)', gap: '0.4em' }}
                    >
                      <div style={{ fontSize: '0.56em', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Flutter Native</div>
                      {RESP_BUBBLES.map(({ fn, code }, i) => (
                        <div key={i} style={bubbleStyle('resp', i)}>
                          <span style={{ fontSize: '0.55em', color: 'rgba(255,255,255,0.32)' }}>{fn}</span>
                          <span style={{ fontSize: '0.55em', color: 'rgba(84,197,248,0.9)', fontWeight: 600 }}>{code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center" style={{ fontSize: '0.52em', color: 'rgba(255,255,255,0.2)', paddingBottom: '0.2em', ...fadeWhen(scene === 3, '0.4s') }}>
                    onLoadStop 시 자동 주입
                  </div>
                </div>

                {/* Home Indicator */}
                <div
                  className="absolute z-10"
                  style={{
                    bottom: '0.6em', left: '50%', transform: 'translateX(-50%)',
                    width: '6em', height: '0.28em',
                    background: 'rgba(255,255,255,0.22)', borderRadius: '0.2em',
                  }}
                />
              </div>

              {/* Scene dots */}
              <div className="flex" style={{ gap: '0.4rem' }} aria-hidden="true">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    style={{
                      width: scene === dot ? '1rem' : '0.4rem',
                      height: '0.4rem',
                      borderRadius: scene === dot ? '0.25rem' : '50%',
                      background: scene === dot ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)',
                      transition: 'background 0.3s ease, transform 0.3s ease, width 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Callout Side ── */}
            <div className="flex-1 min-w-0 relative hybrid-callouts" style={{ minHeight: '260px' }}>

              {/* Callout 1 */}
              <div className="hybrid-callout-block" style={calloutStyle(1)}>
                <Badge color="#54C5F8" bg="rgba(84,197,248,0.12)">아키텍처</Badge>
                <h3 className="hybrid-callout-title" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}>
                  Flutter Shell + WebView
                </h3>
                <p className="hybrid-callout-desc" style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                  Flutter를 얇은 네이티브 래퍼로, 기존 웹 자산을 WebView로 렌더링합니다.
                  React, Vue, Nuxt 등 모든 웹 프레임워크와 호환되어 중복 개발 없이 iOS · Android 네이티브 기능을 활용할 수 있습니다.
                </p>
                <CalloutList items={['모든 웹 프레임워크 호환', 'Firebase Remote Config 연동', '쿠키 기반 앱 환경 전달']} />
              </div>

              {/* Callout 2 */}
              <div className="hybrid-callout-block" style={calloutStyle(2)}>
                <Badge color="#f97316" bg="rgba(249,115,22,0.12)">플레이버</Badge>
                <h3 className="hybrid-callout-title" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}>
                  6개 빌드 타깃, 단일 코드베이스
                </h3>
                <p className="hybrid-callout-desc" style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                  Dart 3.0 Sealed Class로 Flavor를 타입 안전하게 표현합니다.
                  exhaustive switch가 누락된 환경 분기를 컴파일 타임에 잡아냅니다.
                </p>
                <CalloutList items={['LOCAL / TEST / PROD × 2 서비스', 'Flavor별 독립 Firebase 프로젝트', '버전 접미사(-alpha) 자동 관리']} />
              </div>

              {/* Callout 3 */}
              <div className="hybrid-callout-block" style={calloutStyle(3)}>
                <Badge color="#a78bfa" bg="rgba(167,139,250,0.12)">JS Bridge</Badge>
                <h3 className="hybrid-callout-title" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, margin: 0, letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}>
                  window.nativeBridge — 네이티브 기능 노출
                </h3>
                <p className="hybrid-callout-desc" style={{ fontSize: '0.875rem', lineHeight: 1.75, margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                  WebView 로드 완료 시{' '}
                  <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.9em', color: 'rgba(167,139,250,0.9)', background: 'rgba(167,139,250,0.1)', padding: '0.1em 0.35em', borderRadius: '0.3em' }}>window.nativeBridge</code>
                  {' '}객체를 주입합니다. 웹이 앱 버전·카메라·갤러리 저장 등을 직접 호출할 수 있습니다.
                </p>
                <CalloutList items={['앱 버전 / 빌드 번호 조회', '카메라 · 갤러리 접근', '딥링크 · 카카오톡 실행']} />
              </div>
            </div>
          </div>

          {/* ── Scroll Hint ── */}
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
            <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', opacity: 0.4, animation: 'hybrid-hint-bounce 1.6s ease-in-out infinite' }}>
              ↓
            </span>
          </div>
        </div>
      </div>

      <noscript>
        <p style={{ padding: '1rem', fontSize: '0.875rem', color: '#71717a', border: '1px solid #27272a', borderRadius: '0.5rem', marginTop: '1rem' }}>
          Flutter Shell → InAppWebView → Web Application 3-레이어 하이브리드 구조,
          6개 Flavor(LOCAL/TEST/PROD × 식봄/마켓봄), window.nativeBridge JS Bridge
        </p>
      </noscript>
    </section>
  );
}
