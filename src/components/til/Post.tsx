import { Text } from '@gitsunmin/ui';
import Markdown from 'react-markdown';
import { CodeBlockWrapper } from '../Codeblock';

type Props = {
  content: string;
};

export const Post = (props: Props) => {
  const { content } = props;

  return (
    <Markdown
      skipHtml
      components={{
        h1: ({ children }) => <h1 className="font-bold pb-1">{children}</h1>,
        h2: ({ children }) => <h2>{children}</h2>,
        h3: ({ children }) => <Text token="heading-3">{children}</Text>,
        h4: ({ children }) => <Text token="heading-4">{children}</Text>,
        h5: ({ children }) => <Text token="heading-5">{children}</Text>,
        h6: ({ children }) => <Text token="heading-6">{children}</Text>,
        pre: (el) => {
          const preComponent = el.children as unknown as {
            props: {
              className: string;
              children: string;
            };
          };
          const { className, children: code } = preComponent.props;

          return (
            <CodeBlockWrapper
              languege={className?.split('-').slice(1).join('') ?? 'javascript'}
              code={code}
            />
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
};
