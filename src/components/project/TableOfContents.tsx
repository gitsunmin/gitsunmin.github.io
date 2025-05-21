import type { Project } from '@/data/projects';
import { Link } from '@tanstack/react-router';

type Props = {
  project: Project;
};

export const TableOfContents = ({ project }: Props) => {
  const { id, name, work } = project;

  return (
    <ol className="list-decimal pl-5 space-y-2">
      <li className="font-semibold">
        <Link
          hash={`${id}-intro`}
          to=""
          className="font-semibold"
          hashScrollIntoView={{
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          }}
        >
          {name} 소개
        </Link>
      </li>

      {work?.map((work) => (
        <li key={work.id} className="space-y-2">
          <Link
            to=""
            hash={work.id}
            className="font-semibold"
            hashScrollIntoView
          >
            {work.title}
          </Link>
          <ol className="list-disc pl-5 space-y-1">
            <li>
              <Link
                to=""
                hash={`${work.id}-contribution`}
                className="font-medium"
              >
                기여도
              </Link>
              <ol className="list-circle pl-6 space-y-1">
                {work.contribution.map((experience) => (
                  <li key={experience.id} className=" space-y-1">
                    <Link to="" hash={experience.id}>
                      {experience.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
            <li>
              <Link
                to=""
                hash={`${work.id}-troubleshooting`}
                className="font-medium"
              >
                트러블슈팅
              </Link>
              <ol className="list-circle pl-6 space-y-1">
                {work.troubleshooting.map((troubleshooting) => (
                  <li key={troubleshooting.id} className=" space-y-1">
                    <Link to="" hash={troubleshooting.id}>
                      {troubleshooting.problem}
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          </ol>
        </li>
      ))}
    </ol>
  );
};
