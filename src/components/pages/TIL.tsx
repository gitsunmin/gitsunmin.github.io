type Props = React.PropsWithChildren;

export const TILPage = ({ children }: Props) => (
  <div className="px-6 pt-4 md:px-0">
    <h1 className="text-5xl font-bold mb-12 w-full">
      TIL
      <div className="text-xl font-normal text-gray-500 dark:text-gray-400">
        (=Today I Learned)
      </div>
    </h1>
    {children}
  </div>
);
