import { CodeBlockWrapper } from '@/components/Codeblock';
import { Link } from '@tanstack/react-router';
import type { MDXComponents } from 'mdx/types';
import { match, P } from 'ts-pattern';

type Props = {
  components?: MDXComponents;
};

export const MDXReplacer = ({ components = {} }: Props): MDXComponents => {
  return {
    h1: (props) => (
      <h1
        id={`h1-${props.children}`}
        className="text-4xl font-bold text-foreground mb-4"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        id={`h2-${props.children}`}
        className="text-3xl font-semibold text-foreground mt-8 mb-4"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        id={`h3-${props.children}`}
        className="text-2xl font-medium text-foreground mt-6 mb-3"
        {...props}
      />
    ),
    h4: (props) => (
      <h4
        id={`h4-${props.children}`}
        className="text-xl font-medium text-foreground mt-5 mb-2"
        {...props}
      />
    ),
    h5: (props) => (
      <h5
        id={`h5-${props.children}`}
        className="text-lg font-medium text-foreground mt-4 mb-1"
        {...props}
      />
    ),
    h6: (props) => (
      <h6
        id={`h6-${props.children}`}
        className="text-base font-medium text-foreground mt-3 mb-1"
        {...props}
      />
    ),
    p: (props) => (
      <p className="text-foreground leading-relaxed mb-4 w-full" {...props} />
    ),
    ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
    ol: (props) => <ol className="list-decimal list-inside mb-4" {...props} />,
    li: (props) => <li className="mb-2" {...props} />,
    code: (props) => (
      <code
        className="bg-gray-100 text-red-600 px-1 py-0.5 rounded"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
        {...props}
      />
    ),
    pre: (el) => {
      const preComponent = el.children as unknown as {
        props: { className: string; children: string };
      };
      const { className, children: code } = preComponent.props;
      return (
        <CodeBlockWrapper
          languege={className?.split('-').slice(1).join('') ?? 'javascript'}
          code={code}
        />
      );
    },
    a: (props) =>
      match(props.href)
        .with(P.string.startsWith('/'), (href) => (
          <Link {...props} href={href} to={'/'} className="text-blue-400" />
        ))
        .otherwise(() => (
          <a className="text-blue-400" target="_blank" {...props} />
        )),
    img: (props) => (
      <img
        {...props}
        alt={props.alt || 'Image'}
        className="rounded-lg shadow-md m-auto"
      />
    ),
    ...components,
  };
};
