import { Career } from '@/data/careers';
import { cn } from '@/lib/utils';
import { CareerLinks, CareerLogo, RelatedWorks, TIMELINE_RAIL_X } from '@/components/CareerParts';
import { TechTag } from '@/components/TechTag';
import { useInView } from '@/hooks/useInView';
import { ChevronDown, Undo2 } from 'lucide-react';
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

type CareerItem = (typeof Career)[number];
type Point = { x: number; y: number };

const TITLE_BAR_H = 40; // h-10
/** 분기점의 y 좌표. 붙어 있는 창의 타이틀바 가운데와 높이를 맞춰 선이 수평으로 뻗게 한다. */
const FORK_Y = TITLE_BAR_H / 2;
/** 창을 떼어냈을 때 원래 자리에 남기는 빈 슬롯의 높이. 캡션이 들어갈 만큼만 남긴다. */
const SLOT_H = 72;
/** 이 거리 안에서 놓으면 원래 자리에 다시 붙는다. */
const SNAP_DISTANCE = 64;
const DOCK_MS = 350;
const ROW_MS = 400;
/** 창이 화면 가장자리에 붙지 않도록 남기는 여백. */
const EDGE = 8;
const KEY_STEP = 16;
const KEY_STEP_LARGE = 64;
const MAX_SAG = 60;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isCurrent = (career: CareerItem) => career.range.trim().endsWith('~');

// --- 내용 조각 ---

const Collapsible = ({ open, id, children }: { open: boolean; id: string; children: ReactNode }) => (
  <div
    id={id}
    inert={!open}
    style={{
      display: 'grid',
      gridTemplateRows: open ? '1fr' : '0fr',
      opacity: open ? 1 : 0,
      transition: 'grid-template-rows 0.35s ease, opacity 0.25s ease',
    }}
  >
    <div style={{ minHeight: 0, overflow: 'hidden' }}>{children}</div>
  </div>
);

const PersonalSummary = ({ career }: { career: CareerItem }) => (
  <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
    <CareerLogo career={career} className="size-10 shrink-0" />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold text-foreground tracking-tight">{career.name}</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-muted/60 text-muted-foreground border border-border/60">
          개인 프로젝트
        </span>
      </div>
      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
        <span>{career.position}</span>
        <span className="text-border">|</span>
        <span className="inline-flex gap-1.5 whitespace-nowrap">
          <span className="tabular-nums">{career.range}</span>
          {isCurrent(career) && <span className="text-primary font-medium">운영 중</span>}
        </span>
      </div>
    </div>
  </div>
);

const PersonalDetails = ({
  career,
  showLinks,
  activeFilter,
  onTechClick,
}: {
  career: CareerItem;
  showLinks: boolean;
  activeFilter: string | null;
  onTechClick: (tech: string) => void;
}) => (
  <>
    <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
      {career.introduce}
    </p>
    <TechTag techs={career.techs} activeFilter={activeFilter} onTechClick={onTechClick} />
    {showLinks && <CareerLinks career={career} size="sm" className="mt-4" />}
    <RelatedWorks career={career} className="mt-4 pt-4 border-t border-border/40" />
  </>
);

// --- 모바일·태블릿: 요약이 늘 보이는 펼치기 카드 ---

const PersonalCareerPeek = ({
  career,
  activeFilter,
  onTechClick,
}: {
  career: CareerItem;
  activeFilter: string | null;
  onTechClick: (tech: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <div className="lg:hidden pr-3 md:pl-20">
      <div className="rounded-2xl border border-border/60 border-l-2 border-l-primary/60 bg-card/80 backdrop-blur-sm">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center gap-3 p-4 rounded-2xl"
        >
          <PersonalSummary career={career} />
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform duration-300',
              open && 'rotate-180',
            )}
          />
        </button>
        <Collapsible open={open} id={detailsId}>
          <div className="px-4 pb-4 pt-1">
            <PersonalDetails
              career={career}
              showLinks
              activeFilter={activeFilter}
              onTechClick={onTechClick}
            />
          </div>
        </Collapsible>
      </div>
    </div>
  );
};

// --- 데스크톱: 고용 레일에서 갈라져 나온 떠 있는 창 ---

/**
 * 개인 작업을 고용 레일 맨 위에서 갈라져 나온 작은 창으로 보여준다.
 *
 * - 처음에는 분기점 오른쪽 슬롯에 붙어 있고(in-flow), 타이틀바를 끌면 떼어져
 *   타임라인 컨테이너 기준 좌표(absolute)로 움직인다. 화면이 아니라 문서에
 *   놓이므로 스크롤하면 함께 지나간다.
 * - 분기선은 컨테이너 전체를 덮는 SVG 하나로 그리고, 창이 움직이는 동안에만
 *   requestAnimationFrame으로 다시 그린다. React 상태를 거치지 않고 path를
 *   직접 고쳐서 드래그 중 카드 전체가 다시 렌더링되지 않게 한다.
 * - 창과 SVG는 이 행 안에 있지만 행은 position을 갖지 않으므로, absolute 기준은
 *   타임라인 컨테이너가 된다. 필터 접힘용 overflow: hidden에도 잘리지 않는다.
 */
export const PersonalCareerBranch = ({
  career,
  containerRef,
  collapsed,
  activeFilter,
  onTechClick,
}: {
  career: CareerItem;
  containerRef: RefObject<HTMLDivElement | null>;
  /** 기술 필터에 걸려 숨겨야 하는지. */
  collapsed: boolean;
  activeFilter: string | null;
  onTechClick: (tech: string) => void;
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const detailsId = useId();

  /** null이면 슬롯에 붙어 있다. 값이 있으면 컨테이너 기준 좌표로 떠 있다. */
  const [pos, setPos] = useState<Point | null>(null);
  const [rowHeight, setRowHeight] = useState<number | undefined>(undefined);
  const [dragging, setDragging] = useState(false);
  const [docking, setDocking] = useState(false);
  const [open, setOpen] = useState(false);

  // 이벤트 핸들러와 rAF 루프가 최신 값을 읽도록 상태를 ref로도 들고 있는다.
  const posRef = useRef<Point | null>(null);
  const dockingRef = useRef(false);
  const dragRef = useRef<{ pointerId: number; start: Point; origin: Point; last: Point } | null>(
    null,
  );
  const sagRef = useRef<Point>({ x: 0, y: 0 });
  const sagVelRef = useRef<Point>({ x: 0, y: 0 });
  const loopRef = useRef({ raf: 0, until: 0 });
  const dockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const updatePos = useCallback((next: Point | null) => {
    posRef.current = next;
    setPos(next);
  }, []);

  // --- 분기선 ---

  const draw = useCallback(() => {
    const container = containerRef.current;
    const win = windowRef.current;
    const path = pathRef.current;
    if (!container || !win || !path) return;

    const c = container.getBoundingClientRect();
    const w = win.getBoundingClientRect();
    // lg 미만에서는 창이 display: none이라 크기가 0이다.
    if (w.width === 0) {
      path.setAttribute('d', '');
      return;
    }

    const fx = TIMELINE_RAIL_X;
    const fy = FORK_Y;
    const left = w.left - c.left;
    const right = w.right - c.left;
    // 창이 분기점보다 왼쪽으로 가면 오른쪽 모서리에 잇는다.
    const ax = (left + right) / 2 >= fx ? left : right;
    const ay = w.top - c.top + TITLE_BAR_H / 2;
    const half = (ax - fx) / 2;
    const sag = sagRef.current;

    path.setAttribute(
      'd',
      `M ${fx} ${fy} C ${fx + half + sag.x} ${fy + sag.y}, ${ax - half + sag.x} ${ay + sag.y}, ${ax} ${ay}`,
    );
  }, [containerRef]);

  /** ms 동안(또는 드래그·출렁임이 끝날 때까지) 매 프레임 분기선을 다시 그린다. */
  const kick = useCallback(
    (ms = 0) => {
      const loop = loopRef.current;
      loop.until = Math.max(loop.until, performance.now() + ms);
      // 백그라운드 탭에서는 rAF가 멈추므로 한 번은 바로 그려 둔다.
      draw();
      if (loop.raf) return;

      const tick = () => {
        // 줄이 창을 늦게 따라오는 느낌을 주는 감쇠 스프링.
        const sag = sagRef.current;
        const vel = sagVelRef.current;
        vel.x = (vel.x - sag.x * 0.12) * 0.82;
        vel.y = (vel.y - sag.y * 0.12) * 0.82;
        sag.x = clamp(sag.x + vel.x, -MAX_SAG, MAX_SAG);
        sag.y = clamp(sag.y + vel.y, -MAX_SAG, MAX_SAG);

        draw();

        const settled =
          Math.abs(sag.x) + Math.abs(sag.y) + Math.abs(vel.x) + Math.abs(vel.y) < 0.1;
        if (dragRef.current || !settled || performance.now() < loop.until) {
          loop.raf = requestAnimationFrame(tick);
        } else {
          sag.x = sag.y = vel.x = vel.y = 0;
          loop.raf = 0;
          draw();
        }
      };
      loop.raf = requestAnimationFrame(tick);
    },
    [draw],
  );

  const pushSag = (dx: number, dy: number) => {
    if (prefersReducedMotion()) return;
    sagVelRef.current.x -= dx * 0.35;
    sagVelRef.current.y -= dy * 0.35;
  };

  // --- 좌표 계산 ---

  const clampToBounds = (p: Point): Point => {
    const container = containerRef.current;
    const win = windowRef.current;
    if (!container || !win) return p;

    const c = container.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    // 가로는 콘텐츠 열 바깥 여백까지 허용하고, 세로는 타임라인 영역 안에 둔다.
    const minX = EDGE - c.left;
    const maxX = viewportWidth - c.left - win.offsetWidth - EDGE;
    const minY = EDGE - (c.top + window.scrollY);
    const maxY = container.offsetHeight - win.offsetHeight;
    return { x: clamp(p.x, minX, Math.max(minX, maxX)), y: clamp(p.y, minY, Math.max(minY, maxY)) };
  };

  const relativeTo = (el: HTMLElement | null): Point | null => {
    const container = containerRef.current;
    if (!container || !el) return null;
    const c = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - c.left, y: r.top - c.top };
  };

  // 붙는 중에는 posRef가 이미 목적지라서, 화면에 보이는 실제 위치에서 이어 잡는다.
  const currentPos = () =>
    (dockingRef.current ? null : posRef.current) ?? relativeTo(windowRef.current);

  // --- 붙이기·떼어내기 ---

  const dock = () => {
    const target = relativeTo(slotRef.current);
    const win = windowRef.current;
    if (!target || !win) return;

    clearTimeout(dockTimerRef.current);
    dockingRef.current = true;
    setDocking(true);
    updatePos(target);
    // 슬롯을 창 높이만큼 다시 벌린 뒤, 이동이 끝나면 in-flow로 되돌린다.
    setRowHeight(win.offsetHeight);
    dockTimerRef.current = setTimeout(
      () => {
        dockingRef.current = false;
        setDocking(false);
        updatePos(null);
        setRowHeight(undefined);
      },
      prefersReducedMotion() ? 0 : DOCK_MS,
    );
  };

  const undockAt = (next: Point) => {
    clearTimeout(dockTimerRef.current);
    dockingRef.current = false;
    setDocking(false);
    updatePos(next);
  };

  const settleAfterMove = () => {
    const target = relativeTo(slotRef.current);
    const current = posRef.current;
    if (target && current && Math.hypot(current.x - target.x, current.y - target.y) < SNAP_DISTANCE) {
      dock();
    } else {
      setRowHeight(SLOT_H);
    }
  };

  // --- 포인터 드래그 ---

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    const origin = currentPos();
    if (!origin) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    const point = { x: e.clientX, y: e.clientY };
    dragRef.current = { pointerId: e.pointerId, start: point, origin, last: point };

    // 창이 흐름에서 빠져도 아래 카드가 드래그 도중 튀지 않도록 행 높이를 잡아 둔다.
    if (rowRef.current) setRowHeight(rowRef.current.offsetHeight);
    undockAt(origin);
    setDragging(true);
    kick();
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    pushSag(e.clientX - drag.last.x, e.clientY - drag.last.y);
    drag.last = { x: e.clientX, y: e.clientY };
    updatePos(
      clampToBounds({
        x: drag.origin.x + e.clientX - drag.start.x,
        y: drag.origin.y + e.clientY - drag.start.y,
      }),
    );
  };

  const handlePointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    settleAfterMove();
  };

  // --- 키보드 이동 ---

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;

    if (e.key === 'Home' || e.key === 'Escape') {
      if (posRef.current) {
        e.preventDefault();
        dock();
      }
      return;
    }

    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const delta: Partial<Record<string, Point>> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const d = delta[e.key];
    const origin = currentPos();
    if (!d || !origin) return;

    e.preventDefault();
    setRowHeight(SLOT_H);
    undockAt(clampToBounds({ x: origin.x + d.x, y: origin.y + d.y }));
  };

  // --- 레이아웃 변화 추적 ---

  useEffect(() => {
    const container = containerRef.current;
    const win = windowRef.current;
    if (!container || !win) return;

    // 필터로 카드가 접히는 동안 컨테이너 크기가 매 프레임 바뀌므로 여기서 따라 그린다.
    const observer = new ResizeObserver(() => kick(100));
    observer.observe(container);
    observer.observe(win);

    const handleResize = () => {
      if (posRef.current) updatePos(clampToBounds(posRef.current));
      kick(100);
    };
    window.addEventListener('resize', handleResize);

    const loop = loopRef.current;
    const dockTimer = dockTimerRef;
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(loop.raf);
      loop.raf = 0;
      clearTimeout(dockTimer.current);
    };
    // clampToBounds는 ref만 읽으므로 마운트 시점의 것을 계속 써도 된다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, kick, updatePos]);

  // 위치·행 높이·펼침이 바뀌면 CSS 트랜지션이 끝날 때까지 분기선을 따라 그린다.
  useEffect(() => {
    kick(Math.max(DOCK_MS, ROW_MS) + 100);
  }, [pos, rowHeight, open, collapsed, kick]);

  // 처음 보일 때 한 번 살짝 흔들어 끌 수 있는 창이라는 걸 알린다.
  const isVisible = useInView(windowRef as RefObject<HTMLElement | null>, 0.6);
  useEffect(() => {
    const win = windowRef.current;
    if (!isVisible || !win || prefersReducedMotion() || win.getBoundingClientRect().width === 0) {
      return;
    }
    const animation = win.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(-1.5deg)' },
        { transform: 'rotate(1.2deg)' },
        { transform: 'rotate(-0.6deg)' },
        { transform: 'rotate(0deg)' },
      ],
      { duration: 700, delay: 600, easing: 'ease-in-out' },
    );
    kick(1400);
    return () => animation.cancel();
  }, [isVisible, kick]);

  const floating = pos !== null;

  return (
    <div
      // 분기 레일이 바로 아래 카드와 맞닿도록 gap-8을 음수 마진으로 상쇄하고 pb-8로 되돌린다.
      className={cn(!collapsed && 'lg:-mb-8')}
      style={{
        display: 'grid',
        gridTemplateRows: collapsed ? '0fr' : '1fr',
        opacity: collapsed ? 0 : 1,
        transition: 'grid-template-rows 0.5s ease, opacity 0.3s ease, margin 0.5s ease',
        pointerEvents: collapsed ? 'none' : undefined,
      }}
    >
      <div style={{ minHeight: 0, overflow: 'hidden' }} inert={collapsed}>
        <PersonalCareerPeek career={career} activeFilter={activeFilter} onTechClick={onTechClick} />

        <div className="hidden lg:block pb-8">
          {/* 분기선. 첫 자식이라 뒤따르는 카드보다 먼저 그려져 카드 아래에 깔린다. */}
          <svg
            className={cn(
              'absolute inset-0 size-full overflow-visible pointer-events-none text-primary/50',
              'transition-opacity duration-300',
              collapsed ? 'opacity-0' : 'opacity-100',
            )}
            fill="none"
            aria-hidden="true"
          >
            <path ref={pathRef} stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          </svg>

          <div
            ref={rowRef}
            className="flex"
            style={{
              height: rowHeight,
              transition: rowHeight === undefined ? undefined : `height ${ROW_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            {/* 분기점과 아래 카드로 이어지는 레일, 캡션 */}
            <div className="relative flex-1">
              <div
                className="absolute w-px bg-linear-to-b from-primary/50 to-primary/30"
                style={{ left: TIMELINE_RAIL_X, top: FORK_Y, bottom: '-2rem' }}
              />
              <div
                className="absolute size-2.5 rounded-full border-2 border-primary bg-background"
                style={{ left: TIMELINE_RAIL_X - 5, top: FORK_Y - 5 }}
              />
              <div
                className="absolute flex items-baseline gap-2"
                style={{ left: 80, top: FORK_Y + 12 }}
              >
                <span className="text-xs font-semibold text-primary tabular-nums">
                  {career.range.split('~')[0].trim()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {career.branchCaption ?? '개인 작업'}
                </span>
              </div>
            </div>

            {/* 창이 붙는 슬롯. 창은 떼어져도 같은 자리에 렌더링되어 드래그 도중 다시 마운트되지 않는다. */}
            <div ref={slotRef} className="w-80 shrink-0">
              {floating && (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border text-[11px] text-muted-foreground/70">
                  여기에 놓으면 다시 붙어요
                </div>
              )}

              <div
                ref={windowRef}
                role="group"
                aria-label={`${career.name} 창`}
                className={cn(
                  'w-80 z-20 rounded-xl border bg-card/95 backdrop-blur-md',
                  'transition-[box-shadow,border-color] duration-200',
                  floating ? 'absolute' : 'relative',
                  dragging
                    ? 'border-primary/40 shadow-2xl shadow-primary/10'
                    : 'border-border/70 shadow-lg shadow-primary/5',
                )}
                style={
                  floating
                    ? {
                        left: pos.x,
                        top: pos.y,
                        transition: docking
                          ? `left ${DOCK_MS}ms cubic-bezier(0.16, 1, 0.3, 1), top ${DOCK_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
                          : undefined,
                      }
                    : undefined
                }
              >
                {/* 타이틀바: 끌어서 옮기는 손잡이 */}
                <div
                  tabIndex={0}
                  aria-label="창 손잡이. 끌거나 방향키로 옮기고, Home 키로 제자리에 붙입니다."
                  aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    'flex h-10 items-center gap-2 px-3 border-b border-border/50 rounded-t-xl',
                    'select-none touch-none outline-none',
                    'focus-visible:ring-2 focus-visible:ring-primary/40',
                    dragging ? 'cursor-grabbing' : 'cursor-grab',
                  )}
                >
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                    <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                    <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                  </span>
                  <span className="flex-1 truncate text-center text-[11px] font-medium text-muted-foreground">
                    {career.name}
                  </span>
                  {floating && (
                    <button
                      type="button"
                      onClick={dock}
                      aria-label="제자리에 붙이기"
                      title="제자리에 붙이기"
                      className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Undo2 className="size-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    aria-controls={detailsId}
                    aria-label={open ? '자세히 접기' : '자세히 펼치기'}
                    title={open ? '접기' : '펼치기'}
                    className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <ChevronDown
                      className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <PersonalSummary career={career} />
                  <CareerLinks career={career} size="sm" className="mt-3" />
                  <Collapsible open={open} id={detailsId}>
                    <div className="pt-4">
                      <PersonalDetails
                        career={career}
                        showLinks={false}
                        activeFilter={activeFilter}
                        onTechClick={onTechClick}
                      />
                    </div>
                  </Collapsible>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
