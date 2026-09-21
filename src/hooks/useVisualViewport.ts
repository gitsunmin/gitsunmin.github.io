import { useSyncExternalStore } from 'react';

/**
 * 시각 뷰포트 — 소프트 키보드가 올라오면 줄어드는 "실제로 보이는 영역".
 *
 * iOS Safari는 키보드가 떠도 `innerHeight`와 `position: fixed`의 기준을 그대로 두고,
 * 대신 `visualViewport`만 줄인다. 그래서 화면 아래에 붙인 시트는 키보드 뒤로 들어가
 * 버린다. 이 값에 맞춰 놓는 요소만 키보드 위에 남는다.
 *
 * `enabled`가 꺼져 있으면 구독하지 않는다 — 시트가 닫혀 있는 동안 스크롤마다
 * 다시 그릴 이유가 없다.
 */
export type ViewportBox = {
  /** 레이아웃 뷰포트 기준으로 시각 뷰포트가 내려앉은 거리. */
  top: number;
  height: number;
};

let cache: ViewportBox | null = null;

function read(): ViewportBox {
  const viewport = window.visualViewport;
  const next: ViewportBox = viewport
    ? { top: Math.round(viewport.offsetTop), height: Math.round(viewport.height) }
    : { top: 0, height: window.innerHeight };
  // 스냅샷은 참조가 안정적이어야 한다. 값이 같으면 이전 객체를 그대로 돌려준다.
  if (!cache || cache.top !== next.top || cache.height !== next.height) cache = next;
  return cache;
}

function subscribe(onChange: () => void) {
  const viewport = window.visualViewport;
  if (!viewport) {
    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
  }
  viewport.addEventListener('resize', onChange);
  viewport.addEventListener('scroll', onChange);
  return () => {
    viewport.removeEventListener('resize', onChange);
    viewport.removeEventListener('scroll', onChange);
  };
}

const noop = () => () => {};
const none = () => null;

export function useVisualViewport(enabled: boolean): ViewportBox | null {
  return useSyncExternalStore(enabled ? subscribe : noop, enabled ? read : none, none);
}
