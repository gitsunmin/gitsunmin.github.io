import { AppWindow, Globe, Layers, Package } from 'lucide-react';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { TechFilterBar } from '@/components/TechFilterBar';
import { WorkSection, type CategoryMeta } from '@/components/WorkSection';
import { Works, type WorkCategory } from '@/data/works';

type SectionDef = {
  categories: WorkCategory[];
  meta: CategoryMeta;
};

const SECTIONS: SectionDef[] = [
  { categories: ['service'], meta: { id: 'service', label: '서비스 · 앱', icon: AppWindow } },
  { categories: ['framework'], meta: { id: 'framework', label: '프레임워크', icon: Layers } },
  { categories: ['library', 'vscode-extension'], meta: { id: 'tool', label: '라이브러리 · 확장 도구', icon: Package } },
  { categories: ['website'], meta: { id: 'website', label: '웹사이트', icon: Globe } },
];

const VISIBLE_WORKS = Works.filter((w) => !w.isDraft);
const ALL_TECHS = [...new Set(VISIBLE_WORKS.flatMap((w) => w.techs))].sort();

export const WorksPage = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleTechClick = useCallback(
    (tech: string) => setActiveFilter((prev) => (prev === tech ? null : tech)),
    [],
  );

  const filteredWorks = useMemo(
    () =>
      activeFilter == null
        ? VISIBLE_WORKS
        : VISIBLE_WORKS.filter((w) => w.techs.includes(activeFilter)),
    [activeFilter],
  );

  const groupedSections = useMemo(
    () =>
      SECTIONS
        .map(({ categories, meta }) => ({
          category: meta,
          works: filteredWorks.filter((w) => categories.includes(w.category)),
        }))
        .filter(({ works }) => works.length > 0),
    [filteredWorks],
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

        {groupedSections.map(({ category, works }, sectionIndex) => (
          <WorkSection
            key={category.id}
            category={category}
            works={works}
            sectionIndex={sectionIndex}
            activeFilter={activeFilter}
            onTechClick={handleTechClick}
          />
        ))}

        {groupedSections.length === 0 && activeFilter != null && (
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
