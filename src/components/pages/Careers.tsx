import { Career } from '@/data/careers';
import { Works } from '@/data/works';
import { cn } from '@/lib/utils';
import { Award, Briefcase, Building2, Calendar, Code2, ExternalLink } from 'lucide-react';
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

// --- Helpers ---

const getInitials = (name: string): string => {
  const cleaned = name.replace(/^\(주\)\s*/, '');
  return cleaned.slice(0, 2);
};

const LogoFallback = ({ name, className }: { name: string; className?: string }) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-xl bg-muted border border-border/50 font-semibold text-muted-foreground text-sm select-none',
      className,
    )}
  >
    {getInitials(name)}
  </div>
);

// --- Module-level constants ---

const VISIBLE_CAREERS = Career.filter((c) => !c.isDraft);
const ALL_TECHS = [...new Set(VISIBLE_CAREERS.flatMap((c) => c.techs))].sort();

// --- Helpers ---

const parseCareerDate = (str: string): Date => {
  const [year, month] = str.trim().split('.').map(Number);
  return new Date(year, (month ?? 1) - 1, 1);
};

const computeStats = (careers: (typeof Career)[number][]) => {
  const toRange = (range: string) => {
    const [startStr, endStr] = range.split('~').map((s) => s.trim());
    return {
      start: parseCareerDate(startStr),
      end: endStr && endStr.length > 0 ? parseCareerDate(endStr) : new Date(),
    };
  };

  const ranges = careers.map((c) => toRange(c.range));
  const earliest = ranges.reduce(
    (min, { start }) => (start < min ? start : min),
    new Date(),
  );

  const now = new Date();
  const totalMonths =
    (now.getFullYear() - earliest.getFullYear()) * 12 + (now.getMonth() - earliest.getMonth());

  return {
    totalYears: Math.floor(totalMonths / 12),
    startYear: earliest.getFullYear(),
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
        label="재직 회사"
        trigger={trigger}
      />
    </div>
  );
};

// --- CareerCard ---

const CareerCard = ({
  career,
  index,
  activeFilter,
  onTechClick,
}: {
  career: (typeof Career)[number];
  index: number;
  activeFilter: string | null;
  onTechClick: (tech: string) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(cardRef as RefObject<HTMLElement | null>);
  const { ref: tiltRef, tiltStyle } = useTilt(6);
  const skewStyle = useScrollSkew(2.5);
  const isCurrentRole = career.range.trim().endsWith('~');
  const isFiltered = activeFilter !== null && !career.techs.includes(activeFilter);
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
          {/* 타임라인 도트 */}
          <div className="hidden md:block absolute left-1.75 md:left-3.75 top-7 z-10 pt-12 md:pt-16">
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
                  {career.logo ? (
                    <img
                      src={career.logo}
                      alt={`${career.name} 로고`}
                      className={cn(
                        'size-12 md:size-14 rounded-xl border border-border/50 object-contain bg-white p-1',
                        'transition-all duration-300 ease-out',
                        'group-hover:scale-105 group-hover:shadow-md',
                      )}
                    />
                  ) : (
                    <LogoFallback
                      name={career.name}
                      className="size-12 md:size-14 transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-md"
                    />
                  )}
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
              <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-border/40">
                {career.links.map(({ label, url }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'group/link inline-flex items-center gap-1.5',
                      'px-3.5 py-2 rounded-lg text-xs font-medium',
                      'bg-secondary/60 text-secondary-foreground/80',
                      'transition-all duration-200 ease-out',
                      'hover:bg-primary hover:text-primary-foreground',
                      'hover:shadow-md hover:shadow-primary/15',
                      'hover:-translate-y-0.5',
                      'active:translate-y-0 active:shadow-sm',
                    )}
                  >
                    {label}
                    <ExternalLink className="size-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                ))}
              </div>

              {/* 관련 프로젝트 */}
              {(() => {
                const careerWorks = Works.filter((w) => !w.isDraft && w.careerId === career.id);
                if (careerWorks.length === 0) return null;
                return (
                  <div className="mt-5 pt-5 border-t border-border/40">
                    <p className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase mb-3">
                      관련 프로젝트
                    </p>
                    <div className="flex flex-col gap-2">
                      {careerWorks.map((work) => (
                        <a
                          key={work.id}
                          href={`/work/${work.id}`}
                          className={cn(
                            'group/work flex items-center gap-3 px-3 py-2.5 rounded-lg',
                            'border border-border/50 bg-muted/20',
                            'hover:border-primary/30 hover:bg-primary/5',
                            'transition-all duration-200',
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-foreground truncate group-hover/work:text-primary transition-colors duration-200">
                              {work.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{work.range}</p>
                          </div>
                          <ExternalLink className="size-3 text-muted-foreground/40 group-hover/work:text-primary/60 shrink-0 transition-colors duration-200" />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })()}
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
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineVisible = useInView(timelineContainerRef as RefObject<HTMLElement | null>, 0.05);

  return (
    <article className="py-10 px-4 md:px-0 w-full">
      <div ref={timelineContainerRef} className="relative flex flex-col gap-8">
        {/* 타임라인 라인 */}
        <div className="hidden md:block absolute left-3.75 md:left-5.75 top-7 bottom-7 w-px overflow-hidden">
          <div
            className="w-full h-full bg-linear-to-b from-primary/40 via-border to-transparent"
            style={{
              transform: timelineVisible ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top',
              transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {careers.map((career, index) => (
          <CareerCard
            key={career.id}
            career={career}
            index={index}
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
