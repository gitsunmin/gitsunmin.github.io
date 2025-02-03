import { createLazyFileRoute, Link } from '@tanstack/react-router';

import TILIcon from '@/assets/icons/menu_til.webp';
import CareersIcon from '@/assets/icons/menu_careers.webp';
import ProjectsIcon from '@/assets/icons/menu_projects.webp';
import InterviewIcon from '@/assets/icons/menu_interview.webp';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
  errorComponent: undefined,
  notFoundComponent: undefined,
  pendingComponent: undefined,
});

function RouteComponent() {
  const links = [
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
  ];

  return (
    <main className="mx-auto px-4 py-6 w-full h-screen break-all pb-10 bg-gradient-to-tr from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-4">
        {links.map(({ id, label, iconSrc, to }) => (
          <li key={id} className="flex flex-col justify-center items-center">
            <Link
              to={to}
              className="flex w-16 flex-col justify-center items-center gap-1 active:transform active:duration-300 active:scale-150 active:opacity-80 hover:opacity-90"
            >
              <div className="size-16 bg-slate-400 rounded-xl shadow-md">
                <img
                  src={iconSrc}
                  alt={`${label}-icon`}
                  className="rounded-xl"
                />
              </div>
              <span className="text-[12px] text-white">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
