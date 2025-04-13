import { createContext, ReactNode, useLayoutEffect } from 'react';
import { useFontSize } from '@/hooks/useFontSize';

// Define context type
type FontSizeContextType = ReturnType<typeof useFontSize>;

// Create context with a default value (will be overridden by the provider)
const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

// Types for the provider props
type Props = {
  children: ReactNode;
};

/**
 * Font size provider component that wraps the application and provides font size context
 */
export const FontSizeProvider = ({ children }: Props) => {
  // Use the hook to get font size state and methods
  const fontSizeValue = useFontSize();

  useLayoutEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;

    // Set initial font size class based on saved preference
    const savedSize = localStorage.getItem('fontSize');
    if (
      savedSize === 'small' ||
      savedSize === 'medium' ||
      savedSize === 'large'
    ) {
      document.documentElement.classList.add('text-' + savedSize);
    } else {
      document.documentElement.classList.add('text-medium');
    }
  }, []);

  return (
    <FontSizeContext.Provider value={fontSizeValue}>
      {children}
    </FontSizeContext.Provider>
  );
};
