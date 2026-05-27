import { useCallback, useEffect, useState } from 'react';

type FontSizeOption = 'small' | 'medium' | 'large';

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    if (typeof window === 'undefined') return 'medium';
    const savedSize = localStorage.getItem('fontSize');
    if (
      savedSize === 'small' ||
      savedSize === 'medium' ||
      savedSize === 'large'
    ) {
      return savedSize;
    }
    return 'medium';
  });

  useEffect(() => {
    document.documentElement.classList.remove(
      'text-small',
      'text-medium',
      'text-large',
    );
    document.documentElement.classList.add(`text-${fontSize}`);
    const fontSizeScale =
      fontSize === 'small' ? '0.875' : fontSize === 'large' ? '1.125' : '1';
    document.documentElement.style.setProperty(
      '--font-size-scale',
      fontSizeScale,
    );
  }, [fontSize]);

  // Method to change font size
  const changeFontSize = useCallback((size: FontSizeOption) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  }, []);

  // Get the appropriate class for an element based on current font size
  const getFontSizeClass = useCallback(
    (element: 'body' | 'heading' | 'small-text') => {
      switch (element) {
        case 'heading':
          return fontSize === 'small'
            ? 'text-xl md:text-2xl'
            : fontSize === 'medium'
              ? 'text-2xl md:text-3xl'
              : 'text-3xl md:text-4xl';
        case 'body':
          return fontSize === 'small'
            ? 'text-sm'
            : fontSize === 'medium'
              ? 'text-base'
              : 'text-lg';
        case 'small-text':
          return fontSize === 'small'
            ? 'text-xs'
            : fontSize === 'medium'
              ? 'text-sm'
              : 'text-base';
        default:
          return '';
      }
    },
    [fontSize],
  );

  return {
    fontSize,
    changeFontSize,
    getFontSizeClass,
  };
}
