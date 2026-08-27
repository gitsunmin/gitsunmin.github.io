import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * 본문 흐름 중간에 끼어드는 배경지식·정의·용어 설명을 위한 블록.
 *
 * 블로그 MDX는 client 지시어 없이 정적 HTML로 렌더링되므로,
 * 접기/펼치기는 JS 없이 동작하는 <details>/<summary>로 구현한다.
 * (JS가 실패해도, 인쇄해도, 검색 크롤러가 읽어도 내용은 항상 DOM에 존재한다)
 */

type NoteKind = 'definition' | 'reason' | 'caution' | 'note';

type KindStyle = {
  label: string;
  icon: string;
  /** 왼쪽 액센트 레일 */
  rail: string;
  /** 종류 배지 */
  badge: string;
  /** 펼쳤을 때 카드 배경 (Tailwind가 스캔할 수 있도록 리터럴 문자열로 둔다) */
  open: string;
};

const KIND_STYLES: Record<NoteKind, KindStyle> = {
  definition: {
    label: '용어',
    icon: '📖',
    rail: 'before:bg-indigo-400 dark:before:bg-indigo-500',
    badge:
      'bg-indigo-50 text-indigo-600 ring-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-800',
    open: 'open:bg-indigo-50/40 dark:open:bg-indigo-950/20',
  },
  reason: {
    label: '왜',
    icon: '🤔',
    rail: 'before:bg-sky-400 dark:before:bg-sky-500',
    badge:
      'bg-sky-50 text-sky-600 ring-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800',
    open: 'open:bg-sky-50/40 dark:open:bg-sky-950/20',
  },
  caution: {
    label: '주의',
    icon: '⚠️',
    rail: 'before:bg-amber-400 dark:before:bg-amber-500',
    badge:
      'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800',
    open: 'open:bg-amber-50/40 dark:open:bg-amber-950/20',
  },
  note: {
    label: '참고',
    icon: '📝',
    rail: 'before:bg-gray-300 dark:before:bg-gray-600',
    badge:
      'bg-gray-100 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700',
    open: 'open:bg-gray-50/60 dark:open:bg-gray-800/30',
  },
};

type KnowledgeNoteProps = {
  /** 요약 줄에 굵게 노출되는 제목. 용어 이름이나 질문 형태 */
  term: string;
  kind?: NoteKind;
  /** 배지 문구를 직접 지정하고 싶을 때 */
  label?: string;
  /** 처음부터 펼친 상태로 둘지 */
  defaultOpen?: boolean;
  children: ReactNode;
};

export function KnowledgeNote({
  term,
  kind = 'definition',
  label,
  defaultOpen = false,
  children,
}: KnowledgeNoteProps) {
  const style = KIND_STYLES[kind];

  return (
    <details
      data-component="knowledge-note"
      data-kind={kind}
      open={defaultOpen}
      className={cn(
        'not-prose group relative my-3 overflow-hidden rounded-lg',
        'border border-gray-200 dark:border-gray-700',
        'bg-white/60 dark:bg-gray-900/40',
        'transition-colors duration-200',
        // 왼쪽 액센트 레일
        'before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:content-[""]',
        style.rail,
        style.open
      )}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-2 py-2.5 pl-4 pr-3',
          'select-none [&::-webkit-details-marker]:hidden',
          'hover:bg-gray-50/80 dark:hover:bg-gray-800/40',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-500'
        )}
      >
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5',
            'text-[11px] font-bold whitespace-nowrap ring-1 ring-inset',
            style.badge
          )}
        >
          <span aria-hidden="true">{style.icon}</span>
          {label ?? style.label}
        </span>

        <span className="min-w-0 flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          {term}
        </span>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'size-4 shrink-0 text-gray-400 dark:text-gray-500',
            'transition-transform duration-200 group-open:rotate-90'
          )}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </summary>

      <div
        className={cn(
          'knowledge-note-body px-4 pb-4 pl-4',
          'text-sm leading-relaxed text-gray-700 dark:text-gray-300',
          '[&>p]:mb-3 [&>p:last-child]:mb-0',
          '[&>ul]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul:last-child]:mb-0',
          '[&>ol]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol:last-child]:mb-0',
          '[&_li]:mb-1',
          '[&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-red-600',
          'dark:[&_code]:bg-gray-800 dark:[&_code]:text-red-400',
          '[&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-gray-100',
          '[&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400'
        )}
      >
        {children}
      </div>
    </details>
  );
}

// MDX는 형제 JSX 요소들을 Fragment 하나로 컴파일하므로, Children.toArray가
// 개별 KnowledgeNote 대신 Fragment 하나만 보게 된다. 이를 평탄화한다.
function flattenChildren(node: ReactNode): ReturnType<typeof Children.toArray> {
  return Children.toArray(node).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment) {
      return flattenChildren((child.props as { children?: ReactNode }).children);
    }
    return [child];
  });
}

type KnowledgeListProps = {
  /** 묶음 상단에 붙는 제목. 생략하면 제목 없이 묶음만 만든다 */
  title?: string;
  children: ReactNode;
};

/**
 * 같은 맥락에 속한 KnowledgeNote 여러 개를 하나의 묶음으로 만든다.
 * 본문에서 "여기서 짚고 넘어갈 것들"에 해당하는 구간을 한 덩어리로 보이게 해,
 * 어디까지가 곁가지 설명이고 어디부터 본문인지 눈으로 구분되게 한다.
 */
export function KnowledgeList({ title = '짚고 넘어가기', children }: KnowledgeListProps) {
  const items = flattenChildren(children).filter(isValidElement);

  return (
    <section
      data-component="knowledge-list"
      className={cn(
        'not-prose my-6 rounded-xl border border-dashed',
        'border-gray-300 dark:border-gray-700',
        'bg-gray-50/50 dark:bg-gray-900/30',
        'px-3 pb-3 pt-2.5'
      )}
    >
      {title && (
        <p
          className={cn(
            'mb-1.5 flex items-center gap-1.5 px-1',
            'text-[11px] font-bold uppercase tracking-widest',
            'text-gray-400 dark:text-gray-500'
          )}
        >
          <span aria-hidden="true">✦</span>
          {title}
        </p>
      )}
      <div className="flex flex-col">{items}</div>
    </section>
  );
}
