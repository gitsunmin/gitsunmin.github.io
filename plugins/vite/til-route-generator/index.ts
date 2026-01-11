import type { PluginOption } from 'vite';
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { Project, VariableDeclarationKind } from 'ts-morph';
import { match, P } from 'ts-pattern';

const ROOT_DIR = process.cwd();
const TIL_DIR = path.join(ROOT_DIR, '/modules/til');
const DOCS_DIR = path.join(ROOT_DIR, '/src/docs/til');
const TIL_ROUTE_DIR = path.join(ROOT_DIR, '/src/routes/_layout/til');
const TIL_ASSETS_DIR = path.join(ROOT_DIR, '/src/assets/til');
const TIL_DIST_ASSETS_DIR = path.join(ROOT_DIR, '/til');

const ignore = () => undefined;

const ALLOWED_DOCUMENTS_EXT_REGEX = /\.(mdx|md)$/g;
const ALLOWED_IMAGE_EXT_REGEX = /\.(png|jpg|jpeg|gif|svg|webp)$/g;

const processLogger = ({
  fn,
  message,
  silent = false,
}: {
  message: string;
  fn: () => void;
  silent?: boolean;
}) => {
  if (silent) return fn();

  console.time(message);
  fn();
  console.timeEnd(message);
};

const resetDocsDir = () => {
  rmSync(DOCS_DIR, { recursive: true, force: true });
  mkdirSync(DOCS_DIR);
};

const resetTILRouteDir = () => {
  rmSync(TIL_ROUTE_DIR, { recursive: true, force: true });
  mkdirSync(TIL_ROUTE_DIR);
};

const resetTILAssetsDir = () => {
  rmSync(TIL_ASSETS_DIR, { recursive: true, force: true });
  mkdirSync(TIL_ASSETS_DIR);
};

const replaceImagePath = (pathes: {
  filePath: string;
  relativePath: string;
  targetBasePath: string;
}) => {
  const { filePath, relativePath, targetBasePath } = pathes;
  const mdxContent = readFileSync(path.join(DOCS_DIR, relativePath), 'utf-8');
  const updatedImageContent = mdxContent.replace(
    /!\[.*?\]\((.*?)\)/g,
    (match, imagePath) => {
      const imageFileName = path.basename(imagePath);
      const newImagePath = path.join(
        '/',
        path.relative(
          ROOT_DIR,
          path.join(targetBasePath, filePath, imageFileName),
        ),
      );
      return match.replace(imagePath, newImagePath);
    },
  );
  writeFileSync(path.join(DOCS_DIR, relativePath), updatedImageContent);
};

const replaceLinkPath = (pathes: { relativePath: string }) => {
  const { relativePath } = pathes;
  let mdxContent = readFileSync(path.join(DOCS_DIR, relativePath), 'utf-8');

  // 코드 블록과 인라인 코드를 임시로 치환
  const codeBlocks: string[] = [];
  const inlineCodes: string[] = [];

  // 코드 블록 (```) 임시 치환
  mdxContent = mdxContent.replace(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length;
    codeBlocks.push(match);
    return `__CODE_BLOCK_${index}__`;
  });

  // 인라인 코드 (`) 임시 치환
  mdxContent = mdxContent.replace(/`[^`]+`/g, (match) => {
    const index = inlineCodes.length;
    inlineCodes.push(match);
    return `__INLINE_CODE_${index}__`;
  });

  // 링크 교체
  const updatedLinkContent = mdxContent.replace(
    /(?<!!)\[(?!\^)[^\]]*\]\((?![a-zA-Z][a-zA-Z0-9+.-]*:\/\/)([^)]+)\)/g,
    (match, linkPath) => {
      const newLinkPath = path
        .join('/', path.relative(ROOT_DIR, path.join('til', linkPath)))
        .replace(/\.mdx$/, '')
        .replace(/\/index$/, '/');
      return match.replace(linkPath, newLinkPath);
    },
  );

  // 코드 블록 복원
  let finalContent = updatedLinkContent;
  codeBlocks.forEach((code, index) => {
    finalContent = finalContent.replace(`__CODE_BLOCK_${index}__`, code);
  });

  // 인라인 코드 복원
  inlineCodes.forEach((code, index) => {
    finalContent = finalContent.replace(`__INLINE_CODE_${index}__`, code);
  });

  writeFileSync(path.join(DOCS_DIR, relativePath), finalContent);
};

const importTILContents = (inputDir: string, mode: string) => {
  const entries = readdirSync(inputDir, {
    withFileTypes: true,
    recursive: true,
  });

  // biome-ignore lint/complexity/noForEach: <explanation>
  entries.forEach((entry) => {
    const relativePath = path.relative(
      TIL_DIR,
      `${entry.parentPath}/${entry.name}`,
    );
    const filePath = path.parse(relativePath);

    match(filePath.ext)
      .with(P.string.regex(ALLOWED_DOCUMENTS_EXT_REGEX), () => {
        mkdirSync(path.join(DOCS_DIR, filePath.dir), { recursive: true });
        copyFileSync(
          path.join(inputDir, relativePath),
          path.join(DOCS_DIR, relativePath),
        );

        replaceLinkPath({
          relativePath,
        });

        replaceImagePath({
          relativePath,
          filePath: filePath.dir,
          targetBasePath:
            mode === 'development' ? TIL_ASSETS_DIR : TIL_DIST_ASSETS_DIR,
        });
      })
      .with(P.string.regex(ALLOWED_IMAGE_EXT_REGEX), () => {
        mkdirSync(path.join(TIL_ASSETS_DIR, filePath.dir), { recursive: true });
        copyFileSync(
          path.join(inputDir, relativePath),
          path.join(TIL_ASSETS_DIR, relativePath),
        );
      })
      .otherwise(ignore);
  });
};

const getTitleFromParsedPath = (filePath: path.ParsedPath): string => {
  const filename = match(filePath)
    .with({ name: 'index' }, () => filePath.dir.split(path.sep).pop() || '')
    .with({ name: P.string }, () => filePath.name)
    .otherwise(() => '');

  return filename.replace(/-/g, ' ').replace(/_/g, ' ');
};

const generateComponent = (relativePath: string, outputPath: string) => {
  const project = new Project();
  const sourceFile = project.createSourceFile(
    outputPath,
    {},
    { overwrite: true },
  );
  const filePath = path.parse(relativePath);
  const title = getTitleFromParsedPath(filePath);
  const componentName = 'component';
  const mdxReplacerVariableName = 'components';

  sourceFile.addImportDeclaration({
    namedImports: ['TILPage'],
    moduleSpecifier: '@/components/pages/TIL',
  });
  sourceFile.addImportDeclaration({
    defaultImport: 'Content',
    moduleSpecifier: `@til/${relativePath}`,
  });
  sourceFile.addImportDeclaration({
    namedImports: ['MDXReplacer'],
    moduleSpecifier: '@/components/MDXReplacer',
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: mdxReplacerVariableName,
        initializer: 'MDXReplacer({})',
      },
    ],
  });

  sourceFile.addFunction({
    name: componentName,
    isExported: false,
    statements: [
      `return (
  <TILPage>
    <Content components={components} />
  </TILPage>
);`,
    ],
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: 'Route',
        initializer: (writer) => {
          writer.writeLine(
            `createFileRoute('${path.join('/_layout/til', filePath.dir, filePath.name.replace(/index$/, '/'))}')(`,
          );
          writer.block(() => {
            writer.writeLine(`component: ${componentName},`);
            writer.writeLine('head: () => (');
            writer.block(() => {
              writer.writeLine(`  meta: [{ title: '${title}' }],`);
            });
            writer.writeLine('),');
          });
          writer.writeLine(')');
        },
      },
    ],
  });

  sourceFile.saveSync();
};

const createTILRoute = () => {
  const entries = readdirSync(DOCS_DIR, {
    withFileTypes: true,
    recursive: true,
  });
  // biome-ignore lint/complexity/noForEach: <explanation>
  entries.forEach((entry) => {
    const relativePath = path.relative(
      DOCS_DIR,
      `${entry.parentPath}/${entry.name}`,
    );
    const filePath = path.parse(relativePath);

    if (filePath.ext === '.mdx') {
      const outputPath = path.join(
        TIL_ROUTE_DIR,
        filePath.dir,
        `${filePath.name}.tsx`,
      );

      generateComponent(relativePath, outputPath);
    }
  });
};

type Options = {
  silent?: boolean;
  mode?: string;
};

export const tilRouteGenerator = (options?: Options): PluginOption => {
  const { silent = false, mode = 'development' } = options ?? {};

  return {
    name: 'til-route-generator',
    apply: () => true,
    buildStart() {
      processLogger({
        fn: () => resetDocsDir(),
        message: '🚮 [TIL route generation] resetting docs directory completed',
        silent,
      });
      processLogger({
        fn: () => resetTILAssetsDir(),
        message:
          '🚮 [TIL route generation] resetting TIL assets directory completed',
        silent,
      });
      processLogger({
        fn: () => importTILContents(TIL_DIR, mode),
        message: '📄 [TIL route generation] importing TIL contents completed',
        silent,
      });
      processLogger({
        fn: () => resetTILRouteDir(),
        message:
          '🚮 [TIL route generation] resetting TIL route directory completed',
        silent,
      });
      processLogger({
        fn: () => createTILRoute(),
        message: '♻️  [TIL route generation] creating TIL route completed',
        silent,
      });
    },
  };
};
