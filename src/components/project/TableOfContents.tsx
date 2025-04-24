import type { 프로젝트 } from '@/data/프로젝트';
import { Link } from '@tanstack/react-router';

type Props = {
  프로젝트: 프로젝트;
};

export const TableOfContents = ({ 프로젝트 }: Props) => {
  const { id, 이름, 작업 } = 프로젝트;

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
          {이름} 소개
        </Link>
      </li>

      {작업?.map((work) => (
        <li key={work.id} className="space-y-2">
          <Link
            to=""
            hash={work.id}
            className="font-semibold"
            hashScrollIntoView
          >
            {work.제목}
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
                {work.기여도.map((경험) => (
                  <li key={경험.id} className=" space-y-1">
                    <Link to="" hash={경험.id}>
                      {경험.제목}
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
                {work.트러블슈팅.map((트러블슈팅) => (
                  <li key={트러블슈팅.id} className=" space-y-1">
                    <Link to="" hash={트러블슈팅.id}>
                      {트러블슈팅.문제점}
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
