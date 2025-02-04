import { Link } from '@tanstack/react-router';

export const Header = () => {
  return (
    <>
      <header className="h-12 px-4 fixed top-0 left-0 right-0 shadow-sm backdrop-blur-md flex items-center justify-center md:justify-start z-header">
        <Link
          to="/"
          className="flex items-center gap-2 py-1 justify-center md:justify-start"
        >
          <span className="hidden md:block">
            <img
              src="https://github.com/gitsunmin.png"
              alt="logo"
              className="h-10 w-10 rounded-full"
            />
          </span>
          <span>
            <h1 className="text-2xl font-bold">Gitsunmin</h1>
          </span>
        </Link>
      </header>
      <div className="pb-14" />
    </>
  );
};
