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
          'md:mx-auto flex flex-col justify-center min-h-[100dvh] w-full md:max-w-md lg:max-w-(--breakpoint-md) pb-20',
          className,
        )}
      >
        {children}
      </main>
      {footer}
    </>
  );
};
