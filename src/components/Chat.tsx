import type { 채팅 } from '@/data/인터뷰';
import { Link } from '@tanstack/react-router';
import { match } from 'ts-pattern';
import { cn } from '@/lib/utils';

type Props = 채팅 & {
  className?: string;
};

export const Chat = ({ 컨텐츠, 확장, 이름, className = '' }: Props) => {
  const isMe = 이름 === 'Sunmin';

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
        <p>{컨텐츠}</p>
      </div>

      {match(확장)
        .with({ __t: 'Link' }, ({ 경로, 라벨 }) => (
          <Link
            href={경로}
            className={cn('mt-2 text-xs underline', {
              'text-blue-200 dark:text-blue-100': isMe,
              'text-blue-500 dark:text-blue-300': !isMe,
            })}
            to={''}
          >
            {라벨}
          </Link>
        ))
        .otherwise(() => null)}
    </div>
  );
};
