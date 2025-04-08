import { createContext, useContext, ReactNode } from 'react';
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

// eslint-disable-next-line react-refresh/only-export-components
export function useDarkModeContext() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error(
      'useDarkModeContext must be used within a DarkModeProvider'
    );
  }
  return context;
}
