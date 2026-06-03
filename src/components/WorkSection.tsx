import type { LucideIcon } from 'lucide-react';
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
  const Icon = category.icon;

  return (
    <section
      className="work-section-enter"
      style={{ animationDelay: `${sectionIndex * 55}ms` }}
    >
      {/* 섹션 헤더 */}
      <div className="-mx-4 md:mx-0">
        <div className="flex items-center gap-2.5 py-2.5 px-4 rounded-lg backdrop-blur-3xl border-b border-border/25">
          {/* 카테고리 아이콘 */}
          <Icon
            className="size-4 shrink-0 text-muted-foreground/40"
            strokeWidth={1.75}
          />

          {/* 카테고리 레이블 */}
          <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground/55">
            {category.label}
          </span>

          {/* 작업 수 뱃지 */}
          <span className="ml-auto tabular-nums text-[10px] font-medium px-1.5 py-0.5 rounded-full text-muted-foreground/35">
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
