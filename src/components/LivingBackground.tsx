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
  opacity: number;
  puffs: CloudPuff[];
}

const BLOBS = [
  { baseTop: '-20%', baseLeft: '-10%', sizeVw: 60, phase: 0, sxp: 2.8e-4, syp: 2.0e-4, amp: 3.5, prx: -0.04, pry: -0.04 },
  { baseBottom: '-15%', baseRight: '-5%', sizeVw: 50, phase: Math.PI, sxp: 3.5e-4, syp: 2.8e-4, amp: 3.0, prx: 0.03, pry: 0.03 },
  { baseTop: '30%', baseLeft: '40%', sizeVw: 40, phase: Math.PI * 0.5, sxp: 2.2e-4, syp: 3.2e-4, amp: 2.5, prx: -0.025, pry: 0.025 },
] as const;

const NODE_COUNT = 45;
const CONNECT_DIST = 150;
const REPEL_DIST = 120;
const REPEL_FORCE = 0.8;

const CLOUD_COUNT = 8;
const CLOUD_COUNT_MOBILE = 5;
const WIND_DIST = 200;
const WIND_FORCE = 0.25;
const MAX_CLOUD_SPEED = 0.7;

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

export function LivingBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const nodeCanvasRef = useRef<HTMLCanvasElement>(null);
  const rippleCanvasRef = useRef<HTMLCanvasElement>(null);

  const mouseNorm = useRef({ x: 0.5, y: 0.5 });
  const nodesRef = useRef<NodeParticle[]>([]);
  const cloudsRef = useRef<CloudParticle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafId = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 768;
    const nodeCount = mobile ? 25 : NODE_COUNT;
    const cloudCount = mobile ? CLOUD_COUNT_MOBILE : CLOUD_COUNT;
    const blobRefs = [blob1Ref, blob2Ref, blob3Ref];

    if (!reduced) {
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));

      cloudsRef.current = Array.from({ length: cloudCount }, () => {
        const baseR = 28 + Math.random() * 32;
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.3) * 0.15,
          drift: 0.05 + Math.random() * 0.12,
          opacity: 0.55 + Math.random() * 0.35,
          puffs: generatePuffs(baseR),
        };
      });
    }

    let lastMove = 0;
    const onMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      mouseNorm.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    const onClick = (e: MouseEvent) => {
      if (reduced) return;
      ripplesRef.current.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.4 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const now = Date.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      mouseNorm.current = {
        x: touch.clientX / window.innerWidth,
        y: touch.clientY / window.innerHeight,
      };
    };
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const setupCanvas = (canvas: HTMLCanvasElement) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    };

    let nCtx = nodeCanvasRef.current ? setupCanvas(nodeCanvasRef.current) : null;
    let rCtx = rippleCanvasRef.current ? setupCanvas(rippleCanvasRef.current) : null;

    const onResize = () => {
      if (nodeCanvasRef.current) nCtx = setupCanvas(nodeCanvasRef.current);
      if (rippleCanvasRef.current) rCtx = setupCanvas(rippleCanvasRef.current);
    };
    window.addEventListener('resize', onResize);

    const isDark = () => document.documentElement.classList.contains('dark');

    const drawCloud = (ctx: CanvasRenderingContext2D, cloud: CloudParticle) => {
      for (const puff of cloud.puffs) {
        const cx = cloud.x + puff.dx;
        const cy = cloud.y + puff.dy;
        const grad = ctx.createRadialGradient(cx, cy - puff.r * 0.2, puff.r * 0.1, cx, cy, puff.r);
        grad.addColorStop(0,   `rgba(245,250,255,${cloud.opacity * 0.9})`);
        grad.addColorStop(0.4, `rgba(210,228,252,${cloud.opacity * 0.72})`);
        grad.addColorStop(0.75,`rgba(185,212,248,${cloud.opacity * 0.38})`);
        grad.addColorStop(1,   `rgba(180,210,250,0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, puff.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const tick = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dark = isDark();
      const mx = mouseNorm.current.x - 0.5;
      const my = mouseNorm.current.y - 0.5;

      if (!reduced) {
        BLOBS.forEach((cfg, i) => {
          const el = blobRefs[i].current;
          if (!el) return;
          const dx = Math.sin(t * cfg.sxp + cfg.phase) * cfg.amp + mx * cfg.prx * 100;
          const dy = Math.cos(t * cfg.syp + cfg.phase) * cfg.amp + my * cfg.pry * 100;
          el.style.transform = `translate(${dx}%, ${dy}%)`;
        });
      }

      if (rCtx) {
        rCtx.clearRect(0, 0, w, h);
        ripplesRef.current = ripplesRef.current.filter(rp => rp.alpha > 0.004);
        for (const rp of ripplesRef.current) {
          rp.r += 2.5;
          rp.alpha *= 0.94;
          if (dark) {
            rCtx.beginPath();
            rCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
            rCtx.strokeStyle = `rgba(147, 180, 255, ${rp.alpha})`;
            rCtx.lineWidth = 1.2;
            rCtx.stroke();
          } else {
            const grad = rCtx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, rp.r);
            grad.addColorStop(0,   `rgba(200,225,255,0)`);
            grad.addColorStop(0.6, `rgba(185,215,252,${rp.alpha * 0.35})`);
            grad.addColorStop(0.85,`rgba(170,205,250,${rp.alpha * 0.18})`);
            grad.addColorStop(1,   `rgba(160,200,248,0)`);
            rCtx.beginPath();
            rCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
            rCtx.fillStyle = grad;
            rCtx.fill();
          }
        }
      }

      if (!reduced && nCtx) {
        nCtx.clearRect(0, 0, w, h);
        const cmx = mouseNorm.current.x * w;
        const cmy = mouseNorm.current.y * h;

        if (dark) {
          const nodeRgb = '160,190,255';
          for (const n of nodesRef.current) {
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

            nCtx.beginPath();
            nCtx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
            nCtx.fillStyle = `rgba(${nodeRgb}, 0.4)`;
            nCtx.fill();
          }

          for (let i = 0; i < nodesRef.current.length; i++) {
            for (let j = i + 1; j < nodesRef.current.length; j++) {
              const a = nodesRef.current[i];
              const b = nodesRef.current[j];
              const dist = Math.hypot(a.x - b.x, a.y - b.y);
              if (dist < CONNECT_DIST) {
                nCtx.beginPath();
                nCtx.moveTo(a.x, a.y);
                nCtx.lineTo(b.x, b.y);
                nCtx.strokeStyle = `rgba(${nodeRgb}, ${(1 - dist / CONNECT_DIST) * 0.18})`;
                nCtx.lineWidth = 0.8;
                nCtx.stroke();
              }
            }
          }
        } else {
          for (const c of cloudsRef.current) {
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

            drawCloud(nCtx, c);
          }
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <div ref={blob1Ref} className="living-bg-blob living-bg-blob-1" />
      <div ref={blob2Ref} className="living-bg-blob living-bg-blob-2" />
      <div ref={blob3Ref} className="living-bg-blob living-bg-blob-3" />
      <div className="living-bg-grid absolute inset-0" />
      <canvas ref={rippleCanvasRef} className="absolute inset-0" />
      <canvas ref={nodeCanvasRef} className="absolute inset-0" />
    </div>
  );
}
