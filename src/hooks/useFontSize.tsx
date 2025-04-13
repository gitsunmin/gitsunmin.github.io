import { useCallback, useEffect, useState } from 'react';

type FontSizeOption = 'small' | 'medium' | 'large';

/**
 * Font size hook for managing application text sizing
 *
 * Uses local storage to persist user's font size preference across sessions
 * Returns current font size and methods to update it
 */
export function useFontSize() {
  // Initialize with 'medium' or the stored preference
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedSize = localStorage.getItem('fontSize');
      // Return saved preference if valid, otherwise default to 'medium'
      return (savedSize as FontSizeOption) === 'small' ||
        savedSize === 'medium' ||
        savedSize === 'large'
        ? (savedSize as FontSizeOption)
        : 'medium';
    }
    return 'medium';
  });

  // Apply font size class to document root
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;

    // Save to localStorage for persistence
    localStorage.setItem('fontSize', fontSize);

    // Remove existing font size classes
    document.documentElement.classList.remove(
      'text-small',
      'text-medium',
      'text-large'
    );

    // Add the current font size class
    document.documentElement.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  // Method to change font size
  const changeFontSize = useCallback((size: FontSizeOption) => {
    setFontSize(size);
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
    [fontSize]
  );

  return {
    fontSize,
    changeFontSize,
    getFontSizeClass,
  };
}
