import { Suspense, useCallback, useMemo, useState } from 'react';
import { TechFilterBar } from '@/components/TechFilterBar';
import { WorkCard } from '@/components/WorkCard';
import { Works } from '@/data/works';

const VISIBLE_WORKS = Works.filter((w) => !w.isDraft);
const ALL_TECHS = [...new Set(VISIBLE_WORKS.flatMap((w) => w.techs))].sort();

export const WorksPage = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleTechClick = useCallback(
    (tech: string) => setActiveFilter((prev) => (prev === tech ? null : tech)),
    [],
  );

  const hasVisible = useMemo(
    () => activeFilter == null || VISIBLE_WORKS.some((w) => w.techs.includes(activeFilter)),
    [activeFilter],
  );

  return (
    <Suspense>
      <div className="w-full md:max-w-(--breakpoint-md) mx-auto pt-16 md:pt-20 px-4 md:px-0 pb-16">
        <TechFilterBar
          techs={ALL_TECHS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          showColorDot
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {VISIBLE_WORKS.map((work, index) => (
            <WorkCard
              key={work.id}
              work={work}
              index={index}
              activeFilter={activeFilter}
              onTechClick={handleTechClick}
            />
          ))}
        </div>

        {!hasVisible && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{activeFilter}</span> 기술 스택의 프로젝트가 없습니다.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className="mt-3 text-xs text-primary hover:underline"
            >
              전체 보기
            </button>
          </div>
        )}
      </div>
    </Suspense>
  );
};
