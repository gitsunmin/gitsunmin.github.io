import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = React.PropsWithChildren<{
  title?: string;
  category?: string;
}>;

export const TILPage = ({ children, title, category }: Props) => (
  <div className="px-6 pt-16 pb-4 md:pt-24 md:pb-8 md:px-0 w-full md:max-w-(--breakpoint-md) mx-auto">
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8 flex-wrap">
      <a
        href="/til/README"
        className={cn(
          'flex items-center gap-1 px-1.5 py-0.5 rounded-md',
          'hover:text-foreground hover:bg-accent/60',
          'transition-all duration-150',
          'group',
        )}
      >
        <Home
          size={12}
          className="shrink-0 group-hover:scale-110 transition-transform duration-150"
        />
        <span>TIL</span>
      </a>

      {category && (
        <>
          <ChevronRight
            size={13}
            className="shrink-0 text-muted-foreground/50"
          />
          <a
            href={`/til/README?category=${encodeURIComponent(category)}`}
            className={cn(
              'capitalize px-1.5 py-0.5 rounded-md',
              'hover:text-foreground hover:bg-accent/60',
              'transition-all duration-150',
              'relative after:absolute after:bottom-0 after:left-1.5 after:right-1.5',
              'after:h-px after:bg-primary/60 after:scale-x-0 after:origin-left',
              'hover:after:scale-x-100 after:transition-transform after:duration-200',
            )}
          >
            {category.replace(/_/g, ' ')}
          </a>
        </>
      )}

      {title && (
        <>
          <ChevronRight
            size={13}
            className="shrink-0 text-muted-foreground/50"
          />
          <span className="text-foreground font-medium truncate max-w-[16rem] md:max-w-none px-1.5 py-0.5">
            {title}
          </span>
        </>
      )}
    </nav>

    <div className="til-detail-enter">
      {children}
    </div>
  </div>
);
