import Markdown from 'react-markdown';
import { Link } from '@tanstack/react-router';

type Props = {
  content: string;
};

export const Readme = ({ content }: Props) => {
  return (
    <Markdown
      skipHtml
      components={{
        h1: ({ children }) => <h1 className='text-4xl pb-4'>
            {children}
          </h1>,
        h2: ({ children }) => <h2 className='text-3xl py-2'>
            {children}
          </h2>,
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
            <Link href={`/til/${href}`} to={'.'} className='text-blue-400 '>
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
