import { useEffect, useRef } from 'react';

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  alpha: number;
}

interface CloudPuff {
  dx: number;
  dy: number;
  r: number;
}

interface CloudParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  drift: number;
  /** 퍼프들을 미리 그려 둔 스프라이트. 매 프레임엔 drawImage 한 번만 한다. */
  sprite: HTMLCanvasElement;
  /** 스프라이트의 CSS 픽셀 크기. 캔버스 자체는 DPR만큼 크게 그려져 있다. */
  spriteW: number;
  spriteH: number;
  /** 구름 중심(x, y)에서 스프라이트 왼쪽 위까지의 거리. */
  ox: number;
  oy: number;
}

const NODE_COUNT = 45;
const CONNECT_DIST = 150;
const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
const REPEL_DIST = 120;
const REPEL_FORCE = 0.8;
/** 연결선을 알파 단계별로 묶어 stroke 호출 수를 단계 수만큼으로 줄인다. */
const LINE_ALPHA_STEPS = 6;

const CLOUD_COUNT = 8;
const CLOUD_COUNT_MOBILE = 5;
const WIND_DIST = 200;
const WIND_FORCE = 0.25;
const MAX_CLOUD_SPEED = 0.7;

/** 전체 화면 캔버스라 픽셀 수가 곧 비용이다. 흐릿한 배경이라 1.5배면 충분하다. */
const MAX_DPR = 1.5;

function generatePuffs(baseR: number): CloudPuff[] {
  return [
    { dx: 0,           dy: 0,           r: baseR },
    { dx: baseR * 0.9, dy: baseR * 0.1, r: baseR * 0.82 },
    { dx: -baseR * 0.8, dy: baseR * 0.15, r: baseR * 0.75 },
    { dx: baseR * 1.7, dy: baseR * 0.25, r: baseR * 0.65 },
    { dx: -baseR * 1.5, dy: baseR * 0.3, r: baseR * 0.58 },
    { dx: baseR * 0.45, dy: -baseR * 0.5, r: baseR * 0.7 },
  ];
}

/** 구름 하나를 오프스크린 캔버스에 한 번만 그린다. 그라디언트 생성은 여기서만 일어난다. */
function renderCloudSprite(puffs: CloudPuff[], opacity: number, dpr: number) {
  const minX = Math.min(...puffs.map((p) => p.dx - p.r));
  const maxX = Math.max(...puffs.map((p) => p.dx + p.r));
  const minY = Math.min(...puffs.map((p) => p.dy - p.r));
  const maxY = Math.max(...puffs.map((p) => p.dy + p.r));
  const w = Math.ceil(maxX - minX);
  const h = Math.ceil(maxY - minY);

  const sprite = document.createElement('canvas');
  sprite.width = Math.ceil(w * dpr);
  sprite.height = Math.ceil(h * dpr);
  const ctx = sprite.getContext('2d')!;
  ctx.scale(dpr, dpr);

  for (const puff of puffs) {
    const cx = puff.dx - minX;
    const cy = puff.dy - minY;
    const grad = ctx.createRadialGradient(cx, cy - puff.r * 0.2, puff.r * 0.1, cx, cy, puff.r);
    grad.addColorStop(0,   `rgba(245,250,255,${opacity * 0.9})`);
    grad.addColorStop(0.4, `rgba(210,228,252,${opacity * 0.72})`);
    grad.addColorStop(0.75,`rgba(185,212,248,${opacity * 0.38})`);
    grad.addColorStop(1,   `rgba(180,210,250,0)`);
    ctx.beginPath();
    ctx.arc(cx, cy, puff.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  return { sprite, w, h, ox: minX, oy: minY };
}

export function LivingBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    // 움직임을 줄이라는 설정이면 캔버스 루프를 아예 돌리지 않는다. 블롭 이동도 CSS에서 꺼진다.
    if (!root || !canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mobile = window.innerWidth < 768;
    const nodeCount = mobile ? 25 : NODE_COUNT;
    const cloudCount = mobile ? CLOUD_COUNT_MOBILE : CLOUD_COUNT;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const nodes: NodeParticle[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const clouds: CloudParticle[] = Array.from({ length: cloudCount }, () => {
      const baseR = 28 + Math.random() * 32;
      const opacity = 0.55 + Math.random() * 0.35;
      const { sprite, w, h, ox, oy } = renderCloudSprite(generatePuffs(baseR), opacity, dpr);
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.3) * 0.15,
        drift: 0.05 + Math.random() * 0.12,
        sprite,
        spriteW: w,
        spriteH: h,
        ox,
        oy,
      };
    });

    let ripples: Ripple[] = [];
    const mouse = { x: 0.5, y: 0.5 };

    let lastMove = 0;
    const onPointer = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      mouse.x = clientX / window.innerWidth;
      mouse.y = clientY / window.innerHeight;
      // 블롭 패럴랙스는 CSS 변수로 넘긴다. 매 프레임이 아니라 포인터가 움직일 때만 쓴다.
      root.style.setProperty('--living-bg-mx', (mouse.x - 0.5).toFixed(3));
      root.style.setProperty('--living-bg-my', (mouse.y - 0.5).toFixed(3));
    };
    const onMouseMove = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) onPointer(touch.clientX, touch.clientY);
    };
    const onClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.4 });
    };

    let ctx = canvas.getContext('2d')!;
    let w = 0;
    let h = 0;
    const setupCanvas = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setupCanvas();

    const drawRipples = (dark: boolean) => {
      ripples = ripples.filter((rp) => rp.alpha > 0.004);
      for (const rp of ripples) {
        rp.r += 2.5;
        rp.alpha *= 0.94;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        if (dark) {
          ctx.strokeStyle = `rgba(147, 180, 255, ${rp.alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          const grad = ctx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, rp.r);
          grad.addColorStop(0,   `rgba(200,225,255,0)`);
          grad.addColorStop(0.6, `rgba(185,215,252,${rp.alpha * 0.35})`);
          grad.addColorStop(0.85,`rgba(170,205,250,${rp.alpha * 0.18})`);
          grad.addColorStop(1,   `rgba(160,200,248,0)`);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
    };

    const lineBuckets: number[][] = Array.from({ length: LINE_ALPHA_STEPS }, () => []);
    const drawNodes = (cmx: number, cmy: number) => {
      const nodeRgb = '160,190,255';

      ctx.beginPath();
      for (const n of nodes) {
        const dx = n.x - cmx;
        const dy = n.y - cmy;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_DIST && dist > 0) {
          const f = ((REPEL_DIST - dist) / REPEL_DIST) * REPEL_FORCE;
          n.vx += (dx / dist) * f;
          n.vy += (dy / dist) * f;
        }
        n.vx *= 0.97;
        n.vy *= 0.97;
        n.x = ((n.x + n.vx) % w + w) % w;
        n.y = ((n.y + n.vy) % h + h) % h;

        ctx.moveTo(n.x + 1.8, n.y);
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
      }
      ctx.fillStyle = `rgba(${nodeRgb}, 0.4)`;
      ctx.fill();

      for (const bucket of lineBuckets) bucket.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= CONNECT_DIST_SQ) continue;
          const closeness = 1 - Math.sqrt(distSq) / CONNECT_DIST;
          const step = Math.min(LINE_ALPHA_STEPS - 1, Math.floor(closeness * LINE_ALPHA_STEPS));
          lineBuckets[step].push(a.x, a.y, b.x, b.y);
        }
      }

      ctx.lineWidth = 0.8;
      lineBuckets.forEach((coords, step) => {
        if (coords.length === 0) return;
        ctx.beginPath();
        for (let k = 0; k < coords.length; k += 4) {
          ctx.moveTo(coords[k], coords[k + 1]);
          ctx.lineTo(coords[k + 2], coords[k + 3]);
        }
        ctx.strokeStyle = `rgba(${nodeRgb}, ${((step + 0.5) / LINE_ALPHA_STEPS) * 0.18})`;
        ctx.stroke();
      });
    };

    const drawClouds = (cmx: number, cmy: number) => {
      for (const c of clouds) {
        const dx = c.x - cmx;
        const dy = c.y - cmy;
        const dist = Math.hypot(dx, dy);

        if (dist < WIND_DIST && dist > 0) {
          const f = ((WIND_DIST - dist) / WIND_DIST) * WIND_FORCE;
          c.vx += (dx / dist) * f * 0.6;
          c.vy += (dy / dist) * f * 0.3;
        }

        c.vx += (c.drift - c.vx) * 0.008;
        c.vy += (-c.vy) * 0.012;

        const speed = Math.hypot(c.vx, c.vy);
        if (speed > MAX_CLOUD_SPEED) {
          c.vx = (c.vx / speed) * MAX_CLOUD_SPEED;
          c.vy = (c.vy / speed) * MAX_CLOUD_SPEED;
        }

        c.x = ((c.x + c.vx) % w + w) % w;
        c.y = ((c.y + c.vy) % h + h) % h;

        ctx.drawImage(c.sprite, c.x + c.ox, c.y + c.oy, c.spriteW, c.spriteH);
      }
    };

    let rafId = 0;
    const tick = () => {
      const dark = document.documentElement.classList.contains('dark');
      const cmx = mouse.x * w;
      const cmy = mouse.y * h;

      ctx.clearRect(0, 0, w, h);
      if (dark) drawNodes(cmx, cmy);
      else drawClouds(cmx, cmy);
      drawRipples(dark);

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };
    // 탭이 가려지면 루프를 멈춘다. 브라우저가 rAF를 늦춰 주긴 하지만 완전히 멈추진 않는 경우가 있다.
    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('click', onClick);
    window.addEventListener('resize', setupCanvas);
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', setupCanvas);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <div className="living-bg-blob living-bg-blob-1" />
      <div className="living-bg-blob living-bg-blob-2" />
      <div className="living-bg-blob living-bg-blob-3" />
      <div className="living-bg-grid absolute inset-0" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
