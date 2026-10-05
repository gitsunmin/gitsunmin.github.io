import { cn } from '@/lib/utils';
import { WORKS_VIEWS, type WorksView } from '@/lib/worksView';

type Props = {
  value: WorksView;
  onChange: (view: WorksView) => void;
};

/** 같은 작업물을 얼마나 깊게 볼지 고른다. 선택은 ?view=로 남아 링크로 건넬 수 있다. */
export const ViewSwitcher = ({ value, onChange }: Props) => (
  <div role="tablist" aria-label="보기 방식" className="inline-flex rounded-lg bg-muted/60 p-1 print:hidden">
    {WORKS_VIEWS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        role="tab"
        aria-selected={value === id}
        onClick={() => onChange(id)}
        className={cn(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          value === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {label}
      </button>
    ))}
  </div>
);
