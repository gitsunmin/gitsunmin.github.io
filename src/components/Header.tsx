import { Link } from '@tanstack/react-router';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

type Props = {
  title?: string;
  className?: string;
};

export const Header = ({ title = 'Gitsunmin', className }: Props) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <header
        className={cn(
          'h-12 px-4 shadow-xs dark:shadow-gray-800 backdrop-blur-md md:justify-start md:gap-4',
          'flex items-center justify-between',
          'fixed top-0 left-0 right-0 z-header',
          className
        )}
      >
        <Button variant="ghost" className="lg:hidden" onClick={handleBack}>
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
            <h1 className="text-2xl font-bold">{title}</h1>
          </span>
        </Link>
        <div className="size-10"></div>
      </header>
    </>
  );
};
