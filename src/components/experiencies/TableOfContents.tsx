import type { Experience } from '@/data/experiencies';
import { Link } from '@tanstack/react-router';
import { extractHeadings } from '@/utils/ReactNodeToString';

type Props = {
  experience: Experience;
};

export const TableOfContents = ({ experience }: Props) => {
  const { content } = experience;
  const headings = extractHeadings(content);

  // 헤딩을 중첩 구조로 변환
  type HeadingItem = {
    id: string;
    text: string;
    level: number;
    children: HeadingItem[];
  };

  const buildNestedStructure = (headings: HeadingItem[]) => {
    const result: HeadingItem[] = [];
    const stack: HeadingItem[] = [];

    for (const heading of headings) {
      const item = { ...heading, children: [] };

      // 현재 레벨보다 깊은 항목들을 스택에서 제거
      while (
        stack.length > 0 &&
        stack[stack.length - 1].level >= heading.level
      ) {
        stack.pop();
      }

      if (stack.length === 0) {
        result.push(item);
      } else {
        stack[stack.length - 1].children.push(item);
      }

      stack.push(item);
    }

    return result;
  };

  const renderNestedList = (items: HeadingItem[], level = 1) => (
    <ol
      className={`list-decimal space-y-2 ${level > 1 ? 'pl-5 mt-2' : 'pl-5'}`}
    >
      {items.map((item) => (
        <li key={item.id} className="space-y-1">
          <Link
            to="."
            hash={item.id}
            className="font-semibold"
            hashScrollIntoView={{
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            }}
          >
            {item.text}
          </Link>
          {item.children.length > 0 &&
            renderNestedList(item.children, level + 1)}
        </li>
      ))}
    </ol>
  );

  const nestedHeadings = buildNestedStructure(
    headings.map((heading) => ({ ...heading, children: [] })),
  );

  return (
    <div className="w-full text-left">{renderNestedList(nestedHeadings)}</div>
  );
};
