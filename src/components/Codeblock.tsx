import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type Props = React.PropsWithChildren<{
  languege: string;
}>;

export const CodeBlock = ({ children = <></>, languege }: Props) => {
  const handleClick = async () => {
    navigator.clipboard.writeText(children?.toString() ?? '').then(() => {
      alert('Copied!');
    });
  };

  return (
    <div className="relative">
      <button
        className="absolute right-2 top-0 text-sm text-white py-1 px-2"
        onClick={handleClick}
      >
        Copy
      </button>
      <SyntaxHighlighter
        language={languege}
        style={theme}
        customStyle={{
          padding: '1rem',
          borderRadius: '0.5rem',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        {Array.isArray(children) ? children : [children]}
      </SyntaxHighlighter>
    </div>
  );
};
