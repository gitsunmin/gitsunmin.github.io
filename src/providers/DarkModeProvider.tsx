import { createContext, type ReactNode } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

type DarkModeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const { darkMode, setDarkMode } = useDarkMode();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
