type Props = React.PropsWithChildren;

export const TILPage = ({ children }: Props) => (
  <div className="px-6 pt-4 md:px-0">
    <h1 className="text-5xl font-bold mb-12">TIL (=Today I Learned)</h1>
    {children}
  </div>
);
