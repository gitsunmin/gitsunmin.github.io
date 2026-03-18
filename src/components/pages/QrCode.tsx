import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import QRCode from 'qrcode';
import { Plus, Trash2, Download } from 'lucide-react';

type QueryParam = {
  id: string;
  key: string;
  value: string;
};

const buildUrl = (baseUrl: string, params: QueryParam[]): string => {
  const validParams = params.filter((p) => p.key.trim() !== '');
  if (!baseUrl.trim()) return '';

  try {
    const url = new URL(baseUrl);
    validParams.forEach((p) => {
      if (p.key.trim()) url.searchParams.set(p.key.trim(), p.value);
    });
    return url.toString();
  } catch {
    if (validParams.length === 0) return baseUrl;
    const qs = validParams
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');
    return `${baseUrl}?${qs}`;
  }
};

const Content = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState('');
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');

  const finalUrl = buildUrl(url, queryParams);
  const generated = finalUrl.trim() !== '';

  const generateQr = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !finalUrl) return;

    QRCode.toCanvas(canvas, finalUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .catch(() => { });
  }, [finalUrl, darkColor, lightColor]);

  useEffect(() => {
    if (finalUrl) {
      generateQr();
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [finalUrl, darkColor, lightColor, generateQr]);

  const addParam = () => {
    setQueryParams((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: '', value: '' },
    ]);
  };

  const removeParam = (id: string) => {
    setQueryParams((prev) => prev.filter((p) => p.id !== id));
  };

  const updateParam = (id: string, field: 'key' | 'value', val: string) => {
    setQueryParams((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !generated) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <article className="px-4 mt-12 pt-4 w-full md:max-w-(--breakpoint-md) mx-auto space-y-6 pb-12">
      {/* URL Input */}
      <section className="space-y-2">
        <label htmlFor='url-input' className="text-sm font-medium text-foreground">URL</label>
        <input
          id='url-input'
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className={cn(
            'w-full px-4 py-2.5 rounded-xl text-sm text-foreground',
            'bg-white/30 dark:bg-white/10',
            'border border-white/70 dark:border-white/20',
            'backdrop-blur-md',
            'placeholder:text-foreground/40',
            'focus:outline-none focus:ring-2 focus:ring-white/40',
            'transition-all duration-200'
          )}
        />
      </section>

      {/* Query String Builder */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor='' className="text-sm font-medium text-foreground">
            Query String
          </label>
          <button
            type="button"
            onClick={addParam}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'bg-white/30 dark:bg-white/10',
              'border border-white/70 dark:border-white/20',
              'text-foreground hover:bg-white/40 dark:hover:bg-white/20',
              'transition-all duration-200'
            )}
          >
            <Plus size={13} />
            Add
          </button>
        </div>

        {queryParams.length > 0 && (
          <div className="space-y-2">
            {queryParams.map((param) => (
              <div key={param.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                  placeholder="key"
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm text-foreground',
                    'bg-white/30 dark:bg-white/10',
                    'border border-white/70 dark:border-white/20',
                    'placeholder:text-foreground/40',
                    'focus:outline-none focus:ring-2 focus:ring-white/40',
                    'transition-all duration-200'
                  )}
                />
                <span className="text-foreground/50 text-sm">=</span>
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) =>
                    updateParam(param.id, 'value', e.target.value)
                  }
                  placeholder="value"
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm text-foreground',
                    'bg-white/30 dark:bg-white/10',
                    'border border-white/70 dark:border-white/20',
                    'placeholder:text-foreground/40',
                    'focus:outline-none focus:ring-2 focus:ring-white/40',
                    'transition-all duration-200'
                  )}
                />
                <button
                  type="button"
                  onClick={() => removeParam(param.id)}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-foreground/60 hover:text-foreground',
                    'hover:bg-white/20 dark:hover:bg-white/10',
                    'transition-all duration-200'
                  )}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Result URL */}
      {finalUrl && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
              Result
            </span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>
          <div
            className={cn(
              'px-4 py-3 rounded-xl',
              'bg-white/10 dark:bg-white/5',
              'border border-white/50 dark:border-white/15',
              'backdrop-blur-sm',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
              'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]'
            )}
          >
            <p className="text-xs break-all text-foreground/70 font-mono leading-relaxed">
              {finalUrl}
            </p>
          </div>
        </section>
      )}

      {/* Color Pickers */}
      <section className="space-y-3">
        <label htmlFor="color-input" className="text-sm font-medium text-foreground">Colors</label>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="dark-color-input" className="text-xs text-foreground/70">Dark</label>
            <input
              type="color"
              id="dark-color-input"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className={cn(
                'w-9 h-9 rounded-lg cursor-pointer border-2',
                'border-white/70 dark:border-white/20',
                '[&::-webkit-color-swatch]:rounded-md',
                '[&::-webkit-color-swatch]:border-none',
                '[&::-webkit-color-swatch-wrapper]:p-0.5'
              )}
            />
            <span className="text-xs text-foreground/50 font-mono">
              {darkColor}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="light-color-input" className="text-xs text-foreground/70">Light</label>
            <input
              type="color"
              id="light-color-input"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className={cn(
                'w-9 h-9 rounded-lg cursor-pointer border-2',
                'border-white/70 dark:border-white/20',
                '[&::-webkit-color-swatch]:rounded-md',
                '[&::-webkit-color-swatch]:border-none',
                '[&::-webkit-color-swatch-wrapper]:p-0.5'
              )}
            />
            <span className="text-xs text-foreground/50 font-mono">
              {lightColor}
            </span>
          </div>
        </div>
      </section>

      {/* QR Code Preview */}
      <section className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'rounded-2xl p-4',
            'bg-white/30 dark:bg-white/10',
            'border border-white/70 dark:border-white/20',
            'shadow-[0_4px_24px_rgba(0,0,0,0.10)]',
            'dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]',
            'backdrop-blur-md',
            'transition-all duration-300',
            !generated && 'opacity-40'
          )}
        >
          <canvas ref={canvasRef} className="block" />
          {!generated && (
            <div className="w-[280px] h-[280px] flex items-center justify-center text-sm text-foreground/40 -mt-px">
              URL을 입력하면 QR 코드가 생성됩니다
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!generated}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
            'bg-white/30 dark:bg-white/10',
            'border border-white/70 dark:border-white/20',
            'text-foreground',
            'backdrop-blur-md',
            'shadow-[0_4px_24px_rgba(0,0,0,0.10)]',
            'transition-all duration-200',
            'hover:bg-white/40 dark:hover:bg-white/20',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          <Download size={16} />
          Download PNG
        </button>
      </section>
    </article>
  );
};

export const QrCodePage = () => {
  return <Content />;
};
