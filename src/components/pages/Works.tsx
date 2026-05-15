import { Works } from '@/data/works';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, ExternalLink } from 'lucide-react';
import { type RefObject, Suspense, useCallback, useEffect, useRef, useState } from 'react';

const VISIBLE_WORKS = Works.filter((w) => !w.isDraft);
const ALL_TECHS = [...new Set(VISIBLE_WORKS.flatMap((w) => w.techs))].sort();

// GitHub linguist 색상 기반
const TECH_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  React: '#149eca',
  'React Native': '#61dafb',
  Expo: '#4630eb',
  GraphQL: '#e10098',
  Relay: '#f26b00',
  'Cloudflare Workers': '#f38020',
  Prisma: '#5a67d8',
  'Tailwind CSS': '#06b6d4',
  Astro: '#ff5d01',
  'Three.js': '#6b7280',
  Vite: '#646cff',
  Turborepo: '#ef4444',
  Bun: '#c8a97e',
  'Vue.js': '#42b883',
  'Next.js': '#1a1a1a',
  'Node.js': '#339933',
  'AWS Amplify': '#ff9900',
  DataDog: '#632ca6',
  pnpm: '#f69220',
};

const getTechColor = (tech: string) => TECH_COLORS[tech] ?? '#8b949e';

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

const TechTopics = ({
  techs,
  activeFilter,
  onTechClick,
}: {
  techs: string[];
  activeFilter: string | null;
  onTechClick: (tech: string) => void;
}) => (
  <div className="flex flex-wrap gap-1.5 mt-4">
    {techs.map((tech) => (
      <button
        key={tech}
        type="button"
        onClick={() => onTechClick(tech)}
        className={cn(
          'px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all duration-150',
          activeFilter === tech
            ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-blue-100/80 text-blue-700 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900',
        )}
      >
        {tech}
      </button>
    ))}
  </div>
);

const TechFilterBar = ({
  techs,
  activeFilter,
  onFilterChange,
}: {
  techs: string[];
  activeFilter: string | null;
  onFilterChange: (tech: string | null) => void;
}) => (
  <div className="px-4 md:px-0 mb-8">
    <div className="flex flex-wrap gap-1.5 items-center">
      <button
        type="button"
        onClick={() => onFilterChange(null)}
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
          activeFilter === null
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary',
        )}
      >
        전체
      </button>
      {techs.map((tech) => (
        <button
          key={tech}
          type="button"
          onClick={() => onFilterChange(activeFilter === tech ? null : tech)}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200',
            activeFilter === tech
              ? 'bg-primary text-primary-foreground shadow-sm scale-105'
              : 'bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary',
          )}
        >
          <span
            className="size-2 rounded-full shrink-0"
            style={{ backgroundColor: getTechColor(tech) }}
          />
          {tech}
        </button>
      ))}
    </div>
  </div>
);

const WorkListItem = ({
  work,
  index,
  isLast,
  activeFilter,
  onTechClick,
}: {
  work: (typeof Works)[number];
  index: number;
  isLast: boolean;
  activeFilter: string | null;
  onTechClick: (tech: string) => void;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(itemRef as RefObject<HTMLElement | null>);
  const isFiltered = activeFilter !== null && !work.techs.includes(activeFilter);
  const displayTechs = work.techs.slice(0, 5);

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
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 mb-3">
            {work.description.split('\n')[0]}
          </p>

          {/* GitHub topic pill */}
          <TechTopics techs={work.techs} activeFilter={activeFilter} onTechClick={onTechClick} />

          {/* 기술 점 + 날짜 */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-3 flex-wrap">
              {displayTechs.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: getTechColor(tech) }} />
                  {tech}
                </span>
              ))}
              {work.techs.length > 5 && (
                <span className="text-[11px] text-muted-foreground/60">+{work.techs.length - 5}</span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground ml-auto shrink-0">
              <Calendar className="size-3 shrink-0" />
              {work.range}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorksPage = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleTechClick = useCallback(
    (tech: string) => setActiveFilter((prev) => (prev === tech ? null : tech)),
    [],
  );

  return (
    <Suspense>
      <div className="w-full md:max-w-(--breakpoint-md) mx-auto pt-10 px-4 md:px-0">
        <TechFilterBar
          techs={ALL_TECHS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
          {VISIBLE_WORKS.map((work, index) => (
            <WorkListItem
              key={work.id}
              work={work}
              index={index}
              isLast={index === VISIBLE_WORKS.length - 1}
              activeFilter={activeFilter}
              onTechClick={handleTechClick}
            />
          ))}
        </div>
      </div>
    </Suspense>
  );
};
