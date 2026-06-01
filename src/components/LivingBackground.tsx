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

const BLOBS = [
  { baseTop: '-20%', baseLeft: '-10%', sizeVw: 60, phase: 0, sxp: 2.8e-4, syp: 2.0e-4, amp: 3.5, prx: -0.04, pry: -0.04 },
  { baseBottom: '-15%', baseRight: '-5%', sizeVw: 50, phase: Math.PI, sxp: 3.5e-4, syp: 2.8e-4, amp: 3.0, prx: 0.03, pry: 0.03 },
  { baseTop: '30%', baseLeft: '40%', sizeVw: 40, phase: Math.PI * 0.5, sxp: 2.2e-4, syp: 3.2e-4, amp: 2.5, prx: -0.025, pry: 0.025 },
] as const;

const NODE_COUNT = 45;
const CONNECT_DIST = 150;
const REPEL_DIST = 120;
const REPEL_FORCE = 0.8;

export function LivingBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const nodeCanvasRef = useRef<HTMLCanvasElement>(null);
  const rippleCanvasRef = useRef<HTMLCanvasElement>(null);

  const mouseNorm = useRef({ x: 0.5, y: 0.5 });
  const nodesRef = useRef<NodeParticle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafId = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 768;
    const nodeCount = mobile ? 25 : NODE_COUNT;
    const blobRefs = [blob1Ref, blob2Ref, blob3Ref];

    if (!reduced) {
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));
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
          rCtx.beginPath();
          rCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
          rCtx.strokeStyle = dark
            ? `rgba(147, 180, 255, ${rp.alpha})`
            : `rgba(37, 99, 235, ${rp.alpha})`;
          rCtx.lineWidth = 1.2;
          rCtx.stroke();
        }
      }

      if (!reduced && nCtx) {
        nCtx.clearRect(0, 0, w, h);
        const nodeRgb = dark ? '160,190,255' : '37,99,235';
        const cmx = mouseNorm.current.x * w;
        const cmy = mouseNorm.current.y * h;

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
          nCtx.fillStyle = `rgba(${nodeRgb}, ${dark ? 0.4 : 0.65})`;
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
              nCtx.strokeStyle = `rgba(${nodeRgb}, ${(1 - dist / CONNECT_DIST) * (dark ? 0.18 : 0.30)})`;
              nCtx.lineWidth = 0.8;
              nCtx.stroke();
            }
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
