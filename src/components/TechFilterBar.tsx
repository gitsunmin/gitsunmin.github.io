import { getTechColor } from '@/lib/techColors';
import { cn } from '@/lib/utils';

type Props = {
  techs: string[];
  activeFilter: string | null;
  onFilterChange: (tech: string | null) => void;
  showColorDot?: boolean;
};

export const TechFilterBar = ({ techs, activeFilter, onFilterChange, showColorDot = false }: Props) => (
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
            'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-all duration-200',
            showColorDot ? 'rounded-full' : 'rounded-md',
            activeFilter === tech
              ? 'bg-primary text-primary-foreground shadow-sm scale-105'
              : 'bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary',
          )}
        >
          {showColorDot && (
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: getTechColor(tech) }}
            />
          )}
          {tech}
        </button>
      ))}
    </div>
  </div>
);
