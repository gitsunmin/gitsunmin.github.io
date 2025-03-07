import { createLazyFileRoute, Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import {
  Building2,
  FileText,
  MessageSquareCode,
  MonitorSmartphone,
} from 'lucide-react';
import { match } from 'ts-pattern';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
});

const InnerLink = (props: InnerLink) => {
  const { to, icon, label, status } = props;

  const disabled = status === 'CONSTRUCTION';

  return (
    <Link
      to={to}
      disabled={disabled}
      className={cn('flex w-14 flex-col justify-center items-center gap-1', {
        'cursor-not-allowed': disabled,
        'active:transform active:duration-300 active:scale-150 active:opacity-80 hover:opacity-90':
          !disabled,
      })}
    >
      <div
        className={cn(
          'size-14 bg-background rounded-xl shadow-md flex items-center justify-center',
          {
            'bg-gray-200 opacity-50': disabled,
          }
        )}
      >
        {icon}
      </div>
      {status === 'CONSTRUCTION' && <div className="absolute text-5xl">🚧</div>}
      <span
        className={cn('text-[12px] text-foreground', {
          'line-through': disabled,
        })}
      >
        {label}
      </span>
    </Link>
  );
};

const OuterLink = (props: OuterLink) => {
  const { href, icon, label, status } = props;

  const disabled = status === 'CONSTRUCTION';

  return (
    <Link
      to={href}
      disabled={disabled}
      from="/"
      target="_blank"
      className={cn('flex w-14 flex-col justify-center items-center gap-1', {
        'cursor-not-allowed': disabled,
        'active:transform active:duration-300 active:scale-150 active:opacity-80 hover:opacity-90':
          !disabled,
      })}
    >
      <div
        className={cn(
          'size-14 bg-background rounded-xl shadow-md flex items-center justify-center',
          {
            'bg-gray-200 opacity-50': disabled,
          }
        )}
      >
        {icon}
      </div>
      {status === 'CONSTRUCTION' && <div className="absolute text-5xl">🚧</div>}
      <span
        className={cn('text-[12px] text-foreground', {
          'line-through': disabled,
        })}
      >
        {label}
      </span>
    </Link>
  );
};

type InnerLink = {
  __type: 'INNER';
  id: string;
  label: string;
  to: string;
  status: 'ENABLED' | 'CONSTRUCTION';
  icon: React.ReactNode;
};

type OuterLink = {
  __type: 'OUTER';
  id: string;
  href: string;
  status: 'ENABLED' | 'CONSTRUCTION';
  label: string;
  icon: React.ReactNode;
};

type Link = InnerLink | OuterLink;

const LINKS: Link[] = [
  {
    __type: 'INNER',
    id: 'careers',
    label: 'Careers',
    icon: <Building2 size={28} className="text-foreground" />,
    status: 'ENABLED',
    to: '/careers',
  },
  {
    __type: 'INNER',
    id: 'projects',
    label: 'Projects',
    icon: <MonitorSmartphone size={28} className="text-foreground" />,
    status: 'CONSTRUCTION',
    to: '/projects',
  },
  {
    __type: 'INNER',
    id: 'interview',
    label: 'Interview',
    icon: <MessageSquareCode size={28} className="text-foreground" />,
    status: 'ENABLED',
    to: '/interview',
  },
  {
    __type: 'INNER',
    id: 'til',
    label: 'TIL',
    icon: <FileText size={28} className="text-foreground" />,
    status: 'ENABLED',
    to: '/til',
  },
  {
    __type: 'OUTER',
    id: 'github',
    label: 'Github',
    icon: (
      <img
        src="https://simpleicons.org/icons/github.svg"
        alt="github"
        width={28}
        height={28}
      />
    ),
    status: 'ENABLED',
    href: 'https://github.com/gitsunmin',
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
        {LINKS.map((link) => (
          <li
            key={link.id}
            className="flex flex-col justify-center items-center"
          >
            {match(link)
              .with({ __type: 'INNER' }, (link) => <InnerLink {...link} />)
              .with({ __type: 'OUTER' }, (link) => <OuterLink {...link} />)
              .exhaustive()}
          </li>
        ))}
      </ul>
    </main>
  );
}
