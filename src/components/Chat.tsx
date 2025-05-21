import type { Chat } from '@/data/interview';
import { Link } from '@tanstack/react-router';
import { match } from 'ts-pattern';
import { cn } from '@/lib/utils';

type Props = Chat & {
  className?: string;
};

export const ChatCard = ({ contents, extend, name, className = '' }: Props) => {
  const isMe = name === 'Sunmin';

  return (
    <div
      className={cn(
        'rounded-xl px-4 py-2 max-w-full shadow text-sm whitespace-pre-wrap break-words',
        {
          'bg-blue-500 text-white dark:bg-blue-600': isMe,
          'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100':
            !isMe,
        },
        className,
      )}
    >
      <div>
        <p>{contents}</p>
      </div>

      {match(extend)
        .with({ __t: 'Link' }, ({ path, label }) => (
          <Link
            href={path}
            className={cn('mt-2 text-xs underline', {
              'text-blue-200 dark:text-blue-100': isMe,
              'text-blue-500 dark:text-blue-300': !isMe,
            })}
            to={''}
          >
            {label}
          </Link>
        ))
        .otherwise(() => null)}
    </div>
  );
};
