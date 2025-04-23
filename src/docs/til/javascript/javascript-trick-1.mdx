# Javascript Trick 1

## 오늘의 퀴즈

아래 코드를 실행하면 어떤 결과가 나올까?

```js
const person = {
    'last-name': 'Kim',
    first: 'sunmin'
};
console.log(person.last-name);
```

- **Node.js**: `ReferenceError: name is not defined`
- **브라우저**: `NaN`

## 왜 이렇게 결과가 나올까?

### 1. `person.last` 평가
`person.last-name` 코드는 Javascript 엔진에서는 아래와 같이 평가가 됩니다.

```js
person.last - name
```
- `person.last`는 person에 존재하지 않기 때문에 `undefined`로 평가됨
- `undefined - name`은 `undefined`에서 `name`을 뺀다는 의미
- 브라우저에서는 window의 이름으로 `name` 변수가 전역으로 존재함.
- Node.js에서는 전역 스코프에 `name`이라는 식별자가 존재하지 않음

이런 코드는 아래와 같이 평가됩니다.

### 2. 각 실행 환경에 따라 결과가 다른 이유

#### Node.js
- 전역 스코프에 `name`이라는 식별자가 존재하지 않음
- → `ReferenceError` 발생

#### 브라우저
- 전역 객체 `window`에 기본적으로 `name` 프로퍼티가 존재 (`window.name`)
- 기본값은 빈 문자열 `''`
- → `undefined - ''`는 `NaN`

## 정리

| 환경      | 결과                          | 이유                                      |
|-----------|-------------------------------|-------------------------------------------|
| Node.js   | `ReferenceError`              | `name`이라는 식별자가 없음                |
| 브라우저  | `NaN`                          | `window.name`이 빈 문자열로 존재함        |

### 참고
- `name`같은 전역 식별자는 **브라우저에서는 암묵적으로 존재**하지만, Node.js에서는 그렇지 않음
- 전역 객체의 차이는 실행 환경의 차이에 따라 발생하므로, 디버깅 시 환경을 꼭 고려하자

