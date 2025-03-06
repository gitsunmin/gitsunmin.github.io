import { createLazyFileRoute, Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import {
  Building2,
  FileText,
  MessageSquareCode,
  MonitorSmartphone,
} from 'lucide-react';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
});

type AppLink = (typeof LINKS)[number];

const AppIcon = (props: AppLink) => {
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

const LINKS = [
  {
    id: 'careers',
    label: 'Careers',
    icon: <Building2 size={28} className="text-foreground" />,
    status: 'ENABLED',
    to: '/careers',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <MonitorSmartphone size={28} className="text-foreground" />,
    status: 'CONSTRUCTION',
    to: '/projects',
  },
  {
    id: 'interview',
    label: 'Interview',
    icon: <MessageSquareCode size={28} className="text-foreground" />,
    status: 'ENABLED',
    to: '/interview',
  },
  {
    id: 'til',
    label: 'TIL',
    icon: <FileText size={28} className="text-foreground" />,
    status: 'ENABLED',
    to: '/til',
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
            <AppIcon {...link} />
          </li>
        ))}
      </ul>
    </main>
  );
}
