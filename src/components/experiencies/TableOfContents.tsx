import type { Experience } from '@/data/experiencies';
import { Link } from '@tanstack/react-router';

type Props = {
  experience: Experience;
};

export const TableOfContents = ({ experience }: Props) => {
  const { id, name, contents } = experience;

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

      {contents?.map(({ id, title }) => (
        <li key={id} className="space-y-2">
          <Link to="" hash={id} className="font-semibold" hashScrollIntoView>
            {title}
          </Link>
        </li>
      ))}
    </ol>
  );
};
