import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import { match, P } from 'ts-pattern';
import { SafeImage } from '@/components/SafeImage';
import { cn } from '@/lib/utils';

type CalloutType = 'tip' | 'warning' | 'insight' | 'note';

const CALLOUT_STYLES: Record<CalloutType, { container: string; icon: string; label: string }> = {
  tip: {
    container: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600',
    icon: '💡',
    label: 'Tip',
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600',
    icon: '⚠️',
    label: 'Warning',
  },
  insight: {
    container: 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600',
    icon: '✨',
    label: 'Insight',
  },
  note: {
    container: 'bg-gray-50 dark:bg-gray-800/60 border-gray-400 dark:border-gray-600',
    icon: '📝',
    label: 'Note',
  },
};

function parseCalloutType(children: ReactNode): { type: CalloutType | null; rest: ReactNode } {
  const childArray = Children.toArray(children);
  const first = childArray[0];

  if (!isValidElement(first)) return { type: null, rest: children };

  const pChildren = Children.toArray((first as React.ReactElement<{ children: ReactNode }>).props.children);
  const firstText = pChildren[0];

  if (typeof firstText !== 'string') return { type: null, rest: children };

  const match = firstText.match(/^\[!(tip|warning|insight|note)\]\s*/i);
  if (!match) return { type: null, rest: children };

  const type = match[1].toLowerCase() as CalloutType;
  const remaining = firstText.slice(match[0].length);

  const newFirstP = {
    ...(first as React.ReactElement),
    props: {
      ...(first as React.ReactElement<{ children: ReactNode }>).props,
      children: remaining ? [remaining, ...pChildren.slice(1)] : pChildren.slice(1),
    },
  };

  const restChildren = [newFirstP, ...childArray.slice(1)].filter(
    (c) => !(isValidElement(c) && (c as React.ReactElement<{ children: ReactNode }>).props.children?.toString().trim() === '')
  );

  return { type, rest: restChildren };
}

type Props = {
  components?: MDXComponents;
};

export const MDXReplacer = ({ components = {} }: Props): MDXComponents => {
  return {
    h1: (props) => (
      <h1
        id={`h1-${props.children}`}
        className="text-4xl font-bold text-foreground mb-4 w-full"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        id={`h2-${props.children}`}
        className="text-3xl font-semibold text-foreground mt-8 mb-4 w-full"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        id={`h3-${props.children}`}
        className="text-2xl font-medium text-foreground mt-6 mb-3 w-full"
        {...props}
      />
    ),
    h4: (props) => (
      <h4
        id={`h4-${props.children}`}
        className="text-xl font-medium text-foreground mt-5 mb-2 w-full"
        {...props}
      />
    ),
    h5: (props) => (
      <h5
        id={`h5-${props.children}`}
        className="text-lg font-medium text-foreground mt-4 mb-1 w-full"
        {...props}
      />
    ),
    h6: (props) => (
      <h6
        id={`h6-${props.children}`}
        className="text-base font-medium text-foreground mt-3 mb-1 w-full"
        {...props}
      />
    ),
    p: (props) => (
      <p className="text-foreground leading-relaxed mb-4 w-full" {...props} />
    ),
    ul: (props) => (
      <ul className="list-disc list-outside mb-4 w-full pl-6" {...props} />
    ),
    ol: (props) => (
      <ol className="list-decimal list-outside mb-4 w-full pl-6" {...props} />
    ),
    li: (props) => <li className="mb-2 ml-0" {...props} />,
    code: ({ children, ...props }) => {
      if (typeof children !== 'string') {
        return <code {...props}>{children}</code>;
      }
      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ className, ...rest }) => (
      <div className="relative my-6 group code-block-wrapper max-w-[calc(100vw-32px)] overflow-hidden rounded-lg shadow-md">
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-gray-300 dark:group-hover:border-gray-600">
          <pre
            {...rest}
            className={cn("p-5 min-w-max bg-transparent text-foreground", className)}
          />
        </div>
        <button
          className="copy-button absolute top-3 right-3 p-2.5 rounded-lg transition-all duration-200 z-10 cursor-pointer bg-gray-700/90 hover:bg-gray-600 text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-md"
          aria-label="Copy code"
          type="button"
        >
          <svg className="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <title>Copy</title>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg className="check-icon hidden text-green-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <title>Copied</title>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    ),
    blockquote: ({ children }) => {
      const { type, rest } = parseCalloutType(children);
      if (!type) {
        return (
          <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
            {children}
          </blockquote>
        );
      }
      const style = CALLOUT_STYLES[type];
      return (
        <div className={cn('border-l-4 rounded-r-lg px-4 py-3 my-6 not-italic', style.container)}>
          <div className="flex items-center gap-1.5 font-semibold text-sm mb-2">
            <span aria-hidden="true">{style.icon}</span>
            <span>{style.label}</span>
          </div>
          <div className="text-sm leading-relaxed [&>p]:mb-1 [&>p:last-child]:mb-0">
            {rest}
          </div>
        </div>
      );
    },
    a: (props) =>
      match(props.href)
        .with(P.string.startsWith('/'), (href) => (
          <a {...props} href={href} className="text-blue-500 dark:text-blue-400 hover:underline" />
        ))
        .otherwise(() => (
          <a
            className="text-blue-500 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        )),
    img: (props) => <SafeImage {...props} />,
    table: ({ className, ...rest }) => (
      <div className="w-full max-w-[calc(100vw-40px)] my-6 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table
            className={cn("w-full table-fixed text-sm text-left border-collapse", className)}
            {...rest}
          />
        </div>
      </div>
    ),
    thead: (props) => (
      <thead
        className="bg-gray-50/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider"
        {...props}
      />
    ),
    tbody: (props) => (
      <tbody
        className="divide-y divide-gray-100 dark:divide-gray-700"
        {...props}
      />
    ),
    tr: (props) => (
      <tr
        className="odd:bg-white even:bg-gray-50/50 dark:odd:bg-gray-900 dark:even:bg-gray-800/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-150"
        {...props}
      />
    ),
    th: (props) => (
      <th
        className="px-4 py-3 font-semibold border-b border-gray-200 dark:border-gray-700 break-all"
        {...props}
      />
    ),
    td: (props) => (
      <td
        className="px-4 py-3 text-gray-700 dark:text-gray-300 align-top break-all"
        {...props}
      />
    ),
    ...components,
  };
};
