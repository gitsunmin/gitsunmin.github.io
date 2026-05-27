import { useEffect, useState } from 'react';
import { LocalStorage } from '@/utils/LocalStorage';


export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const savedMode = LocalStorage.get('darkMode');
    if (savedMode !== null) return savedMode === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      LocalStorage.set('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      LocalStorage.set('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (LocalStorage.get('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { darkMode, setDarkMode };
}