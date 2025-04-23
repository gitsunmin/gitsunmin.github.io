# Overuse of useMemo and useCallback

`useMemo` 와 `useCallback`은 분명히 성능 향상에 도움이 됩니다. 하지만 과사용은 오히려 성능에 좋지 않은 결과를 가져옵니다. 한 가지 예를 들면, dependency array에 object를 넣고 사용하면, react의 함수형 컴포넌트가 실행 될 때마다 re-rendering이 됩니다.


```javascript
const user = {
  name: "sunmin",
  gender: "M",
};

// ❌ user가 새롭게 할당되면서 변화로 인지하게 됩니다.
useMemo(() => {
  return `my name is ${user.name}`;
}, [user]);

// 🟢 원시 타입의 변수는 값이 변해야 변화로 인지하게 됩니다.
useMemo(() => {
  return `my name is ${user.name}`;
}, [user.name]);
```
