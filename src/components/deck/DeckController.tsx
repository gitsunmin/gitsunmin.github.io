import { ChevronDown, Printer } from 'lucide-react';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

/**
 * 덱(슬라이드쇼) 컨트롤러 — 0단계 프로토타입.
 *
 * 슬라이드 마크업 자체는 페이지가 소유하고, 이 컴포넌트는 DOM에 이미 있는
 * `[data-slide]`를 훑어서 이동·표시만 담당한다. 그래야 콘텐츠가 서버 렌더 HTML에
 * 그대로 남아 SEO·인쇄·딥링크가 유지된다.
 *
 * 진행은 전적으로 사용자 몫이다. 자동 스크롤은 두었다가 걷어냈다 — 발표자가
 * 말하는 속도와 맞을 리 없고, 읽는 사람의 스크롤과도 계속 다퉜다.
 */

/**
 * 스스로 높이를 정하는 슬라이드인지. rehype가 인터랙티브 컴포넌트를 품은 슬라이드에
 * data-slide-full을 남겨 두므로, 특정 work의 슬라이드 id를 알 필요가 없다.
 */
const isStorySlide = (slide: HTMLElement | undefined) => slide?.dataset.slideFull !== undefined;

const NO_SLIDES: HTMLElement[] = [];

/**
 * 슬라이드는 페이지가 소유한 DOM이라 React state가 아니라 외부 저장소로 읽는다.
 * useSyncExternalStore를 쓰면 하이드레이션 시점에 서버 스냅샷(빈 배열) → 클라이언트
 * 스냅샷으로 한 번에 넘어가므로, effect에서 setState를 호출할 필요가 없다.
 */
const slideStore = {
  cache: NO_SLIDES,
  key: '',
  subscribe() {
    return () => {};
  },
  getSnapshot() {
    const list = Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'));
    const key = list.map((element, index) => `${index}:${element.dataset.slideTitle ?? ''}`).join('|');
    // 스냅샷은 참조가 안정적이어야 한다. 구성이 같으면 이전 배열을 그대로 돌려준다.
    if (key !== slideStore.key) {
      slideStore.key = key;
      slideStore.cache = list;
    }
    return slideStore.cache;
  },
  getServerSnapshot() {
    return NO_SLIDES;
  },
};

/** 현재 스크롤 위치에서 가장 위쪽에 걸린 슬라이드를 고른다. */
function findActive(slides: HTMLElement[]) {
  const line = window.innerHeight * 0.35;
  let index = 0;
  for (let i = 0; i < slides.length; i += 1) {
    if (slides[i].getBoundingClientRect().top <= line) index = i;
  }
  return index;
}

/**
 * 슬라이드 하나를 화면에 맞춰 줄인다.
 *
 * 콘텐츠 길이는 글마다 다르고, 접힌 보조 자료를 펼치면 또 달라진다. MDX를 일일이
 * 손보는 대신 실제 렌더 높이를 재서 넘치는 만큼만 축소한다. font-size가 아니라
 * zoom을 쓰는 이유는 글자와 여백·표·코드 블록이 같은 비율로 줄어야 하기 때문이다.
 */
const FIT_STEPS = [1, 0.92, 0.84, 0.76, 0.68];

function fitSlide(slide: HTMLElement) {
  const body = slide.firstElementChild;
  if (!(body instanceof HTMLElement)) return;

  for (const step of FIT_STEPS) {
    body.style.zoom = step === 1 ? '' : String(step);
    // 1px은 소수점 반올림 여유. 이 값이 없으면 딱 맞는 슬라이드도 계속 줄어든다.
    if (body.scrollHeight <= body.clientHeight + 1) {
      delete slide.dataset.slideOverflow;
      return;
    }
  }

  // 최소 단계에서도 넘치면 슬라이드 안 스크롤에 맡기고, 더 있다는 표시를 남긴다.
  slide.dataset.slideOverflow = '';
}

export function DeckController() {
  const slides = useSyncExternalStore(slideStore.subscribe, slideStore.getSnapshot, slideStore.getServerSnapshot);
  const [active, setActive] = useState(0);

  /* ── 현재 슬라이드 추적 ─────────────────────────────────────
     IntersectionObserver로 "보인다/안 보인다"만 받고, 실제 인덱스는
     그때그때 기하로 다시 계산한다. 300svh짜리 Story 슬라이드처럼 뷰포트보다
     큰 슬라이드가 섞여 있으면 교차 비율만으로는 순서가 뒤집히기 때문이다. */
  useEffect(() => {
    if (slides.length === 0) return;

    // findActive는 슬라이드 전부의 위치를 잰다. 90장짜리 덱에서 스크롤 이벤트마다
    // 그대로 돌리면 매 프레임 레이아웃을 강제로 계산하게 되어 스크롤이 끊긴다.
    // 프레임당 한 번으로 묶는다.
    let frame: number | null = null;
    const update = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setActive(findActive(slides));
      });
    };

    const observer = new IntersectionObserver(update, { threshold: [0, 0.5, 1] });
    for (const slide of slides) observer.observe(slide);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [slides]);

  /* ── 한 화면에 맞추기 ───────────────────────────────────────
     발표 슬라이드는 스크롤해서 읽는 문서가 아니다. 넘치는 슬라이드는 줄여서
     한눈에 들어오게 하고, 접혀 있던 보조 자료는 미리 펼쳐 둔다 —
     발표 도중에 클릭해서 펼쳐야 하는 내용은 없는 편이 낫다. */
  useEffect(() => {
    const targets = slides.filter((slide) => !isStorySlide(slide));
    if (targets.length === 0) return;

    for (const slide of targets) {
      for (const details of slide.querySelectorAll('details')) details.open = true;
    }

    let disposed = false;
    let frame: number | null = null;
    const refit = () => {
      if (disposed || frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        for (const slide of targets) fitSlide(slide);
      });
    };

    refit();
    // 웹폰트가 늦게 도착하면 줄 수가 달라진다. 그때 한 번 더 잰다.
    document.fonts?.ready.then(refit);

    window.addEventListener('resize', refit);
    // toggle은 버블링하지 않으므로 캡처 단계에서 받는다.
    for (const slide of targets) slide.addEventListener('toggle', refit, true);

    return () => {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('resize', refit);
      for (const slide of targets) {
        slide.removeEventListener('toggle', refit, true);
        delete slide.dataset.slideOverflow;
        const body = slide.firstElementChild;
        if (body instanceof HTMLElement) body.style.zoom = '';
      }
    };
  }, [slides]);

  /* ── 등장 연출 ──────────────────────────────────────────────
     슬라이드가 화면에 자리 잡으면 내용이 한 번 떠오른다.
     숨김 상태를 CSS에 그냥 두면 JS가 죽었을 때 본문이 영영 보이지 않으므로,
     연출을 켜는 표시(data-deck-animate)를 런타임에 붙인 뒤에만 적용한다. */
  useEffect(() => {
    if (slides.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const deck = slides[0].closest('[data-deck]');
    if (!(deck instanceof HTMLElement)) return;
    deck.dataset.deckAnimate = '';

    // 한 번 드러난 슬라이드는 관찰을 끊는다. 빠르게 훑고 지나갈 때
    // 같은 슬라이드가 몇 번씩 다시 나타나며 깜빡이지 않게 하기 위해서다.
    let revealed = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.slideShown = '';
          observer.unobserve(entry.target);
          revealed += 1;
        }
      },
      { threshold: 0.35 },
    );
    for (const slide of slides) observer.observe(slide);

    // 안전장치. 연출은 본문을 잠시 숨겨 두고 시작하므로, 관찰자가 한 번도 울리지
    // 않으면 본문이 영영 보이지 않는다(백그라운드 탭처럼 렌더링이 멎은 경우가 그렇다).
    // 그럴 때는 연출을 포기하고 전부 드러낸다 — 안 보이는 것보다는 낫다.
    const failsafe = window.setTimeout(() => {
      if (revealed > 0) return;
      observer.disconnect();
      for (const slide of slides) slide.dataset.slideShown = '';
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
      delete deck.dataset.deckAnimate;
      for (const slide of slides) delete slide.dataset.slideShown;
    };
  }, [slides]);

  /* ── 씬 스냅 지점 ───────────────────────────────────────────
     Story 슬라이드는 뷰포트 몇 배 높이에 씬이 그만큼 들어 있다. 씬마다 멈추려면
     그 높이에 스냅 지점이 하나씩 있어야 하는데, MDX에는 쓸 자리가 없다.
     슬라이드 높이를 재서 여기서 심고, 언마운트할 때 걷어 낸다. */
  useEffect(() => {
    const anchors: HTMLElement[] = [];

    for (const slide of slides) {
      if (!isStorySlide(slide)) continue;
      const scenes = Math.max(1, Math.round(slide.offsetHeight / window.innerHeight));

      for (let i = 0; i < scenes; i += 1) {
        const anchor = document.createElement('span');
        anchor.className = 'deck-snap-anchor';
        anchor.style.top = `${i * 100}svh`;
        anchor.setAttribute('aria-hidden', 'true');
        slide.appendChild(anchor);
        anchors.push(anchor);
      }
    }

    return () => anchors.forEach((anchor) => anchor.remove());
  }, [slides]);

  const goTo = useCallback(
    (index: number) => {
      const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [slides],
  );

  /* ── 키보드 ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const step = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowRight: 1, ArrowUp: -1, PageUp: -1, ArrowLeft: -1 }[event.key];
      if (step !== undefined) {
        event.preventDefault();
        goTo(active + step);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        goTo(slides.length - 1);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo, slides.length]);

  /* 인쇄 중에는 스냅이 페이지 분할을 방해한다. */
  useEffect(() => {
    const before = () => {
      document.documentElement.style.scrollSnapType = 'none';
    };
    const after = () => document.documentElement.style.removeProperty('scroll-snap-type');

    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);

  if (slides.length === 0) return null;

  const isLast = active === slides.length - 1;

  return (
    <div className="deck-chrome print:hidden">
      {/* 진행 도트 — PC는 오른쪽 세로, 모바일은 상단 가로 바 */}
      <nav className="deck-dots" aria-label="슬라이드 이동">
        {slides.map((slide, index) => (
          <button
            key={slide.dataset.slide ?? index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`${index + 1}번 슬라이드: ${slide.dataset.slideTitle ?? ''}`}
            aria-current={index === active ? 'true' : undefined}
            className={cn('deck-dot', index === active && 'is-active')}
          >
            <span className="deck-dot-label">{slide.dataset.slideTitle}</span>
          </button>
        ))}
      </nav>

      {/* 좌하단 상태 · 모드 전환 */}
      <div className="deck-status">
        <span className="tabular-nums">
          {active + 1} <span className="opacity-40">/ {slides.length}</span>
        </span>

        <button type="button" onClick={() => window.print()} className="deck-mode" title="덱 전체를 인쇄합니다">
          <Printer className="size-3" />
          인쇄
        </button>
      </div>

      {/* 다음 슬라이드 힌트 */}
      {!isLast && (
        <button type="button" onClick={() => goTo(active + 1)} className="deck-next" aria-label="다음 슬라이드">
          <ChevronDown className="size-5" />
        </button>
      )}
    </div>
  );
}
