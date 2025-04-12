import { LocalStorage } from '@/utils/LocalStorage';
import { useState, useEffect } from 'react';

export function useDarkMode() {
  // 로컬 스토리지에서 초기 상태 확인
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = LocalStorage.get('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // 시스템 환경설정 기본값으로 설정
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // 다크모드 상태에 따라 HTML에 클래스 추가/제거
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // 상태 저장
    LocalStorage.set('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // 사용자가 명시적으로 모드를 선택하지 않았을 때만 시스템 설정 따름
      if (LocalStorage.get('darkMode') === 'false') {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setDarkMode]);

  return { darkMode, setDarkMode };
}
