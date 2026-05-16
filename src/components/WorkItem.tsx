import { TechTag } from '@/components/TechTag';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { Works } from '@/data/works';
import { BookOpen, Calendar, ExternalLink } from 'lucide-react';
import { type RefObject, useRef } from 'react';

type Props = {
  work: (typeof Works)[number];
  index: number;
  isLast: boolean;
  activeFilter?: string | null;
  onTechClick?: (tech: string) => void;
};

export const WorkItem = ({ work, index, isLast, activeFilter, onTechClick }: Props) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(itemRef as RefObject<HTMLElement | null>);
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
        <div
          ref={itemRef}
          className={cn(
            'group px-5 py-4 hover:bg-muted/30 transition-colors duration-150',
            !isLast && 'border-b border-border/50',
            'transition-all duration-700 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          )}
          style={{ transitionDelay: `${index * 80}ms` }}
        >
          {/* 제목 행 */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="size-3.5 text-muted-foreground shrink-0" />
              <img
                src={work.icon}
                alt={`${work.title} 아이콘`}
                className="size-4 rounded object-contain bg-white border border-border/40 shrink-0"
              />
              <h2 className="text-sm font-semibold text-primary truncate">{work.title}</h2>
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
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 mb-1">
            {work.description.split('\n')[0]}
          </p>

          {/* 태그 */}
          <TechTag techs={work.techs} activeFilter={activeFilter} onTechClick={onTechClick} />

          {/* 날짜 */}
          <div className="flex justify-end mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="size-3 shrink-0" />
              {work.range}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
