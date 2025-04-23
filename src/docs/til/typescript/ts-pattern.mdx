# ts-pattern

[ts-pattern](https://github.com/gvergnaud/ts-pattern)은 Typescript로 함수형 프로그래밍 언어에서 지원하는 Pattern Matching(=패턴 매칭)이라는 문법을 사용할 수 있도록 지원하는 라이브러리 입니다.

패턴 매칭은 위에서도 이야기 했듯이, 함수형 프로그래밍 언어에서 유래한 코드 분기 기법으로, 선언적 방식으로 값의 구조를 면밀히 조사할 수 있습니다. 특히 복잡한 데이터 구조나 여러 값에 대해 분기할 때 명령형 대안(if/else/스위치 문)에 비해 덜 장황하고 강력합니다.

ts-pattern은 아래와 같이 예시를 제공해 주고 있습니다.

```typescript
import { match, P } from 'ts-pattern';

type Data =
  | { type: 'text'; content: string }
  | { type: 'img'; src: string };

type Result =
  | { type: 'ok'; data: Data }
  | { type: 'error'; error: Error };

const result: Result = ...;

const html = match(result)
  .with({ type: 'error' }, () => `<p>Oups! An error occured</p>`)
  .with({ type: 'ok', data: { type: 'text' } }, (res) => `<p>${res.data.content}</p>`)
  .with({ type: 'ok', data: { type: 'img', src: P.select() } }, (src) => `<img src=${src} />`)
  .exhaustive();
```

이렇게 `match`로 입력값을 받아서, `.with()`와 같은 함수를 연속으로 사용하여 분기 처리를 할 수 있습니다. 또, `.with()`안에 object로 구성된 패턴을 입력하면, 이 패턴과 매칭된 경우에는 패턴 다음으로 입력받은 콜백함수가 실행됩니다.

추가적으로, 마지막에 `exhaustive()`와 같은 함수를 사용하여 예외에 대한 검증을 추가할 수 있습니다.
