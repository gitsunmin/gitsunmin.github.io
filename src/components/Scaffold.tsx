import { cn } from '@/lib/utils';

type Props = React.PropsWithChildren<{
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}>;

export const Scaffold = ({ children, header, footer, className }: Props) => {
  return (
    <>
      {header}
      <main
        className={cn(
          'flex flex-col justify-center min-h-[calc(100dvh-48px)] md:min-h-[calc(100dvh-64px)] w-full',
          className,
        )}
      >
        {children}
      </main>
      {footer}
    </>
  );
};
