import { TechTag } from '@/components/TechTag';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { Works } from '@/data/works';
import { Calendar } from 'lucide-react';
import { type RefObject, useRef } from 'react';

const COMPANY_LABELS: Record<string, string> = {
  seonhamlabs: '선함연구소',
  marketboro: '마켓보로',
  korens: '코렌스',
};

type Props = {
  work: (typeof Works)[number];
  index: number;
  activeFilter?: string | null;
  onTechClick?: (tech: string) => void;
};

export const WorkCard = ({ work, index, activeFilter, onTechClick }: Props) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const isVisible = useInView(cardRef as RefObject<HTMLElement | null>);
  const isFiltered = activeFilter != null && !work.techs.includes(activeFilter);

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
        <a
          href={`/work/${work.id}`}
          ref={cardRef}
          aria-label={`${work.title} 상세 보기`}
          className={cn(
            'group block rounded-xl border border-border/70 bg-card p-5',
            'hover:border-primary/40 hover:shadow-md hover:shadow-primary/5',
            'transition-all duration-300 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
          style={{
            transitionDelay: `${index * 80}ms`,
            viewTransitionName: `work-card-${work.id}`,
          }}
        >
          {/* 헤더 행 */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={work.icon}
                alt={`${work.title} 아이콘`}
                className="size-8 rounded-lg object-contain bg-white border border-border/40 shrink-0 p-0.5"
              />
              <div className="min-w-0">
                <h2
                  className={cn(
                    'text-sm font-semibold text-primary truncate',
                    'group-hover:text-primary/80 transition-colors duration-200',
                  )}
                >
                  {work.title}
                </h2>
                {work.careerId && (
                  <span className="text-[11px] text-muted-foreground">
                    {COMPANY_LABELS[work.careerId] ?? work.careerId}
                  </span>
                )}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 mt-0.5">
              <Calendar className="size-3" />
              {work.range}
            </span>
          </div>

          {/* 설명 */}
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 mb-1">
            {work.description.split('\n')[0]}
          </p>

          {/* 서브레포 수 */}
          {work.subRepos && work.subRepos.length > 0 && (
            <p className="text-[11px] text-muted-foreground/70 mt-1 mb-1">
              {work.subRepos.length}개 레포지토리
            </p>
          )}

          {/* 기술 태그 */}
          <TechTag techs={work.techs} activeFilter={activeFilter} onTechClick={onTechClick} />

          {/* 상세 보기 힌트 */}
          <div className="flex justify-end mt-3">
            <span
              className={cn(
                'text-[11px] text-muted-foreground/50 group-hover:text-primary/60',
                'transition-colors duration-200',
              )}
            >
              상세 보기 →
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};
