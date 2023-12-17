---
title: 2021년 Javascript 최신 동향
summary: 2021년 Javascript 최신 동향을 정리 해두었습니다.
description: 2021년 Javascript 최신 동향을 정리 해두었습니다.
date: 2021-11-02 12:00:00
image: /images/blogs/default_thumbnail.jpeg
author: 'Gitsunmin'
categories:
  - '2021'
tags:
  - Javascript
  - Trend
---

2015년 ~ 2020년까지의 Javascript의 표준 목록입니다.

- [ES2015 a.k.a. ES6](https://betterprogramming.pub/javascript-es2020-features-with-simple-examples-d301dbef2c37)
- [ES2016 a.k.a. ES7](https://medium.com/better-programming/javascript-es2016-features-with-examples-a41b7aead589)
- [ES2017 a.k.a. ES8](https://medium.com/better-programming/javascript-es2017-features-with-examples-877f8406e770)
- [ES2018 a.k.a. ES9](https://medium.com/better-programming/javascript-es2018-features-with-examples-30fda8ac50fa)
- [ES2019 a.k.a. ES10](https://medium.com/better-programming/twelve-es10-features-in-twelve-simple-examples-6e8cc109f3d3)
- [ES2020 a.k.a. ES11](https://medium.com/better-programming/javascript-es2020-features-with-simple-examples-d301dbef2c37)

2021년에는 어떤 변화가 있었는지 알아보려고합니다.

## String.prototype.replaceAll()

Javascript는 replace만 존재했었고, 한 String에 공통된 문자를 수정하려면, `정규표현식`을 이용하여 아래와 같은 방법을 사용해야 했습니다.

```javascript
const STR = '안녕하세요. 감사합니다. 안녕하세요. 고맙습니다.';

// 기존에 존재하였던 replace
STR.replace(/안녕하세요/g, 1); // => '1. 감사합니다. 1. 고맙습니다.'
```

2021년의 ES12는 replaceAll이라는 기능이 생겨 아래와 같이 공통된 문자를 수정할 수 있습니다.

```javascript
const STR = '안녕하세요. 감사합니다. 안녕하세요. 고맙습니다.';

// 2021년 ES12
STR.replaceAll('안녕하세요', 1); // '1. 감사합니다. 1. 고맙습니다.'
```

## Promise.any()

`Promise.any()`는 `Array.prototype.some()`와 비슷한 기능으로 이해를 했습니다. 하나라도 true인 경우에는 true, 전부 false인 경우에는 false를 리턴 하듯이, `Promise.any()`는 Array에 담긴 Promise들을 차례대로 실행하며 처음으로 성공한 Promise의 결과값을 리턴합니다. 단, 모두 실패한 경우에는 Error가 발생합니다.

```javascript
const successPromises = [
  new Promise((res, rej) => setTimeout(rej, 200, '인덱스 1')),
  new Promise((res, rej) => setTimeout(rej, 100, '인덱스 2')),
  new Promise((res, rej) => setTimeout(res, 300, '인덱스 3')),
];

Promise.any(successPromises)
  .then((value) => console.log(value)) // V
  .catch((error) => console.error(error));
// 인덱스 3

const allFailurePromises = [
  new Promise((res, rej) => setTimeout(rej, 100, '인덱스 1')),
  new Promise((res, rej) => setTimeout(rej, 200, '인덱스 2')),
  new Promise((res, rej) => setTimeout(rej, 300, '인덱스 3')),
];

Promise.any(allFailurePromises)
  .then((value) => console.log(value))
  .catch((error) => console.error(error)); // V
// AggregateError: All promises were rejected
```

## WeakRefs

javascript는 어떤 객체를 참조하고 있을 때, 사용이(참조) 멈추지 않는다면, 가비지컬렉터가 메모리를 삭제하지 않는 언어입니다. 하지만, weakRefs를 사용하게되면, 해당 객체의 참조 여부와는 상관 없이 일정 시간이 지나면 가비지컬렉터가 메모리를 삭제하여 사용할 수 없도록 합니다.

보통 캐시 또는 대형 객체에 대한 매핑을 오랜 시간 가지고 있지 않기를 원할 때 사용할 수 있습니다.

```javascript
let userInfo = {
  name: '안녕하세요.',
};

const userInfoWeekRef = new WeakRef(userInfo);

const printName = () => {
  console.log(userInfoWeekRef.deref().name);
};

userInfo = null; // 참조 해제

setInterval(printName, 3000); // 반복적으로 log를 찍는다.
```

```javascript
안녕하세요. // 반복적으로 log를 찍다가 어느센가 Error가 방생합니다.
안녕하세요.
안녕하세요.
...
...
...
// TypeError: Cannot read property 'name' of undefined
```

## Logical assignment operators(논리 할당 연산자)

Typescript 4.0 버전 부터 지원하던 기능인데, javascript의 기능으로 사용할 수 있도록 지원하게 되었습니다.

```javascript
// before
obj.prop = obj.prop || foo(); // obj.prop이 잘못된 값일 경우 할당
obj.prop = obj.prop && foo(); // obj.prop이 올바른 값일 경우 할당
obj.prop = obj.prop ?? foo(); // obj.prop이 null이나 undefined일 경우 할당

// after
obj.prop ||= foo();
obj.prop &&= foo();
obj.prop ??= foo();
```

## Numeric separators (숫자 구분 기호)

금액 관련 숫자에 3자리마다 콤마를 찍듯이, 구분자 \_(언더바)를 사용하여 사람이 읽기 쉽도록 작성하여도, javascript에서는 구분자를 사용하지 않았을 때랑 같은 숫자로 취급을 하는 기능이다.

```javascript
// before
10000000000; // 10000000000 -> 100억

// after
10_000_000_000; // 10000000000 -> 100억
1_00_0000_00; // 100000000 -> 구분자가 꼭 3자리마다 있을 필요는 없다.

console.log(10_000_000_000); // 10000000000
```

## 앞으로 Javascript는 어떤 기능을 추가할 것인가?

[https://github.com/tc39/proposals/blob/master/finished-proposals.md](https://github.com/tc39/proposals/blob/master/finished-proposals.md)

## 참조

[https://chanyeong.com/blog/post/29](https://chanyeong.com/blog/post/29)
