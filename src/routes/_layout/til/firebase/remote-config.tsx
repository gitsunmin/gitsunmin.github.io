
import Content from '@til/firebase/remote-config.mdx';
import { createFileRoute } from '@tanstack/react-router';
import { CodeBlockWrapper } from '@/components/Codeblock';
import { Link } from '@tanstack/react-router';
import { match, P } from 'ts-pattern';

const Component = () => (
  <Content
    components={{
      h1: (props) => <h1 className="text-4xl font-bold text-foreground mb-4" {...props} />,
      h2: (props) => <h2 className="text-3xl font-semibold text-foreground mt-8 mb-4" {...props} />,
      h3: (props) => <h3 className="text-2xl font-medium text-foreground mt-6 mb-3" {...props} />,
      p: (props) => <p className="text-foreground leading-relaxed mb-4" {...props} />,
      ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
      ol: (props) => <ol className="list-decimal list-inside mb-4" {...props} />,
      li: (props) => <li className="mb-2" {...props} />,
      a: (props) => match(props.href)
        .with(P.string.startsWith('/'), (href) => (
          <Link {...props} href={'' + href.replace('.mdx', '').replace(/\/index$/, '')} to={'/'} className="text-blue-400" />
        ))
        .otherwise(() => <a className="text-blue-400" {...props} />),
      code: (props) => <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded" {...props} />,
      blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600" {...props} />,
      img: (props) => <img {...props} src={'/modules/til/firebase/' + props.src?.split('/').pop()} className="rounded-lg shadow-md my-4" />,
      pre: (el) => {
        const preComponent = el.children as unknown as { props: { className: string; children: string } };
        const { className, children: code } = preComponent.props;
        return <CodeBlockWrapper languege={className?.split('-').slice(1).join('') ?? 'javascript'} code={code} />;
      },
    }}
  />
);

export const Route = createFileRoute('/_layout/til/firebase/remote-config')({
  component: Component,
});
