# Promise.allSettled And Promise.all

```jsx
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).
  then((results) => results.forEach((result, index) => console.log(index, result.status)));

Promise.all(promises).
  then((results) => results.forEach((result, index) => console.log(index, result.status)));
```

`Promise.allSettled`와 `Promise.all`는 모두 input으로 제공한 `Promise` 들을 비동기로 실행하고, 모두 종료 되었을 때, 동시에 모든 결과값을 받을 수 있습니다. 그렇다면, 두 API의 차이점을 무엇일까요?

- `Promise.allSettled`는 `promise1`처럼 실패한 `Promise`를 비동기 함수를 제외하고, `Promise2`, `Promise3`의 결과값을 받아온다.

```jsx
0 'fulfilled'
1 'rejected'
```

- `Promise.all`는 `promise1`처럼 실패한 `Promise`가 있는 경우에는 모든 비동기 함수 들의 결과를 받아올 수 없다. (Error)

```jsx
Uncaught (in promise) foo
```

