import { useSyncExternalStore } from 'react';

/**
 * 미디어 쿼리 결과를 구독한다.
 *
 * 서버 스냅샷은 `false`다. 덱처럼 서버 HTML에 모바일·PC 분기가 없는 곳에서 쓰고,
 * 하이드레이션 직후 실제 값으로 한 번 갈아탄다.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** deck.css의 모바일 분기(640px)와 같은 기준. */
export const MOBILE_QUERY = '(max-width: 640px)';
