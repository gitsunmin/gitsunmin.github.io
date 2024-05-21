---
title: Web Assembly
image: /images/blogs/default_thumbnail.webp
draft: false
summary: web assembly에 대한 내용을 정리하였습니다.
description: web assembly에 대한 내용을 정리하였습니다.
author: Gitsunmin
date: 2024-05-21 12:00:00
math: true
draft: true
---

## 서론
웹 어셈블리에 대해서 학습한 내용을 정리하였습니다.

## 본론
### 웹 어셈블리는 무엇인가요?

#### 웹 브라우저에서의 Javascript
웹 브라우저에서는 보통 HTML, CSS, JavaScript만 실행되는 것으로 생각될 수 있습니다. 이 중에서 프로그래밍 언어로서 동작과 연산 등 자유롭게 사용할 수 있는 언어는 JavaScript입니다. 그렇다면 웹 브라우저는 JavaScript를 어떻게 실행할까요? 대부분의 프로그래밍 언어를 실행하기 위해서는 더 저수준 언어로 작성된 실행기인 엔진이 필요합니다. 크롬 웹 브라우저에서는 V8이라는 엔진을 사용해서 JavaScript를 실행하고 있습니다.

이 V8 엔진은 JavaScript의 문법을 분석(파싱)하고, 추상 구문 트리(Abstract Syntax Tree, AST)로 변환합니다. 그런 다음, AST를 이용하여 컴퓨터에서 바로 실행할 수 있는 바이너리 코드로 변환하는 컴파일링 작업을 수행합니다. 이로 인해 바이너리 코드로 변환된 후, `Turbofan`이라고 불리우는 
머신코드로 변환되어 컴퓨터는 해당 코드를 실행할 수 있습니다. 또한 중복된 코드 같은 경우에는 V8엔진의 `Turbofan`이라는 최적화된 컴파일러가 실행되어서, 좀 더 나은 성능으로서 Javascript가 실행되도록 할 수 있습니다.

간단하게 요약한다면, 아래와 같습니다.
•	JavaScript 소스 코드를 분석 -> AST로 변환 -> 바이트코드 생성 -> 인터프리터 실행 및 프로파일링 -> 최적화된 머신 코드 생성(중복 코드 발생 시, Turbofan) -> 실행

#### 웹 브라우저에서의 웹 어셈블리

위에서 Javascript가 웹 브라우저에서 실행되는 것을 알아보았습니다. 이제 웹 어셈블리에 대해서 한 번 알아보겠습니다. 웹 어셈블리는 `.wasm`이라는 확장자로 짜여진 파일로 저장이 됩니다. 이 파일은 V8엔진의 또다른 컴파일러인 `Liftoff`라고 불리는 컴파일러로 컴파일하여 실행을 하는데, 단계는 다음과 같습니다.

1.	로딩 (Loading):
•	WebAssembly 모듈이 브라우저에 로드됩니다.
2.	검증 (Validation):
•	WebAssembly 코드가 유효한지 검사합니다.
3.	Liftoff 컴파일 (Liftoff Compilation):
•	Liftoff는 WebAssembly 바이너리 코드를 빠르게 기계어로 컴파일하여 즉시 실행 가능한 상태로 만듭니다.
4.	초기 실행 (Initial Execution):
•	Liftoff가 생성한 코드가 즉시 실행됩니다.
5.	프로파일링 및 최적화 (Profiling and Optimization):
•	실행 중에 수집된 프로파일링 데이터를 바탕으로, V8 엔진의 Turbofan 컴파일러가 코드를 더 최적화된 형태로 다시 컴파일합니다.
6.	최적화된 실행 (Optimized Execution):
•	Turbofan이 최적화한 코드는 더 높은 성능으로 실행됩니다.


### 웹 어셈블리를 사용해 보기

## 결론

## 참조
- [웹어셈블리](https://tecoble.techcourse.co.kr/post/2021-11-24-web-assembly/)
- [카툰으로 소개하는 웹어셈블리](https://dongwoo.blog/2017/06/06/%eb%b2%88%ec%97%ad-%ec%b9%b4%ed%88%b0%ec%9c%bc%eb%a1%9c-%ec%86%8c%ea%b0%9c%ed%95%98%eb%8a%94-%ec%9b%b9%ec%96%b4%ec%85%88%eb%b8%94%eb%a6%ac/)