import { MoonIcon, SunIcon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
      aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {darkMode ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}
