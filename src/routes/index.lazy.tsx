import { createLazyFileRoute, Link } from '@tanstack/react-router';
import GithubIcon from '@/assets/icons/github.svg';

import { cn } from '@/lib/utils';
import {
  Building2,
  FileText,
  MessageSquareCode,
  MonitorSmartphone,
  Settings,
} from 'lucide-react';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
});

const AppLink = (props: AppLinkSchema) => {
  const { to, icon, label, target } = props;

  return (
    <Link
      to={to}
      target={target}
      from={'/'}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={cn(
        'flex w-14 flex-col justify-center items-center gap-x-1 gap-y-2 active:transform active:duration-300 active:scale-150 active:opacity-80 hover:opacity-90 relative'
      )}
    >
      <div
        className={cn(
          'size-14 bg-background rounded-xl shadow-md dark:shadow-white dark:shadow-sm flex items-center justify-center '
        )}
      >
        {icon}
      </div>
      <span className={cn('text-xs text-foreground break-keep')}>{label}</span>
    </Link>
  );
};

type AppLinkSchema = {
  __type: 'INNER' | 'OUTER';
  id: string;
  label: string;
  to: string;
  target: '_blank' | '_self' | '_parent' | '_top';
  status: 'ENABLED' | 'CONSTRUCTION';
  icon: React.ReactNode;
};

const LINKS: AppLinkSchema[] = [
  {
    __type: 'INNER',
    id: 'careers',
    label: 'Careers',
    icon: <Building2 size={28} className="text-foreground bg-background" />,
    status: 'ENABLED',
    target: '_self',
    to: '/careers',
  },
  {
    __type: 'INNER',
    id: 'projects',
    label: 'Projects',
    icon: (
      <MonitorSmartphone size={28} className="text-foreground bg-background" />
    ),
    status: 'CONSTRUCTION',
    target: '_self',
    to: '/projects',
  },
  {
    __type: 'INNER',
    id: 'interview',
    label: 'Interview',
    icon: (
      <MessageSquareCode size={28} className="text-foreground bg-background" />
    ),
    status: 'ENABLED',
    target: '_self',
    to: '/interview',
  },
  {
    __type: 'INNER',
    id: 'til',
    label: 'TIL',
    icon: <FileText size={28} className="text-foreground bg-background" />,
    status: 'ENABLED',
    target: '_self',
    to: '/til',
  },
  {
    __type: 'OUTER',
    id: 'github',
    label: 'Github',
    icon: (
      <img
        src={GithubIcon}
        alt="github icon"
        width={28}
        height={28}
        className="text-foreground dark:invert"
      />
    ),
    target: '_blank',
    status: 'ENABLED',
    to: 'https://github.com/gitsunmin',
  },
  {
    __type: 'OUTER',
    id: 'linkedin',
    label: 'linkedin',
    icon: (
      <div className="text-foreground bg-background font-bold text-[30px]">
        In
      </div>
    ),
    target: '_blank',
    status: 'ENABLED',
    to: 'https://www.linkedin.com/in/gitsunmin/',
  },
  {
    __type: 'INNER',
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={28} className="text-foreground bg-background" />,
    status: 'ENABLED',
    target: '_self',
    to: '/settings',
  },
] as const;

function RouteComponent() {
  return (
    <main
      className={cn(
        'fixed',
        'mx-auto px-4 py-6 w-full h-[100dvh] break-all pb-10',
        'bg-background'
      )}
    >
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-4">
        {LINKS.filter(
          (link) => link.status === 'ENABLED' || __MODE__ === 'development'
        ).map((link) => (
          <li
            key={link.id}
            className="flex flex-col justify-center items-center"
          >
            <AppLink {...link} />
          </li>
        ))}
      </ul>
    </main>
  );
}
