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
  Copy,
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

type ImageFilter = {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  tintColor: string;
  tintOpacity: number;
};

type Frame = {
  id: string;
  state: EditorState;
  filter: ImageFilter;
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

const DEFAULT_FILTER: ImageFilter = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  tintColor: '#0066ff',
  tintOpacity: 0,
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

const makeFrame = (): Frame => ({
  id: crypto.randomUUID(),
  state: {
    presetIndex: 0,
    customW: 800,
    customH: 600,
    background: { ...DEFAULT_BG },
    textLayers: [makeTextLayer()],
    overlays: [],
  },
  filter: { ...DEFAULT_FILTER },
});

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

const renderFrameToCanvas = async (
  frame: Frame,
  targetWidth?: number,
  targetHeight?: number
): Promise<HTMLCanvasElement> => {
  const { state, filter } = frame;
  const preset =
    state.presetIndex < PRESETS.length - 1
      ? PRESETS[state.presetIndex]
      : { label: 'Custom', width: state.customW, height: state.customH };

  const W = targetWidth ?? preset.width;
  const H = targetHeight ?? preset.height;

  // Render scene at target size (all units are %-based so they scale correctly)
  const scene = document.createElement('canvas');
  scene.width = W;
  scene.height = H;
  const ctx = scene.getContext('2d');
  if (!ctx) return scene;

  const { background, textLayers, overlays } = state;

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
      gradient = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) / 2);
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

  // Overlay images
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

  // Apply filters via CSS filter
  const filterParts = [
    `brightness(${filter.brightness}%)`,
    `contrast(${filter.contrast}%)`,
    `saturate(${filter.saturation}%)`,
    `hue-rotate(${filter.hue}deg)`,
    filter.blur > 0 ? `blur(${filter.blur}px)` : '',
  ].filter(Boolean);

  const isDefaultFilter =
    filter.brightness === 100 &&
    filter.contrast === 100 &&
    filter.saturation === 100 &&
    filter.hue === 0 &&
    filter.blur === 0 &&
    filter.tintOpacity === 0;

  if (isDefaultFilter) return scene;

  const output = document.createElement('canvas');
  output.width = W;
  output.height = H;
  const outCtx = output.getContext('2d');
  if (!outCtx) return scene;

  outCtx.filter = filterParts.join(' ') || 'none';
  outCtx.drawImage(scene, 0, 0);
  outCtx.filter = 'none';

  // Color tint overlay
  if (filter.tintOpacity > 0) {
    outCtx.globalAlpha = filter.tintOpacity / 100;
    outCtx.fillStyle = filter.tintColor;
    outCtx.fillRect(0, 0, W, H);
    outCtx.globalAlpha = 1;
  }

  return output;
};

// ─── SliderWithInput ──────────────────────────────────────────────────────────

const numInp =
  'w-full shrink-0 border rounded px-1 py-0.5 text-xs text-center bg-background focus:outline-none focus:ring-1 focus:ring-foreground/30';

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
      onTouchEnd={(e) => onCommit(Number((e.target as HTMLInputElement).value))}
      className="w-full"
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Content = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<Frame[]>([]);

  const [frames, setFramesRaw] = useState<Frame[]>(() => [makeFrame()]);
  const [activeFrameIdx, setActiveFrameIdx] = useState(0);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  // Keep framesRef in sync for use in effects without stale closures
  useEffect(() => {
    framesRef.current = frames;
  }, [frames]);

  // ── History ──
  const historyRef = useRef<Frame[][]>([]);
  const historyIdxRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = useCallback((next: Frame[]) => {
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push(next);
    if (historyRef.current.length > 60) historyRef.current.shift();
    else historyIdxRef.current++;
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(false);
  }, []);

  // commit = setState + push history
  const setFrames = useCallback(
    (updater: Frame[] | ((prev: Frame[]) => Frame[])) => {
      setFramesRaw((prev) => {
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
    setFramesRaw(s);
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(true);
  }, []);

  const redo = useCallback(() => {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current++;
    const s = historyRef.current[historyIdxRef.current];
    setFramesRaw(s);
    setCanUndo(true);
    setCanRedo(historyIdxRef.current < historyRef.current.length - 1);
  }, []);

  // Initialize history with initial state
  useEffect(() => {
    if (historyIdxRef.current === -1) {
      pushHistory(framesRef.current);
    }
  }, [pushHistory]);

  // ── Active frame ──
  const safeIdx = Math.min(activeFrameIdx, frames.length - 1);
  const activeFrame = frames[safeIdx];
  const { state, filter } = activeFrame;
  const { presetIndex, customW, customH, background, textLayers, overlays } = state;

  const preset = useMemo(
    () =>
      presetIndex < PRESETS.length - 1
        ? PRESETS[presetIndex]
        : { label: 'Custom', width: customW, height: customH },
    [presetIndex, customW, customH]
  );

  // ── Helpers for active frame state ──
  const commitState = useCallback(
    (updater: EditorState | ((prev: EditorState) => EditorState)) => {
      setFrames((prevFrames) => {
        const idx = Math.min(activeFrameIdx, prevFrames.length - 1);
        const prevState = prevFrames[idx].state;
        const nextState = typeof updater === 'function' ? updater(prevState) : updater;
        const updated = [...prevFrames];
        updated[idx] = { ...updated[idx], state: nextState };
        return updated;
      });
    },
    [setFrames, activeFrameIdx]
  );

  const patchStateRaw = useCallback(
    (updater: (prev: EditorState) => EditorState) => {
      setFramesRaw((prevFrames) => {
        const idx = Math.min(activeFrameIdx, prevFrames.length - 1);
        const nextState = updater(prevFrames[idx].state);
        const updated = [...prevFrames];
        updated[idx] = { ...updated[idx], state: nextState };
        return updated;
      });
    },
    [activeFrameIdx]
  );

  const commitFilter = useCallback(
    (patch: Partial<ImageFilter>) => {
      setFrames((prevFrames) => {
        const idx = Math.min(activeFrameIdx, prevFrames.length - 1);
        const updated = [...prevFrames];
        updated[idx] = { ...updated[idx], filter: { ...updated[idx].filter, ...patch } };
        return updated;
      });
    },
    [setFrames, activeFrameIdx]
  );

  const patchFilterRaw = useCallback(
    (patch: Partial<ImageFilter>) => {
      setFramesRaw((prevFrames) => {
        const idx = Math.min(activeFrameIdx, prevFrames.length - 1);
        const updated = [...prevFrames];
        updated[idx] = { ...updated[idx], filter: { ...updated[idx].filter, ...patch } };
        return updated;
      });
    },
    [activeFrameIdx]
  );

  // ── Render main canvas ──
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = preset.width;
    canvas.height = preset.height;
    const rendered = await renderFrameToCanvas(activeFrame, preset.width, preset.height);
    ctx.drawImage(rendered, 0, 0);
  }, [activeFrame, preset]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      renderCanvas();
    });
    return () => cancelAnimationFrame(id);
  }, [renderCanvas]);

  // ── Thumbnails ──
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      for (const frame of frames) {
        if (cancelled) break;
        try {
          const p =
            frame.state.presetIndex < PRESETS.length - 1
              ? PRESETS[frame.state.presetIndex]
              : { label: 'Custom', width: frame.state.customW, height: frame.state.customH };
          const THUMB_MAX = 160;
          const scale = THUMB_MAX / Math.max(p.width, p.height);
          const tw = Math.max(40, Math.round(p.width * scale));
          const th = Math.max(30, Math.round(p.height * scale));
          const rendered = await renderFrameToCanvas(frame, tw, th);
          const url = rendered.toDataURL('image/jpeg', 0.7);
          if (!cancelled) {
            setThumbnails((prev) => ({ ...prev, [frame.id]: url }));
          }
        } catch {
          // skip
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [frames]);

  // ── Selection ──
  const [selectedTextId, setSelectedTextId] = useState<string | null>(
    () => frames[0]?.state.textLayers[0]?.id ?? null
  );
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

  // switchToFrame: frame index 변경 + selection 초기화를 이벤트 핸들러에서 처리
  const switchToFrame = useCallback((idx: number, targetFrames?: Frame[]) => {
    setActiveFrameIdx(idx);
    const list = targetFrames ?? framesRef.current;
    const safeI = Math.min(idx, list.length - 1);
    setSelectedTextId(list[safeI]?.state.textLayers[0]?.id ?? null);
    setSelectedOverlayId(null);
  }, []);

  // ── Export ──
  const [projectName, setProjectName] = useState('');
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [exportQuality, setExportQuality] = useState(92);
  const [exportScale, setExportScale] = useState(1);

  const makeFileName = (index: number, ext: string) => {
    const base = projectName.trim() || 'frame-studio';
    return `${base}-${index}.${ext}`;
  };

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

      for (const overlay of [...overlays].reverse()) {
        const dist = Math.sqrt((overlay.x - x) ** 2 + (overlay.y - y) ** 2);
        if (dist < 12) {
          setSelectedOverlayId(overlay.id);
          setSelectedTextId(null);
          dragRef.current = {
            type: 'overlay',
            id: overlay.id,
            startClientX: e.clientX,
            startClientY: e.clientY,
            startPctX: overlay.x,
            startPctY: overlay.y,
          };
          return;
        }
      }

      for (const layer of [...textLayers].reverse()) {
        if (!layer.text) continue;
        const dist = Math.sqrt((layer.x - x) ** 2 + (layer.y - y) ** 2);
        if (dist < 18) {
          setSelectedTextId(layer.id);
          setSelectedOverlayId(null);
          dragRef.current = {
            type: 'text',
            id: layer.id,
            startClientX: e.clientX,
            startClientY: e.clientY,
            startPctX: layer.x,
            startPctY: layer.y,
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
        patchStateRaw((prev) => ({
          ...prev,
          textLayers: prev.textLayers.map((t) =>
            t.id === drag.id ? { ...t, x: newX, y: newY } : t
          ),
        }));
      } else {
        patchStateRaw((prev) => ({
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
      setFramesRaw((prev) => {
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
  }, [patchStateRaw, pushHistory]);

  // ── Background helpers ──
  const updateBg = useCallback(
    (patch: Partial<Background>) =>
      commitState((prev) => ({ ...prev, background: { ...prev.background, ...patch } })),
    [commitState]
  );

  // ── Text helpers ──
  const addTextLayer = () => {
    const layer = makeTextLayer();
    commitState((prev) => ({ ...prev, textLayers: [...prev.textLayers, layer] }));
    setSelectedTextId(layer.id);
    setSelectedOverlayId(null);
  };

  const removeTextLayer = (id: string) => {
    commitState((prev) => ({ ...prev, textLayers: prev.textLayers.filter((t) => t.id !== id) }));
    setSelectedTextId(null);
  };

  const patchText = (id: string, patch: Partial<TextLayer>) => {
    patchStateRaw((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const commitText = (id: string, patch: Partial<TextLayer>) => {
    commitState((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const moveTextLayer = (id: string, dir: 1 | -1) => {
    commitState((prev) => {
      const idx = prev.textLayers.findIndex((t) => t.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.textLayers.length) return prev;
      const arr = [...prev.textLayers];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...prev, textLayers: arr };
    });
  };

  // ── Overlay helpers ──
  const handleOverlayAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const overlay: OverlayImage = {
        id: crypto.randomUUID(),
        src,
        x: 50,
        y: 50,
        scale: 30,
        rotation: 0,
      };
      commitState((prev) => ({ ...prev, overlays: [...prev.overlays, overlay] }));
      setSelectedOverlayId(overlay.id);
      setSelectedTextId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const patchOverlay = (id: string, patch: Partial<OverlayImage>) => {
    patchStateRaw((prev) => ({
      ...prev,
      overlays: prev.overlays.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  };

  const commitOverlay = (id: string, patch: Partial<OverlayImage>) => {
    commitState((prev) => ({
      ...prev,
      overlays: prev.overlays.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  };

  const removeOverlay = (id: string) => {
    commitState((prev) => ({ ...prev, overlays: prev.overlays.filter((o) => o.id !== id) }));
    setSelectedOverlayId(null);
  };

  const moveOverlay = (id: string, dir: 1 | -1) => {
    commitState((prev) => {
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

  // ── Frame management ──
  const addFrame = () => {
    const frame = makeFrame();
    const newFrames = [...frames, frame];
    setFrames(newFrames);
    switchToFrame(newFrames.length - 1, newFrames);
  };

  const duplicateFrame = (idx: number) => {
    const src = frames[idx];
    const newFrame: Frame = {
      id: crypto.randomUUID(),
      state: JSON.parse(JSON.stringify(src.state)) as EditorState,
      filter: { ...src.filter },
    };
    const newFrames = [...frames];
    newFrames.splice(idx + 1, 0, newFrame);
    setFrames(newFrames);
    switchToFrame(idx + 1, newFrames);
  };

  const removeFrame = (idx: number) => {
    if (frames.length <= 1) return;
    const newFrames = frames.filter((_, i) => i !== idx);
    const newIdx = Math.min(safeIdx >= idx && safeIdx > 0 ? safeIdx - 1 : safeIdx, newFrames.length - 1);
    setFrames(newFrames);
    switchToFrame(newIdx, newFrames);
  };

  // ── Download ──
  const handleDownload = async () => {
    const W = Math.round(preset.width * exportScale);
    const H = Math.round(preset.height * exportScale);
    const canvas = await renderFrameToCanvas(activeFrame, W, H);
    const mime = `image/${exportFormat}` as const;
    const quality = exportFormat === 'png' ? undefined : exportQuality / 100;
    const url = canvas.toDataURL(mime, quality);
    const a = document.createElement('a');
    a.href = url;
    a.download = makeFileName(safeIdx + 1, exportFormat === 'jpeg' ? 'jpg' : exportFormat);
    a.click();
  };

  const handleDownloadAll = async () => {
    const mime = `image/${exportFormat}` as const;
    const quality = exportFormat === 'png' ? undefined : exportQuality / 100;
    const ext = exportFormat === 'jpeg' ? 'jpg' : exportFormat;

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const fp =
        frame.state.presetIndex < PRESETS.length - 1
          ? PRESETS[frame.state.presetIndex]
          : { label: 'Custom', width: frame.state.customW, height: frame.state.customH };
      const W = Math.round(fp.width * exportScale);
      const H = Math.round(fp.height * exportScale);
      const canvas = await renderFrameToCanvas(frame, W, H);
      const url = canvas.toDataURL(mime, quality);
      const a = document.createElement('a');
      a.href = url;
      a.download = makeFileName(i + 1, ext);
      a.click();
      await new Promise<void>((resolve) => setTimeout(resolve, 250));
    }
  };

  const selectedText = textLayers.find((t) => t.id === selectedTextId);
  const selectedOverlay = overlays.find((o) => o.id === selectedOverlayId);

  // ── Style shortcuts ──
  const lbl = 'text-xs text-foreground/70';
  const sec = 'border rounded-xl p-4 space-y-3';
  const inp =
    'w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20';
  const btn =
    'flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-foreground/5';
  const active = 'bg-foreground text-background border-foreground';
  const toggleBtn = (on: boolean) =>
    cn(
      'flex-1 border rounded-lg px-2 py-1.5 text-xs transition-colors',
      on ? active : 'hover:bg-foreground/5'
    );

  // ── Render ──
  return (
    <div className="px-4 mt-12 pt-4 w-full max-w-6xl mx-auto pb-10">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          title="실행취소 (Ctrl+Z)"
          className={cn(btn, !canUndo && 'opacity-40 cursor-not-allowed')}
        >
          <Undo2 size={14} /> 실행취소
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          title="다시실행 (Ctrl+Shift+Z)"
          className={cn(btn, !canRedo && 'opacity-40 cursor-not-allowed')}
        >
          <Redo2 size={14} /> 다시실행
        </button>
        <span className="text-xs text-foreground/40 ml-1">
          {safeIdx + 1} / {frames.length} 프레임
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar ── */}
        <aside className="lg:w-80 shrink-0 space-y-4">
          {/* Canvas size */}
          <section className={sec}>
            <h2 className="text-sm font-semibold">캔버스 크기</h2>
            <select
              value={presetIndex}
              onChange={(e) => commitState((p) => ({ ...p, presetIndex: Number(e.target.value) }))}
              className={inp}
            >
              {PRESETS.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ))}
            </select>
            {presetIndex === PRESETS.length - 1 && (
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label htmlFor="customW" className={lbl}>
                    Width (px)
                  </label>
                  <input
                    id="customW"
                    type="number"
                    min={1}
                    value={customW}
                    onChange={(e) =>
                      patchStateRaw((p) => ({ ...p, customW: Math.max(1, Number(e.target.value)) }))
                    }
                    onBlur={(e) =>
                      commitState((p) => ({ ...p, customW: Math.max(1, Number(e.target.value)) }))
                    }
                    className={inp}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label htmlFor="customH" className={lbl}>
                    Height (px)
                  </label>
                  <input
                    id="customH"
                    type="number"
                    min={1}
                    value={customH}
                    onChange={(e) =>
                      patchStateRaw((p) => ({ ...p, customH: Math.max(1, Number(e.target.value)) }))
                    }
                    onBlur={(e) =>
                      commitState((p) => ({ ...p, customH: Math.max(1, Number(e.target.value)) }))
                    }
                    className={inp}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Background */}
          <section className={sec}>
            <h2 className="text-sm font-semibold">배경</h2>
            <div className="flex gap-2">
              {(['color', 'gradient'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateBg({ type: t })}
                  className={toggleBtn(background.type === t)}
                >
                  {t === 'color' ? '단색' : '그라디언트'}
                </button>
              ))}
            </div>

            {background.type === 'color' && (
              <div className="flex items-center gap-3">
                <label htmlFor="bgColor" className={lbl}>
                  배경색
                </label>
                <input
                  id="bgColor"
                  type="color"
                  value={background.color}
                  onChange={(e) => updateBg({ color: e.target.value })}
                  className="h-8 w-16 rounded cursor-pointer border p-0.5"
                />
              </div>
            )}

            {background.type === 'gradient' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {(['linear', 'radial'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateBg({ gradientType: t })}
                      className={toggleBtn(background.gradientType === t)}
                    >
                      {t === 'linear' ? '선형' : '방사형'}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className={lbl}>시작</span>
                    <input
                      type="color"
                      value={background.gradientStart}
                      onChange={(e) => updateBg({ gradientStart: e.target.value })}
                      className="h-8 w-12 rounded cursor-pointer border p-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={lbl}>끝</span>
                    <input
                      type="color"
                      value={background.gradientEnd}
                      onChange={(e) => updateBg({ gradientEnd: e.target.value })}
                      className="h-8 w-12 rounded cursor-pointer border p-0.5"
                    />
                  </div>
                </div>
                {background.gradientType === 'linear' && (
                  <div className="space-y-1">
                    <label htmlFor="gradientAngle" className={lbl}>
                      각도 (°)
                    </label>
                    <SliderWithInput
                      id="gradientAngle"
                      min={0}
                      max={360}
                      value={background.gradientAngle}
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
              <button
                type="button"
                onClick={() => updateBg({ image: null })}
                className="text-xs text-red-500 hover:underline"
              >
                배경 이미지 제거
              </button>
            )}
          </section>

          {/* Filter */}
          <section className={sec}>
            <h2 className="text-sm font-semibold">필터</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="fBrightness" className={lbl}>
                  밝기 ({filter.brightness}%)
                </label>
                <SliderWithInput
                  id="fBrightness"
                  min={0}
                  max={200}
                  value={filter.brightness}
                  onChange={(v) => patchFilterRaw({ brightness: v })}
                  onCommit={(v) => commitFilter({ brightness: v })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="fContrast" className={lbl}>
                  대비 ({filter.contrast}%)
                </label>
                <SliderWithInput
                  id="fContrast"
                  min={0}
                  max={200}
                  value={filter.contrast}
                  onChange={(v) => patchFilterRaw({ contrast: v })}
                  onCommit={(v) => commitFilter({ contrast: v })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="fSaturation" className={lbl}>
                  채도 ({filter.saturation}%)
                </label>
                <SliderWithInput
                  id="fSaturation"
                  min={0}
                  max={200}
                  value={filter.saturation}
                  onChange={(v) => patchFilterRaw({ saturation: v })}
                  onCommit={(v) => commitFilter({ saturation: v })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="fHue" className={lbl}>
                  색조 ({filter.hue}°)
                </label>
                <SliderWithInput
                  id="fHue"
                  min={0}
                  max={360}
                  value={filter.hue}
                  onChange={(v) => patchFilterRaw({ hue: v })}
                  onCommit={(v) => commitFilter({ hue: v })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="fBlur" className={lbl}>
                  블러 ({filter.blur}px)
                </label>
                <SliderWithInput
                  id="fBlur"
                  min={0}
                  max={20}
                  value={filter.blur}
                  onChange={(v) => patchFilterRaw({ blur: v })}
                  onCommit={(v) => commitFilter({ blur: v })}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={lbl}>컬러 틴트 오버레이</span>
                  <input
                    type="color"
                    value={filter.tintColor}
                    onChange={(e) => commitFilter({ tintColor: e.target.value })}
                    className="h-7 w-10 rounded cursor-pointer border p-0.5"
                  />
                </div>
                <SliderWithInput
                  id="fTintOpacity"
                  min={0}
                  max={100}
                  value={filter.tintOpacity}
                  onChange={(v) => patchFilterRaw({ tintOpacity: v })}
                  onCommit={(v) => commitFilter({ tintOpacity: v })}
                />
              </div>
              <button
                type="button"
                onClick={() => commitFilter({ ...DEFAULT_FILTER })}
                className={cn(btn, 'w-full justify-center')}
              >
                필터 초기화
              </button>
            </div>
          </section>

          {/* Text layers */}
          <section className={sec}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">텍스트 레이어</h2>
              <button
                type="button"
                onClick={addTextLayer}
                className="flex items-center gap-1 text-xs border rounded-lg px-2 py-1 hover:bg-foreground/5 transition-colors"
              >
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
                  onClick={() => {
                    setSelectedTextId(layer.id);
                    setSelectedOverlayId(null);
                  }}
                >
                  <Type size={12} className="shrink-0 opacity-40" />
                  <span className="text-xs flex-1 truncate">{layer.text || '(빈 텍스트)'}</span>
                  <div className="flex gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTextLayer(layer.id, -1);
                      }}
                      disabled={idx === 0}
                      className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTextLayer(layer.id, 1);
                      }}
                      disabled={idx === textLayers.length - 1}
                      className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity"
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTextLayer(layer.id);
                      }}
                      className="p-0.5 text-red-500 hover:opacity-70 transition-opacity"
                    >
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
                    <label htmlFor={`txtFont-${selectedText.id}`} className={lbl}>
                      폰트
                    </label>
                    <select
                      id={`txtFont-${selectedText.id}`}
                      value={selectedText.fontFamily}
                      onChange={(e) =>
                        commitText(selectedText.id, { fontFamily: e.target.value as FontFamily })
                      }
                      className={inp}
                    >
                      {(['Pretendard', 'sans-serif', 'serif', 'monospace', 'cursive'] as FontFamily[]).map(
                        (f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`txtColor-${selectedText.id}`} className={lbl}>
                      글자 색
                    </label>
                    <input
                      id={`txtColor-${selectedText.id}`}
                      type="color"
                      value={selectedText.color}
                      onChange={(e) => commitText(selectedText.id, { color: e.target.value })}
                      className="h-9 w-full rounded cursor-pointer border p-0.5"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label htmlFor={`txtSize-${selectedText.id}`} className={lbl}>
                      글자 크기 (%)
                    </label>
                    <SliderWithInput
                      id={`txtSize-${selectedText.id}`}
                      min={1}
                      max={20}
                      value={selectedText.fontSize}
                      onChange={(v) => patchText(selectedText.id, { fontSize: v })}
                      onCommit={(v) => commitText(selectedText.id, { fontSize: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`txtX-${selectedText.id}`} className={lbl}>
                      가로 위치 (%)
                    </label>
                    <SliderWithInput
                      id={`txtX-${selectedText.id}`}
                      min={0}
                      max={100}
                      value={selectedText.x}
                      onChange={(v) => patchText(selectedText.id, { x: v })}
                      onCommit={(v) => commitText(selectedText.id, { x: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`txtY-${selectedText.id}`} className={lbl}>
                      세로 위치 (%)
                    </label>
                    <SliderWithInput
                      id={`txtY-${selectedText.id}`}
                      min={0}
                      max={100}
                      value={selectedText.y}
                      onChange={(v) => patchText(selectedText.id, { y: v })}
                      onCommit={(v) => commitText(selectedText.id, { y: v })}
                    />
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => commitText(selectedText.id, { bold: !selectedText.bold })}
                    className={cn(
                      'flex-1 border rounded-lg px-2 py-1.5 text-xs font-bold transition-colors',
                      selectedText.bold ? active : 'hover:bg-foreground/5'
                    )}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => commitText(selectedText.id, { italic: !selectedText.italic })}
                    className={cn(
                      'flex-1 border rounded-lg px-2 py-1.5 text-xs italic transition-colors',
                      selectedText.italic ? active : 'hover:bg-foreground/5'
                    )}
                  >
                    I
                  </button>
                  {(['left', 'center', 'right'] as CanvasTextAlign[]).map((align, i) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => commitText(selectedText.id, { align })}
                      className={cn(
                        'flex-1 border rounded-lg px-2 py-1.5 text-xs transition-colors',
                        selectedText.align === align ? active : 'hover:bg-foreground/5'
                      )}
                    >
                      {i === 0 ? (
                        <AlignLeft size={12} className="mx-auto" />
                      ) : i === 1 ? (
                        <AlignCenter size={12} className="mx-auto" />
                      ) : (
                        <AlignRight size={12} className="mx-auto" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label htmlFor={`txtBgColor-${selectedText.id}`} className={lbl}>
                      텍스트 배경
                    </label>
                    <div className="flex gap-1">
                      <input
                        id={`txtBgColor-${selectedText.id}`}
                        type="color"
                        value={selectedText.bgColor || '#000000'}
                        onChange={(e) => commitText(selectedText.id, { bgColor: e.target.value })}
                        className="h-8 w-10 rounded cursor-pointer border p-0.5 shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          commitText(selectedText.id, {
                            bgColor: selectedText.bgColor ? '' : '#000000',
                          })
                        }
                        className={cn(
                          'flex-1 text-xs border rounded-lg px-1.5 py-1 transition-colors',
                          selectedText.bgColor ? active : 'hover:bg-foreground/5'
                        )}
                      >
                        {selectedText.bgColor ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`txtStroke-${selectedText.id}`} className={lbl}>
                      외곽선
                    </label>
                    <div className="flex gap-1">
                      <input
                        id={`txtStroke-${selectedText.id}`}
                        type="color"
                        value={selectedText.strokeColor || '#000000'}
                        onChange={(e) =>
                          commitText(selectedText.id, { strokeColor: e.target.value })
                        }
                        className="h-8 w-10 rounded cursor-pointer border p-0.5 shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          commitText(selectedText.id, {
                            strokeColor: selectedText.strokeColor ? '' : '#000000',
                          })
                        }
                        className={cn(
                          'flex-1 text-xs border rounded-lg px-1.5 py-1 transition-colors',
                          selectedText.strokeColor ? active : 'hover:bg-foreground/5'
                        )}
                      >
                        {selectedText.strokeColor ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                  {selectedText.strokeColor && (
                    <div className="col-span-2 space-y-1">
                      <label htmlFor={`txtStrokeW-${selectedText.id}`} className={lbl}>
                        외곽선 두께
                      </label>
                      <SliderWithInput
                        id={`txtStrokeW-${selectedText.id}`}
                        min={1}
                        max={20}
                        value={selectedText.strokeWidth}
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
                  onClick={() => {
                    setSelectedOverlayId(overlay.id);
                    setSelectedTextId(null);
                  }}
                >
                  <ImagePlus size={12} className="shrink-0 opacity-40" />
                  <span className="text-xs flex-1">이미지 {idx + 1}</span>
                  <div className="flex gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveOverlay(overlay.id, -1);
                      }}
                      disabled={idx === 0}
                      className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveOverlay(overlay.id, 1);
                      }}
                      disabled={idx === overlays.length - 1}
                      className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity"
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOverlay(overlay.id);
                      }}
                      className="p-0.5 text-red-500 hover:opacity-70 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </button>
              ))}
            </div>

            {selectedOverlay && (
              <div className="border rounded-lg p-3 space-y-2 bg-foreground/5">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label htmlFor={`ovX-${selectedOverlay.id}`} className={lbl}>
                      X 위치 (%)
                    </label>
                    <SliderWithInput
                      id={`ovX-${selectedOverlay.id}`}
                      min={0}
                      max={100}
                      value={selectedOverlay.x}
                      onChange={(v) => patchOverlay(selectedOverlay.id, { x: v })}
                      onCommit={(v) => commitOverlay(selectedOverlay.id, { x: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`ovY-${selectedOverlay.id}`} className={lbl}>
                      Y 위치 (%)
                    </label>
                    <SliderWithInput
                      id={`ovY-${selectedOverlay.id}`}
                      min={0}
                      max={100}
                      value={selectedOverlay.y}
                      onChange={(v) => patchOverlay(selectedOverlay.id, { y: v })}
                      onCommit={(v) => commitOverlay(selectedOverlay.id, { y: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`ovScale-${selectedOverlay.id}`} className={lbl}>
                      크기 (%)
                    </label>
                    <SliderWithInput
                      id={`ovScale-${selectedOverlay.id}`}
                      min={5}
                      max={100}
                      value={selectedOverlay.scale}
                      onChange={(v) => patchOverlay(selectedOverlay.id, { scale: v })}
                      onCommit={(v) => commitOverlay(selectedOverlay.id, { scale: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`ovRot-${selectedOverlay.id}`} className={lbl}>
                      회전 (°)
                    </label>
                    <SliderWithInput
                      id={`ovRot-${selectedOverlay.id}`}
                      min={0}
                      max={360}
                      value={selectedOverlay.rotation}
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
              <label htmlFor="projectName" className={lbl}>
                프로젝트명
              </label>
              <input
                id="projectName"
                type="text"
                placeholder="frame-studio"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={inp}
              />
              <p className={`${lbl} opacity-60`}>
                파일명: {projectName.trim() || 'frame-studio'}-1.{exportFormat === 'jpeg' ? 'jpg' : exportFormat}
              </p>
            </div>
            <div className="space-y-1">
              <span className={lbl}>포맷</span>
              <div className="flex gap-2">
                {(['png', 'jpeg', 'webp'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setExportFormat(f)}
                    className={toggleBtn(exportFormat === f)}
                  >
                    {f === 'jpeg' ? 'jpg' : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {exportFormat !== 'png' && (
              <div className="space-y-1">
                <label htmlFor="exportQuality" className={lbl}>
                  품질 (%)
                </label>
                <SliderWithInput
                  id="exportQuality"
                  min={10}
                  max={100}
                  value={exportQuality}
                  onChange={setExportQuality}
                  onCommit={setExportQuality}
                />
              </div>
            )}
            <div className="space-y-1">
              <span className={lbl}>출력 배율</span>
              <div className="flex gap-2">
                {([0.5, 1, 2] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setExportScale(s)}
                    className={toggleBtn(exportScale === s)}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </section>
        </aside>

        {/* ── Canvas + Slide strip ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <p className="text-xs text-foreground/50 text-center">
            캔버스에서 텍스트·이미지를 직접 드래그해 위치를 조정할 수 있습니다.
          </p>

          {/* Canvas preview */}
          <div className="border rounded-xl overflow-hidden bg-foreground/5 flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              className="w-full h-auto block cursor-crosshair select-none"
              style={{ maxHeight: '60vh' }}
            />
          </div>

          {/* Slide strip */}
          <div className="border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">
                프레임 ({frames.length})
              </span>
              <button type="button" onClick={addFrame} className={cn(btn)}>
                <Plus size={12} /> 프레임 추가
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {frames.map((frame, idx) => (
                <div
                  key={frame.id}
                  className={cn(
                    'relative shrink-0 rounded-lg overflow-hidden border-2 transition-all bg-foreground/10',
                    idx === safeIdx
                      ? 'border-foreground shadow-md'
                      : 'border-transparent hover:border-foreground/40'
                  )}
                  style={{ width: 96, height: 72 }}
                >
                  {/* Select button covers the whole area */}
                  <button
                    type="button"
                    aria-label={`프레임 ${idx + 1} 선택`}
                    onClick={() => switchToFrame(idx)}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                  >
                    {thumbnails[frame.id] ? (
                      <img
                        src={thumbnails[frame.id]}
                        alt={`프레임 ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-foreground/30">...</span>
                      </div>
                    )}
                  </button>
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 leading-none">
                    {idx + 1}
                  </div>
                  <div className="absolute top-0.5 right-0.5 flex gap-0.5">
                    <button
                      type="button"
                      title="복제"
                      onClick={() => duplicateFrame(idx)}
                      className="bg-black/50 hover:bg-black/80 text-white rounded p-0.5 transition-colors"
                    >
                      <Copy size={9} />
                    </button>
                    <button
                      type="button"
                      title="삭제"
                      onClick={() => removeFrame(idx)}
                      disabled={frames.length <= 1}
                      className="bg-black/50 hover:bg-red-600 text-white rounded p-0.5 transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              <Download size={16} />
              이미지 다운로드
            </button>
            <button
              type="button"
              onClick={handleDownloadAll}
              className="flex items-center justify-center gap-2 border rounded-xl px-4 py-3 text-sm font-semibold hover:bg-foreground/5 transition-colors"
            >
              <Download size={16} />
              모두 ({frames.length})
            </button>
          </div>
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
