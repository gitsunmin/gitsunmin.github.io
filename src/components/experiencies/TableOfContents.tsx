import type { Experience } from '@/data/experiencies';
import { Link } from '@tanstack/react-router';
import { extractHeadings } from '@/utils/ReactNodeToString';

type Props = {
  experience: Experience;
};

export const TableOfContents = ({ experience }: Props) => {
  const { content } = experience;

  const headings = extractHeadings(content);

  return (
    <ol className="list-decimal pl-5 space-y-2 w-full text-left">
      {/* 추출된 헤딩들로 목차 생성 */}
      {headings.map((heading) => (
        <li
          key={heading.id}
          className="space-y-2"
          style={{ marginLeft: `${(heading.level - 1) * 20}px` }}
        >
          <Link
            to=""
            hash={heading.id}
            className="font-semibold"
            hashScrollIntoView={{
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            }}
          >
            {heading.text}
          </Link>
        </li>
      ))}
    </ol>
  );
};
