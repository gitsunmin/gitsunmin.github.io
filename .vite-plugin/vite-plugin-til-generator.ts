import { mkdirSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { PluginOption } from 'vite';

type TransformOptions = {
  ignoreFolders: string[];
};

const generateTilComponents = ({ ignoreFolders }: TransformOptions) => {
  const tilDir = path.resolve(__dirname, '../modules/til');
  const outputDir = path.resolve(__dirname, '../src/routes/_layout/til');

  const isIgnored = (dirName: string) => ignoreFolders.includes(dirName);

  const transformPath = (filePath: string) =>
    filePath.replace(/\/index$/, '').replace(/README\.tsx$/, 'index.tsx');

  const transformRoutePath = (filePath: string) =>
    filePath.replace(/^.*\/til\//, 'til/').replace(/\/index$/, '/');

  const generateComponentCode = (mdxImportPath: string, routePath: string, linkPrefix: string = '', imgSrcPrefix: string = '') => {
    return `
import Content from '@${mdxImportPath}';
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
          <Link {...props} href={'${linkPrefix}' + href.replace('.mdx', '').replace(/\\/index$/, '')} to={'/'} className="text-blue-400" />
        ))
        .otherwise(() => <a className="text-blue-400" {...props} />),
      code: (props) => <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded" {...props} />,
      blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600" {...props} />,
      img: (props) => <img {...props} src={'${imgSrcPrefix}' + props.src?.split('/').pop()} className="rounded-lg shadow-md my-4" />,
      pre: (el) => {
        const preComponent = el.children as unknown as { props: { className: string; children: string } };
        const { className, children: code } = preComponent.props;
        return <CodeBlockWrapper languege={className?.split('-').slice(1).join('') ?? 'javascript'} code={code} />;
      },
    }}
  />
);

export const Route = createFileRoute('/_layout/${routePath}')({
  component: Component,
});
`
  };

  const cleanOutputDir = (dir: string) => {
    if (rmSync) {
      rmSync(dir, { recursive: true, force: true });
    }
    mkdirSync(dir, { recursive: true });
  };

  const processDir = (inputDir: string, outputDir: string) => {
    const entries = readdirSync(inputDir, { withFileTypes: true });

    entries.forEach((entry) => {
      const inputPath = path.join(inputDir, entry.name);

      // Special handling for README.md
      if (entry.isFile() && entry.name === 'README.mdx') {
        const outputPath = path.join(outputDir, 'index.tsx');
        const mdxImportPath = inputPath.replace(/^.*\/til\//, 'til/');
        const routePath = 'til/';
        const rawContent = generateComponentCode(mdxImportPath, routePath, '/til');

        mkdirSync(path.dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, rawContent);
        return;
      }

      const outputPath = path.join(outputDir, transformPath(entry.name.replace(/\.mdx$/, '.tsx')));

      if (entry.isDirectory() && !isIgnored(entry.name)) {
        mkdirSync(outputPath, { recursive: true });
        processDir(inputPath, outputPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const mdxImportPath = inputPath.replace(/^.*\/til\//, 'til/');
        const routePath = transformRoutePath(outputPath.replace(/\.tsx$/, ''));
        const rawContent = generateComponentCode(mdxImportPath, routePath, '', inputDir.replace(/^.*\/til\//, '/modules/til/') + '/');

        mkdirSync(path.dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, rawContent);
      }
    });
  };

  cleanOutputDir(outputDir);
  processDir(tilDir, outputDir);
};

export const tilGenerator = (options: TransformOptions): PluginOption => {
  return {
    name: 'til-generator',
    apply: 'serve',
    buildStart() {
      generateTilComponents(options);
    },
  };
};