---
title: z-index 우선순위
description: z-index의 우선순위를 알아보았습니다.
date: 2022-07-27 12:00:00
author: 'Gitsunmin'
categories:
  - '2022'
tags:
  - Frontend
  - CSS
---

## 배경

z-index를 아무리 99999로 설정해도 전혀 반응도 하지 않는 경우가 있어서 원인을 찾아보았습니다.

## Stacking context

브라우저가 화면을 그릴 때 z-index보다 우선적으로 사용자 기준에서 3차원 공간을 결정하는 요소가 있습니다.

- 문서의 루트 요소. (`<html>`)
- [position](https://developer.mozilla.org/ko/docs/Web/CSS/position)이 `absolute` 또는 `relative`이고, [z-index](https://developer.mozilla.org/ko/docs/Web/CSS/z-index)가 `auto`가 아닌 요소.
- [position](https://developer.mozilla.org/ko/docs/Web/CSS/position)이 `fixed` 또는 `sticky`인 요소. (`sticky`는 모든 모바일 브라우저에서는 해당하지만 구형 데스크톱 브라우저에서는 해당하지 않음)
- 플렉스([flexbox (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)) 컨테이너의 자식 중 [z-index](https://developer.mozilla.org/ko/docs/Web/CSS/z-index)가 `auto`가 아닌 요소.
- 그리드([grid](https://developer.mozilla.org/ko/docs/Web/CSS/grid)) 컨테이너의 자식 중 [z-index](https://developer.mozilla.org/ko/docs/Web/CSS/z-index)가 `auto`가 아닌 요소.
- [opacity](https://developer.mozilla.org/ko/docs/Web/CSS/opacity)가 1보다 작은 요소. ([불투명도 명세](https://www.w3.org/TR/css3-color/#transparency) 참고)
- [mix-blend-mode](https://developer.mozilla.org/ko/docs/Web/CSS/mix-blend-mode)가 `normal`이 아닌 요소.
- 다음 속성 중 하나라도 `none`이 아닌 값을 가진 요소.
  - [transform](https://developer.mozilla.org/ko/docs/Web/CSS/transform)
  - [filter](https://developer.mozilla.org/ko/docs/Web/CSS/filter)
  - [perspective (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective)
  - [clip-path](https://developer.mozilla.org/ko/docs/Web/CSS/clip-path)
  - [mask](https://developer.mozilla.org/ko/docs/Web/CSS/mask) / [mask-image (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image) / [mask-border (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border)
- [isolation](https://developer.mozilla.org/ko/docs/Web/CSS/isolation)이 `isolate`인 요소.
- [webkit-overflow-scrolling](https://developer.mozilla.org/ko/docs/Web/CSS/-webkit-overflow-scrolling)이 `touch`인 요소.
- [will-change](https://developer.mozilla.org/ko/docs/Web/CSS/will-change)의 값으로, 초깃값이 아닐 때 새로운 쌓임 맥락을 생성하는 속성을 지정한 요소.
- [contain](https://developer.mozilla.org/ko/docs/Web/CSS/contain)이 `layout`, `paint`, 또는 둘 중 하나를 포함하는 값(`strict`, `content` 등)인 요소.

그리고 자식 Element의 z-index는 오직 부모 Element에게만 의미가 있습니다.

## 참고

- [stacking context](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
