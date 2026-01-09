import { Link } from '@tanstack/react-router';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import GitsunminProfile from '@/assets/avatar/gitsunmin.webp';

type Props = {
  title?: string;
  className?: string;
};

export const Header = ({ title = 'Gitsunmin', className }: Props) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <header
      className={cn(
        'px-4 py-1 md:py-2 shadow-xs dark:shadow-gray-800 backdrop-blur-md md:justify-start md:gap-4',
        'flex items-center justify-between',
        'fixed top-0 left-0 right-0 z-header',
        className,
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
            src={GitsunminProfile}
            alt="logo"
            className="h-10 w-10 rounded-full"
          />
        </span>
        <span>
          <h1
            className="text-2xl font-bold hidden md:block"
            aria-label="테크스탑용 제목"
          >
            Gitsunmin
          </h1>
          <h1
            className="text-2xl font-bold md:hidden"
            aria-label="모바일용 제목"
          >
            {title}
          </h1>
        </span>
      </Link>
      <div className="size-10" />
    </header>
  );
};
