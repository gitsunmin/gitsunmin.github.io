import { Career } from '@/data/careers';
import { Works } from '@/data/works';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

type CareerItem = (typeof Career)[number];

/**
 * 데스크톱 타임라인 세로 레일의 x 좌표(px).
 * 레일 세그먼트·도트·개인 작업 창의 분기선이 모두 이 값을 공유해야 선이 이어진다.
 */
export const TIMELINE_RAIL_X = 23.5;

const getInitials = (name: string): string => {
  const cleaned = name.replace(/^\(주\)\s*/, '');
  return cleaned.slice(0, 2);
};

export const LogoFallback = ({ name, className }: { name: string; className?: string }) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-xl bg-muted border border-border/50 font-semibold text-muted-foreground text-sm select-none',
      className,
    )}
  >
    {getInitials(name)}
  </div>
);

export const CareerLogo = ({ career, className }: { career: CareerItem; className?: string }) =>
  career.logo ? (
    <img
      src={career.logo}
      alt={`${career.name} 로고`}
      className={cn('rounded-xl border border-border/50 object-contain bg-white p-1', className)}
    />
  ) : (
    <LogoFallback name={career.name} className={className} />
  );

export const CareerLinks = ({
  career,
  size = 'md',
  className,
}: {
  career: CareerItem;
  size?: 'sm' | 'md';
  className?: string;
}) => (
  <div className={cn('flex flex-wrap gap-2', className)}>
    {career.links.map(({ label, url }) => (
      <a
        key={url}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group/link inline-flex items-center gap-1.5 rounded-lg font-medium',
          size === 'sm' ? 'px-2.5 py-1.5 text-[11px]' : 'px-3.5 py-2 text-xs',
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
);

export const RelatedWorks = ({ career, className }: { career: CareerItem; className?: string }) => {
  const careerWorks = Works.filter((w) => !w.isDraft && w.careerId === career.id);
  if (careerWorks.length === 0) return null;

  return (
    <div className={className}>
      <p className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase mb-3">
        관련 프로젝트
      </p>
      <div className="flex flex-col gap-2">
        {careerWorks.map((work) => (
          <a
            key={work.id}
            href={`/work/${work.id}`}
            // WorkCard와 같은 이유로 뷰 트랜지션을 건너뛴다.
            data-astro-reload
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
};
