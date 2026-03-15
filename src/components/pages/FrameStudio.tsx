import {
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  ChevronUp,
  Download,
  ImagePlus,
  Plus,
  Redo2,
  Trash2,
  Type,
  Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Preset = { label: string; width: number; height: number };

const PRESETS: Preset[] = [
  { label: 'Instagram Square (1080×1080)', width: 1080, height: 1080 },
  { label: 'Instagram Story (1080×1920)', width: 1080, height: 1920 },
  { label: 'Twitter/X Header (1500×500)', width: 1500, height: 500 },
  { label: 'YouTube Thumbnail (1280×720)', width: 1280, height: 720 },
  { label: 'OG Image (1200×630)', width: 1200, height: 630 },
  { label: 'Play Store Feature (1024×500)', width: 1024, height: 500 },
  { label: 'App Store Screenshot (1290×2796)', width: 1290, height: 2796 },
  { label: 'Custom', width: 800, height: 600 },
];

type FontFamily = 'Pretendard' | 'sans-serif' | 'serif' | 'monospace' | 'cursive';

type TextLayer = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  align: CanvasTextAlign;
  fontFamily: FontFamily;
  bold: boolean;
  italic: boolean;
  bgColor: string;
  strokeColor: string;
  strokeWidth: number;
};

type GradientType = 'linear' | 'radial';

type Background = {
  type: 'color' | 'gradient';
  color: string;
  gradientType: GradientType;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  image: string | null;
};

type OverlayImage = {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type EditorState = {
  presetIndex: number;
  customW: number;
  customH: number;
  background: Background;
  textLayers: TextLayer[];
  overlays: OverlayImage[];
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_BG: Background = {
  type: 'color',
  color: '#1e293b',
  gradientType: 'linear',
  gradientStart: '#1e293b',
  gradientEnd: '#0f172a',
  gradientAngle: 135,
  image: null,
};

const makeTextLayer = (): TextLayer => ({
  id: crypto.randomUUID(),
  text: '',
  x: 50,
  y: 50,
  fontSize: 5,
  color: '#ffffff',
  align: 'center',
  fontFamily: 'Pretendard',
  bold: true,
  italic: false,
  bgColor: '',
  strokeColor: '',
  strokeWidth: 2,
});

const INITIAL_STATE: EditorState = {
  presetIndex: 0,
  customW: 800,
  customH: 600,
  background: DEFAULT_BG,
  textLayers: [makeTextLayer()],
  overlays: [],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    const words = paragraph.split(' ');
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
};

// ─── SliderWithInput ──────────────────────────────────────────────────────────

const numInp = 'w-full shrink-0 border rounded px-1 py-0.5 text-xs text-center bg-background focus:outline-none focus:ring-1 focus:ring-foreground/30';

type SliderWithInputProps = {
  id: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  onCommit: (v: number) => void;
};

const SliderWithInput = ({ id, min, max, step = 1, value, onChange, onCommit }: SliderWithInputProps) => (
  <div className="space-y-1">
    <div className="flex justify-end">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Math.min(max, Math.max(min, Number(e.target.value)));
          onChange(v);
        }}
        onBlur={(e) => {
          const v = Math.min(max, Math.max(min, Number(e.target.value)));
          onCommit(v);
        }}
        className={numInp}
      />
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onMouseUp={(e) => onCommit(Number((e.target as HTMLInputElement).value))}
      className="w-full"
    />
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Content = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [state, setStateRaw] = useState<EditorState>(INITIAL_STATE);

  // ── History ──
  const historyRef = useRef<EditorState[]>([state]);
  const historyIdxRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = useCallback((next: EditorState) => {
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push(next);
    if (historyRef.current.length > 60) historyRef.current.shift();
    else historyIdxRef.current++;
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(false);
  }, []);

  // commit = setState + record history
  const commit = useCallback(
    (updater: EditorState | ((prev: EditorState) => EditorState)) => {
      setStateRaw((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const undo = useCallback(() => {
    if (historyIdxRef.current <= 0) return;
    historyIdxRef.current--;
    const s = historyRef.current[historyIdxRef.current];
    setStateRaw(s);
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(true);
  }, []);

  const redo = useCallback(() => {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current++;
    const s = historyRef.current[historyIdxRef.current];
    setStateRaw(s);
    setCanUndo(true);
    setCanRedo(historyIdxRef.current < historyRef.current.length - 1);
  }, []);

  // ── Selection ──
  const [selectedTextId, setSelectedTextId] = useState<string | null>(
    () => state.textLayers[0]?.id ?? null
  );
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

  // ── Export options ──
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [exportQuality, setExportQuality] = useState(92);
  const [exportScale, setExportScale] = useState(1);

  const { presetIndex, customW, customH, background, textLayers, overlays } = state;

  const preset = useMemo(
    () =>
      presetIndex < PRESETS.length - 1
        ? PRESETS[presetIndex]
        : { label: 'Custom', width: customW, height: customH },
    [presetIndex, customW, customH]
  );

  // ── Render canvas ──
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = preset.width;
    const H = preset.height;
    canvas.width = W;
    canvas.height = H;

    // Background
    if (background.image) {
      try {
        const img = await loadImage(background.image);
        ctx.drawImage(img, 0, 0, W, H);
      } catch {
        ctx.fillStyle = background.color;
        ctx.fillRect(0, 0, W, H);
      }
    } else if (background.type === 'gradient') {
      let gradient: CanvasGradient;
      if (background.gradientType === 'linear') {
        const angle = (background.gradientAngle * Math.PI) / 180;
        const cx = W / 2;
        const cy = H / 2;
        const len = Math.sqrt(W * W + H * H) / 2;
        gradient = ctx.createLinearGradient(
          cx - Math.cos(angle) * len,
          cy - Math.sin(angle) * len,
          cx + Math.cos(angle) * len,
          cy + Math.sin(angle) * len
        );
      } else {
        gradient = ctx.createRadialGradient(
          W / 2, H / 2, 0,
          W / 2, H / 2, Math.max(W, H) / 2
        );
      }
      gradient.addColorStop(0, background.gradientStart);
      gradient.addColorStop(1, background.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = background.color;
      ctx.fillRect(0, 0, W, H);
    }

    // Text layers
    for (const layer of textLayers) {
      if (!layer.text) continue;
      const scaledFontSize = (layer.fontSize / 100) * W;
      ctx.font = `${layer.italic ? 'italic ' : ''}${layer.bold ? 'bold ' : ''}${scaledFontSize}px ${layer.fontFamily}`;
      ctx.textAlign = layer.align;
      ctx.textBaseline = 'middle';

      const maxWidth = W * 0.9;
      const x = (layer.x / 100) * W;
      const y = (layer.y / 100) * H;
      const lines = wrapText(ctx, layer.text, maxWidth);
      const lineHeight = scaledFontSize * 1.3;
      const startY = y - ((lines.length - 1) / 2) * lineHeight;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const ly = startY + i * lineHeight;

        if (layer.bgColor) {
          const metrics = ctx.measureText(line);
          const tw = metrics.width;
          const th = scaledFontSize * 1.1;
          let bx = x;
          if (layer.align === 'center') bx = x - tw / 2;
          else if (layer.align === 'right') bx = x - tw;
          ctx.fillStyle = layer.bgColor;
          ctx.fillRect(bx - 8, ly - th / 2 - 4, tw + 16, th + 8);
        }

        if (layer.strokeColor && layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth = layer.strokeWidth * (W / 1000);
          ctx.lineJoin = 'round';
          ctx.strokeText(line, x, ly);
        }

        ctx.fillStyle = layer.color;
        ctx.fillText(line, x, ly);
      }
    }

    // Overlays
    for (const overlay of overlays) {
      if (!overlay.src) continue;
      try {
        const img = await loadImage(overlay.src);
        const w = (overlay.scale / 100) * W;
        const h = (img.height / img.width) * w;
        const x = (overlay.x / 100) * W;
        const y = (overlay.y / 100) * H;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((overlay.rotation * Math.PI) / 180);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();
      } catch {
        // skip
      }
    }
  }, [preset, background, textLayers, overlays]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      renderCanvas();
    });
    return () => cancelAnimationFrame(id);
  }, [renderCanvas]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  // ── Canvas drag ──
  const dragRef = useRef<{
    type: 'text' | 'overlay';
    id: string;
    startClientX: number;
    startClientY: number;
    startPctX: number;
    startPctY: number;
  } | null>(null);

  const clientToCanvasPct = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    };
  }, []);

  const handleCanvasMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement>) => {
      const { x, y } = clientToCanvasPct(e.clientX, e.clientY);

      // Check overlays (reversed = topmost first)
      for (const overlay of [...overlays].reverse()) {
        const dist = Math.sqrt((overlay.x - x) ** 2 + (overlay.y - y) ** 2);
        if (dist < 12) {
          setSelectedOverlayId(overlay.id);
          setSelectedTextId(null);
          dragRef.current = {
            type: 'overlay', id: overlay.id,
            startClientX: e.clientX, startClientY: e.clientY,
            startPctX: overlay.x, startPctY: overlay.y,
          };
          return;
        }
      }

      // Check text layers
      for (const layer of [...textLayers].reverse()) {
        if (!layer.text) continue;
        const dist = Math.sqrt((layer.x - x) ** 2 + (layer.y - y) ** 2);
        if (dist < 18) {
          setSelectedTextId(layer.id);
          setSelectedOverlayId(null);
          dragRef.current = {
            type: 'text', id: layer.id,
            startClientX: e.clientX, startClientY: e.clientY,
            startPctX: layer.x, startPctY: layer.y,
          };
          return;
        }
      }
    },
    [overlays, textLayers, clientToCanvasPct]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dx = ((e.clientX - drag.startClientX) / rect.width) * 100;
      const dy = ((e.clientY - drag.startClientY) / rect.height) * 100;
      const newX = Math.max(0, Math.min(100, drag.startPctX + dx));
      const newY = Math.max(0, Math.min(100, drag.startPctY + dy));

      if (drag.type === 'text') {
        setStateRaw((prev) => ({
          ...prev,
          textLayers: prev.textLayers.map((t) =>
            t.id === drag.id ? { ...t, x: newX, y: newY } : t
          ),
        }));
      } else {
        setStateRaw((prev) => ({
          ...prev,
          overlays: prev.overlays.map((o) =>
            o.id === drag.id ? { ...o, x: newX, y: newY } : o
          ),
        }));
      }
    };

    const onMouseUp = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      // commit current state to history after drag ends
      setStateRaw((prev) => {
        pushHistory(prev);
        return prev;
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [pushHistory]);

  // ── State helpers ──

  const updateBg = useCallback(
    (patch: Partial<Background>) =>
      commit((prev) => ({ ...prev, background: { ...prev.background, ...patch } })),
    [commit]
  );

  const addTextLayer = () => {
    const layer = makeTextLayer();
    commit((prev) => ({ ...prev, textLayers: [...prev.textLayers, layer] }));
    setSelectedTextId(layer.id);
    setSelectedOverlayId(null);
  };

  const removeTextLayer = (id: string) => {
    commit((prev) => ({ ...prev, textLayers: prev.textLayers.filter((t) => t.id !== id) }));
    setSelectedTextId(null);
  };

  // silent = no history (for live input like typing / slider drag)
  const patchText = (id: string, patch: Partial<TextLayer>) => {
    setStateRaw((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const commitText = (id: string, patch: Partial<TextLayer>) => {
    commit((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const moveTextLayer = (id: string, dir: 1 | -1) => {
    commit((prev) => {
      const idx = prev.textLayers.findIndex((t) => t.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.textLayers.length) return prev;
      const arr = [...prev.textLayers];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...prev, textLayers: arr };
    });
  };

  const handleOverlayAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const overlay: OverlayImage = {
        id: crypto.randomUUID(), src, x: 50, y: 50, scale: 30, rotation: 0,
      };
      commit((prev) => ({ ...prev, overlays: [...prev.overlays, overlay] }));
      setSelectedOverlayId(overlay.id);
      setSelectedTextId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const patchOverlay = (id: string, patch: Partial<OverlayImage>) => {
    setStateRaw((prev) => ({
      ...prev,
      overlays: prev.overlays.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  };

  const commitOverlay = (id: string, patch: Partial<OverlayImage>) => {
    commit((prev) => ({
      ...prev,
      overlays: prev.overlays.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  };

  const removeOverlay = (id: string) => {
    commit((prev) => ({ ...prev, overlays: prev.overlays.filter((o) => o.id !== id) }));
    setSelectedOverlayId(null);
  };

  const moveOverlay = (id: string, dir: 1 | -1) => {
    commit((prev) => {
      const idx = prev.overlays.findIndex((o) => o.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.overlays.length) return prev;
      const arr = [...prev.overlays];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...prev, overlays: arr };
    });
  };

  const handleBgImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateBg({ image: ev.target?.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mime = `image/${exportFormat}` as const;
    const quality = exportFormat === 'png' ? undefined : exportQuality / 100;

    let src: HTMLCanvasElement = canvas;
    if (exportScale !== 1) {
      const off = document.createElement('canvas');
      off.width = Math.round(canvas.width * exportScale);
      off.height = Math.round(canvas.height * exportScale);
      const ctx = off.getContext('2d');
      if (ctx) {
        ctx.scale(exportScale, exportScale);
        ctx.drawImage(canvas, 0, 0);
      }
      src = off;
    }

    const url = src.toDataURL(mime, quality);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frame-studio-${Date.now()}.${exportFormat === 'jpeg' ? 'jpg' : exportFormat}`;
    a.click();
  };

  const selectedText = textLayers.find((t) => t.id === selectedTextId);
  const selectedOverlay = overlays.find((o) => o.id === selectedOverlayId);

  // ── Styles ──
  const lbl = 'text-xs text-foreground/70';
  const sec = 'border rounded-xl p-4 space-y-3';
  const inp = 'w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20';
  const btn = 'flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-foreground/5';
  const active = 'bg-foreground text-background border-foreground';

  const toggleBtn = (on: boolean) =>
    cn('flex-1 border rounded-lg px-2 py-1.5 text-xs transition-colors', on ? active : 'hover:bg-foreground/5');

  // ── Render ──
  return (
    <div className="px-4 mt-12 pt-4 w-full max-w-6xl mx-auto pb-10">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button type="button" onClick={undo} disabled={!canUndo}
          title="실행취소 (Ctrl+Z)"
          className={cn(btn, !canUndo && 'opacity-40 cursor-not-allowed')}>
          <Undo2 size={14} /> 실행취소
        </button>
        <button type="button" onClick={redo} disabled={!canRedo}
          title="다시실행 (Ctrl+Shift+Z)"
          className={cn(btn, !canRedo && 'opacity-40 cursor-not-allowed')}>
          <Redo2 size={14} /> 다시실행
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar ── */}
        <aside className="lg:w-80 shrink-0 space-y-4">

          {/* Canvas size */}
          <section className={sec}>
            <h2 className="text-sm font-semibold">캔버스 크기</h2>
            <select
              value={presetIndex}
              onChange={(e) => commit((p) => ({ ...p, presetIndex: Number(e.target.value) }))}
              className={inp}
            >
              {PRESETS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
            </select>
            {presetIndex === PRESETS.length - 1 && (
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label htmlFor="customW" className={lbl}>Width (px)</label>
                  <input id="customW" type="number" min={1} value={customW}
                    onChange={(e) => setStateRaw((p) => ({ ...p, customW: Math.max(1, Number(e.target.value)) }))}
                    onBlur={(e) => commit((p) => ({ ...p, customW: Math.max(1, Number(e.target.value)) }))}
                    className={inp} />
                </div>
                <div className="flex-1 space-y-1">
                  <label htmlFor="customH" className={lbl}>Height (px)</label>
                  <input id="customH" type="number" min={1} value={customH}
                    onChange={(e) => setStateRaw((p) => ({ ...p, customH: Math.max(1, Number(e.target.value)) }))}
                    onBlur={(e) => commit((p) => ({ ...p, customH: Math.max(1, Number(e.target.value)) }))}
                    className={inp} />
                </div>
              </div>
            )}
          </section>

          {/* Background */}
          <section className={sec}>
            <h2 className="text-sm font-semibold">배경</h2>
            <div className="flex gap-2">
              {(['color', 'gradient'] as const).map((t) => (
                <button key={t} type="button" onClick={() => updateBg({ type: t })}
                  className={toggleBtn(background.type === t)}>
                  {t === 'color' ? '단색' : '그라디언트'}
                </button>
              ))}
            </div>

            {background.type === 'color' && (
              <div className="flex items-center gap-3">
                <label htmlFor="bgColor" className={lbl}>배경색</label>
                <input id="bgColor" type="color" value={background.color}
                  onChange={(e) => updateBg({ color: e.target.value })}
                  className="h-8 w-16 rounded cursor-pointer border p-0.5" />
              </div>
            )}

            {background.type === 'gradient' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {(['linear', 'radial'] as const).map((t) => (
                    <button key={t} type="button" onClick={() => updateBg({ gradientType: t })}
                      className={toggleBtn(background.gradientType === t)}>
                      {t === 'linear' ? '선형' : '방사형'}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className={lbl}>시작</span>
                    <input type="color" value={background.gradientStart}
                      onChange={(e) => updateBg({ gradientStart: e.target.value })}
                      className="h-8 w-12 rounded cursor-pointer border p-0.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={lbl}>끝</span>
                    <input type="color" value={background.gradientEnd}
                      onChange={(e) => updateBg({ gradientEnd: e.target.value })}
                      className="h-8 w-12 rounded cursor-pointer border p-0.5" />
                  </div>
                </div>
                {background.gradientType === 'linear' && (
                  <div className="space-y-1">
                    <label htmlFor="gradientAngle" className={lbl}>각도 (°)</label>
                    <SliderWithInput
                      id="gradientAngle"
                      min={0} max={360} value={background.gradientAngle}
                      onChange={(v) => updateBg({ gradientAngle: v })}
                      onCommit={(v) => updateBg({ gradientAngle: v })}
                    />
                  </div>
                )}
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 text-sm hover:bg-foreground/5 transition-colors">
              <ImagePlus size={15} />
              <span>배경 이미지 선택</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleBgImageChange} />
            </label>
            {background.image && (
              <button type="button" onClick={() => updateBg({ image: null })}
                className="text-xs text-red-500 hover:underline">
                배경 이미지 제거
              </button>
            )}
          </section>

          {/* Text layers */}
          <section className={sec}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">텍스트 레이어</h2>
              <button type="button" onClick={addTextLayer}
                className="flex items-center gap-1 text-xs border rounded-lg px-2 py-1 hover:bg-foreground/5 transition-colors">
                <Plus size={12} /> 추가
              </button>
            </div>

            <div className="space-y-1">
              {textLayers.map((layer, idx) => (
                <button
                  key={layer.id}
                  type="button"
                  className={cn(
                    'w-full flex items-center gap-2 border rounded-lg px-2 py-1.5 cursor-pointer transition-colors text-left',
                    selectedTextId === layer.id
                      ? 'bg-foreground/10 border-foreground/30'
                      : 'hover:bg-foreground/5'
                  )}
                  onClick={() => { setSelectedTextId(layer.id); setSelectedOverlayId(null); }}
                >
                  <Type size={12} className="shrink-0 opacity-40" />
                  <span className="text-xs flex-1 truncate">{layer.text || '(빈 텍스트)'}</span>
                  <div className="flex gap-0.5 shrink-0">
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveTextLayer(layer.id, -1); }}
                      disabled={idx === 0}
                      className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity">
                      <ChevronUp size={12} />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveTextLayer(layer.id, 1); }}
                      disabled={idx === textLayers.length - 1}
                      className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity">
                      <ChevronDown size={12} />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeTextLayer(layer.id); }}
                      className="p-0.5 text-red-500 hover:opacity-70 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </button>
              ))}
            </div>

            {selectedText && (
              <div className="border rounded-lg p-3 space-y-3 bg-foreground/5">
                <textarea
                  placeholder="텍스트를 입력하세요..."
                  value={selectedText.text}
                  onChange={(e) => patchText(selectedText.id, { text: e.target.value })}
                  onBlur={(e) => commitText(selectedText.id, { text: e.target.value })}
                  rows={3}
                  className={cn(inp, 'resize-none')}
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label htmlFor={`txtFont-${selectedText.id}`} className={lbl}>폰트</label>
                    <select id={`txtFont-${selectedText.id}`} value={selectedText.fontFamily}
                      onChange={(e) => commitText(selectedText.id, { fontFamily: e.target.value as FontFamily })}
                      className={inp}>
                      {(['Pretendard', 'sans-serif', 'serif', 'monospace', 'cursive'] as FontFamily[]).map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`txtColor-${selectedText.id}`} className={lbl}>글자 색</label>
                    <input id={`txtColor-${selectedText.id}`} type="color" value={selectedText.color}
                      onChange={(e) => commitText(selectedText.id, { color: e.target.value })}
                      className="h-9 w-full rounded cursor-pointer border p-0.5" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label htmlFor={`txtSize-${selectedText.id}`} className={lbl}>글자 크기 (%)</label>
                    <SliderWithInput
                      id={`txtSize-${selectedText.id}`}
                      min={1} max={20} value={selectedText.fontSize}
                      onChange={(v) => patchText(selectedText.id, { fontSize: v })}
                      onCommit={(v) => commitText(selectedText.id, { fontSize: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`txtX-${selectedText.id}`} className={lbl}>가로 위치 (%)</label>
                    <SliderWithInput
                      id={`txtX-${selectedText.id}`}
                      min={0} max={100} value={selectedText.x}
                      onChange={(v) => patchText(selectedText.id, { x: v })}
                      onCommit={(v) => commitText(selectedText.id, { x: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`txtY-${selectedText.id}`} className={lbl}>세로 위치 (%)</label>
                    <SliderWithInput
                      id={`txtY-${selectedText.id}`}
                      min={0} max={100} value={selectedText.y}
                      onChange={(v) => patchText(selectedText.id, { y: v })}
                      onCommit={(v) => commitText(selectedText.id, { y: v })}
                    />
                  </div>
                </div>

                {/* Style toggles */}
                <div className="flex gap-1.5">
                  <button type="button"
                    onClick={() => commitText(selectedText.id, { bold: !selectedText.bold })}
                    className={cn('flex-1 border rounded-lg px-2 py-1.5 text-xs font-bold transition-colors',
                      selectedText.bold ? active : 'hover:bg-foreground/5')}>
                    B
                  </button>
                  <button type="button"
                    onClick={() => commitText(selectedText.id, { italic: !selectedText.italic })}
                    className={cn('flex-1 border rounded-lg px-2 py-1.5 text-xs italic transition-colors',
                      selectedText.italic ? active : 'hover:bg-foreground/5')}>
                    I
                  </button>
                  {(['left', 'center', 'right'] as CanvasTextAlign[]).map((align, i) => (
                    <button key={align} type="button"
                      onClick={() => commitText(selectedText.id, { align })}
                      className={cn('flex-1 border rounded-lg px-2 py-1.5 text-xs transition-colors',
                        selectedText.align === align ? active : 'hover:bg-foreground/5')}>
                      {i === 0
                        ? <AlignLeft size={12} className="mx-auto" />
                        : i === 1
                          ? <AlignCenter size={12} className="mx-auto" />
                          : <AlignRight size={12} className="mx-auto" />}
                    </button>
                  ))}
                </div>

                {/* Text bg + stroke */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label htmlFor={`txtBgColor-${selectedText.id}`} className={lbl}>텍스트 배경</label>
                    <div className="flex gap-1">
                      <input id={`txtBgColor-${selectedText.id}`} type="color"
                        value={selectedText.bgColor || '#000000'}
                        onChange={(e) => commitText(selectedText.id, { bgColor: e.target.value })}
                        className="h-8 w-10 rounded cursor-pointer border p-0.5 shrink-0" />
                      <button type="button"
                        onClick={() => commitText(selectedText.id, { bgColor: selectedText.bgColor ? '' : '#000000' })}
                        className={cn('flex-1 text-xs border rounded-lg px-1.5 py-1 transition-colors',
                          selectedText.bgColor ? active : 'hover:bg-foreground/5')}>
                        {selectedText.bgColor ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`txtStroke-${selectedText.id}`} className={lbl}>외곽선</label>
                    <div className="flex gap-1">
                      <input id={`txtStroke-${selectedText.id}`} type="color"
                        value={selectedText.strokeColor || '#000000'}
                        onChange={(e) => commitText(selectedText.id, { strokeColor: e.target.value })}
                        className="h-8 w-10 rounded cursor-pointer border p-0.5 shrink-0" />
                      <button type="button"
                        onClick={() => commitText(selectedText.id, { strokeColor: selectedText.strokeColor ? '' : '#000000' })}
                        className={cn('flex-1 text-xs border rounded-lg px-1.5 py-1 transition-colors',
                          selectedText.strokeColor ? active : 'hover:bg-foreground/5')}>
                        {selectedText.strokeColor ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                  {selectedText.strokeColor && (
                    <div className="col-span-2 space-y-1">
                      <label htmlFor={`txtStrokeW-${selectedText.id}`} className={lbl}>외곽선 두께</label>
                      <SliderWithInput
                        id={`txtStrokeW-${selectedText.id}`}
                        min={1} max={20} value={selectedText.strokeWidth}
                        onChange={(v) => patchText(selectedText.id, { strokeWidth: v })}
                        onCommit={(v) => commitText(selectedText.id, { strokeWidth: v })}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Overlay images */}
          <section className={sec}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">오버레이 이미지</h2>
              <label className="flex items-center gap-1 text-xs border rounded-lg px-2 py-1 hover:bg-foreground/5 transition-colors cursor-pointer">
                <Plus size={12} /> 추가
                <input type="file" accept="image/*" className="hidden" onChange={handleOverlayAdd} />
              </label>
            </div>

            <div className="space-y-1">
              {overlays.map((overlay, idx) => (
                <button
                  key={overlay.id}
                  type="button"
                  className={cn(
                    'w-full flex items-center gap-2 border rounded-lg px-2 py-1.5 cursor-pointer transition-colors text-left',
                    selectedOverlayId === overlay.id
                      ? 'bg-foreground/10 border-foreground/30'
                      : 'hover:bg-foreground/5'
                  )}
                  onClick={() => { setSelectedOverlayId(overlay.id); setSelectedTextId(null); }}
                >
                  <ImagePlus size={12} className="shrink-0 opacity-40" />
                  <span className="text-xs flex-1">이미지 {idx + 1}</span>
                  <div className="flex gap-0.5 shrink-0">
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveOverlay(overlay.id, -1); }}
                      disabled={idx === 0}
                      className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity">
                      <ChevronUp size={12} />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveOverlay(overlay.id, 1); }}
                      disabled={idx === overlays.length - 1}
                      className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity">
                      <ChevronDown size={12} />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeOverlay(overlay.id); }}
                      className="p-0.5 text-red-500 hover:opacity-70 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </button>
              ))}
            </div>

            {selectedOverlay && (
              <div className="border rounded-lg p-3 space-y-2 bg-foreground/5">
                <div className="grid grid-cols-1 gap-2">
                  <div className="space-y-1">
                    <label htmlFor={`ovX-${selectedOverlay.id}`} className={lbl}>X 위치 (%)</label>
                    <SliderWithInput
                      id={`ovX-${selectedOverlay.id}`}
                      min={0} max={100} value={selectedOverlay.x}
                      onChange={(v) => patchOverlay(selectedOverlay.id, { x: v })}
                      onCommit={(v) => commitOverlay(selectedOverlay.id, { x: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`ovY-${selectedOverlay.id}`} className={lbl}>Y 위치 (%)</label>
                    <SliderWithInput
                      id={`ovY-${selectedOverlay.id}`}
                      min={0} max={100} value={selectedOverlay.y}
                      onChange={(v) => patchOverlay(selectedOverlay.id, { y: v })}
                      onCommit={(v) => commitOverlay(selectedOverlay.id, { y: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`ovScale-${selectedOverlay.id}`} className={lbl}>크기 (%)</label>
                    <SliderWithInput
                      id={`ovScale-${selectedOverlay.id}`}
                      min={5} max={100} value={selectedOverlay.scale}
                      onChange={(v) => patchOverlay(selectedOverlay.id, { scale: v })}
                      onCommit={(v) => commitOverlay(selectedOverlay.id, { scale: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`ovRot-${selectedOverlay.id}`} className={lbl}>회전 (°)</label>
                    <SliderWithInput
                      id={`ovRot-${selectedOverlay.id}`}
                      min={0} max={360} value={selectedOverlay.rotation}
                      onChange={(v) => patchOverlay(selectedOverlay.id, { rotation: v })}
                      onCommit={(v) => commitOverlay(selectedOverlay.id, { rotation: v })}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Export options */}
          <section className={sec}>
            <h2 className="text-sm font-semibold">내보내기 설정</h2>
            <div className="space-y-1">
              <span className={lbl}>포맷</span>
              <div className="flex gap-2">
                {(['png', 'jpeg', 'webp'] as const).map((f) => (
                  <button key={f} type="button" onClick={() => setExportFormat(f)}
                    className={toggleBtn(exportFormat === f)}>
                    {f === 'jpeg' ? 'jpg' : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {exportFormat !== 'png' && (
              <div className="space-y-1">
                <label htmlFor="exportQuality" className={lbl}>품질 (%)</label>
                <SliderWithInput
                  id="exportQuality"
                  min={10} max={100} value={exportQuality}
                  onChange={setExportQuality}
                  onCommit={setExportQuality}
                />
              </div>
            )}
            <div className="space-y-1">
              <span className={lbl}>출력 배율</span>
              <div className="flex gap-2">
                {([0.5, 1, 2] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setExportScale(s)}
                    className={toggleBtn(exportScale === s)}>
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </section>
        </aside>

        {/* Canvas preview */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <p className="text-xs text-foreground/50 text-center">
            캔버스에서 텍스트·이미지를 직접 드래그해 위치를 조정할 수 있습니다.
          </p>
          <div className="border rounded-xl overflow-hidden bg-foreground/5 flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              className="w-full h-auto block cursor-crosshair select-none"
              style={{ maxHeight: '70vh' }}
            />
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            <Download size={18} />
            이미지 다운로드
          </button>
        </div>
      </div>
    </div>
  );
};

export const FrameStudio = () => (
  <Suspense>
    <Content />
  </Suspense>
);
