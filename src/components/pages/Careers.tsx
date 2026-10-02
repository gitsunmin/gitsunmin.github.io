import { Career } from '@/data/careers';
import { cn } from '@/lib/utils';
import { Award, Briefcase, Building2, Calendar, Code2 } from 'lucide-react';
import { CareerLinks, CareerLogo, RelatedWorks, TIMELINE_RAIL_X } from '@/components/CareerParts';
import { PersonalCareerBranch } from '@/components/PersonalCareerBranch';
import { TechFilterBar } from '@/components/TechFilterBar';
import { TechTag } from '@/components/TechTag';
import { useInView } from '@/hooks/useInView';
import {
  type CSSProperties,
  type RefObject,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// --- Module-level constants ---

const VISIBLE_CAREERS = Career.filter((c) => !c.isDraft);
const ALL_TECHS = [...new Set(VISIBLE_CAREERS.flatMap((c) => c.techs))].sort();

const DOT_SIZE = 20; // md 기준 size-5

const laneOf = (career: (typeof Career)[number]) => career.kind ?? 'employment';

const isCareerFiltered = (career: (typeof Career)[number], activeFilter: string | null) =>
  activeFilter !== null && !career.techs.includes(activeFilter);

// --- Helpers ---

const parseCareerDate = (str: string): Date => {
  const [year, month] = str.trim().split('.').map(Number);
  return new Date(year, (month ?? 1) - 1, 1);
};

const computeStats = (careers: (typeof Career)[number][]) => {
  const toMonthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth();

  const toRange = (range: string) => {
    const [startStr, endStr] = range.split('~').map((s) => s.trim());
    return {
      start: parseCareerDate(startStr),
      end: endStr && endStr.length > 0 ? parseCareerDate(endStr) : new Date(),
    };
  };

  // 경력 연수는 고용 이력만 센다. 개인 작업은 기간이 겹치기도 하고, 이력서에 적는
  // '경력 N년'은 통상 재직 기준으로 읽히므로 부풀리지 않는다.
  // 공백기는 제외하고, 겹치는 기간은 한 번만 센다.
  const ranges = careers
    .filter((c) => laneOf(c) === 'employment')
    .map((c) => toRange(c.range))
    .map(({ start, end }) => ({ start: toMonthIndex(start), end: toMonthIndex(end) }))
    .sort((a, b) => a.start - b.start);

  const merged = ranges.reduce<{ start: number; end: number }[]>((acc, range) => {
    const last = acc.at(-1);
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
      return acc;
    }
    return [...acc, { ...range }];
  }, []);

  // 입사월과 퇴사월을 모두 포함해 개월 수를 센다.
  const totalMonths = merged.reduce((sum, { start, end }) => sum + (end - start) + 1, 0);
  const earliest = ranges.reduce((min, { start }) => Math.min(min, start), Number.POSITIVE_INFINITY);

  return {
    totalYears: Math.floor(totalMonths / 12),
    startYear: Math.floor(earliest / 12),
    techCount: new Set(careers.flatMap((c) => c.techs)).size,
    companyCount: careers.length,
  };
};

// --- Hooks ---

const useCountUp = (target: number, duration = 1200, trigger = false): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);

  return count;
};

const isTouchDevice = (): boolean =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const useTilt = (maxTilt = 6) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({
    transition: 'transform 0.45s ease-out',
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isTouchDevice()) {
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const rect = el.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width - 0.5) * maxTilt;
        const y = ((touch.clientY - rect.top) / rect.height - 0.5) * -maxTilt;
        setTiltStyle({
          transform: `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-2px)`,
          transition: 'transform 0.05s ease-out',
        });
      };

      const handleTouchEnd = () => {
        setTiltStyle({
          transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        });
      };

      el.addEventListener('touchmove', handleTouchMove, { passive: true });
      el.addEventListener('touchend', handleTouchEnd, { passive: true });
      el.addEventListener('touchcancel', handleTouchEnd, { passive: true });
      return () => {
        el.removeEventListener('touchmove', handleTouchMove);
        el.removeEventListener('touchend', handleTouchEnd);
        el.removeEventListener('touchcancel', handleTouchEnd);
      };
    }

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * maxTilt;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -maxTilt;
      setTiltStyle({
        transform: `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`,
        transition: 'transform 0.08s ease-out',
      });
    };

    const handleLeave = () => {
      setTiltStyle({
        transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: 'transform 0.45s ease-out',
      });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [maxTilt]);

  return { ref: ref as RefObject<HTMLDivElement | null>, tiltStyle };
};

const useScrollSkew = (maxSkew = 2.5): CSSProperties => {
  const [skewStyle, setSkewStyle] = useState<CSSProperties>({});
  const lastScrollY = useRef(0);
  const rafId = useRef<number>(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!isTouchDevice()) return;

    const handleScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const delta = window.scrollY - lastScrollY.current;
        lastScrollY.current = window.scrollY;
        const skew = Math.max(-maxSkew, Math.min(maxSkew, delta * 0.3));
        setSkewStyle({ transform: `skewY(${skew}deg)`, transition: 'transform 0.1s linear' });
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
          setSkewStyle({ transform: 'skewY(0deg)', transition: 'transform 0.5s ease-out' });
        }, 150);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
      clearTimeout(timeoutId.current);
    };
  }, [maxSkew]);

  return skewStyle;
};

// --- Sub-components ---

const StatItem = ({
  icon,
  value,
  label,
  suffix = '',
  subtitle,
  trigger,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  subtitle?: string;
  trigger: boolean;
}) => {
  const count = useCountUp(value, 1200, trigger);
  return (
    <div className="flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm text-center">
      <div className="size-9 md:size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums leading-none">
          {count}
          {suffix}
        </div>
        <div className="mt-1.5 text-[11px] md:text-xs text-muted-foreground font-medium tracking-wide">
          {label}
        </div>
        {subtitle && (
          <div className="mt-1 text-[10px] text-muted-foreground/50 tracking-wide">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

const StatsHeader = ({ careers }: { careers: (typeof Career)[number][] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useInView(ref as RefObject<HTMLElement | null>, 0.4);
  const stats = useMemo(() => computeStats(careers), [careers]);

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-3 gap-3 md:gap-5 pt-20 mb-10 px-4 md:px-0',
        'transition-all duration-700 ease-out',
        trigger ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
    >
      <StatItem
        icon={<Award className="size-4 md:size-5" />}
        value={stats.totalYears}
        label="년 경력"
        suffix="+"
        subtitle={`since ${stats.startYear}`}
        trigger={trigger}
      />
      <StatItem
        icon={<Code2 className="size-4 md:size-5" />}
        value={stats.techCount}
        label="기술 스택"
        trigger={trigger}
      />
      <StatItem
        icon={<Building2 className="size-4 md:size-5" />}
        value={stats.companyCount}
        label="소속"
        trigger={trigger}
      />
    </div>
  );
};

// --- CareerCard ---

const CareerCard = ({
  career,
  index,
  isFirst,
  isLast,
  receivesBranch = false,
  activeFilter,
  onTechClick,
}: {
  career: (typeof Career)[number];
  index: number;
  isFirst: boolean;
  isLast: boolean;
  /** 위쪽 개인 작업 분기점에서 레일을 넘겨받는 카드. 데스크톱(lg)에서 세그먼트를 카드 처음부터 그린다. */
  receivesBranch?: boolean;
  activeFilter: string | null;
  onTechClick: (tech: string) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(cardRef as RefObject<HTMLElement | null>);
  const { ref: tiltRef, tiltStyle } = useTilt(6);
  const skewStyle = useScrollSkew(2.5);
  const isCurrentRole = career.range.trim().endsWith('~');
  const isFiltered = isCareerFiltered(career, activeFilter);
  const fromLeft = index % 2 === 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: isFiltered ? '0fr' : '1fr',
        opacity: isFiltered ? 0 : 1,
        transition: 'grid-template-rows 0.5s ease, opacity 0.3s ease',
        pointerEvents: isFiltered ? 'none' : undefined,
      }}
    >
      <div style={{ minHeight: 0, overflow: 'hidden' }}>
        <div
          ref={cardRef}
          className={cn(
            'relative pl-0 md:pl-20 pt-6 md:pt-16 pb-4 pr-3',
            'transition-all duration-700 ease-out',
            isVisible
              ? 'opacity-100 translate-x-0 translate-y-0'
              : fromLeft
                ? 'opacity-0 -translate-x-8 translate-y-2'
                : 'opacity-0 translate-x-8 translate-y-2',
          )}
          style={{ ...skewStyle, transitionDelay: `${index * 150}ms` }}
        >
          {/* 타임라인 레일 세그먼트. 카드마다 자기 높이만큼 그려서 필터로 접힐 때
              레일도 함께 접히게 한다. 카드 사이 gap-8은 음수 bottom으로 메운다. */}
          <div
            className={cn(
              'hidden md:block absolute w-px overflow-hidden',
              // 분기점과 맞닿는 쪽은 여백 없이 카드 경계까지 그려야 선이 이어진다.
              // 분기점은 lg 이상에서만 보이므로 그 아래에서는 평소처럼 띄운다.
              isFirst ? (receivesBranch ? 'top-7 lg:top-0' : 'top-7') : 'top-0',
            )}
            style={{
              left: TIMELINE_RAIL_X,
              bottom: isLast ? '1.75rem' : '-2rem',
            }}
          >
            <div
              className={cn(
                'w-full h-full',
                isFirst
                  ? 'bg-linear-to-b from-primary/40 to-border'
                  : isLast
                    ? 'bg-linear-to-b from-border to-transparent'
                    : 'bg-border',
              )}
              style={{
                transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                transformOrigin: 'top',
                transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${index * 150}ms`,
              }}
            />
          </div>

          {/* 타임라인 도트 */}
          <div
            className="hidden md:block absolute top-7 z-10 pt-12 md:pt-16"
            style={{ left: TIMELINE_RAIL_X - DOT_SIZE / 2 }}
          >
            <div
              className={cn(
                'group/dot relative size-4 md:size-5 rounded-full border-2',
                'transition-all duration-300 cursor-default hover:scale-125',
                isCurrentRole
                  ? 'border-primary bg-primary scale-110'
                  : 'border-muted-foreground/30 bg-background hover:border-primary/50 hover:bg-primary/5',
              )}
            >
              {/* Hover halo ring */}
              <span className="absolute -inset-2.5 rounded-full bg-primary/10 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-300 pointer-events-none" />
              {isCurrentRole && (
                <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping" />
              )}
            </div>
          </div>

          {/* 카드 */}
          <div
            ref={tiltRef}
            style={tiltStyle}
            className={cn(
              'group relative rounded-2xl border bg-card/80 backdrop-blur-sm overflow-hidden',
              'p-5 md:p-7',
              'hover:shadow-xl hover:shadow-primary/5',
              'hover:border-primary/30',
              isCurrentRole
                ? 'border-primary/20 shadow-lg shadow-primary/5'
                : 'border-border/60',
            )}
          >
            {/* 호버 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative">
              {/* 헤더 */}
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <CareerLogo
                    career={career}
                    className="size-12 md:size-14 transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                    {career.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Briefcase className="size-3.5 shrink-0" />
                      {career.position}
                    </span>
                    <span className="hidden sm:inline text-border">|</span>
                    <span className="inline-flex items-baseline gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="size-3.5 shrink-0" />
                      {career.range}
                      {isCurrentRole && (
                        <span className="inline-flex items-center gap-1 text-primary font-medium animate-pulse">
                          재직중
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* 소개 */}
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {career.introduce}
              </p>

              {/* 기술 스택 */}
              {career.techs.length > 0 && (
                <TechTag
                  techs={career.techs}
                  activeFilter={activeFilter}
                  onTechClick={onTechClick}
                  isVisible={isVisible}
                  animationDelay={(i) => index * 150 + i * 35 + 200}
                />
              )}

              {/* 링크 */}
              <CareerLinks career={career} className="mt-6 pt-5 border-t border-border/40" />

              {/* 관련 프로젝트 */}
              <RelatedWorks career={career} className="mt-5 pt-5 border-t border-border/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Content ---

const Content = ({
  careers,
  activeFilter,
  onTechClick,
}: {
  careers: (typeof Career)[number][];
  activeFilter: string | null;
  onTechClick: (tech: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // 개인 작업은 고용 레일 맨 위에서 갈라져 나온 창으로 따로 그린다.
  const personal = careers.find((c) => laneOf(c) === 'personal');
  const employment = careers.filter((c) => laneOf(c) === 'employment');

  return (
    <article className="py-10 px-4 md:px-0 w-full">
      <div ref={containerRef} className="relative flex flex-col gap-8">
        {personal && (
          <PersonalCareerBranch
            career={personal}
            containerRef={containerRef}
            collapsed={isCareerFiltered(personal, activeFilter)}
            activeFilter={activeFilter}
            onTechClick={onTechClick}
          />
        )}
        {employment.map((career, index) => (
          <CareerCard
            key={career.id}
            career={career}
            index={index}
            isFirst={index === 0}
            isLast={index === employment.length - 1}
            receivesBranch={index === 0 && personal !== undefined}
            activeFilter={activeFilter}
            onTechClick={onTechClick}
          />
        ))}
      </div>
    </article>
  );
};

// --- CareersPage ---

export const CareersPage = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleTechClick = useCallback(
    (tech: string) => setActiveFilter((prev) => (prev === tech ? null : tech)),
    [],
  );

  return (
    <Suspense>
      <div className="w-full md:max-w-(--breakpoint-md) mx-auto">
        <StatsHeader careers={VISIBLE_CAREERS} />
        <TechFilterBar
          techs={ALL_TECHS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <Content
          careers={VISIBLE_CAREERS}
          activeFilter={activeFilter}
          onTechClick={handleTechClick}
        />
      </div>
    </Suspense>
  );
};
