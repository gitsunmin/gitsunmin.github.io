import { Suspense, useState } from 'react';
import { cn } from '@/lib/utils';

const Content = () => {
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');

  const getBlackAndWhite = (bgColor: string): string => {
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
  };

  const handleFixedColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const backgroundColor = e.currentTarget.value;
    const foregroundColor = getBlackAndWhite(backgroundColor);

    setBgColor(backgroundColor);
    setFgColor(foregroundColor);
  };

  return (
    <article className="px-4 mt-12 pt-4 w-full md:max-w-(--breakpoint-md) mx-auto">
      <section
        aria-label="color picker"
        className="relative rounded-lg"
        content="max-h-40"
      >
        <input
          type="color"
          aria-label="background color picker"
          value={bgColor}
          className="w-full h-40 rounded-lg border-2 p-0 cursor-pointer shadow-2xl [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch-wrapper]:p-px"
          onInput={handleFixedColorChange}
        />
        <div
          style={{ color: fgColor, borderColor: fgColor }}
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'border px-4 py-2 shadow-2xl rounded-lg text-center'
          )}
        >
          Gitsunmin is <br /> The Best Programer!
        </div>
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
