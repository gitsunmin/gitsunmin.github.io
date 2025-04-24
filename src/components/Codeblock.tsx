import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getSingletonHighlighter } from 'shiki';
import mermaid from 'mermaid';
import { match } from 'ts-pattern';

type Props = {
  languege: string;
  code: string;
};

const MermaidDiagram = ({ code }: { code: string }) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, [code]);

  return <div className="mermaid flex justify-center items-center">{code}</div>;
};

const CodeBlock = ({ code = '', languege }: Props) => {
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    getSingletonHighlighter({
      themes: ['github-dark'],
      langs: [languege],
    }).then((highlighter) => {
      setHighlightedCode(
        highlighter.codeToHtml(code ?? '', {
          lang: languege,
          theme: 'github-dark',
        }),
      );
    });
  }, [code, languege]);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      className="rounded-lg bg-[#24292e] p-4 overflow-auto shadow-lg shadow-gray-700"
    />
  );
};

export const CodeBlockWrapper = ({ code = '', languege }: Props) => {
  const handleClick = async () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Copied!');
    });
  };

  return (
    <div className={cn('relative py-4', `language-${languege}`)}>
      <button
        className="absolute right-2 top-4 text-sm text-white py-1 px-2"
        onClick={handleClick}
      >
        Copy
      </button>
      {match(languege)
        .with('mermaid', () => <MermaidDiagram code={code} />)
        .otherwise(() => (
          <CodeBlock code={code} languege={languege} />
        ))}
    </div>
  );
};
