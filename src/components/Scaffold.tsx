import { cn } from '@/lib/utils';

type Props = React.PropsWithChildren<{
  variant?: 'default' | 'book';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}>;

export const Scaffold = ({
  children,
  variant = 'default',
  header,
  footer,
  className,
}: Props) => {
  return (
    <>
      {header}
      <main
        className={cn('mx-auto flex justify-center min-h-[100dvh]', className)}
      >
        <article
          className={cn('max-w-sm w-full px-4 md:max-w-md lg:max-w-(--breakpoint-md)', {
            'snap-y snap-mandatory h-[100dvh] overflow-y-scroll':
              variant === 'book',
          })}
        >
          {children}
        </article>
      </main>
      {footer}
    </>
  );
};
