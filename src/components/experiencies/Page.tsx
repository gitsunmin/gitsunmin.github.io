import { cn } from '@/lib/utils';

type Props = React.PropsWithChildren<{
  id?: string;
  className?: string;
  variant?: 'default' | 'cover';
  label?: React.ReactNode;
}>;

export const Page = ({
  id = '',
  label = '',
  variant = 'default',
  className,
  children,
}: Props) => (
  <section
    id={id}
    className={cn(
      'w-full md:max-w-(--breakpoint-md) mx-auto snap-always p-4 snap-start min-h-[calc(100dvh-48px)] md:min-h-[calc(100dvh-64px)] break-words text-left',
      {
        'flex items-center justify-center': variant === 'cover',
      },
      className,
    )}
  >
    {label && (
      <div
        className={cn('h-12', {
          'py-1 rounded-xl flex items-center text-3xl md:text-5xl font-bold mb-4 md:mb-8':
            variant === 'default' && label !== '',
        })}
      >
        {label}
      </div>
    )}

    {children && (
      <div className="flex flex-col w-full justify-start items-center">
        {children}
      </div>
    )}
  </section>
);
