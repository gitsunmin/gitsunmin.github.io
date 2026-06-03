import { ChevronRight } from 'lucide-react';

type Props = React.PropsWithChildren<{
  title?: string;
  category?: string;
}>;

export const TILPage = ({ children, title, category }: Props) => (
  <div className="px-6 pt-16 pb-4 md:pt-24 md:pb-8 md:px-0 w-full md:max-w-(--breakpoint-md) mx-auto">
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8 flex-wrap">
      <a href="/til/README" className="hover:text-foreground transition-colors duration-150">
        TIL
      </a>
      {category && (
        <>
          <ChevronRight size={13} className="shrink-0" />
          <span className="capitalize text-muted-foreground">
            {category.replace(/_/g, ' ')}
          </span>
        </>
      )}
      {title && (
        <>
          <ChevronRight size={13} className="shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[16rem] md:max-w-none">
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
