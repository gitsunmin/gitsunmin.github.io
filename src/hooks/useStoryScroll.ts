import { type RefObject, useEffect, useRef } from 'react';

/**
 * 인터랙티브 Story의 스크롤 진행도.
 *
 * Story 컴포넌트는 뷰포트보다 몇 배 긴 바깥 상자(outer)와 그 안의 sticky 패널로
 * 이루어진다. 바깥 상자를 얼마나 지나쳤는지가 곧 연출의 진행도다.
 */
export type StoryScroll = {
  /** 0~1. 구간 전체 대비 얼마나 지나왔는지. */
  progress: number;
  /** 구간 시작점부터 스크롤된 픽셀. 씬을 뷰포트 단위로 끊는 Story가 쓴다. */
  scrolledInto: number;
  /** 그 시점의 뷰포트 높이. */
  viewport: number;
};

/**
 * Story 6개가 각자 복붙해 두었던 스크롤 계산을 한 곳으로 모은 훅.
 *
 * 값을 상태로 돌려주지 않고 콜백으로 넘기는 이유: Story마다 "얼마나 움직여야
 * 다시 그릴지"의 기준이 다르다(진행도 0.001 vs 씬 번호 변화). 훅이 상태를 쥐면
 * 매 스크롤 프레임마다 리렌더가 걸려 sticky 패널이 버벅인다. 걸러 내는 일은
 * 각 Story가 자기 기준으로 한다.
 *
 * 콜백은 ref에 담아 두므로 매 렌더 새 함수를 넘겨도 리스너는 다시 붙지 않는다.
 */
export function useStoryScroll(
  outerRef: RefObject<HTMLElement | null>,
  onScroll: (scroll: StoryScroll) => void,
) {
  const onScrollRef = useRef(onScroll);

  // 렌더 중에 ref를 건드리면 안 되므로 커밋 뒤에 최신 콜백으로 갈아 끼운다.
  // 아래 구독 effect보다 먼저 선언해 두어야 첫 마운트에서도 순서가 어긋나지 않는다.
  useEffect(() => {
    onScrollRef.current = onScroll;
  });

  useEffect(() => {
    function handleScroll() {
      const outer = outerRef.current;
      if (!outer) return;

      const scrolledInto = -outer.getBoundingClientRect().top;
      if (scrolledInto < 0) return; // 아직 구간에 들어오지 않았다

      const totalHeight = outer.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return; // 구간이 뷰포트보다 짧으면 진행도가 성립하지 않는다

      onScrollRef.current({
        progress: Math.max(0, Math.min(1, scrolledInto / totalHeight)),
        scrolledInto,
        viewport: window.innerHeight,
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [outerRef]);
}
