import type { Chat } from '@/data/interview';
import { Link } from '@tanstack/react-router';
import { match } from 'ts-pattern';
import { cn } from '@/lib/utils';

type Props = Chat & {
  className?: string;
  active?: boolean;
};

export const ChatCard = ({
  content,
  active = false,
  className = '',
}: Props) => {
  return (
    <div
      className={cn(
        'rounded-xl px-4 py-2 max-w-full shadow text-sm whitespace-pre-wrap break-words',
        {
          'bg-blue-500 text-white dark:bg-blue-600': active,
          'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100':
            !active,
        },
        className,
      )}
    >
      {match(content)
        .with({ __t: 'text' }, ({ text }) => (
          <div>
            <p>{text}</p>
          </div>
        ))
        .with({ __t: 'link' }, ({ label, url }) => (
          <Link
            href={url}
            className={cn('mt-2 text-xs underline', {
              'text-blue-200 dark:text-blue-100': active,
              'text-blue-500 dark:text-blue-300': !active,
            })}
            to={url}
          >
            {label}
          </Link>
        ))
        .with({ __t: 'image' }, () => <>image</>)
        .with({ __t: 'headline' }, () => <>headline</>)
        .exhaustive()}
    </div>
  );
};
