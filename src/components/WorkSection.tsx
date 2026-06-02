import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkCard } from '@/components/WorkCard';
import type { Works } from '@/data/works';

export type CategoryMeta = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type Props = {
  category: CategoryMeta;
  works: (typeof Works)[number][];
  activeFilter?: string | null;
  onTechClick?: (tech: string) => void;
  sectionIndex: number;
};

export const WorkSection = ({ category, works, activeFilter, onTechClick, sectionIndex }: Props) => {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const Icon = category.icon;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const getHeaderH = () => (window.innerWidth >= 768 ? 65 : 49);

    let observer: IntersectionObserver;

    const init = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => setIsStuck(!entry.isIntersecting),
        { rootMargin: `-${getHeaderH()}px 0px 0px 0px`, threshold: 0 },
      );
      observer.observe(sentinel);
    };

    init();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <section
      className="work-section-enter"
      style={{ animationDelay: `${sectionIndex * 55}ms` }}
    >
      {/* sentinel: sticky stuck 감지를 위한 마커 */}
      <div ref={sentinelRef} className="h-px pointer-events-none" aria-hidden />

      {/* sticky 섹션 헤더 */}
      <div
        className={cn(
          'sticky top-12 md:top-16 z-5',
          '-mx-4 md:mx-0',
          'transition-shadow duration-300 ease-out',
          isStuck && 'shadow-[0_3px_16px_-4px_hsl(var(--foreground)/0.08)]',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2.5 py-2.5 px-4 rounded-lg',
            'bg-background/92 backdrop-blur-md',
            'border-b transition-[border-color,background-color] duration-300',
            isStuck ? 'border-border/55 bg-background/96' : 'border-border/25',
          )}
        >
          {/* 카테고리 아이콘 */}
          <Icon
            className={cn(
              'size-3.5 shrink-0 transition-[color,transform] duration-300',
              isStuck
                ? 'text-muted-foreground/65 scale-105'
                : 'text-muted-foreground/40',
            )}
            strokeWidth={1.75}
          />

          {/* 카테고리 레이블 */}
          <span
            className={cn(
              'text-[11px] font-semibold tracking-widest uppercase transition-colors duration-300',
              isStuck ? 'text-muted-foreground/80' : 'text-muted-foreground/55',
            )}
          >
            {category.label}
          </span>

          {/* 작업 수 뱃지 */}
          <span
            className={cn(
              'ml-auto tabular-nums text-[10px] font-medium px-1.5 py-0.5 rounded-full',
              'transition-[color,background-color] duration-300',
              isStuck
                ? 'text-muted-foreground/60 bg-muted/50'
                : 'text-muted-foreground/35 bg-transparent',
            )}
          >
            {works.length}
          </span>
        </div>
      </div>

      {/* work 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 mb-10">
        {works.map((work, i) => (
          <WorkCard
            key={work.id}
            work={work}
            index={i}
            activeFilter={activeFilter}
            onTechClick={onTechClick}
          />
        ))}
      </div>
    </section>
  );
};
