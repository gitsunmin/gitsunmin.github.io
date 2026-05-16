import { cn } from '@/lib/utils';

type Props = {
  techs: string[];
  activeFilter?: string | null;
  onTechClick?: (tech: string) => void;
  isVisible?: boolean;
  animationDelay?: (index: number) => number;
};

export const TechTag = ({ techs, activeFilter, onTechClick, isVisible = true, animationDelay }: Props) => (
  <div className="flex flex-wrap gap-1.5 mt-4">
    {techs.map((tech, i) => (
      <button
        key={tech}
        type="button"
        onClick={() => onTechClick?.(tech)}
        disabled={!onTechClick}
        className={cn(
          'px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all duration-300',
          animationDelay !== undefined
            ? isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
            : '',
          activeFilter === tech
            ? 'bg-primary/20 text-primary ring-1 ring-primary/40 scale-[1.02]'
            : 'bg-muted/60 text-muted-foreground',
          onTechClick &&
            activeFilter !== tech &&
            'hover:bg-primary/10 hover:text-primary/80 hover:scale-105 cursor-pointer',
          !onTechClick && 'cursor-default',
        )}
        style={
          animationDelay !== undefined
            ? { transitionDelay: isVisible ? `${animationDelay(i)}ms` : '0ms' }
            : undefined
        }
      >
        {tech}
      </button>
    ))}
  </div>
);
