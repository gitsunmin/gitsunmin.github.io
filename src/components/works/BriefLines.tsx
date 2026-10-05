import { Fragment } from 'react';
import { competencyOf, type CompetencyId } from '@/data/competencies';
import type { WorkBrief } from '@/lib/workBriefs';
import { cn } from '@/lib/utils';

const ROWS = [
  { key: 'problem', label: '문제' },
  { key: 'decision', label: '결정' },
  { key: 'result', label: '결과' },
] as const;

/** 문제 → 결정 → 결과 세 줄. 30초 카드, 3분 목록, 렌즈 결과가 같은 모양으로 쓴다. */
export const BriefLines = ({ brief, className }: { brief: WorkBrief; className?: string }) => (
  <dl className={cn('grid grid-cols-[2.75rem_1fr] gap-x-3 gap-y-1.5 text-base leading-relaxed', className)}>
    {ROWS.map(({ key, label }) => (
      // div로 감싸면 사이트 글자 크기 설정(p·span·div를 1rem로 맞춤)이 dd까지 내려온다.
      <Fragment key={key}>
        <dt className="text-xs font-semibold tracking-wide text-muted-foreground/60 pt-1 print:text-gray-500">
          {label}
        </dt>
        <dd
          className={cn(
            'text-muted-foreground print:text-black',
            key === 'problem' && 'text-foreground font-medium',
          )}
        >
          {brief[key]}
        </dd>
      </Fragment>
    ))}
  </dl>
);

/** 역량 태그. 렌즈에서 고른 것은 강조한다. */
export const CompetencyChips = ({ tags, active = [] }: { tags: CompetencyId[]; active?: CompetencyId[] }) => (
  <ul className="flex flex-wrap gap-1 print:hidden">
    {tags.map((tag) => (
      <li
        key={tag}
        className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium border',
          active.includes(tag)
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border/60 text-muted-foreground/70',
        )}
      >
        {competencyOf(tag).label}
      </li>
    ))}
  </ul>
);
