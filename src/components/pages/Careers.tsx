import { Career } from '@/data/careers';
import { cn } from '@/lib/utils';
import { Briefcase, Calendar, ExternalLink } from 'lucide-react';
import { type RefObject, Suspense, useEffect, useRef, useState } from 'react';

const useInView = (ref: RefObject<HTMLElement | null>, threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
};

const CareerCard = ({
  career,
  index,
}: {
  career: (typeof Career)[number];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref);
  const isCurrentRole = career.range.trim().endsWith('~');

  return (
    <div
      ref={ref}
      className={cn(
        'relative pl-12 md:pl-20 pt-12 md:pt-16',
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* 타임라인 도트 */}
      <div className="absolute left-1.75 md:left-3.75 top-7 z-10 pt-12 md:pt-16">
        <div
          className={cn(
            'relative size-4 md:size-5 rounded-full border-2 transition-all duration-300',
            isCurrentRole
              ? 'border-primary bg-primary scale-110'
              : 'border-muted-foreground/30 bg-background',
          )}
        >
          {isCurrentRole && (
            <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping" />
          )}
        </div>
      </div>

      {/* 카드 */}
      <div
        className={cn(
          'group relative rounded-2xl border bg-card/80 backdrop-blur-sm overflow-hidden',
          'p-5 md:p-7',
          'transition-all duration-300 ease-out',
          'hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1',
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
                  'size-12 md:size-14 rounded-xl border border-border/50 object-cover bg-white',
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
                  {career.positoin}
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
  );
};

const Content = () => {
  return (
    <article className="py-10 px-4 md:px-0 w-full md:max-w-(--breakpoint-md) mx-auto">
      <div className="relative flex flex-col gap-8">
        {/* 타임라인 라인 */}
        <div className="absolute left-[15px] md:left-[23px] top-7 bottom-7 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />

        {Career.map((career, index) => (
          <CareerCard key={career.id} career={career} index={index} />
        ))}
      </div>
    </article>
  );
};

export const CareersPage = () => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
};
