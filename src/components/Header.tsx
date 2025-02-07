import { Link } from '@tanstack/react-router';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { ArrowLeft} from 'lucide-react';

export const Header = () => {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-header',
          'h-12 px-4 shadow-sm backdrop-blur-md flex items-center justify-between',
          'md:justify-start z-header md:gap-4'
        )}
      >
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft />
        </Button>
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
        <div className="size-10"></div>
      </header>
      <div className="pb-14" />
    </>
  );
};
