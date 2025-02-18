import { cn } from '@/lib/utils';

type Props = React.PropsWithChildren<{
  className?: string;
  variant?: 'default' | 'cover';
}>;

export const Page = ({ variant = 'default', className, children }: Props) => (
  <section
    className={cn(
      'snap-always snap-start min-h-[100dvh] py-14',
      {
        'max-w-lg mx-auto': variant === 'cover',
      },
      className
    )}
  >
    {children}
  </section>
);
