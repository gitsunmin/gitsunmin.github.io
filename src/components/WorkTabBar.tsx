import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type Tab = {
  id: string;
  label: string;
};

type Props = {
  tabs: Tab[];
};

export function WorkTabBar({ tabs }: Props) {
  const [active, setActive] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (tabs.find((t) => t.id === hash)) return hash;
    }
    return tabs[0]?.id ?? '';
  });

  // hintTab: 센티넬이 보일 때 현재 active 값을 저장.
  // 탭이 바뀌면 hintTab !== active가 되어 힌트가 사라진다 (추가 setState 불필요).
  const [hintTab, setHintTab] = useState<string | null>(null);

  const scrollRef    = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeIndex = tabs.findIndex((t) => t.id === active);
  const nextTab     = tabs[activeIndex + 1] ?? null;
  const isLastTab   = nextTab === null;
  const hintVisible = hintTab === active;

  // ── 타이머 정리 ─────────────────────────────────────────────────────────────

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── 힌트 액션 (클릭 전용) ───────────────────────────────────────────────────

  const handleAction = useCallback(() => {
    clearTimer();
    setHintTab(null);
    if (nextTab) {
      setActive(nextTab.id);
      requestAnimationFrame(() => {
        document
          .querySelector('[data-work-tab-bar]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      window.location.href = '/works';
    }
  }, [nextTab, clearTimer]);

  const handleDismiss = useCallback(() => {
    clearTimer();
    setHintTab(null);
  }, [clearTimer]);

  // ── CSS 주입 (마운트 1회) ─────────────────────────────────────────────────────

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes hint-slide-up {
        from { opacity: 0; transform: translateX(-50%) translateY(120%); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      .work-next-hint {
        position: fixed;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        display: flex;
        align-items: center;
        height: 2.75rem;
        border-radius: 9999px;
        border: 1px solid hsl(var(--border) / 0.6);
        background: hsl(var(--background) / 0.94);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 4px 20px hsl(var(--foreground) / 0.07);
        overflow: hidden;
        white-space: nowrap;
        animation: hint-slide-up 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
        transition: border-color 180ms ease, box-shadow 180ms ease;
      }

      /* :has() 지원 브라우저에서 CTA 호버 시 pill 테두리·그림자 강조 */
      .work-next-hint:has(.work-next-hint__cta:hover) {
        border-color: hsl(var(--primary) / 0.35);
        box-shadow: 0 4px 24px hsl(var(--primary) / 0.1), 0 0 0 3px hsl(var(--primary) / 0.06);
      }

      .work-next-hint__cta {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0 0.625rem 0 1.125rem;
        height: 100%;
        font-size: 0.8125rem;
        font-weight: 500;
        color: hsl(var(--foreground) / 0.75);
        background: none;
        border: none;
        cursor: pointer;
        transition: color 150ms ease, transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
        outline: none;
      }

      .work-next-hint__cta:hover {
        color: hsl(var(--foreground));
      }

      .work-next-hint__cta:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: -2px;
        border-radius: 9999px;
      }

      .work-next-hint__cta:active {
        transform: scale(0.96);
        transition-duration: 80ms;
      }

      .work-next-hint__label {
        max-width: 12rem;
        overflow: hidden;
        text-overflow: ellipsis;
        color: hsl(var(--primary));
        font-weight: 600;
      }

      .work-next-hint__arrow {
        display: inline-block;
        color: hsl(var(--primary));
        transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .work-next-hint__cta:hover .work-next-hint__arrow {
        transform: translateX(4px);
      }

      .work-next-hint__divider {
        width: 1px;
        height: 1.25rem;
        background: hsl(var(--border) / 0.7);
        flex-shrink: 0;
      }

      .work-next-hint__close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 100%;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 0.75rem;
        color: hsl(var(--muted-foreground) / 0.6);
        transition: color 150ms ease, background 150ms ease;
        flex-shrink: 0;
        border-radius: 0 9999px 9999px 0;
      }

      .work-next-hint__close:hover {
        color: hsl(var(--foreground) / 0.7);
        background: hsl(var(--muted) / 0.35);
      }

      .work-next-hint__close:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: -2px;
        border-radius: 0 9999px 9999px 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .work-next-hint { animation: none; }
        .work-next-hint__cta,
        .work-next-hint__arrow,
        .work-next-hint__close { transition: none !important; }
      }

      @media (max-width: 480px) {
        .work-next-hint { bottom: 1rem; }
        .work-next-hint__cta { padding: 0 0.5rem 0 0.875rem; }
        .work-next-hint__label { max-width: 8rem; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ── 탭 콘텐츠 가시성 + URL hash 동기화 ────────────────────────────────────────

  useEffect(() => {
    tabs.forEach((tab) => {
      const el = document.querySelector(`[data-tab-content="${tab.id}"]`) as HTMLElement | null;
      if (!el) return;
      if (tab.id === active) {
        el.style.display = '';
        el.dataset.entering = 'true';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            delete el.dataset.entering;
          });
        });
      } else {
        el.style.display = 'none';
      }
    });

    const url = new URL(window.location.href);
    if (active === tabs[0]?.id) {
      history.replaceState(null, '', url.pathname + url.search);
    } else {
      history.replaceState(null, '', `${url.pathname}#${active}`);
    }
  }, [active, tabs]);

  // ── hash 기반 딥링크 ──────────────────────────────────────────────────────────

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (tabs.find((t) => t.id === hash)) setActive(hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [tabs]);

  // ── 활성 탭 버튼 가로 스크롤 인뷰 ────────────────────────────────────────────

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const btn = container.querySelector(`[data-tab-btn="${active}"]`) as HTMLElement | null;
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active]);

  // ── 센티넬 IntersectionObserver → 하단 도달 힌트 ─────────────────────────────
  // 탭이 변경되면 hintTab !== active가 되어 힌트는 자동으로 숨겨진다.
  // 모든 setState는 콜백 내부에서만 호출한다 (effect 내 동기 setState 금지 규칙).

  useEffect(() => {
    clearTimer();

    const sentinel = document.querySelector(`[data-tab-sentinel="${active}"]`);
    if (!sentinel) return clearTimer;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timerRef.current = setTimeout(() => {
            setHintTab(active);
          }, 600);
        } else {
          clearTimer();
          setHintTab(null);
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [active, clearTimer]);

  // ── 렌더 ─────────────────────────────────────────────────────────────────────

  const hintLabel  = isLastTab ? 'Works 목록' : nextTab?.label ?? '';
  const hintPrefix = isLastTab ? '← 돌아가기' : '다음';

  return (
    <>
      <div
        className="sticky z-10 -mx-4 md:mx-0 bg-background/95 backdrop-blur-sm border-b border-border/60 mb-6"
        style={{ top: '48px' }}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-auto px-4 md:px-0"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              data-tab-btn={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'shrink-0 relative px-4 py-3 text-sm font-medium whitespace-nowrap',
                'transition-colors duration-150 outline-none rounded-t',
                'focus-visible:ring-2 focus-visible:ring-primary',
                active === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              {active === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm tab-underline" />
              )}
            </button>
          ))}
        </div>
      </div>

      {hintVisible && typeof document !== 'undefined' &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            aria-label={`${hintPrefix}: ${hintLabel}`}
            className="work-next-hint"
          >
            <button
              type="button"
              onClick={handleAction}
              className="work-next-hint__cta"
            >
              <span style={{ color: 'hsl(var(--muted-foreground) / 0.8)', fontSize: '0.75rem' }}>
                {hintPrefix}
              </span>
              <span className="work-next-hint__label">{hintLabel}</span>
              <span className="work-next-hint__arrow" aria-hidden="true">
                {isLastTab ? '↩' : '→'}
              </span>
            </button>
            <span className="work-next-hint__divider" aria-hidden="true" />
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="힌트 닫기"
              className="work-next-hint__close"
            >
              ✕
            </button>
          </div>,
          document.body,
        )
      }
    </>
  );
}
