# Scroll Restoration

소개

이 훅은 페이지 전환 또는 뒤로가기/앞으로가기 시 이전 스크롤 위치를 자동으로 저장하고 복원합니다.
SessionStorage를 활용해 각 경로마다 스크롤 위치를 기억하며, 브라우저 히스토리 내에서 부드럽고 자연스러운 사용자 경험을 제공합니다.

⸻

주요 기능
- 페이지 이동 전 스크롤 위치 저장
- 뒤로가기/앞으로가기 시 위치 복원
- SessionStorage 기반의 경량 구현
- React Router, Next.js 등 라우팅 방식에 관계없이 활용 가능

⸻

설치 및 준비

1. SessionStorage 유틸 생성
```tsx
// utils/sessionStorage.ts
const SessionStorage = {
  set: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  },
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(key);
    }
    return null;
  },
  getWithDefault: (key: string, defaultValue: string) => {
    const val = SessionStorage.get(key);
    return val ?? defaultValue;
  },
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  },
};

export default SessionStorage;
```

2. useScrollRestoration 훅 생성

```tsx
// hooks/useScrollRestoration.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // react-router-dom 기반 Next에서는 Next Router 사용. (url 정보 필요)
import SessionStorage from '@/utils/sessionStorage';

const SCROLL_POSITION_KEY_PREFIX = 'scroll_pos_';

const hashKey = (path: string) => {
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = (hash << 5) - hash + path.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

type Options = {
  replace?: boolean;
};

export const useScrollRestoration = (options?: Options) => {
  const { replace = false } = options || {};
  const location = useLocation();
  const key = SCROLL_POSITION_KEY_PREFIX + hashKey(location.pathname + location.search);

  useEffect(() => {
    const saveScroll = () => {
      if (!replace) {
        SessionStorage.set(key, JSON.stringify({ x: window.scrollX, y: window.scrollY }));
      } else {
        SessionStorage.remove(key);
      }
    };

    const restoreScroll = () => {
      const saved = SessionStorage.getWithDefault(key, JSON.stringify({ x: 0, y: 0 }));
      const { x, y } = JSON.parse(saved);
      window.scrollTo({ left: x, top: y, behavior: 'instant' });
    };

    // 브라우저 종료, 새로고침 직전
    window.addEventListener('beforeunload', saveScroll);
    // 경로 이동 직후 복원
    restoreScroll();

    return () => {
      window.removeEventListener('beforeunload', saveScroll);
      saveScroll(); // cleanup 시 저장 (라우팅 전 이동 시)
    };
  }, [location.pathname, location.search, replace]);
};
```
3. 사용 방법

React Router 기반 프로젝트

```tsx
// App.tsx
import { BrowserRouter } from 'react-router-dom';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

function App() {
  useScrollRestoration();

  return (
    <BrowserRouter>
      {/* Routes 정의 */}
    </BrowserRouter>
  );
}
```
