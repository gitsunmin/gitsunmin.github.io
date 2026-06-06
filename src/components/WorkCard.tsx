import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Globe,
  Layers,
  Package,
  Puzzle,
} from 'lucide-react';
import {
  type ComponentType,
  type RefObject,
  type SVGProps,
  useRef,
} from 'react';

import { TechTag } from '@/components/TechTag';
import type { Works } from '@/data/works';
import { useInView } from '@/hooks/useInView';
import { GithubIcon } from '@/lib/brandIcons';
import { cn } from '@/lib/utils';

const getInitials = (name: string): string => name.replace(/^\(주\)\s*/, '').slice(0, 2);

const WorkIconFallback = ({ title, className }: { title: string; className?: string }) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-xl bg-muted border border-border/40 font-semibold text-muted-foreground text-sm select-none',
      className,
    )}
  >
    {getInitials(title)}
  </div>
);

const COMPANY_LABELS: Record<string, string> = {
  seonhamlabs: '선함연구소',
  marketboro: '마켓보로',
  korens: '코렌스',
};


type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };
const LINK_ICON_MAP: Record<string, ComponentType<IconProps>> = {
  GitHub: GithubIcon,
  npm: Package,
  'VS Code Marketplace': Puzzle,
  사이트: Globe,
  '돌들의 숲': Globe,
};

type Props = {
  work: (typeof Works)[number];
  index: number;
  activeFilter?: string | null;
  onTechClick?: (tech: string) => void;
};

export const WorkCard = ({ work, index, activeFilter, onTechClick }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(cardRef as RefObject<HTMLElement | null>);

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative rounded-xl border border-border/70 bg-card h-full',
        'hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/15',
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
      style={{
        transitionDelay: `${index * 80}ms`,
        viewTransitionName: `work-card-${work.id}`,
      }}
    >
      {/* 오버레이 네비게이션 링크 */}
      <a
        href={`/work/${work.id}`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="sr-only">{work.title} 상세 보기</span>
      </a>

      {/* 콘텐츠 레이어 */}
      <div className="relative z-10 pointer-events-none flex flex-col px-5 pt-5 pb-9">

        {/* 헤더 행 */}
        <div className="flex items-start justify-between pb-2">
          <div className="flex items-center justify-between gap-2.5 ">
            {work.icon ? (
              <img
                src={work.icon}
                alt={`${work.title} 아이콘`}
                className={cn(
                  'size-10 rounded-xl object-contain bg-white border border-border/40 shrink-0 p-1',
                  'shadow-sm shadow-black/10',
                  'group-hover:shadow-md group-hover:scale-[1.04] transition-all duration-300 ease-out',
                )}
              />
            ) : (
              <WorkIconFallback
                title={work.title}
                className="size-10 shadow-sm shadow-black/10 group-hover:shadow-md group-hover:scale-[1.04] transition-all duration-300 ease-out"
              />
            )}
            <div className="min-w-0">
              <h2
                className={cn(
                  'text-xl font-bold text-primary truncate leading-snug',
                  'group-hover:text-primary/80 transition-colors duration-200',
                )}
              >
                {work.title}
              </h2>
              {work.careerId && (
                <span className="inline-block text-xs py-0.5 text-muted-foreground/80">
                  {COMPANY_LABELS[work.careerId] ?? work.careerId}
                </span>
              )}
            </div>
          </div>

          {/* 방향 힌트 아이콘 (하단 우측 고정) */}
          <ArrowUpRight
            className={cn(
              'pointer-events-none size-5',
              'text-muted-foreground/20 transition-all duration-300',
              'group-hover:text-primary/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
            )}
          />
        </div>

        {/* 날짜 */}
        <div className="flex items-baseline justify-start gap-2 text-muted-foreground pb-2">
          <Calendar className="size-4" />
          <div className='text-sm h-fit flex items-center'>{work.range}</div>
        </div>
        <div className="flex items-baseline justify-start gap-2 text-muted-foreground pb-2">
          <Calendar className="size-4" />
          <div className='text-sm h-fit flex items-center'>{work.range}</div>
        </div>

        {/* 설명 */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 mb-1">
          {work.description.split('\n')[0]}
        </p>

        {/* 서브레포 수 */}
        {work.subRepos && work.subRepos.length > 0 && (
          <div className="inline-flex items-baseline gap-2 text-sm text-muted-foreground/60 mt-1 mb-1">
            <Layers className="size-4" />
            <div className="inline-flex items-baseline gap-2 text-sm text-muted-foreground/60 mt-1 mb-1">
              <Layers className="size-4" />
              <span>{work.subRepos.length}개 레포지토리</span>
            </div>
          </div>
        )}

        {/* 기술 태그 */}
        <div className="pointer-events-auto">
          <TechTag
            techs={work.techs}
            activeFilter={activeFilter}
            onTechClick={onTechClick}
          />
        </div>

        {/* 푸터: 외부 링크 */}
        {work.links.length > 0 && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/40 pointer-events-auto">
            {work.links.map(({ label, url }) => {
              const Icon = LINK_ICON_MAP[label] ?? ExternalLink;
              return (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    'p-1.5 rounded-md',
                    'text-muted-foreground/60 hover:text-foreground',
                    'hover:bg-muted/60 transition-all duration-200',
                  )}
                >
                  <Icon size={14} />
                  <span className="sr-only">{label}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
