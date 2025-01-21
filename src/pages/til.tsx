import { useQueryTIL } from '@/hooks/useQueryTIL';
import { Text } from '@gitsunmin/ui';
import Markdown from 'react-markdown';

export const TilPage = () => {
  const { data: readme, isLoading, isError } = useQueryTIL('/readme');

  if (isLoading) return <div>Loading...</div>;
  if (isError) throw new Error('Error fetching TIL');

  return (
    <main className="mx-auto flex">
      <section className="max-w-[320px] px-4 lg:outline overflow-y-scroll h-screen scroll-px-0">
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
                <a
                  href={href}
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
      </section>
    </main>
  );
};
