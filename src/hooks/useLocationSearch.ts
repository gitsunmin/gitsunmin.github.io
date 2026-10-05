import { useSyncExternalStore } from 'react';

/**
 * 주소의 쿼리를 상태처럼 읽고 쓴다 — /works의 보기(?view=)와 직무 렌즈(?lens=, ?tech=).
 *
 * 쿼리가 곧 상태라서 따로 useState를 두지 않는다. 정적 HTML은 빈 쿼리(서버 스냅샷)로
 * 그려지고, 하이드레이션 뒤에 실제 주소로 다시 그려진다.
 * replaceState는 이벤트를 내지 않으므로 바꿀 때 직접 알린다.
 */
const CHANGE_EVENT = 'locationsearchchange';

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('popstate', onChange);
  };
};

export const useLocationSearch = () =>
  useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => '',
  );

/**
 * 쿼리를 바꾼다. null이면 지워서 주소를 짧게 둔다.
 * history.state는 ClientRouter가 쓰므로 그대로 넘긴다.
 */
export const replaceSearchParams = (params: Record<string, string | null>) => {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  window.history.replaceState(window.history.state, '', url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
};
