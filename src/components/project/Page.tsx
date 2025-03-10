import { cn } from '@/lib/utils';

type Props = React.PropsWithChildren<{
  className?: string;
  variant?: 'default' | 'cover';
}>;

export const Page = ({ variant = 'default', className, children }: Props) => (
  <section
    className={cn(
      'max-w-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto px-4 snap-always snap-start min-h-[100dvh] py-12 break-words',
      {
        'flex items-center justify-center': variant === 'cover',
      },
      className
    )}
  >
    {children}
  </section>
);
