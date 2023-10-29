---
title: Viewport
description: viewport에 대해서 설명하였습니다.
date: 2023-03-28 12:00:00
categories:
  - "2023"
tags:
  - Frontend
---
# 서론

[Intersection Observer API](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API) 라는 것을 사용하게 되었는데, viewport에 대해서 간단하게라도 알고 넘어가야할 것 같아서 내용을 정리 해 보았습니다.

# 본론

뷰포트(Viewport)란 웹에서 사용되는 용어로, 화면에서 웹 페이지나 애플리케이션의 보여지는 영역을 이야기합니다.

## viewport를 정의하는 방법

뷰포트의 크기는 다음과 같은 meta 태그를 이용하여 설정할 수 있습니다.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

이때 `width=device-width`는 뷰포트의 너비를 디바이스의 스크린 너비와 동일하게 설정하겠다는 의미이며, `initial-scale=1.0`은 페이지를 처음 로드할 때 뷰포트를 100% 크기로 설정하겠다는 의미입니다. 이 meta 태그를 이용하여 뷰포트를 설정하면, 다양한 기기에서 화면이 어떻게 표시될지 예측할 수 있고, 반응형 웹 디자인을 쉽게 적용할 수 있습니다.

`content`값으로는 다양한 값을 설정할 수 있는데, 일반적으로는 위에서 이야기한 `device-width`를 사용하고, `initial-scale` 값을 조절하여 페이지의 초기 확대/축소 비율을 조절할 수 있습니다. 그 외에도 `height`, `minimum-scale`, `maximum-scale`, `user-scalable` 등의 속성을 이용하여 뷰포트의 동작 방식을 조절할 수 있습니다.

|속성|설명|
|---|---|
|width|뷰포트의 가로 길이를 설정합니다. 일반적으로 width=device-width를 사용합니다.|
|height|뷰포트의 세로 길이를 설정합니다. 일반적으로는 height:device-height 로 사용할 수 있지만, height 속성 자체를 잘 사용하지 않습니다.|
|minimum-scale|사용자가 화면을 축소할 수 있는 최소 비율을 설정합니다. 기본값은 0 입니다.|
|maximum-scale|사용자가 화면을 확대할 수 있는 최대 비율을 설정합니다. 기본값은 10 입니다.|
|user-scalable|사용자가 화면을 확대/축소할 수 있는지 여부를 지정합니다. yes로 설정하면 사용자가 확대/축소 가능하고, no로 설정하면 사용자가 확대/축소할 수 없습니다. 기본값은 yes입니다.|
|initial-scale|페이지가 로드될 때 뷰포트의 초기 확대/축소 비율을 설정합니다. 기본값은 1입니다.|

## viewport의 크기를 알아내는 방법

JavaScript를 사용하여 뷰포트 너비와 높이를 가져오는 방법은 `window.innerWidth`와 `window.innerHeight` 속성을 사용하는 것입니다. 이 속성들은 브라우저 툴바와 스크롤바를 제외한 픽셀 단위의 뷰포트 크기를 반환합니다.

추가적으로 `window.visualViewport` 라는 것도 존재하는데, 이 객체는 아래의 속성들을 가지고 있으며,

|속성|설명|
|---|---|
|width|현재 뷰포트의 너비|
|height|현재 뷰포트의 높이|
|offsetLeft|뷰포트의 왼쪽 가장자리에서의 화면 좌표|
|offsetTop|뷰포트의 위쪽 가장자리에서의 화면 좌표|
|pageLeft|뷰포트의 왼쪽 가장자리에서의 문서 좌표|
|pageTop|뷰포트의 위쪽 가장자리에서의 문서 좌표|
|scale|현재 뷰포트의 확대/축소 비율|

```jsx

const viewportHandler = (event) => {
	... // event.target이 visualViewport
};

window.visualViewport.addEventListener("scroll", viewportHandler);
window.visualViewport.addEventListener("resize", viewportHandler);
```

이렇게, `visualViewport`에 `addEventListener`함수를 사용하여, 줌을하거나 리사이징할 경우에 event.target으로 받는 `visualViewport` 객체를 이용할 수 있습니다.

# 결론

뷰포트(Viewport)는 한 화면에서 보이는 영역을 의미하며, meta 태그를 이용하여 web에서 뷰포트의 크기를 정의할 수 있습니다. 이를 통해, 반응형 웹 디자인을 쉽게 적용 가능하며, innerWidth, innerHeight 혹은 `visualViewport` 객체를 이용하여 현재 뷰포트의 상태를 얻을 수 있습니다.

# 참조

- [Viewport - MDN Web Docs](https://developer.mozilla.org/ko/docs/Glossary/Viewport)
    - 웹 페이지나 애플리케이션에서 사용되는 용어
    - 화면에서 보여지는 영역을 이야기함
    - 다양한 기기에서 화면이 어떻게 표시될지 예측 가능
    - 반응형 웹 디자인을 쉽게 적용 가능
- [Visual Viewport API - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)
    - 뷰포트를 제어하는 JavaScript API
    - 페이지가 렌더링되는 동안 뷰포트의 상태에 대한 정보를 제공함
- [Viewports - quirksmode](https://www.quirksmode.org/mobile/viewports.html)
    - 뷰포트 설정과 관련된 개념과 용어를 설명함
    - 뷰포트 설정이 필요한 이유와 설정 방법에 대해 다룸