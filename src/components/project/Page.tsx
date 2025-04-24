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
      'w-full md:max-w-(--breakpoint-md) mx-auto px-4 snap-always snap-start min-h-[100dvh] break-words',
      {
        'flex items-center justify-center': variant === 'cover',
      },
      className,
    )}
  >
    <div
      className={cn('h-12', {
        'px-4 py-1 rounded-xl flex items-center ml-8 md:ml-0 md:px-0 text-md md:text-2xl font-bold':
          variant === 'default' && label !== '',
      })}
    >
      {label}
    </div>

    {children}
  </section>
);
