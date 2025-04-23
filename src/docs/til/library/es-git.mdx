# Es-git

[es-git](https://es-git.slash.page/ko/getting-started.html)은 Node.js 환경에서 Git을 사용할 수 있도록 지원하는 라이브러리 입니다. 기존에는 `child_process` 혹은 [nodeGit](https://github.com/nodegit/nodegit)을 사용해왔습니다. `child_process`는
사용성이 너무 복잡하다는 문제가 있었고, nodeGit은 C++로 작성된 libgit2 라이브러리에 의존하며, 설치 시 node-gyp를 사용하여 네이티브 빌드를 수행해야 합니다. 이로 인해 설치 과정이 복잡하고, 시스템 환경에 따라 추가적인 설정이 필요할 수 있습니다.

이러한 불편함을 해소하여 `es-git`은 사전 빌드된 네이티브 바이너리를 제공하여 설치가 빠르고 간편함을 제공합니다. 또한 `typescript`의 Type을 제공하여 컴파일 타임에 안정성을 확보하는 것이 가능합니다.

또한 Rust로 작성된 바이너리 코드이기 때문에 메모리 누수에 대한 안정성을 확보할 수 있으며 성능 또한 기존의 `nodeGit`과 비슷한 수준으로서 사용함에 무리가 없어보입니다.

아래에는 커밋을 하는 간단한 예시를 작성하였습니다.

```sh
import { openRepository } from 'es-git';
import fs from 'node:fs/promises';

const repo = await openRepository('.');
 
await fs.writeFile('README.md', 'Hello World!', 'utf8');

const index = repo.index();
index.addPath('README.md');
index.write();

const tree = repo.head().peelToTree();
const signature = { name: 'Seokju Na', email: 'seokju.me@toss.im' };
const sha = repo.commit(tree, 'added new file', {
  author: signature,
  committer: signature,
});

const commit = repo.getCommit(sha);
console.log(commit.summary()); // "added new file"
```

자세한 내용은 공식 문서를 확인해주세요. [es-git](https://es-git.slash.page/ko/)