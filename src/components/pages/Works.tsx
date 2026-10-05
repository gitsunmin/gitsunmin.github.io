import { AppWindow, Globe, Layers, Package, Sparkles } from 'lucide-react';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { WorkSearch } from '@/components/search/WorkSearch';
import { TechFilterBar } from '@/components/TechFilterBar';
import { WorkSection, type CategoryMeta } from '@/components/WorkSection';
import { AskAIButtons } from '@/components/works/AskAIButtons';
import { BriefView } from '@/components/works/BriefView';
import { CaseListView } from '@/components/works/CaseListView';
import { LensPanel } from '@/components/works/LensPanel';
import { ViewSwitcher } from '@/components/works/ViewSwitcher';
import { Works, type WorkCategory } from '@/data/works';
import { replaceSearchParams, useLocationSearch } from '@/hooks/useLocationSearch';
import type { WorkDigest } from '@/lib/workBriefs';
import { DEFAULT_VIEW, isWorksView, type WorksView } from '@/lib/worksView';

type SectionDef = {
  categories: WorkCategory[];
  meta: CategoryMeta;
};

const SECTIONS: SectionDef[] = [
  { categories: ['service'], meta: { id: 'service', label: '서비스 · 앱', icon: AppWindow } },
  { categories: ['framework'], meta: { id: 'framework', label: '프레임워크', icon: Layers } },
  { categories: ['side-project'], meta: { id: 'side-project', label: '사이드 프로젝트', icon: Sparkles } },
  { categories: ['library', 'vscode-extension'], meta: { id: 'tool', label: '라이브러리 · 확장 도구', icon: Package } },
  { categories: ['website'], meta: { id: 'website', label: '웹사이트', icon: Globe } },
];

/** 요약 보기도 전체 목록과 같은 순서로 놓는다. */
const CATEGORY_ORDER = SECTIONS.flatMap((s) => s.categories);

const VISIBLE_WORKS = Works.filter((w) => !w.isDraft);
const ALL_TECHS = [...new Set(VISIBLE_WORKS.flatMap((w) => w.techs))].sort();

type Props = {
  /** 빌드 타임에 모은 요약(loadWorkDigests). */
  digests: WorkDigest[];
};

export const WorksPage = ({ digests }: Props) => {
  // 보기는 주소(?view=)에만 둔다. 정적 HTML은 기본 보기로 그려지고,
  // 주소에 다른 보기가 있으면 하이드레이션 뒤에 바뀐다.
  const search = useLocationSearch();
  const view = useMemo(() => {
    const fromUrl = new URLSearchParams(search).get('view');
    return isWorksView(fromUrl) ? fromUrl : DEFAULT_VIEW;
  }, [search]);

  const changeView = useCallback((next: WorksView) => {
    replaceSearchParams({ view: next === DEFAULT_VIEW ? null : next });
  }, []);

  const showCases = useCallback(
    (workId: string) => {
      changeView('cases');
      requestAnimationFrame(() => document.getElementById(`cases-${workId}`)?.scrollIntoView({ behavior: 'smooth' }));
    },
    [changeView],
  );

  const orderedDigests = useMemo(
    () => [...digests].sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)),
    [digests],
  );
  const allBriefs = useMemo(() => orderedDigests.flatMap((d) => d.briefs), [orderedDigests]);

  return (
    <Suspense>
      <div className="w-full md:max-w-(--breakpoint-md) mx-auto pt-16 md:pt-20 px-4 md:px-0 pb-16 print:pt-0 print:px-0 print:pb-0 print:max-w-none">
        {/* 검색 — 기술 칩은 목록을 거르고, 검색은 덱 안 슬라이드까지 찾는다. */}
        <div className="mb-5 print:hidden">
          <WorkSearch variant="bar" />
        </div>

        <LensPanel briefs={allBriefs} />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <ViewSwitcher value={view} onChange={changeView} />
          <p className="text-sm text-muted-foreground/70">
            {view === 'brief' && '프로젝트마다 한 장, 대표 케이스 하나씩'}
            {view === 'cases' && '모든 케이스를 문제 · 결정 · 결과 세 줄로'}
            {view === 'all' && '기술 스택으로 거를 수 있는 전체 목록'}
          </p>
        </div>

        {view === 'brief' && (
          <>
            <BriefView digests={orderedDigests} onShowCases={showCases} />
            <div className="mt-8 rounded-xl border border-dashed border-border/70 px-5 py-4 print:hidden">
              <p className="mb-3 text-sm text-muted-foreground">
                쓰시는 AI에게 물어보셔도 됩니다. 이 포트폴리오 전문(/llms-full.txt)을 근거로 답하도록 질문을 채워 드립니다.
              </p>
              <AskAIButtons />
            </div>
          </>
        )}
        {view === 'cases' && <CaseListView digests={orderedDigests} />}
        {view === 'all' && <AllWorksView />}
      </div>
    </Suspense>
  );
};

/** 전체 목록 — 기술 칩으로 거르는 카드 목록. 요약 보기가 생기기 전의 /works 그대로다. */
const AllWorksView = () => {
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
    <>
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
    </>
  );
};
