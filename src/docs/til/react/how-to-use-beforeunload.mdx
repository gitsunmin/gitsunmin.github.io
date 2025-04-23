# How to Use beforeunload

React Page가 닫히거나 새로고침 될 때 사용자에게 경고를 표시하려면 `beforeunload` 이벤트를 사용할 수 있습니다.

```tsx
import React, { useEffect } from 'react';

const useBeforeUnload = (enabled: boolean) => {
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    if (enabled) {
      window.addEventListener('beforeunload', handler);
    }

    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [enabled]);
};

const App = () => {
  useBeforeUnload(true);

  return <div>App</div>;
};

export default App;
```

위 코드는 페이지가 닫히거나 새로고침 될 때 사용자에게 경고를 표시합니다. `useBeforeUnload` 훅은 `enabled` 값이 `true`일 때만 `beforeunload` 이벤트를 추가하고, `false`일 때는 제거합니다.
