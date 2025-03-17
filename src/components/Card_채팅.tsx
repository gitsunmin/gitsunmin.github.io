// import { Card } from '@/components/ui/card';
import { 채팅 } from '@/data/인터뷰';
import { Link } from '@tanstack/react-router';
import { match } from 'ts-pattern';

export const Card_채팅 = (props: 채팅) => {
  const { 컨텐츠, 확장 } = props;
  return (
    <div className="rounded-[10px] py-[12px] px-[10px] outline outline-gray-200">
      <p>{컨텐츠}</p>

      {match(확장)
        .with({ __t: 'Link' }, ({ 경로, 라벨 }) => (
          <Link
            href={경로}
            className="text-blue-500 hover:underline flex justify-end break-all"
            to={''}
          >
            {라벨}
          </Link>
        ))
        .otherwise(() => null)}
    </div>
  );
};
