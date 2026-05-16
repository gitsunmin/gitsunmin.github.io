import { Career } from '@/data/careers';
import { Works } from '@/data/works';
import { cn } from '@/lib/utils';
import { Award, BookOpen, Briefcase, Building2, Calendar, ChevronDown, ChevronRight, Code2, ExternalLink } from 'lucide-react';
import { TechFilterBar } from '@/components/TechFilterBar';
import { useInView } from '@/hooks/useInView';
import { getTechColor } from '@/lib/techColors';
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
const FEATURED_WORKS = Works.filter((w) => !w.isDraft && w.isFeatured);

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
            'relative pl-12 md:pl-20 pt-12 md:pt-16 pb-4 pr-3',
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
          <div className="absolute left-1.75 md:left-3.75 top-7 z-10 pt-12 md:pt-16">
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
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative">
              {/* 현재 재직 중 배지 */}
              {isCurrentRole && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  현재 재직 중
                </div>
              )}

              {/* 헤더 */}
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <img
                    src={career.logo}
                    alt={`${career.name} 로고`}
                    className={cn(
                      'size-12 md:size-14 rounded-xl border border-border/50 object-contain bg-white p-1',
                      'transition-all duration-300 ease-out',
                      'group-hover:scale-105 group-hover:shadow-md',
                    )}
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
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="size-3.5 shrink-0" />
                      {career.range}
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
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {career.techs.map((tech, badgeIndex) => (
                    <button
                      type='button'
                      key={tech}
                      onClick={() => onTechClick(tech)}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer',
                        'transition-all duration-300',
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                        activeFilter === tech
                          ? 'bg-primary/20 text-primary ring-1 ring-primary/40 scale-[1.02]'
                          : 'bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/80 hover:scale-105',
                      )}
                      style={{
                        transitionDelay: isVisible
                          ? `${index * 150 + badgeIndex * 35 + 200}ms`
                          : '0ms',
                      }}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
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
        <div className="absolute left-3.75 md:left-5.75 top-7 bottom-7 w-px overflow-hidden">
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

// --- WorksHighlight ---

const WorksHighlightListItem = ({
  work,
  index,
  isLast,
}: {
  work: (typeof Works)[number];
  index: number;
  isLast: boolean;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(itemRef as RefObject<HTMLElement | null>);
  const displayTechs = work.techs.slice(0, 4);

  return (
    <div
      ref={itemRef}
      className={cn(
        'group px-5 py-4 hover:bg-muted/30 transition-colors duration-150',
        !isLast && 'border-b border-border/50',
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* 제목 행 */}
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="size-3.5 text-muted-foreground shrink-0" />
          <img
            src={work.icon}
            alt={`${work.title} 아이콘`}
            className="size-4 rounded object-contain bg-white border border-border/40 shrink-0"
          />
          <h3 className="text-sm font-semibold text-primary truncate">{work.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {work.links.map(({ label, url }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium',
                'border border-border/60 bg-background text-muted-foreground',
                'hover:bg-primary hover:text-primary-foreground hover:border-primary',
                'transition-all duration-150',
              )}
            >
              {label}
              <ExternalLink className="size-2.5" />
            </a>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-1 mb-2">
        {work.description.split('\n')[0]}
      </p>

      {/* 기술 점 + 날짜 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {displayTechs.map((tech) => (
            <span key={tech} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: getTechColor(tech) }} />
              {tech}
            </span>
          ))}
          {work.techs.length > 4 && (
            <span className="text-[11px] text-muted-foreground/60">+{work.techs.length - 4}</span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground ml-auto shrink-0">
          <Calendar className="size-3 shrink-0" />
          {work.range}
        </span>
      </div>
    </div>
  );
};

const WorksHighlight = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(sectionRef as RefObject<HTMLElement | null>, 0.1);

  const previewWorks = FEATURED_WORKS.slice(0, 2);
  const hiddenCount = FEATURED_WORKS.length - previewWorks.length;

  if (FEATURED_WORKS.length === 0) return null;

  return (
    <section className="px-4 md:px-0 pt-10 pb-10">
      <div className="w-full h-px bg-linear-to-r from-transparent via-border to-transparent mb-10" />
      <div
        ref={sectionRef}
        className={cn(
          'transition-all duration-700 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-5 w-0.5 bg-primary rounded-full shrink-0" />
            <span className="text-sm font-bold text-foreground">개인 작업물</span>
            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
              태그 필터 미적용
            </span>
          </div>
          <a
            href="/works"
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium text-muted-foreground shrink-0',
              'transition-all duration-200 hover:text-primary hover:gap-2',
            )}
          >
            모든 작업물 보기
            <ChevronRight className="size-3.5" />
          </a>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
            {previewWorks.map((work, index) => (
              <WorksHighlightListItem
                key={work.id}
                work={work}
                index={index}
                isLast={index === previewWorks.length - 1}
              />
            ))}
          </div>

          {hiddenCount > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-card to-transparent rounded-b-xl pointer-events-none" />
          )}
        </div>

        {hiddenCount > 0 && (
          <a
            href="/works"
            className={cn(
              'group mt-2 flex w-full items-center justify-center gap-1.5',
              'py-2.5 rounded-lg border border-dashed border-border/60',
              'text-xs font-medium text-muted-foreground',
              'hover:border-primary/40 hover:bg-primary/5 hover:text-primary',
              'transition-all duration-200',
            )}
          >
            {hiddenCount}개 더 있음
            <ChevronDown className="size-3.5 animate-bounce" />
          </a>
        )}
      </div>
    </section>
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
        <WorksHighlight />
      </div>
    </Suspense>
  );
};
