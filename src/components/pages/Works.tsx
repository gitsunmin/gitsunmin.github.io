import { TechFilterBar } from '@/components/TechFilterBar';
import { WorkItem } from '@/components/WorkItem';
import { Works } from '@/data/works';
import { Suspense, useCallback, useState } from 'react';

const VISIBLE_WORKS = Works.filter((w) => !w.isDraft);
const ALL_TECHS = [...new Set(VISIBLE_WORKS.flatMap((w) => w.techs))].sort();

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
          showColorDot
        />
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
          {VISIBLE_WORKS.map((work, index) => (
            <WorkItem
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
