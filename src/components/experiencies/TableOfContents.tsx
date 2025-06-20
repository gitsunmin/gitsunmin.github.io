import type { Experience } from '@/data/experiencies';
import { Link } from '@tanstack/react-router';
import { match, P } from 'ts-pattern';

type Props = {
  experience: Experience;
};

export const TableOfContents = ({ experience }: Props) => {
  const { id, contents } = experience;

  return (
    <ol className="list-decimal pl-5 space-y-2 w-full text-left">
      <li className="font-semibold">
        <Link
          hash={`${id}-intro`}
          to=""
          className="font-semibold"
          hashScrollIntoView={{
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          }}
        >
          introduce
        </Link>
      </li>

      {match(contents)
        .with(P.nonNullable, (contents) => {
          return contents
            .filter((content) => content.__t === 'headline')
            .map(({ __t, level, text }, index) => (
              <li
                key={`${id}-content-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
                className="space-y-2"
              >
                <Link
                  to=""
                  hash={`${__t}-${level}-${text.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-semibold"
                  hashScrollIntoView={{
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                  }}
                >
                  {text}
                </Link>
              </li>
            ));
        })
        .otherwise(() => null)}
    </ol>
  );
};
