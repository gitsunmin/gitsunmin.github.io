# VScode Language Extensions

vscode은 다양한 Extension을 사용할 수 있는데, 이는 모두 개인 혹은 단체에서 제작된 add-on 소프트웨어 입니다. 이 Extension들은 많은 기능들 사용할 수 있는데 이 글에서는 그 중에서도 Code를 작성할 떄 도움이 되는 Extension을 개발하는 방법의 일부입니다.

## Language Extension
vscode에서는 코드를 작성할 때 도움이 되는 Extension 기능중에는 크게 두 가지가 있습니다. 
- Declarative language features
- Programmatic language features

### Declarative language features
Declarative language features는 TextMate grammar을 사용하여 구현됩니다. 이는 TextMate grammar은 TextMate editor에서 사용되는 문법을 사용하여
- Syntax highlighting
- Snippet completion
- Bracket matching
- Bracket autoclosing
- Bracket autosurrounding
- Comment toggling
- Auto indentation
- Folding (by markers)

위 기능들을 구현할 수 있습니다.

위 기능들은 `.json` 파일을 사용하여 vscode가 지원하는 기능들에 대한 문법에 따라서 작성이 되며, 아래 처럼 작성하면, 그 문법에 맞는 기능이 제공되는 형태입니다.

```json
{
    "scopeName": "source.example",
    "patterns": [
        {
            "include": "#keyword"
        }
    ],
    "repository": {
        "keyword": {
            "match": "\\b(keyword)\\b",
            "name": "keyword.example"
        }
    }
}
```

### Programmatic language features

Programmatic language features는 Language Server Protocol (LSP)를 사용하여 구현됩니다. 이는 LSP는 Language Server와 Editor 사이의 통신을 위한 프로토콜로, Language Server는 코드를 분석하고, 에러를 검출하고, 코드를 완성하고, 코드를 정리하는 등의 작업을 수행합니다. 아래와 같은 기능은 LSP를 사용하여 구현할 수 있습니다.

- Hover information (vscode.languages.registerHoverProvider)
- Auto completion (vscode.languages.registerCompletionItemProvider)
- Jump to definition (vscode.languages.registerDefinitionProvider)
- Error checking
- Formatting
- Refactoring
- Folding

Programmatic language features는 설명과 같이 하나의 Server가 필요합니다. 아래에는 LSP를 사용하여 구현된 Language Server를 사용하는 예시입니다.

### Language Server Protocol (LSP)
LSP(Language Server Protocol)는 Microsoft에서 제안한 프로토콜로, 언어 도구와 코드 편집기 간의 통신을 표준화합니다. 이 프로토콜이 등장한 이유와 그 역할을 요약하면 다음과 같습니다.

#### 왜 Language Server(언어 서버) 일까?
언어 서버는 다양한 프로그래밍 언어의 편집 환경을 강화하는 특별한 종류의 Visual Studio Code 확장 프로그램입니다. 언어 서버를 사용하면 자동 완성, 오류 검사(진단), 정의로 이동 및 VS Code에서 지원되는 기타 여러 언어 기능을 구현할 수 있습니다.

하지만 VS Code에서 언어 기능 지원을 구현하는 과정에서 세 가지 공통적인 문제를 발견했습니다:

첫째, 언어 서버는 일반적으로 네이티브 프로그래밍 언어로 구현되므로 Node.js 런타임을 사용하는 VS Code와 통합하는 데 어려움이 있습니다.

또한 언어 기능은 리소스 집약적일 수 있습니다. 예를 들어, 파일을 올바르게 검증하려면 언어 서버는 대량의 파일을 구문 분석하고, 추상 구문 트리를 구축하고, 정적 프로그램 분석을 수행해야 합니다. 이러한 작업에는 상당한 CPU 및 메모리 사용량이 발생할 수 있으므로 VS Code의 성능에 영향을 미치지 않도록 해야 합니다.

마지막으로, 여러 언어 툴링을 여러 코드 편집기와 통합하려면 상당한 노력이 필요할 수 있습니다. 언어 툴링의 입장에서는 서로 다른 API를 사용하는 코드 편집기에 적응해야 합니다. 코드 편집자의 입장에서는 언어 툴링에서 일관된 API를 기대할 수 없습니다. 따라서 N개의 코드 편집기에서 M개의 언어에 대한 언어 지원을 구현하는 것은 M * N의 작업이 됩니다.

이러한 문제를 해결하기 위해 Microsoft는 언어 도구와 코드 편집기 간의 통신을 표준화하는 언어 서버 프로토콜을 지정했습니다. 이렇게 하면 언어 서버는 언어 서버 프로토콜을 통해 코드 편집기와 통신하므로 어떤 언어로든 구현할 수 있으며 자체 프로세스에서 실행하여 성능 비용을 절감할 수 있습니다. 또한 모든 LSP 호환 언어 툴링은 여러 LSP 호환 코드 편집기와 통합할 수 있으며, 모든 LSP 호환 코드 편집기는 여러 LSP 호환 언어 툴링을 쉽게 선택할 수 있습니다. LSP는 언어 툴링 제공업체와 코드 편집기 공급업체 모두에게 이득입니다!


#### 언어 서버 구현하기

VS Code에서 언어 서버는 두 부분으로 나뉩니다:

- 언어 클라이언트: 자바스크립트/타입스크립트로 작성된 일반 VS 코드 확장 프로그램입니다. 이 확장자는 모든 VS 코드 네임스페이스 API에 액세스할 수 있습니다.
- 언어 서버: 별도의 프로세스에서 실행되는 언어 분석 도구입니다.

위에서 간략하게 설명한 것처럼 언어 서버를 별도의 프로세스에서 실행하면 두 가지 이점이 있습니다:

- 분석 도구는 언어 서버 프로토콜에 따라 언어 클라이언트와 통신할 수 있는 언어라면 어떤 언어로도 구현할 수 있습니다.
- 언어 분석 도구는 CPU와 메모리 사용량이 많은 경우가 많으므로 별도의 프로세스에서 실행하면 성능 비용을 피할 수 있습니다.


vscode에서 언어 서버를 사용하는 방법은 다음과 같습니다.

우선 package.json configurations 설정을 수정합니다.

```json
{
  "name": "my-extension",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.74.0"
  },
  "activationEvents": [
    "onLanguage:javascript"
  ],
  "main": "./extension.js",
  "contributes": {
    "configuration": {
      "type": "object",
      "title": "Example configuration",
      "properties": {
        "myExtension.enable": {
          "type": "boolean",
          "default": true,
          "description": "Enable/disable the extension"
        }
      }
    },
    "languages": [
      {
        "id": "javascript",
        "aliases": [
          "JavaScript",
          "javascript"
        ],
        "extensions": [
          ".js",
          ".mjs",
          ".cjs",
          ".ts",
          ".tsx"
        ],
        "configuration": "./language-configuration.json"
      }
    ]
  }
}
```

이렇게 설정하면 언어 클라이언트와 언어 서버 모두 활성화 됩니다.

그리고 언어 서버를 구현하는 프로세스를 만들어 줍니다.

```typescript
import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [{ scheme: 'file', language: 'plaintext' }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
    }
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'languageServerExample',
    'Language Server Example',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
```
