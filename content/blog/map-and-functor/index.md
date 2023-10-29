---
title: "Map, Functor 그리고 ts-belt"
description: "함수형 프로그래밍의 map과 functor를 설명합니다."
date: "2023-09-16T00:02:37.121Z"
categories:
  - "2023"
tags:
  - FunctionalPrograming
---

# 서론

함수형 프로그래밍에는 정말 많은 내용이 있는 것 같습니다. 그 중에서 map과 functor에 대해서, 그리고  typescript로 함수형 프로그래밍을 할 수 있도록 도와주는 ts-belt라는 라이브러리를 소개하겠습니다.

# 본론

우선 Map에 대해서 이야기를 해보려고 합니다.

보통 Map이라고 하면 어떤 것들이 생각 나시나요?

저는 아래 세 가지가 생각 나더라고요.

- 지도
- 데이터 타입의 Map
- 함수 Map

Map이 뭐길래 이렇게 같지만 다른 의미로 사용 되고 있을까요?

## 지도

Map이 왜 지도 일까요? 고대 라틴어를 사용하던 시기로 가보겠습니다. 고대 라틴어에서는 지도를 종이가 아닌 천이나 가죽에 그려서 가지고 다녔다고 합니다. 그래서 천이나 옷이라는 뜻의 mappa와 세계라는 뜻의 mundi라는 단어의 합성으로서 “mappa mundi”라는 단어로서 세계지도 라는 단어를 만들었죠. 그리고 이 “mappa mundi”는 프랑스어를 어쳐서 고대 영어로 “mapemounde”라는 단어로 사용이 되었다고 합니다. 너무 긴 이 단어는 축약이 되어서 결국 map이 되었죠.

그리고 우리는 보통 “mapping”이라는 단어를 많이 사용 하잖아요. 3차원의 구 형태인 지구를 잘게 쪼개서 조각 조각들을 2차원 형태인 종이에 옮겨서 그려내는 작업을 mapping이라고 한다네요.

## 데이터 타입

다음으로 데이터 타입의 Map을 한 번 알아볼게요.

map은 기본적으로 key와 value를 가진 아래와 같은 형태를 가집니다.

```jsx
{
  a: 1,
  b: 2,
  c: 3,
  d: 4,
}
```

a, b, c, d를 1, 2, 3, 4로 mapping하고 있습니다.

엇 지도를 설명할 때에 mapping이 있었는데, 여기도 나오네요.

잘 생각해보면, a, b, c, d가 지구의 조각들이고, 1, 2, 3, 4가 지도로 옮겨진 조각들이라고 생각하면 어떨까요?

데이터 타입의 map과 mapping이라는 단어들은 이렇게 만들어졌습니다.

결국 같은 의미를 가지고 있었네요.

## 함수

그럼 함수인 Map은 또 뭘까요?

보통 javascript 개발자라면, 아래와 같은 예시를 생각하실 것 같습니다.

```tsx
const array = ['a', 'b', 'c', 'd'];

const output = array.map((_, index) => index + 1);

console.log('output:', output);
// [1, 2, 3, 4];
```

그런데, 어디서 많이 본, Input과 Output인 것 같습니다.

함수인 Map도 사실 같은 의미를 가지고 있습니다. 원본 데이터를 사용자가 원하는 과정을 통해서 다른 데이터를 반환하는 함수 입니다. 아래 처럼 바꾸면 조금 더 쉬울 것 같습니다.

```tsx
const 지구_조각들 = ['a', 'b', 'c', 'd'];

const mapping = (_, index) => index + 1;

const 지도_조각들 = 지구_조각들.map(mapping);

console.log('지도_조각들:', 지도_조각들);
// [1, 2, 3, 4];
```

위 코드를 보면 진짜 전에 등장 하였던 내용들을 모두 포함하고 있는 내용 같네요. 다만, 유심히 봐야할 것이 있습니다. 데이터 구조가 바뀌지는 않았다는 것입니다. 잘 생각해보면, 지구의 조각들을 다 버리거나 다른 조각을 추가하여 지도를 만들지 않았듯이, 함수의 map도 이전과 이후가 구조가 바뀌면 map이라고 부를 수 없습니다. 이 점을 추가하여 함수에서의 Map을 한 번 정의해 보겠습니다.

> 함수에서의 Map은 데이터 구조의 모든 원소에 동일한 함수를 적용하여 새로운 데이터 구조를 생성하는 함수이다. 단, 이 때, 원본 데이터 구조를 변경하지 않고, 각 원소에 함수를 적용한 결과를 새로운 데이터 구조로 반환해야한다.
> 

## Functor

위에서 Map이 가진 의미 3가지가 사실은 같은 어원을 가지고 있다는 것을 알게 되었습니다. 이 섹션에서는 “mapping 가능한 어떠한 것”을 만들어 보려고 합니다. 마치 javascript의 array 처럼요.

mapping 가능한 어떠한 것을 만들기 위해서는 어떠한 것이 일단 필요할 것 같습니다. 또 이 어떠한 것은 원본 데이터를 가지고 있어야할 것 같습니다.

```tsx
class 어떠한_것 {
  constructor (value) {
    this.value = value
  }
}
```

이제 원본 데이터를 가진 `어떠한_것`을 정의하였으니, map함수를 넣어보겠습니다.

```tsx
class 어떠한_것 {
  constructor(value: string) {
    this.value = value;
  }

  value: string;

  map = (fn: (value: string) => string) => {
    return new 어떠한_것(fn(this.value));
  };
}
```

그런데, 우리 이 `어떠한_것`을 왜 만들었을까요?

이 어떠한_것은 사실 함수형프로그래밍에서 사용하는 “Functor”라고 하는 개념입니다. Functor끼리는 합성이 가능하고, 원본 데이터를 변경하지 않기 때문에, 함수형 프로그래밍에서 필수 개념중에 하나 입니다. (다음 포스트에서 더욱 자세히 다루어 보겠습니다.)

## ts-belt

typescript 영역에서 [fp-ts](https://gcanti.github.io/fp-ts/)라는 라이브러리를 이용하여 함수형 프로그래밍을 구현하고 있지만, 사실 어려운 개념들이 많이 있어서 도입하기가 쉽지는 않습니다. 이의 대안으로서 좀 더 쉬고 간편한 라이브러리인 [ts-belt](https://mobily.github.io/ts-belt/)를 소개합니다. 이 ts-belt는 pipe와 flow함수를 제공하여, 사용하다 보면 자연스럽게 함수형 프로그래밍을 하게 되는 라이브러리이며, 복잡한 기능 없이 필수적인 간편한 Functor만을 제공합니다. 비교적 러닝커브가 낮고, 함수형 프로그래밍을 처음 도입하는 분들께 적합한 라이브러리라고 생각합니다.

# 결론

Map은 데이터 타입, 함수 그리고 지도로의 의미를 갖지만, 이 의미는 사실 같은 의미를 가지고 있습니다. A라는 원본의 값을 받아서 B라는 다른 값을 반환하는 것이죠. 또, 이러한 것을 가지고 있고, mapping을 할 수 있는 것을 함수형 프로그래밍에서는 Functor라고 부르기로 하였습니다. 이러한 Functor를 ts-belt라는 라이브러리를 통해서 쉽게 사용할 수 있습니다.

# 참조

- [https://www.mediafine.co.kr/news/articleView.html?idxno=10360](https://www.mediafine.co.kr/news/articleView.html?idxno=10360)
- [Functors와 카테고리 - mido](https://tpgns.github.io/2018/04/07/functors-and-categories/#fn2)
- [What is a functor?. This is my attempt at explaining about… | by Thai Pangsakulyanont | Medium](https://medium.com/@dtinth/what-is-a-functor-dcf510b098b6)
- [https://mobily.github.io/ts-belt/api/array](https://mobily.github.io/ts-belt/api/array)