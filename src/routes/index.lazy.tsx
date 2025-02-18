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
  const { to, icon, label } = props;

  return (
    <Link
      to={to}
      className="flex w-14 flex-col justify-center items-center gap-1 active:transform active:duration-300 active:scale-150 active:opacity-80 hover:opacity-90"
    >
      <div className="size-14 bg-background rounded-xl shadow-md flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[12px] text-foreground">{label}</span>
    </Link>
  );
};

const LINKS = [
  {
    id: 'careers',
    label: 'Careers',
    icon: <Building2 size={28} className="text-foreground" />,
    to: '/careers',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <MonitorSmartphone size={28} className="text-foreground" />,
    to: '/projects',
  },
  {
    id: 'interview',
    label: 'Interview',
    icon: <MessageSquareCode size={28} className="text-foreground" />,
    to: '/interview',
  },
  {
    id: 'til',
    label: 'TIL',
    icon: <FileText size={28} className="text-foreground" />,
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
