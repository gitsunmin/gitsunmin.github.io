import { createLazyFileRoute, Link } from '@tanstack/react-router';

import TILIcon from '@/assets/icons/menu_til.webp';
import CareersIcon from '@/assets/icons/menu_careers.webp';
import ProjectsIcon from '@/assets/icons/menu_projects.webp';
import InterviewIcon from '@/assets/icons/menu_interview.webp';
import { cn } from '@/lib/utils';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
});

const LINKS = [
  {
    id: 'careers',
    label: 'Careers',
    iconSrc: CareersIcon,
    to: '/careers',
  },
  {
    id: 'projects',
    label: 'Projects',
    iconSrc: ProjectsIcon,
    to: '/til',
  },
  {
    id: 'interview',
    label: 'Interview',
    iconSrc: InterviewIcon,
    to: '/interview',
  },
  {
    id: 'til',
    label: 'TIL',
    iconSrc: TILIcon,
    to: '/til',
  },
] as const;

type AppLink = (typeof LINKS)[number];

const AppIcon = (props: AppLink) => {
  const { to, iconSrc, label } = props;
  return (
    <Link
      to={to}
      className="flex w-14 flex-col justify-center items-center gap-1 active:transform active:duration-300 active:scale-150 active:opacity-80 hover:opacity-90"
    >
      <div className="size-14 bg-slate-400 rounded-xl shadow-md">
        <img src={iconSrc} alt={`${label}-icon`} className="rounded-xl" />
      </div>
      <span className="text-[12px] text-foreground">{label}</span>
    </Link>
  );
};

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
