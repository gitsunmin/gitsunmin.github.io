import Markdown from 'react-markdown';
import { Text } from '@gitsunmin/ui';
import { Link } from '@tanstack/react-router';

type Props = {
  content: string;
};

export const Readme = ({ content }: Props) => {
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
        ul: ({ children }) => {
          return <ul className="list-disc ml-4">{children}</ul>;
        },
        li: ({ children }) => {
          return (
            <li style={{ listStyleType: 'disc' }} className="ml-4">
              {children}
            </li>
          );
        },
        a: ({ children, href }) => {
          return (
            <Link href={`/til/${href}`} to={'.'}>
              {children}
            </Link>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
};
