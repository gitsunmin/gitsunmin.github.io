import type { MDXComponents } from 'mdx/types';
import { match, P } from 'ts-pattern';
import { SafeImage } from '@/components/SafeImage';
import { PreWithCopy } from '@/components/PreWithCopy';

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
      <ul className="list-disc list-inside mb-4 w-full" {...props} />
    ),
    ol: (props) => (
      <ol className="list-decimal list-inside mb-4 w-full" {...props} />
    ),
    li: (props) => <li className="mb-2" {...props} />,
    code: (props) => (
      <code
        className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded font-mono text-sm"
        {...props}
      />
    ),
    pre: (props) => <PreWithCopy {...props} />,
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
    ...components,
  };
};
