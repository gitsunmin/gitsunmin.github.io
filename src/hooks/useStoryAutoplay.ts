import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  /** 구간을 처음부터 끝까지 훑는 데 걸리는 시간(ms). */
  durationMs: number;
  /** 끝까지 재생됐을 때만 호출된다. 사용자가 끊으면 호출되지 않는다. */
  onComplete?: () => void;
};

export type StoryAutoplay = {
  playing: boolean;
  /** 이 구간(뷰포트보다 긴 Story 섹션)을 처음부터 끝까지 스크롤한다. */
  play: (section: HTMLElement) => void;
  stop: () => void;
};

/** 한 프레임에 인정할 최대 경과 시간. 프레임이 길어져도 연출이 건너뛰지 않게 한다. */
const MAX_FRAME_MS = 100;

/**
 * 스크롤 구동 Story를 자동으로 재생한다.
 *
 * Story 컴포넌트는 window 스크롤에서 진행도를 직접 읽는다(useStoryScroll). 그래서
 * 진행도를 흉내 내는 대신 실제로 창을 스크롤해 준다 — Story 쪽 코드를 한 줄도
 * 고치지 않고 자동 재생을 얻는 방법이다.
 */
export function useStoryAutoplay({ durationMs, onComplete }: Options): StoryAutoplay {
  const [playing, setPlaying] = useState(false);

  const runRef = useRef<{ from: number; to: number; elapsed: number; last: number; frame: number | null } | null>(null);
  const detachRef = useRef<(() => void) | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const stop = useCallback(() => {
    const run = runRef.current;
    if (run?.frame != null) cancelAnimationFrame(run.frame);
    runRef.current = null;

    detachRef.current?.();
    detachRef.current = null;

    // 재생을 위해 껐던 것들을 되돌린다.
    const html = document.documentElement;
    html.style.removeProperty('scroll-snap-type');
    html.style.removeProperty('scroll-behavior');

    setPlaying(false);
  }, []);

  const play = useCallback(
    (section: HTMLElement) => {
      const distance = section.offsetHeight - window.innerHeight;
      if (distance <= 0) return;

      const from = window.scrollY;
      const to = section.offsetTop + distance;
      if (to <= from) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // 저절로 흘러가는 스크롤은 멀미를 유발한다(WCAG 2.2.2). 연출을 재생하는 대신
        // 최종 장면만 즉시 확정하고, 그다음은 사용자 스크롤에 맡긴다.
        window.scrollTo({ top: to, behavior: 'instant' as ScrollBehavior });
        return;
      }

      stop(); // 이전 재생이 남아 있으면 먼저 정리한다

      // 스냅은 매 프레임 위치를 되돌려 놓고, scroll-behavior: smooth는 매 프레임
      // 새 부드러운 스크롤을 시작해 이전 것을 취소한다. 둘 중 하나만 남아 있어도
      // 화면이 1픽셀도 움직이지 않는다.
      const html = document.documentElement;
      html.style.scrollSnapType = 'none';
      html.style.scrollBehavior = 'auto';

      // 취소 리스너는 재생과 같은 틱에 붙인다. effect로 미루면 그 사이에 들어온
      // 휠 한 번을 놓쳐 사용자 스크롤과 자동 스크롤이 맞붙는다. 개입하면 항상 사람이 이긴다.
      const cancel = () => stop();
      const passive = { passive: true } as const;
      window.addEventListener('wheel', cancel, passive);
      window.addEventListener('touchstart', cancel, passive);
      window.addEventListener('pointerdown', cancel, passive);
      window.addEventListener('keydown', cancel);
      detachRef.current = () => {
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
        window.removeEventListener('pointerdown', cancel);
        window.removeEventListener('keydown', cancel);
      };

      const run = { from, to, elapsed: 0, last: performance.now(), frame: null as number | null };
      runRef.current = run;

      const step = (now: number) => {
        // 경과 시간을 누적한다. 시작 시각과의 차이를 쓰면, 탭이 백그라운드에 있어
        // rAF가 멈춰 있던 시간까지 흐른 것으로 계산돼 돌아오는 순간 끝으로 튄다.
        run.elapsed += Math.min(now - run.last, MAX_FRAME_MS);
        run.last = now;

        const t = Math.min(1, run.elapsed / durationMs);
        window.scrollTo(0, run.from + (run.to - run.from) * t);

        if (t < 1) {
          run.frame = requestAnimationFrame(step);
          return;
        }

        stop(); // 여기서 스냅과 smooth 스크롤이 되살아난다
        onCompleteRef.current?.();
      };

      run.frame = requestAnimationFrame(step);
      setPlaying(true);
    },
    [durationMs, stop],
  );

  useEffect(() => stop, [stop]);

  return { playing, play, stop };
}
