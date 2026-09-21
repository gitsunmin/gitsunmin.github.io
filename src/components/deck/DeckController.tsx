import { ChevronDown, List } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { DeckArch } from '@/components/deck/DeckArch';
import { DeckArrival } from '@/components/deck/DeckArrival';
import { DeckOutline } from '@/components/deck/DeckOutline';
import { DeckPosition } from '@/components/deck/DeckPosition';
import { markMatches } from '@/components/deck/markMatches';
import { buildOutline, locate, positionCrumbs } from '@/components/deck/outline';
import { WorkSearch } from '@/components/search/WorkSearch';
import { MOBILE_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import type { SearchHit } from '@/lib/workSearch';
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

/**
 * 첫 진입이면 스크롤을 표지에 붙인다.
 *
 * [id].astro의 인라인 스크립트가 첫 페인트 전에 한 번 하지만, 그것만으로는 모자란다.
 * ClientRouter가 scrollRestoration을 'manual'로 돌려 두어 브라우저의 스크롤 초기화가
 * 꺼져 있고, iOS Safari는 로드가 끝난 뒤에도 앞 문서의 오프셋을 되돌려 놓는 일이 있다.
 * 덱을 드러내기 직전 — 자동 축소로 높이가 확정된 뒤 — 에 한 번 더 굳힌다.
 *
 * 되돌아온 것(뒤로/앞으로)과 딥링크는 그 위치가 맞으므로 건드리지 않는다.
 */
function pinToTopIfFresh() {
  if (location.hash) return;
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (nav?.type === 'back_forward') return;
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

/**
 * 딥링크(#슬러그)가 가리키는 슬라이드로 바로 간다.
 *
 * 브라우저의 프래그먼트 이동에 맡기지 않는다. html에 scroll-behavior: smooth가 걸려 있어
 * 3만 px를 애니메이션으로 흘러가고, 그 사이 자동 축소가 높이를 바꿔 엉뚱한 곳에 멈춘다.
 * 배치가 끝난 뒤에 한 번, 즉시 이동으로 굳힌다.
 */
function jumpToHash() {
  if (!location.hash) return;
  let id = location.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* 깨진 인코딩은 그대로 둔다. */
  }
  const target = document.getElementById(id);
  if (!target) return;
  (target.closest<HTMLElement>('[data-slide]') ?? target).scrollIntoView({ behavior: 'instant', block: 'start' });
}

/** 검색에서 넘어올 때 실어 보낸 검색어(?q=). */
function arrivalQuery() {
  return new URLSearchParams(location.search).get('q')?.trim() ?? '';
}

/**
 * 슬라이드의 문서 좌표(문서 맨 위에서의 거리)를 전부 잰다.
 *
 * 레이아웃을 강제로 계산하는 무거운 일이라, 스크롤 중에는 절대 부르지 않는다.
 * 높이가 실제로 달라지는 순간 — 리사이즈, 폰트 도착, 자동 축소 — 에만 다시 잰다.
 */
function measureTops(slides: HTMLElement[]) {
  const base = window.scrollY;
  return slides.map((slide) => slide.getBoundingClientRect().top + base);
}

/**
 * 현재 스크롤 위치에서 가장 위쪽에 걸린 슬라이드를 고른다.
 *
 * 재어 둔 좌표만 보므로 레이아웃을 읽지 않는다. 좌표는 오름차순이라
 * "기준선 위에 있는 마지막 슬라이드"를 이분 탐색으로 찾을 수 있다.
 */
function activeFromTops(tops: number[]) {
  const line = window.scrollY + window.innerHeight * 0.35;
  let low = 0;
  let high = tops.length - 1;
  let index = 0;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (tops[mid] <= line) {
      index = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
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

/** 슬라이드가 지금 배율에서 한 화면에 들어가는지. 1px은 소수점 반올림 여유다. */
function fits(body: HTMLElement) {
  return body.scrollHeight <= body.clientHeight + 1;
}

/**
 * 여러 슬라이드를 한꺼번에 맞춘다.
 *
 * 슬라이드마다 zoom을 쓰고 곧바로 높이를 읽으면 그때마다 레이아웃이 다시 돈다.
 * 배율 단계별로 "전부 쓰고 → 전부 읽기"로 묶으면 레이아웃이 단계 수만큼만 돈다.
 * 93장짜리 marketbom-pro에서 113ms → 35ms.
 */
function fitSlides(targets: HTMLElement[]) {
  // 화면 밖 슬라이드는 content-visibility로 렌더를 건너뛰는데, 그 상태에서는
  // scrollHeight가 실제 내용이 아니라 예약 크기를 돌려준다. 재는 동안만 켠다.
  for (const slide of targets) slide.style.contentVisibility = 'visible';

  try {
    let pending = targets.filter((slide) => slide.firstElementChild instanceof HTMLElement);

    for (const step of FIT_STEPS) {
      for (const slide of pending) {
        (slide.firstElementChild as HTMLElement).style.zoom = step === 1 ? '' : String(step);
      }

      pending = pending.filter((slide) => {
        if (!fits(slide.firstElementChild as HTMLElement)) return true;
        delete slide.dataset.slideOverflow;
        return false;
      });

      if (pending.length === 0) return;
    }

    // 최소 단계에서도 넘치면 슬라이드 안 스크롤에 맡기고, 더 있다는 표시를 남긴다.
    for (const slide of pending) slide.dataset.slideOverflow = '';
  } finally {
    for (const slide of targets) slide.style.removeProperty('content-visibility');
  }
}

export function DeckController() {
  const slides = useSyncExternalStore(slideStore.subscribe, slideStore.getSnapshot, slideStore.getServerSnapshot);
  const [active, setActive] = useState(0);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  /** 검색에서 넘어왔을 때의 검색어. 위치 표시줄에 칩으로 남고, 도착한 장을 하이라이트한다. */
  const [arrived, setArrived] = useState('');
  const clearMarks = useRef<() => void>(() => {});

  /** 슬라이드 하나를 잠깐 밝히고 검색어를 <mark>로 감싼다. 앞선 하이라이트는 지운다. */
  const spotlight = useCallback((slide: HTMLElement | undefined, query: string) => {
    clearMarks.current();
    clearMarks.current = () => {};
    if (!slide) return;
    slide.dataset.slideSpot = '';
    const timer = window.setTimeout(() => delete slide.dataset.slideSpot, 1800);
    const unmark = query ? markMatches(slide, query) : () => {};
    clearMarks.current = () => {
      window.clearTimeout(timer);
      delete slide.dataset.slideSpot;
      unmark();
    };
  }, []);

  /* ── 목차 계층 ──────────────────────────────────────────────
     슬라이드 제목(data-slide-title)만 읽어 장 › 묶음 › 슬라이드로 접는다.
     최상위 장의 이름은 페이지가 [data-deck]에 적어 둔 덱 제목이다. */
  const outline = useMemo(() => {
    const deck = slides[0]?.closest<HTMLElement>('[data-deck]');
    const rootTitle = deck?.dataset.deckTitle ?? '개요';
    return buildOutline(
      slides.map((slide) => ({ id: slide.dataset.slide ?? '', title: slide.dataset.slideTitle ?? '' })),
      rootTitle,
    );
  }, [slides]);
  const position = useMemo(() => locate(outline, active), [outline, active]);

  /* ── 검색 스코프 ────────────────────────────────────────────
     이 덱이 어느 프로젝트인지는 [data-deck]이 적어 둔 id·제목으로 안다. */
  const searchScope = useMemo(() => {
    const deck = slides[0]?.closest<HTMLElement>('[data-deck]');
    const id = deck?.dataset.deckId;
    const title = deck?.dataset.deckTitle;
    return id && title ? { id, title } : null;
  }, [slides]);

  /* ── 현재 슬라이드 추적 ─────────────────────────────────────
     교차 비율만으로는 순서를 못 정한다. 300svh짜리 Story 슬라이드처럼 뷰포트보다
     큰 슬라이드가 섞여 있으면 비율이 뒤집히기 때문이다. 그래서 기하로 계산하되,
     좌표를 미리 재 두고 스크롤 중에는 그 값만 본다 — 80장짜리 덱에서 매 프레임
     80번씩 레이아웃을 강제로 계산하던 것이 스크롤이 끊기던 이유였다. */
  useEffect(() => {
    if (slides.length === 0) return;

    let tops = measureTops(slides);
    let frame: number | null = null;
    let disposed = false;

    const update = () => {
      if (disposed || frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setActive(activeFromTops(tops));
      });
    };

    const remeasure = () => {
      if (disposed) return;
      tops = measureTops(slides);
      update();
    };

    // 문서 높이가 실제로 달라질 때만 다시 잰다. 자동 축소, 이미지 도착,
    // details 펼침이 모두 여기로 모인다.
    const resize = new ResizeObserver(remeasure);
    resize.observe(document.documentElement);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', remeasure);
    document.fonts?.ready.then(remeasure);
    update();

    return () => {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', remeasure);
    };
  }, [slides]);

  /* ── 첫 배치와 그 뒤의 보정 ─────────────────────────────────
     발표 슬라이드는 스크롤해서 읽는 문서가 아니다. 넘치는 슬라이드는 줄여서
     한눈에 들어오게 하고, 접혀 있던 보조 자료는 미리 펼쳐 둔다 —
     발표 도중에 클릭해서 펼쳐야 하는 내용은 없는 편이 낫다.

     그 계산은 덱 전체를 한 번 훑는 일이라 93장에서 수십 ms가 걸린다. 예전에는
     이걸 리사이즈·폰트 도착·details 펼침마다 통째로 다시 돌렸는데, 모바일에서
     스크롤할 때 주소창이 접히며 resize가 뜨면 스크롤 한복판에서 그 작업이
     끼어들었다. 지금은 첫 배치를 로딩 화면 뒤에서 한 번에 끝내고, 그 뒤로는
     정말 필요한 슬라이드만 다시 잰다. */
  useEffect(() => {
    const root = document.documentElement;
    // 표지 고정은 딱 한 번. 배치가 늦어져 실패 안전장치가 대신 드러낼 때,
    // 그 사이 이미 읽기 시작한 사람을 맨 위로 끌어올리지 않기 위해서다.
    let pinned = false;
    const reveal = () => {
      if (!pinned) {
        pinned = true;
        pinToTopIfFresh();
        jumpToHash();
        // 검색에서 왔으면 도착한 장을 밝히고 검색어를 표시한다.
        const query = arrivalQuery();
        if (query && location.hash) {
          setArrived(query);
          const id = decodeURIComponent(location.hash.slice(1));
          const slide = document.getElementById(id)?.closest<HTMLElement>('[data-slide]') ?? undefined;
          spotlight(slide, query);
        }
      }
      delete root.dataset.deckBooting;
    };

    const targets = slides.filter((slide) => !isStorySlide(slide));
    if (targets.length === 0) {
      reveal();
      return;
    }

    for (const slide of targets) {
      for (const details of slide.querySelectorAll('details')) details.open = true;
    }

    let disposed = false;

    // ── 첫 배치. 폰트가 도착하면 줄 수가 달라지므로 한 번 더 재고 나서 드러낸다.
    fitSlides(targets);
    const settle = () => {
      if (disposed) return;
      fitSlides(targets);
      reveal();
    };
    if (document.fonts) document.fonts.ready.then(settle);
    else settle();
    // 폰트가 끝내 도착하지 않아도 덱이 가려진 채로 남지는 않게 한다.
    const failsafe = window.setTimeout(reveal, 3000);

    // ── 한 장만 다시 재기. details를 펼치거나 이미지가 도착한 슬라이드만 해당한다.
    const listeners: Array<[EventTarget, string, EventListener]> = [];
    const refitOne = (slide: HTMLElement) => () => {
      if (!disposed) fitSlides([slide]);
    };

    for (const slide of targets) {
      // toggle은 버블링하지 않으므로 캡처 단계에서 받는다.
      const onToggle = refitOne(slide);
      slide.addEventListener('toggle', onToggle, true);
      listeners.push([slide, 'toggle', onToggle]);

      for (const image of slide.querySelectorAll('img')) {
        if (image.complete) continue;
        const onLoad = refitOne(slide);
        image.addEventListener('load', onLoad, { once: true });
        listeners.push([image, 'load', onLoad]);
      }
    }

    // ── 창 크기가 정말 달라졌을 때만 전부 다시 잰다.
    // 모바일 주소창이 접히면 innerHeight가 100px 남짓 흔들리는데, 그건 배치를
    // 다시 할 이유가 되지 않는다. 폭이 바뀌거나 높이가 크게 달라졌을 때만 센다.
    const viewportKey = () => `${window.innerWidth}x${Math.round(window.innerHeight / 120)}`;
    let viewport = viewportKey();
    let timer: number | null = null;

    const onResize = () => {
      const next = viewportKey();
      if (next === viewport) return;
      viewport = next;
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = null;
        if (!disposed) fitSlides(targets);
      }, 150);
    };

    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      window.clearTimeout(failsafe);
      if (timer !== null) window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      for (const [target, type, handler] of listeners) {
        target.removeEventListener(type, handler, type === 'toggle');
      }
      for (const slide of targets) {
        delete slide.dataset.slideOverflow;
        const body = slide.firstElementChild;
        if (body instanceof HTMLElement) body.style.zoom = '';
      }
      reveal();
    };
  }, [slides, spotlight]);

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
      // 슬라이드가 화면에 들어오기 한참 전(뷰포트 40% 앞)부터 연출을 시작한다.
      // 0.35를 기준으로 삼았을 때는 스냅이 끝나갈 무렵에야 페이드가 시작돼,
      // 착지한 다음에 글이 뒤늦게 떠오르는 것처럼 보였다.
      { rootMargin: '40% 0px', threshold: 0.01 },
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
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      const target = slides[clamped];
      if (!target) return;
      // 옆 장으로는 미끄러지고, 목차·검색으로 멀리 뛸 때는 바로 간다. 3만 px를
      // 애니메이션으로 흘러가는 걸 지켜보는 건 이동이 아니라 기다림이고, mandatory 스냅이
      // 그 사이 어느 장에 붙잡을지도 알 수 없다.
      const behavior = Math.abs(clamped - active) <= 1 ? 'smooth' : 'instant';
      target.scrollIntoView({ behavior, block: 'start' });
    },
    [slides, active],
  );

  /* 같은 프로젝트의 결과는 페이지를 옮기지 않고 그 슬라이드로 간다. */
  const navigateWithin = useCallback(
    (hit: SearchHit, query: string) => {
      if (!searchScope || hit.record.workId !== searchScope.id) return false;
      const { slug } = hit.record;
      if (!slug) return false;
      const target = document.getElementById(slug)?.closest<HTMLElement>('[data-slide]');
      const index = target ? slides.indexOf(target) : -1;
      if (index === -1) return false;
      goTo(index);
      history.replaceState(null, '', `?q=${encodeURIComponent(query)}#${slug}`);
      setArrived(query);
      spotlight(target ?? undefined, query);
      return true;
    },
    [searchScope, slides, goTo, spotlight],
  );

  /* ── 키보드 ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // 목차 필터처럼 글자를 받는 곳에 포커스가 있으면 덱 단축키를 양보한다.
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"], [data-search-root]')) {
        if (event.key === 'Escape') setOutlineOpen(false);
        return;
      }

      if (event.key === 't' || event.key === 'T') {
        event.preventDefault();
        setOutlineOpen((prev) => !prev);
        return;
      }
      if (event.key === 'Escape') {
        setOutlineOpen(false);
        return;
      }

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

  /* ── 넘치는 슬라이드의 끝에서 한 번 더 밀면 다음 장 ──────────────
     한 화면에 안 들어가는 슬라이드는 안쪽 상자가 스크롤된다. 그 상자의 끝에 닿은 뒤
     계속 미는 힘은 문서로 이어지지 않게 막고(overscroll-behavior: contain, deck.css),
     여기서 받아 옆 장으로 보낸다. 브라우저의 스크롤 연쇄에 맡기면 데스크톱은
     바로 튀고 iOS는 안쪽 상자만 튕기고 말아, 어느 쪽도 뜻대로 되지 않는다.

     끝에 닿자마자 넘어가면 실수로 지나친다. 끝에서 더 민 거리가 문턱을 넘어야
     넘어가고, 방향이 바뀌거나 잠깐 쉬면 다시 센다. */
  useEffect(() => {
    const WHEEL_THRESHOLD = 90;
    const TOUCH_THRESHOLD = 72;
    const REST_MS = 400;
    const COOLDOWN_MS = 700;

    let accumulated = 0;
    let lastAt = 0;
    let cooldownUntil = 0;
    let touchY: number | null = null;
    // 터치는 손을 뗀 뒤에 넘어간다. iOS는 손가락이 화면에 있는 동안 프로그램 스크롤을
    // 무시하므로, 문턱을 넘었다는 것만 기억해 두었다가 touchend에서 간다.
    let touchJump = 0;

    // 지금 읽는 슬라이드의 스크롤 상자. 넘치지 않는 슬라이드면 null — 그건 문서 스냅이 맡는다.
    const scrollBox = (target: EventTarget | null) => {
      const slide = slides[active];
      const box = slide?.firstElementChild;
      if (!(box instanceof HTMLElement) || isStorySlide(slide)) return null;
      if (box.scrollHeight <= box.clientHeight + 1) return null;
      if (!(target instanceof Node) || !box.contains(target)) return null;
      return box;
    };

    // 끝에서 민 만큼을 더하고, 문턱을 넘으면 방향(±1)을 돌려준다. 양수가 아래.
    const push = (box: HTMLElement, delta: number, threshold: number): 0 | 1 | -1 => {
      const now = performance.now();
      if (now < cooldownUntil) return 0;
      const atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
      const atTop = box.scrollTop <= 0;
      const pastEnd = (delta > 0 && atBottom) || (delta < 0 && atTop);
      if (!pastEnd) {
        accumulated = 0;
        return 0;
      }
      if (now - lastAt > REST_MS || Math.sign(accumulated) !== Math.sign(delta)) accumulated = 0;
      lastAt = now;
      accumulated += delta;
      if (Math.abs(accumulated) < threshold) return 0;
      accumulated = 0;
      cooldownUntil = now + COOLDOWN_MS;
      return delta > 0 ? 1 : -1;
    };

    const onWheel = (event: WheelEvent) => {
      const box = scrollBox(event.target);
      if (!box) return;
      const direction = push(box, event.deltaY, WHEEL_THRESHOLD);
      if (direction) goTo(active + direction);
    };
    const onTouchStart = (event: TouchEvent) => {
      touchJump = 0;
      touchY = scrollBox(event.target) ? event.touches[0].clientY : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchY === null || touchJump) return;
      const box = scrollBox(event.target);
      if (!box) return;
      const y = event.touches[0].clientY;
      // 손가락이 위로 가면 내용은 아래로 — 스크롤 방향과 같게 부호를 뒤집는다.
      touchJump = push(box, touchY - y, TOUCH_THRESHOLD);
      touchY = y;
    };
    const onTouchEnd = () => {
      const direction = touchJump;
      touchJump = 0;
      touchY = null;
      accumulated = 0;
      if (direction) goTo(active + direction);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [active, goTo, slides]);

  /* ── 코드·표의 가로 스크롤(터치) ─────────────────────────────
     iOS Safari는 세로 mandatory 스냅 컨테이너 안에 든 가로 스크롤러를 손가락으로
     밀어도 움직이지 않는다 — 제스처를 스냅 컨테이너가 먼저 가져간다. 가로로 시작한
     드래그를 여기서 받아 직접 scrollLeft를 움직이고, 손을 떼면 남은 속도만큼 미끄러진다.
     세로로 시작한 드래그는 건드리지 않아 문서 스크롤이 그대로 동작한다. */
  useEffect(() => {
    const AXIS_LOCK = 6;
    const FRICTION = 0.94;

    // 손가락 아래에서 가장 가까운, 실제로 가로로 넘치는 스크롤러.
    const horizontalScroller = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      for (let node: Element | null = target; node && !node.hasAttribute('data-slide'); node = node.parentElement) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.scrollWidth <= node.clientWidth + 1) continue;
        const overflowX = getComputedStyle(node).overflowX;
        if (overflowX === 'auto' || overflowX === 'scroll') return node;
      }
      return null;
    };

    let scroller: HTMLElement | null = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    // 상자에 자동 축소(zoom)가 걸려 있으면 손가락 1px이 상자 안에서는 1/zoom px다.
    let scale = 1;
    let lastX = 0;
    let lastAt = 0;
    let velocity = 0;
    let axis: 'x' | 'y' | null = null;
    let glide: number | null = null;

    const stopGlide = () => {
      if (glide !== null) cancelAnimationFrame(glide);
      glide = null;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      stopGlide();
      scroller = horizontalScroller(event.target);
      if (!scroller) return;
      const touch = event.touches[0];
      startX = lastX = touch.clientX;
      startY = touch.clientY;
      startLeft = scroller.scrollLeft;
      const box = scroller.closest('[data-slide]')?.firstElementChild;
      scale = box instanceof HTMLElement ? Number(box.style.zoom) || 1 : 1;
      lastAt = performance.now();
      velocity = 0;
      axis = null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!scroller || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (axis === null) {
        if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis === 'y') {
          scroller = null;
          return;
        }
      }
      // 가로 제스처는 우리가 맡는다. 기본 동작을 막아야 스냅 컨테이너가 끼어들지 않는다.
      if (event.cancelable) event.preventDefault();
      scroller.scrollLeft = startLeft - dx / scale;
      const now = performance.now();
      const dt = now - lastAt;
      if (dt > 0) velocity = (lastX - touch.clientX) / scale / dt;
      lastX = touch.clientX;
      lastAt = now;
    };

    const onTouchEnd = () => {
      const el = scroller;
      scroller = null;
      if (!el || axis !== 'x' || Math.abs(velocity) < 0.05) return;
      // 관성. 브라우저가 해 주던 것을 잃었으니 흉내만 낸다 — 프레임마다 조금씩 줄어든다.
      let v = velocity * 16;
      const step = () => {
        el.scrollLeft += v;
        v *= FRICTION;
        glide = Math.abs(v) > 0.5 ? requestAnimationFrame(step) : null;
      };
      glide = requestAnimationFrame(step);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      stopGlide();
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

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
  const toggleOutline = () => setOutlineOpen((prev) => !prev);
  const crumbs = positionCrumbs(outline, position);
  const archCrumbs = crumbs ? [crumbs.chapter, crumbs.group, crumbs.item].filter((c): c is string => !!c) : [];
  const dismissArrival = () => {
    setArrived('');
    clearMarks.current();
    history.replaceState(null, '', location.pathname + location.hash);
  };

  // 검색은 단축키와 시트를 하나만 가져야 하므로 한 곳에만 그린다.
  // PC는 위치 표시줄 옆, 모바일은 아래 플로팅 버튼 묶음이다.
  const search = (
    <WorkSearch
      variant="icon"
      scope={searchScope}
      onNavigateWithin={navigateWithin}
      className={isMobile ? 'deck-fab-button' : 'deck-position-search'}
    />
  );

  return (
    <div className="deck-chrome print:hidden">
      {/* 위치 — PC는 좌상단 알약, 모바일은 화면 가장자리를 도는 아치 */}
      {isMobile ? (
        <DeckArch
          crumbs={archCrumbs}
          onOpen={toggleOutline}
        >
          {arrived && <DeckArrival query={arrived} onDismiss={dismissArrival} />}
        </DeckArch>
      ) : (
        <DeckPosition
          outline={outline}
          position={position}
          active={active}
          total={slides.length}
          outlineOpen={outlineOpen}
          onToggleOutline={toggleOutline}
          search={search}
          arrivedQuery={arrived}
          onDismissArrival={dismissArrival}
        />
      )}

      {/* 전체 목차 — PC는 왼쪽 사이드 패널, 모바일은 하단 시트 */}
      <DeckOutline
        outline={outline}
        active={active}
        open={outlineOpen}
        onOpenChange={setOutlineOpen}
        onGoTo={goTo}
      />

      {/* 진행 레일(PC) — 장마다 한 칸. 도트 93개를 세로로 늘어놓던 자리다.
          칸의 길이는 장의 슬라이드 수에 비례하고, 지금 읽는 장만 채워진다. */}
      <nav className="deck-rail" aria-label="장 이동">
        {outline.map((chapter, i) => {
          const next = outline[i + 1];
          const startIndex = chapter.index;
          const endIndex = next ? next.index : slides.length;
          const count = Math.max(1, endIndex - startIndex);
          const isCurrent = active >= startIndex && active < endIndex;
          const fill = isCurrent ? (active - startIndex + 1) / count : active >= endIndex ? 1 : 0;
          return (
            <button
              key={chapter.index}
              type="button"
              onClick={() => goTo(chapter.index)}
              aria-label={`${chapter.title} (${count}장)`}
              aria-current={isCurrent ? 'true' : undefined}
              className={cn('deck-rail-segment', isCurrent && 'is-active')}
              style={{ flexGrow: count, '--deck-rail-fill': fill } as React.CSSProperties}
            >
              <span className="deck-rail-label">{chapter.title}</span>
            </button>
          );
        })}
      </nav>

      {/* 모바일 하단 바 — 왼쪽 목차, 가운데 쪽수, 오른쪽 검색. 상단 아치는 읽는
          자리라 누르는 것은 여기로 모은다. */}
      {isMobile && (
        <div className="deck-fab">
          <button
            type="button"
            onClick={toggleOutline}
            aria-expanded={outlineOpen}
            aria-label="목차 열기"
            className="deck-fab-button"
          >
            <List className="size-5" strokeWidth={1.75} />
          </button>
          <span className="deck-fab-counter tabular-nums" aria-label={`${active + 1} / ${slides.length} 쪽`}>
            {active + 1}
            <span className="opacity-40"> / {slides.length}</span>
          </span>
          {search}
        </div>
      )}

      {/* 다음 슬라이드 힌트 */}
      {!isLast && (
        <button type="button" onClick={() => goTo(active + 1)} className="deck-next" aria-label="다음 슬라이드">
          <ChevronDown className="size-5" />
        </button>
      )}
    </div>
  );
}

