import type { MDXComponents } from 'mdx/types';
import { match, P } from 'ts-pattern';
import { SafeImage } from '@/components/SafeImage';
import { cn } from '@/lib/utils';

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
    code: (props) => (
      <code
        className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded font-mono text-sm"
        {...props}
      />
    ),
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
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-400 my-4"
        {...props}
      />
    ),
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
      <div className="max-w-[calc(100vw-40px)] mx-1 overflow-hidden overflow-x-auto my-6 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <table
          className={cn("min-w-full text-sm text-left border-collapse", className)}
          {...rest}
        />
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
        className="px-4 py-3 font-semibold border-b border-gray-200 dark:border-gray-700 whitespace-nowrap"
        {...props}
      />
    ),
    td: (props) => (
      <td
        className="px-4 py-3 text-gray-700 dark:text-gray-300 align-top"
        {...props}
      />
    ),
    ...components,
  };
};
