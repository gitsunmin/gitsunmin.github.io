---
title: Deview 2023을 다녀온 후
summary: deview 2023을 다녀온 후에 작성하는 요약 및 리뷰
description: deview 2023을 다녀온 후에 작성하는 요약 및 리뷰
date: 2023-03-04 12:00:00
image: https://deview.kr/2023/img/og-edit.jpg
author: 'Gitsunmin'
categories:
  - '2023'
tags:
  - Frontend
  - Review
---

# 서론

Naver에서 개최한 컨퍼런스인 Deview를 다녀와서 간단하게라도 기록하기 위해 문서를 작성하려고합니다.

# 본론

우선 저는 프론트엔드 개발자이기 때문에 일부 프론트엔드 관련된 아래 세션에만 참가를 하였고, Day1에만 참석할 수 있었습니다.

- **하나의 코드로 React, Vue, Svelte 등 모든 프레임워크를 지원할 수 있는 CFCs Reactive [최연규, NAVER Search]**
- **눈으로 보며 듣는 음성 기록, 클로바노트 서비스의 웹 기술 톺아보기 [임대현/이은성, NAVER Cloud]**
- **중요한 건 꺾이지 않는 마음: 스마트에디터의 도전 [김성원/이진, NAVER ETECH]**
- **GraphQL 잘 쓰고 계신가요? (Production-ready GraphQL) [오제관/권기범, NAVER Glace]**
- **SSR환경에서의 Micro-Frontend 구현과 퍼포먼스 향상을 위한 캐시전략 [박찬진, 쿠팡]**

강의 자료를 따로 제공해 주고 있어서 참조 부분에 업로드 해두겠습니다.

## 하나의 코드로 React, Vue, Svelte 등 모든 프레임워크를 지원할 수 있는 CFCs Reactive [최연규, NAVER Search]

### 요약

[CFCs](https://github.com/naver/cfcs)는 Naver에서 사용하는 [egjs](https://naver.github.io/egjs/)라는 라이브러리를 React, Vue, Svelte 등 여러 프에레워크에서 제공하기 위해서 개발되었습니다. 물론 각 프레임워크 별로 코드를 작성하여 egjs를 여러 Framework에서 제공하는 것도 가능했지만, 한 번의 작업으로 여러 프레임워크를 제공하는 것이 목표였습니다.

목표를 이루기 위해서 프레임워크들의 공통점을 찾았는데, 다음과 같은 공통점을 찾을 수 있었습니다.

- 변경이 되면 UI를 다시 그리는 state가 존재한다.
- 컴포넌트별로 생성이 완료되는 순간과 컴포넌트가 소멸하는 순간에 대한 라이프 사이클이 존재한다.

CFCs는 위 공통점을 이용하여 한 번만 작성하면, 여러 프레임워크로의 변환 가능한 코드를 작성할 수 있었습니다. 자세한 문법은 라이브러리 페이지나 발표자료를 참고해주세요.

장점과 단점은 이렇습니다.

- 장점
  - Core(Vanilla)를 제외한 프레임워크 코드가 매우 적고 간결합니다.
  - 대부분의 문제는 공통 코드 또는 Core 컴포넌트의 문제로 판단할 수 있습니다.
    - Core만 기능 추가 / 수정하면 모든 프레임워크 컴포넌트에 기능 추가 / 수정이 반영됩니다.
- 단점
  - CFCs에 대한 러닝 커브가 존재합니다.
  - 단일 프레임워크 지원이라면 비효율적입니다.
  - CFCs 모듈의 코드가 추가됨으로써 패키지 용량이 증가할 수 있습니다.

## 눈으로 보며 듣는 음성 기록, 클로바노트 서비스의 웹 기술 톺아보기 [임대현/이은성, NAVER Cloud]

### 요약

- 클로바 노트 소개

클로바 노트(Clova Note)는 네이버에서 제공하는 클로바 AI 기술을 활용하여 음성 녹음을 텍스트로 변환해 주는 기능을 제공하는 노트 앱입니다. 최근에는 파파고와 함께 다국어 지원을 하고 있습니다.

- 클로바 노트 개발 스택

클로바노트는 NEXT.js로 만들어 졌으며, 오프라인 중에도 서비스를 지원하기 위해서 PWA와 workbox를 도입하였다고 합니다. 추가적으로 클로바 노트에서는 반응형 디자인을 사용하고 있는데, 단순히 UI만 반응형으로 만든 것이 아니라 UX또한 모바일과 PC 등 에서 사용할 수 있도록 개발을 하였습니다.

예 ) 리스트에서 체크박스가 hover하였을 때, 생기는 것이 PC의 UX상 깔끔하게 사용할 수 있지만, 모바일과 함께 고려하였기 때문에, hover하지 않아도, 체크 가능한 상태를 유지하도록 하였습니다.

클로바 노트 팀에서는 클로바 노트 관련 모든 프로젝트를 모노레포 방식으로 코드를 관리하고 있는데, yarn workspace를 사용하여 패키지를 관리하고, 아토믹 디자인 패턴으로 컴포넌트를 관리한다고 합니다.

- 팀 문화

클로바 노트 팀은 개발 효율화, 운영 효율화, 세계 최고의 기술력 지향을 개발 철학으로 삼고, 2주에 한 번씩 하는 스크럼을 “감성 스크럼”이라고 명명하여 사적인 이야기 또한 같이 공유하며 팀간의 우대를 쌓는다고 하였고, 이러한 감성의 교류는 코드 리뷰와 같이 예민한 작업 시에 서로에 대한 이해를 도와준다고 합니다.

## 중요한 건 꺾이지 않는 마음: 스마트에디터의 도전 [김성원/이진, NAVER ETECH]

### 요약

스마트 에디터가 지금까지 어떤 고난과 역경을 이겨냈는지를 알려주는 발표였습니다.

1세대, 1.5세대 그리고 2세대, 3세대 로 구분이 되어 있는데, 한 번 요약 해 보겠습니다.

1세대 에디터(SE 2.0)는 [contenteditable](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/contenteditable)을 기반으로 하여 html을 그대로 저장하였고, IE의 버전별 대응의 어려움과 inline style의 한계로 멀티 디바이스 대응의 문제점이 있었습니다.

1.5세대 에디터(SE 3.0)에서는 HTML의 텍스트를 저장하는 대신 JSON으로 스타일과 텍스트 타입을 정의하여 저장하였지만, Selection의 동작에 문제가 발생하는 등의 문제점이 있었습니다.

2세대 에디터(SE ONE)는 contenteditable 대신 가상 커서와 input Buffer를 활용하여 문제점을 해결하였지만, 우클릭 시 컨텍스트 메뉴에서 텍스트 수정관련 메뉴를 제공하지 않는 문제와 한자나 일본어 입력 시 밀리는 현상이 있었습니다.

3세대 에디터(SE ONE V2)에서는 React의 vDOM과 DOM 충돌 문제를 해결하기 위해 upstream과 downstream을 사용하여 글을 작성하는 동안에는 오로지 데이터만 저장하는 upstream과 Enter 입력 시에는 React에서 화면을 제어하는 downstream이 발생하도록 구현하여 서로 충돌이 일어나는 것을 방지하였습니다.

추가적으로 에디터가 아닌, 다른 앱에서도 적용가능한 Undo/Redo의 최적화 방법, Chunk를 이용한 성능 최적화 방법은 발표자료의 설명을 대신하겠습니다.

코드 품질과 스타일에 대한 내용도 있어서 짧게 요약하자면,

코드의 복잡도와 중복을 해결하기 위해서 블록코딩이라는 것을 도입하였습니다. 불록 코딩은 명령의 단위를 최소화 하여, 하나의 블록으로 만들고, 이 블록들이 연결되어 하나의 명령을 수행하는 코딩 방법이며, 각 작은 단위의 블록에서는 성공, 실패 두 가지의 상태를 가집니다. 성공에 대한 다음 액션, 실패에 대한 다음 액션을들 정의하여 큰 블록을 만들면, 재사용성도 증가하고, 흐름의 파악이 쉽기 때문에 복잡도 또한 감소할 수 있습니다.

스마트 에디터의 스타일은 2세대 부터 커스텀 스타일을 적용하였는데, 에디터를 사용하는 모든 서비스들에 따라서 너무 많은 요구사항으로 복잡한 상황이었습니다. 스마트 에디터에서는 이러한 상황에서 IE 스펙을 제외할 수 있는 점, node sass를 Dart Sass로 변경을 기점으로 문제를 해결하기 시작했습니다. IE 스펙을 제외하면서 CSS 변수를 사용할 수 있게 되었고, 공통화를 하여 복잡도를 낮출 수 있었습니다. 또, 관심사의 분리를 하였는데, 기존의 mixin, function별로 관리를 하던 css코드를 color의 mixin, font의 mixin 처럼 하나의 관심사를 두어 관심사 별로 mixin, function을 관리하는 방식으로 변경하여, 모듈화를 할 수 있었고, 복잡도가 많이 개선되었습니다.

## GraphQL 잘 쓰고 계신가요? (Production-ready GraphQL) [오제관/권기범, NAVER Glace]

### 요약

정의해야 하는 GQL 중에서 같은 이미지 이지만, 리사이징 크기에 따라서 다른 경로를 제공하는 필드가 있었습니다. 그런데 각 크기별로 GQL 필드를 차지하는것이 비효율적이라고 느껴서 발표자 분들은 Field Argument를 적용하였습니다.

1. Schema

발표자분들은 여러 서버에서 데이터를 받아 사용하고 있었기 때문에, Schema를 다시 정의해야 했으며, 2개 이상의 API를 하나의 GQL로 합치며 Type도 정의 하는 작업을 했습니다.

2. Field Argument

정의해야 하는 GQL 중에서 리사이징 된 이미지의 경로들이 있었는데, 이것들 사이즈 별로 필드를 차지하며 있는 GQL의 비효율성을 느껴서 Field Argument를 사용하였습니다.

Field Argument를 사용하면,

```jsx
{
	image_200: @@@@
	imgae_400: @@@@
	image_800: @@@@
}
```

이런식으로 GQL을 정의할 필요 없이,

```jsx
type User {
	image(width: Int): String
}
```

이렇게 정의하여

```jsx
query {
	user (id: "1234") {
		image(width: 200)
	}
}
```

이런 식으로 사용하면 되어서, 간단하게 사용할 수 있습니다.

3. Enum

위에서 다루었던 image의 사이즈별 Argument를 받는 방식에서 width가 정해져 있을 텐데, 타입을 강제하고 싶을 때, Enum을 사용하면 됩니다.

```jsx
enum ImageWidth {
	W_200
	W_400
	W_800
}
```

4. Error handling & Union & Typescript

GraphQL은 성공 실패 시 모두 status가 200으로 응답이 오기 때문에, 별도의 Error Handling을 해 주어야합니다. 하지만 귀찮죠. 효과적인 방법을 제시해 주었습니다.

한 Query에서 여러 에러가 발생할 경우에 Union을 사용하여 간단하게 해결하였습니다.

```graphql
query {
  checkNickname(name: "abcd") {
    ... on NicknameSuccessd {
      nickname
    }
    ... on DuplicatedNickname {
      message
    }
    ... on PwoedError {
      words
    }
  }
}
```

이런식으로 사용하면, 성공했을 때는 NicknameSuccessd의 데이터, 중복 오류인 경우에는 DuplicatedNickname의 데이터가 오며, 금칙어 오류가 발생하였을 때는 PwoedError 필드에 데이터가 올 것입니다.

위와 같은 에러는, typescript로 아래의 타입을 정의해서 사용할 수 있고, 분기를 이용하여 에러별 동작을 정의할 수 있습니다.

```tsx
interface BaseError {
	message: String!
}

type DuplicatedNickname implements BaseError {
	message: String!
}

type PwordError implements BaseError {
	woeds: [String!]!
}
...
```

5. Custom Scalar

날짜, Email, url 등 일정한 패턴이 있는 데이터들의 타입을 정의하는 방법인 Custom Scalar기능을 소개합니다.

```tsx
const GraphQLYearMonth = new GraphQLScalarType({
	name: 'YearMonth',
	summary:'년월을 `YYYY-MM` 포맷의 스트링으로 받고 유효한 날짜인지 검증',
	seialize,
	parseValuse
});

type Query {
	missions(yearMonth: YearMonth!): [Mission!]!
}
```

- seialize, parseValuse는 데이터를 체크하는 함수를 주입하는 변수입니다.

발표자분들께서 [grapgql-scalars](https://the-guild.dev/graphql/scalars/docs/scalars/account-number)라는 라이브러리를 추천해 주었습니다.

6. Field Resolver

```jsx
const isShowable =
  !review.isPrivate && review.isQualified && !review.isReportedByOthers;
```

이러한 로직이 프론트엔드에 있는 것 괜찮으신가요? 또, 여러 프론트엔드에서 다 이런 로직을 사용하고 있습니다. BFF에서 한 번의 치환으로 모두 isShowable이라는 변수만 보게하면 좋을 것 같습니다.

이러한 것을 가능하게 해주는 것이 Field Resolver입니다. 이 Resolver는 단순하게는 Getter 함수라고 생각을 하셔도 무방합니다.

프론트엔드에서 사용할 경우에는 단순히 field를 추가하는 것 처럼 사용을 하면 되고, BFF에서는 field를 사용한 경우에는 field resolver가 실행되고, 그렇지 않은 경우네느 실행이 되지 않아서 서버 자원을 동적으로 사용할 수 있습니다.

7. Normalization

database에서 많이 사용하는 용어인 normalization을 프론트엔드에서도 사용하는 방법을 소개하는 내용인데, 프론트엔드에서 apollo-client를 사용할 경우에 요청한 데이터를 caching 할 수 있고, 이 기능을 이용하여 여러 아이템이 있는 list에서 한 건을 변경하는 경우에, 변경이 성공한 데이터의 값만 cache에서 바꾸고, cache에 있는 데이터를 조회하는 방법을 사용할 수 있습니다.

8. Fragment

같은 GraphQL field를 여러번 사용할 경우에 schema에서 정의한 type들을 이용하여 fragment를 선언할 수 있고, 변수처럼 사용이 가능합니다.

## SSR환경에서의 Micro-Frontend 구현과 퍼포먼스 향상을 위한 캐시전략 [박찬진, 쿠팡]

### 요약

마이크로 프론트엔드를 적용하면서 있었던 고민과 회고한 내용을 발표해 주셨습니다.

발표자분께서는 너무 많은 위젯을 한 팀에서 업무를 하다 보니, 과부하에 대한 대처로서 마이크로 프론트엔드를 생각하셨다고 하셨고, 1차와 2차로 나누어서 적용를 하였는데, 1차로는 mono-repo를 도입하는 것을 하셨다고 합니다.

의외로 mono-repo 적용은 코드레벨에서는 큰 영향이 없었고, 배포 후에 롤백 해야하는 상황에서 각 commit의 순서가 영향을 주는 경우가 있었습니다.

2차로 마이크로 프론트엔드를 적용하였는데, cdn으로 각 서비스를 배포하고, 그 cdn 주소로부터 component를 import하여 등록하는 방식을 적용하였습니다. 그렇기 때문에, 각 서비스별로 개별 배포가 가능해졌으며, AB 테스트를 추가로 도입하여 각 부분별 문제가 발생했을 때, 롤백이 가능하도록 구성하였습니다.

마지막으로 캐시 전략이 있는데, 모듈별 버전 업데이트와 컨테이너의 버전 없데이트 때마다 캐시를 초기화하여 새로운 코드가 반영되도록 구성되었습니다.

→ 결과

- 마이크로 프론트엔드는 시스템의 복잡성을 증가시킨다.
- 캐시 키는 동시성 문제를 고려하여 신중하게 결정해야한다.
- 개발 경험이 월등히 나아졌다.
- 여전히 팀간의 소통은 중요하다.

# 결론

오랜만에 오프라인 컨퍼런스에 참여하여 정보 교류도 하고, 기념품도 받아오는 시간을 갖게 된 것 같습니다. 발표 내용들은 만족하는 것도 있고, 그렇지 않은 것도 있었지만, 대체로 좋은 시간이었던 것 같습니다.

그중에 “GraphQL 잘 쓰고 계산기요?(오제관/권기범)” 세션에서 우리 회사에도 이런 BFF 서버를 두어서 프론트엔드에서 관리를 한다면, 프론트엔드 코드가 한결 깔끔해질 것 같고, 성능도 어느정도는 상승할 것 같다는 생각이 들었습니다. 그리고 지금 운영중인 가장 큰 프로젝트 또한 언젠가는 vue에서 React로 변경을 해야하는 숙제가 있는데, 이것은 “SSR환경에서의 micro-frontend 구현과 퍼포먼스 향상을 위한 캐시전략(박찬진)” 세션에서 보여준 마이크로 프론트엔드를 이용하여 점진적으로 바꾸어 나가면 될 것 같다는 생각 또한 해 보았습니다.

이렇게 Deview를 통해서 모든 정보를 얻지는 못 하더라도, 잊혀졌던 키워드만 듣고 온 것 만으로도 저에게는 긍정적인 영향이 있었습니다. 그리고, “눈으로 보며 듣는 음성 기록, 클로바노트 서비스의 웹 기술 톺아보기(임대현/이은성)” 세션의 발표자들의 발표하는 방식이 너무 마음에 들었습니다. 아주 긴 내용이 아주 잘 이해가 되어서, 클로바 노트로 녹음한 내용들 다시 들어보며, 발표하는 방식을 연구해 보려고 합니다.

# 참조

- **하나의 코드로 React, Vue, Svelte 등 모든 프레임워크를 지원할 수 있는 CFCs Reactive [최연규, NAVER Search]**
  [최연규-발표자료](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/86e28656-af5a-4bc0-af13-142df4392303/111%E1%84%92%E1%85%A1%E1%84%82%E1%85%A1%E1%84%8B%E1%85%B4%E1%84%8F%E1%85%A9%E1%84%83%E1%85%B3%E1%84%85%E1%85%A9ReactVueSvelte%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%87%E1%85%AE%E1%84%8C%E1%85%B5%E1%84%8B%E1%85%AF%E1%86%AB%E1%84%92%E1%85%A1%E1%84%82%E1%85%B3%E1%86%ABCFCsReactive.pdf)
- **눈으로 보며 듣는 음성 기록, 클로바노트 서비스의 웹 기술 톺아보기 [임대현/이은성, NAVER Cloud]**
  [임대현-이은성-발표자료](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/972f66eb-dd57-487e-9b6e-d0ab582680ab/122%E1%84%82%E1%85%AE%E1%86%AB%E1%84%8B%E1%85%B3%E1%84%85%E1%85%A9%E1%84%87%E1%85%A9%E1%84%86%E1%85%A7%E1%84%83%E1%85%B3%E1%86%AE%E1%84%82%E1%85%B3%E1%86%AB%E1%84%8B%E1%85%B3%E1%86%B7%E1%84%89%E1%85%A5%E1%86%BC%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A9%E1%84%87%E1%85%A1%E1%84%82%E1%85%A9%E1%84%90%E1%85%B3%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3%E1%84%8B%E1%85%B4%E1%84%8B%E1%85%B0%E1%86%B8%E1%84%80%E1%85%B5%E1%84%89%E1%85%AE%E1%86%AF%E1%84%90%E1%85%A9%E1%87%81%E1%84%8B%E1%85%A1%E1%84%87%E1%85%A9%E1%84%80%E1%85%B5.pdf)
- **중요한 건 꺾이지 않는 마음: 스마트에디터의 도전 [김성원/이진, NAVER ETECH]**
  [김성원-이진-발표자료](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2fcc4430-56ad-4f4d-98e9-3a593c4a4ab8/114%E1%84%8C%E1%85%AE%E1%86%BC%E1%84%8B%E1%85%AD%E1%84%92%E1%85%A1%E1%86%AB_%E1%84%80%E1%85%A5%E1%86%AB_%E1%84%81%E1%85%A5%E1%86%A9%E1%84%8B%E1%85%B5%E1%84%8C%E1%85%B5_%E1%84%8B%E1%85%A1%E1%86%AD%E1%84%82%E1%85%B3%E1%86%AB_%E1%84%86%E1%85%A1%E1%84%8B%E1%85%B3%E1%86%B7_%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC.pdf)
- **GraphQL 잘 쓰고 계신가요? (Production-ready GraphQL) [오제관/권기범, NAVER Glace]**
  [오제관-권기범-발표자료](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fedcaeb4-691d-40c6-86e6-da529beccf1a/115Production_ready_GraphQL_1.pdf)
- **SSR환경에서의 Micro-Frontend 구현과 퍼포먼스 향상을 위한 캐시전략 [박찬진, 쿠팡]**
