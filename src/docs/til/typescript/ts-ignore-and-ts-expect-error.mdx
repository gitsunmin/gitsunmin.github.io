# ts-ignore and ts-expect-error

아래와 같은 Typescript 코드가 있다고 가정해보겠습니다.

```typescript
function main() {
    let a = 1;
    
    a = 0; // OK
    a = false; // Not OK
//  ^ Type 'boolean' is not assignable to type 'number'. ts(2322)
}
```

이러한 상황에서는 에러가 발생할 것이다. 하지만, `// @ts-ignore`를 사용하면 에러를 무시할 수 있습니다.

```typescript
function main() {
    let a = 1;
    
    a = 0; // OK
    // @ts-ignore
    a = false; // OK
}
```

하지만, 기껏 만들어준 에러를 무시하는게, 좋은 방법은 아니라고 생각합니다.
(몰래몰래 사용하면 될 것 같습니다.)

이러한 케이스 외에도 Test 코드에서 사용하면 좋을 `// @ts-expect-error`가 있습니다.

```typescript
import { match, P } from 'ts-pattern';

describe('exhaustive()', () => {
  describe('should exclude matched patterns from subsequent `.with()` clauses', () => {
    it('string literals', () => {
        match(input)
        .with('b', (x) => {
            type t = Expect<Equal<typeof x, 'b'>>;
            return 1;
        })
        // @ts-expect-error
        .exhaustive();
    });
  });
});

```
- 참조: [ts-pattern repository](https://github.com/gvergnaud/ts-pattern)
