import { useQueryTIL } from '@/hooks/useQueryTIL';
import { Text } from '@gitsunmin/ui';
import Markdown from 'react-markdown';

export const TilPage = () => {
  const { data: readme, isLoading, isError } = useQueryTIL('/readme');

  if (isLoading) return <div>Loading...</div>;
  if (isError) throw new Error('Error fetching TIL');

  return (
    <main className="mx-auto">
      <Markdown
        skipHtml
        components={{
          h1: ({ children }) => (
            <Text token="heading-1" variant="bright">
              {children}
            </Text>
          ),
          h2: ({ children }) => <Text token="heading-2">{children}</Text>,
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
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {readme ?? ''}
      </Markdown>
    </main>
  );
};
