type Props = React.PropsWithChildren<{
  header?: React.ReactNode;
  footer?: React.ReactNode;
}>;

export const Scaffold = ({ children, header, footer }: Props) => {
  return (
    <>
      {header}
      <main className="mx-auto flex justify-center min-h-[100dvh]">
        <div className="max-w-sm px-4 md:max-w-md lg:max-w-screen-md">
          {children}
        </div>
      </main>
      {footer}
    </>
  );
};
