import { Text } from '@gitsunmin/ui';
import Markdown from 'react-markdown';

type Props = {
  content: string;
};

export const Post = (props: Props) => {
  const { content } = props;

  return (
    <Markdown
      skipHtml
      components={{
        h1: ({ children }) => (
          <Text token="heading-1" variant="bold">
            {children}
          </Text>
        ),
        h2: ({ children }) => (
          <Text
            token="heading-2"
            className="overflow-x-auto scroll-x scroll-smooth scrollbar-hide"
          >
            {children}
          </Text>
        ),
        h3: ({ children }) => <Text token="heading-3">{children}</Text>,
        h4: ({ children }) => <Text token="heading-4">{children}</Text>,
        h5: ({ children }) => <Text token="heading-5">{children}</Text>,
        h6: ({ children }) => <Text token="heading-6">{children}</Text>,
      }}
    >
      {content}
    </Markdown>
  );
};
