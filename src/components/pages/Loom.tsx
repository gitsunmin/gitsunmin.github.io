import { Suspense, useRef, useState } from 'react';
import { Button } from '../Button';
import { cn } from '@/lib/utils';
import { match, P } from 'ts-pattern';

type FixedColorOption = 'background' | 'foreground';

const Content = () => {
  const fgPickerRef = useRef<HTMLInputElement>(null);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [fixedColor, setFixedColor] = useState<FixedColorOption>('background');

  function getBlackAndWhite(bgColor: string): string {
    if (!bgColor || typeof bgColor !== 'string') {
      return '#000000';
    }

    const hex = bgColor.startsWith('#') ? bgColor.slice(1) : bgColor;

    const r = Number.parseInt(hex.substring(0, 2), 16);
    const g = Number.parseInt(hex.substring(2, 4), 16);
    const b = Number.parseInt(hex.substring(4, 6), 16);

    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
      return '#000000';
    }

    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? '#000000' : '#FFFFFF';
  }

  const handleFixedColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    match(e.currentTarget.value)
      .with(P.union('background', 'foreground'), (value) => {
        setFixedColor(value);
      })
      .otherwise(() => {
        console.warn('Invalid color option selected');
      });
  };

  const handleApply = (fixedColor: FixedColorOption) => () => {
    match(fixedColor)
      .with('background', () => {
        const foregroundColor = getBlackAndWhite(bgColor);
        setFgColor(foregroundColor);
      })
      .with('foreground', () => {
        const backgroundColor = getBlackAndWhite(fgColor);
        setBgColor(backgroundColor);
      })
      .exhaustive();
  };

  return (
    <article className="px-4 mt-12 pt-4">
      <section
        aria-label="color picker"
        className="relative"
        content="max-h-40"
      >
        <input
          type="color"
          aria-label="background color picker "
          value={bgColor}
          className="w-full h-40 rounded-3xl border-none p-0 cursor-pointer shadow-2xl"
          onInput={(e) => {
            console.log('background:', e.currentTarget.value);
            setBgColor(e.currentTarget.value);
          }}
        />
        <input
          type="color"
          ref={fgPickerRef}
          aria-label="foreground color picker"
          className="hidden"
          value={fgColor}
          onInput={(e) => {
            console.log('foreground:', e.currentTarget.value);
            setFgColor(e.currentTarget.value);
          }}
        />
        <Button
          variant="ghost"
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border px-4 py-2 shadow-2xl rounded-lg',
          )}
          onClick={() => fgPickerRef.current?.click()}
        >
          <span style={{ color: fgColor }}>
            Gitsunmin is <br /> The Best Programer !
          </span>
        </Button>
      </section>
      <section className="flex flex-col gap-y-4 mt-8">
        <fieldset className="space-y-2">
          <legend className="text-lg font-medium text-gray-700">
            Fix Color
          </legend>

          <div className="flex gap-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value="background"
                checked={fixedColor === 'background'}
                onChange={handleFixedColorChange}
                className="accent-blue-600"
              />
              <span>Background</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value="foreground"
                checked={fixedColor === 'foreground'}
                onChange={handleFixedColorChange}
                className="accent-blue-600"
              />
              <span>Foreground</span>
            </label>
          </div>
        </fieldset>
        <Button
          variant="outline"
          className="w-full py-2 rounded-lg"
          onClick={handleApply(fixedColor)}
        >
          Is this your color ?
        </Button>
      </section>
    </article>
  );
};

export const LoomPage = () => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
};
