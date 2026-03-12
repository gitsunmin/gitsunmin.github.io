import {
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ChangeEvent,
} from 'react';
import { cn } from '@/lib/utils';
import { Download, ImagePlus, Trash2 } from 'lucide-react';

type Preset = { label: string; width: number; height: number };

const PRESETS: Preset[] = [
  { label: 'Instagram Square (1080×1080)', width: 1080, height: 1080 },
  { label: 'Instagram Story (1080×1920)', width: 1080, height: 1920 },
  { label: 'Play Store Feature (1024×500)', width: 1024, height: 500 },
  { label: 'App Store Screenshot (1290×2796)', width: 1290, height: 2796 },
  { label: 'Custom', width: 800, height: 600 },
];

type OverlayImage = {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
};

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

const Content = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [presetIndex, setPresetIndex] = useState(0);
  const [customW, setCustomW] = useState(800);
  const [customH, setCustomH] = useState(600);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#1e293b');
  const [text, setText] = useState('');
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  const [fontSize, setFontSize] = useState(5);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState<CanvasTextAlign>('center');
  const [overlays, setOverlays] = useState<OverlayImage[]>([]);

  const preset = useMemo(
    () =>
      presetIndex < PRESETS.length - 1
        ? PRESETS[presetIndex]
        : { label: 'Custom', width: customW, height: customH },
    [presetIndex, customW, customH]
  );

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = preset.width;
    canvas.height = preset.height;

    if (bgImage) {
      try {
        const img = await loadImage(bgImage);
        ctx.drawImage(img, 0, 0, preset.width, preset.height);
      } catch {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, preset.width, preset.height);
      }
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, preset.width, preset.height);
    }

    if (text) {
      const scaledFontSize = (fontSize / 100) * preset.width;
      ctx.font = `bold ${scaledFontSize}px sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';

      const maxWidth = preset.width * 0.9;
      const x = (textX / 100) * preset.width;
      const y = (textY / 100) * preset.height;
      const lines = wrapText(ctx, text, maxWidth);
      const lineHeight = scaledFontSize * 1.3;
      const startY = y - ((lines.length - 1) / 2) * lineHeight;

      lines.forEach((line, i) => {
        ctx.fillText(line, x, startY + i * lineHeight);
      });
    }

    for (const overlay of overlays) {
      try {
        const img = await loadImage(overlay.src);
        const w = (overlay.scale / 100) * preset.width;
        const h = (img.height / img.width) * w;
        const x = (overlay.x / 100) * preset.width - w / 2;
        const y = (overlay.y / 100) * preset.height - h / 2;
        ctx.drawImage(img, x, y, w, h);
      } catch {
        // skip failed overlay
      }
    }
  }, [preset, bgImage, bgColor, text, textX, textY, fontSize, textColor, textAlign, overlays]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleBgImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOverlayAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setOverlays((prev) => [
        ...prev,
        { id: crypto.randomUUID(), src, x: 50, y: 50, scale: 30 },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const updateOverlay = (id: string, patch: Partial<OverlayImage>) => {
    setOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o))
    );
  };

  const removeOverlay = (id: string) => {
    setOverlays((prev) => prev.filter((o) => o.id !== id));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `frame-studio-${Date.now()}.png`;
    a.click();
  };

  const labelClass = 'text-xs text-foreground/70';
  const sectionClass = 'border rounded-xl p-4 space-y-3';
  const inputClass =
    'w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20';

  return (
    <div className="px-4 mt-12 pt-4 w-full max-w-6xl mx-auto pb-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Controls */}
        <aside className="lg:w-80 flex-shrink-0 space-y-4">
          {/* Preset */}
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold">캔버스 크기</h2>
            <select
              value={presetIndex}
              onChange={(e) => setPresetIndex(Number(e.target.value))}
              className={inputClass}
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
                  <label htmlFor='customWidth' className={labelClass}>Width (px)</label>
                  <input
                    id="customWidth"
                    type="number"
                    min={1}
                    value={customW}
                    onChange={(e) => setCustomW(Math.max(1, Number(e.target.value)))}
                    className={inputClass}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label htmlFor='customHeight' className={labelClass}>Height (px)</label>
                  <input
                    id="customHeight"
                    type="number"
                    min={1}
                    value={customH}
                    onChange={(e) => setCustomH(Math.max(1, Number(e.target.value)))}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Background */}
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold">배경</h2>
            <label
              className={cn(
                'flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 text-sm hover:bg-foreground/5 transition-colors'
              )}
            >
              <ImagePlus size={15} />
              <span>배경 이미지 선택</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBgImageChange}
              />
            </label>
            {bgImage && (
              <button
                type="button"
                onClick={() => setBgImage(null)}
                className="text-xs text-red-500 hover:underline"
              >
                배경 이미지 제거
              </button>
            )}
            <div className="flex items-center gap-3">
              <label htmlFor="bgColor" className={labelClass}>배경색</label>
              <input
                id="bgColor"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-16 rounded cursor-pointer border p-0.5"
              />
            </div>
          </section>

          {/* Text */}
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold">텍스트</h2>
            <textarea
              placeholder="텍스트를 입력하세요..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className={cn(inputClass, 'resize-none')}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="textX" className={labelClass}>가로 위치 ({textX}%)</label>
                <input
                  id="textX"
                  type="range"
                  min={0}
                  max={100}
                  value={textX}
                  onChange={(e) => setTextX(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="textY" className={labelClass}>세로 위치 ({textY}%)</label>
                <input
                  id="textY"
                  type="range"
                  min={0}
                  max={100}
                  value={textY}
                  onChange={(e) => setTextY(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="fontSize" className={labelClass}>글자 크기 ({fontSize}%)</label>
                <input
                  id="fontSize"
                  type="range"
                  min={1}
                  max={20}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="textColor" className={labelClass}>글자 색</label>
                <input
                  id="textColor"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8 w-full rounded cursor-pointer border p-0.5"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="textAlign" className={labelClass}>정렬</label>
              <div className="flex gap-2">
                {(
                  [
                    { value: 'left', label: '왼쪽' },
                    { value: 'center', label: '중앙' },
                    { value: 'right', label: '오른쪽' },
                  ] as { value: CanvasTextAlign; label: string }[]
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTextAlign(value)}
                    className={cn(
                      'flex-1 border rounded-lg px-2 py-1.5 text-xs transition-colors',
                      textAlign === value
                        ? 'bg-foreground text-background'
                        : 'hover:bg-foreground/5'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Overlay Images */}
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold">오버레이 이미지</h2>
            <label
              className={cn(
                'flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 text-sm hover:bg-foreground/5 transition-colors'
              )}
            >
              <ImagePlus size={15} />
              <span>이미지 추가</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleOverlayAdd}
              />
            </label>
            {overlays.map((overlay, idx) => (
              <div
                key={overlay.id}
                className="border rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">이미지 {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeOverlay(overlay.id)}
                    className="text-red-500 hover:opacity-70 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label htmlFor={`overlayX-${overlay.id}`} className={labelClass}>X ({overlay.x}%)</label>
                    <input
                      id={`overlayX-${overlay.id}`}
                      type="range"
                      min={0}
                      max={100}
                      value={overlay.x}
                      onChange={(e) =>
                        updateOverlay(overlay.id, { x: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`overlayY-${overlay.id}`} className={labelClass}>Y ({overlay.y}%)</label>
                    <input
                      id={`overlayY-${overlay.id}`}
                      type="range"
                      min={0}
                      max={100}
                      value={overlay.y}
                      onChange={(e) =>
                        updateOverlay(overlay.id, { y: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label htmlFor={`overlayScale-${overlay.id}`} className={labelClass}>크기 ({overlay.scale}%)</label>
                    <input
                      id={`overlayScale-${overlay.id}`}
                      type="range"
                      min={5}
                      max={100}
                      value={overlay.scale}
                      onChange={(e) =>
                        updateOverlay(overlay.id, {
                          scale: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </aside>

        {/* Canvas Preview */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="border rounded-xl overflow-hidden bg-foreground/5 flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block"
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
