---
title: 계산기 만들기
summary: 중위 표기법을 후위 표기법으로 변환하는 알고리즘을 활용하여 계산기 프로그램을 만들어봤습니다.
date: 2023-03-23 12:00:00
image: /images/blogs/default_thumbnail.jpeg
author: 'Gitsunmin'
categories:
  - '2023'
tags:
  - Frontend
---

# 서론

일반적으로 사람은 수학 계산을 할 때, [중위 표기법](https://ko.wikipedia.org/wiki/%EC%A4%91%EC%9C%84_%ED%91%9C%EA%B8%B0%EB%B2%95)을 사용하여 계산을 하고, 쉽게 이해할 수 있습니다. 하지만, 중위 표기법을 컴퓨터로 계산하기는 쉽지 않습니다. “우선순위”라는 것이 존재하기 때문입니다. 그래서 계산기와 같은 컴퓨터로 계산을 할 때에는 [후위 표기법](https://ko.wikipedia.org/wiki/%EC%97%AD%ED%8F%B4%EB%9E%80%EB%93%9C_%ED%91%9C%EA%B8%B0%EB%B2%95)이라는 것을 사용하여 계산을 합니다. 이 후위 표기법은 괄호나 곱하기 더하기 등의 우선순위를 따로 생각하지 않고, 순서대로 계산만 하면 되는, 컴퓨터로 계산을 할 때에는 아주 간편한 표기법입니다.

저는 사용자가 중위 표기법으로 입력을 하면, 후위 표기법으로 변환을 한 뒤에, 계산을 하여 결과를 도출하는 계산기 프로그램을 만들어 보려고합니다.

# 본론

## Algorithm

저는 [여기](https://dev.to/quantumsheep/how-calculators-read-mathematical-expression-with-operator-precedence-4n9h) 블로그의 내용을 참고하였으며, **[Shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)** 을 사용하여 개발을 하였습니다.

Sunting yard algorithm은 중위표기법으로 작성된 input의 내용을 Operator Stack이라는 Stack을 이용하여 후위 표기법인 ouput으로 변환을 하는 알고리즘입니다.

Sunting yard algorithm을 알기 위해서는 우선, 산수에서 사용하는 우선순위를 알고 있어야합니다.

| 연산자 | 우선순위 |
| ------ | -------- |
| \*     | 2        |
| /      | 2        |
| %      | 2        |
| +      | 1        |
| -      | 1        |

그리고 아래의 그림을 설명 하겠습니다

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/06dafcb7-f9bd-43b7-a109-80298d881eb8/Untitled.png)

- a) 는 input을 보여주고 있고,
- b) 는 연산자가 아닌 token을 ouput으로 보냅니다.
- c) 는 + 연산자를 Operator Stack에 넣습니다.
- d) 는 연산자가 아닌 B를 ouput에 넣습니다.
- e) 는 다시 \* 연산자를 Operator Stack에 넣습니다.
- f), g) 는 - 연산자를 Operator Stack에 넣으려고 하지만, - 연산자 보다 우선순위가 높은 연산자가 Stack의 가장 위에 있습니다. Operator Stack에는 들어온 순서가 있고, 새로 들어오는 연산자가 이미 Operator Stack에 TOP에 있는 연산자보다 작거나 같은 경우에는, Stack의 값을 output으로 비우고나서, 넣을 수 있습니다. 그렇기 때문에, \*, + 연산자를 먼저 output으로 보내고, - 연산자를 Operator Stack에 넣습니다.
- h) 에서는 다시 D가 연산자가 아니기 때문에, output으로 들어갑니다.
- i)에서는 이제 남아있는 모든 Operator Stack의 연산자를 모두 output으로 옮깁니다.
- j) input과 Operator Stack이 모두 비었다면, 변환이 마무리 된 것입니다.

## Coding

위 설명을 바탕으로 저는 아래와 같이 코드를 작성하였습니다.

[funny-calculator/index.ts at master · gitsunmin/funny-calculator](https://github.com/gitsunmin/funny-calculator/blob/master/src/renderer/src/hooks/index.ts)

- 유요한 값인지 확인, validator
- 중위 표기법의 input을 후위 표기법으로 변환, converter
- 후위 표기법으로 변환된 값을 계산하는 함수, calculate

여기서 converter에서 **[Shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)** 을 사용하여 중위 표기법을 후위 표기법으로 변환을 하였습니다.

나머지 계산은 부동 소수점 오류를 방지하기 위해서 [big.js](https://mikemcl.github.io/big.js/) 라이브러리를 사용하였습니다.

## Building

사실 모바일로 만들고 싶었지만, 모든 연산자를 input에 모두 노출 시키며 계산을 하는 방식은 데스크탑에서 더 적합한 것 같다는 생각이 들어서 저는 Electron + React로 개발을 하였고, vite를 이용하여 번들링 하였습니다.

# 결론

계산기를 만들어보는 것이 처음 이었지만, 알고리즘을 구현하여 개발을 비교적 쉽게 할 수 있었습니다. 다시 한 번 더 알고리즘의 구현의 중요성을 느끼게 해주는 프로젝트였다고 생각합니다.

# 참조

- [https://dev.to/quantumsheep/how-calculators-read-mathematical-expression-with-operator-precedence-4n9h](https://dev.to/quantumsheep/how-calculators-read-mathematical-expression-with-operator-precedence-4n9h)
- https://ko.wikipedia.org/wiki/역폴란드_표기법]
- [https://en.wikipedia.org/wiki/Shunting_yard_algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)
