import { 채팅 } from '@/data/인터뷰';
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
        isMe ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900',
        className
      )}
    >
      <div>
        <p>{컨텐츠}</p>
      </div>

      {match(확장)
        .with({ __t: 'Link' }, ({ 경로, 라벨 }) => (
          <Link
            href={경로}
            className={cn(
              'mt-2 text-xs underline',
              isMe ? 'text-blue-200' : 'text-blue-500'
            )}
            to={''}
          >
            {라벨}
          </Link>
        ))
        .otherwise(() => null)}
    </div>
  );
};
