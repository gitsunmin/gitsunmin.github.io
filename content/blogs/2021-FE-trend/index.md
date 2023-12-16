---
title: '2021년 FE 동향, 한방에 끝내기'
description: 영상을 보고 내용을 정리 하였습니다.
date: 2021-11-25 12:00:00
image: /images/blogs/default_thumbnail.jpeg
author: 'Gitsunmin'
categories:
  - '2021'
tags:
  - Deview
  - Frontend
  - Trend
---

> 아래의 내용은 **[The state of JavaScript & FE, 2021 Edition (2021년 FE 동향, 한방에 끝내기)](https://deview.kr/2021/sessions/508) 라는 박재성님의 발표를 보고 내용을 정리한 것입니다**

## 1. ECMAScript

- ECMAScript 2021 / 2022
- 새롭게 추가될 명세들
  - 2021 - [https://gitsunmin.github.io/2021/790FBE70-5F97-43C9-8B4B-6FF68308975E/](https://gitsunmin.github.io/2021/790FBE70-5F97-43C9-8B4B-6FF68308975E/)
  - 2022
    | 명세 | 설명 |
    | --- | --- |
    | RegExp Match indices | 새로운 d 플래그를 통해서 매칭 문자열의 시작과 종료 index를 반환 |
    | Top-level await | aync 함수 없이 상위 레벨에서 await 사용 |
    | Erganomic brand checks for Private fields | private 필드값의 존재 유무 판단하고, 없다면, callback제공 |
    | Accessible Object, prototype.hasOwnProperty | Object.prototype.hasOwnProperty → Object.hasOwn()로 접근성 개선 |
    | Class Static Block | 클래스 정의시에 추가적인 static 초기화 방법을 제공 |
  - Stage 3 단계의 명세들 (이후 명세에 추가될 후보군들)
    | 명세 | 설명 |
    | --- | --- |
    | Import Assertions (stage3) | 서버가 잘못된 MIME 타입을 잘못 처리해 발생할 수 있는 보안이슈를 제거하기 위함 |
    | JSON Mudules (stage3) | JSON을 보편적 방식의 모듈로 import할 수 있도록 개선 |
    | Error Cause (stage3) | 오류 객체 초기화시 추가 옵션 객체 필드 cause 추가 |
    | Temporal (stage3) | 모던한 날짜/시간 API를 제공해 기존 Date 객체를 개선 |

## 2. WebAssembly

- WebAssembly는
  - 친숙한 도구와 언어로 개발을 하고 wasm(web assembly modules)으로 컴파일 → 모든 OS에서 실행되거나 다른 언어에 임배드해서 사용 가능하도록 하는 기술이다.
- wasm 개발에 사용하는 언어
  - `RUST` > `C++` > `AssemblyScript` > `Blazor`
- 웹에서만 사용되지는 않을 것 같다.
  - WASM + [WASI](https://wasi.dev/) 가 있었으면 docker를 만들 필요가 없었다. (도커 공통 창업자)
  - 범용 VM 아이디어 실현은 webAssembly이다. (Brendan Eich ← javascript 창시자)
- WASI 구현체
  - [WasmEdgeRuntime](https://wasmedge.org/)
    - 분산화 환경 애플리케이션 위한 wasm 런타임이며, runtime중 **가장 빠른 성능**
    - 다양한 언어로 작성된 wasm 바이트코드 프로그램 실행과 임배드된 QueickJS 엔진을 통해서 wasm 내에서 **javascript 코드 실행 가능**
  - Lucet + wasmtime = wasmtime
    - Lucet 팀이 wasmtime의 개발에 참여하여 활발하게 개발 진행중 → 관심 갖으면 좋을 듯합니다
  - Wasmer
    - 가장 많은 언어를 임배딩 지원
  - QuickJS
    - C로 작성된 임배딩 javascript 엔진
    - 또다른 Wasmer에서도 qjs.wasm모듈을 통해 사용가능
- [WebAssembly Roadamp](https://webassembly.org/roadmap/)
  - ECMA script와 다르게 1년 단위로 표준화를 하지는 않고있고, 5단계의 명세 작성 프로세스를 갖고있음

## 3. Framework

- React
  - Server Component
    - 새로운 유형의 컴포넌트 제안
    - 클라이언트와 서버 통신은 결과적으로 느리다.
    - 컴포넌트를 서버로 이동, 데이터 처리는 서버에서 이루어지도록 한다.
    - 서버 컴포넌트는 번들(webpack으로 번들)에 포함하지 않고, 필요한 코드만 로딩되게한다.
    - 개발 진행을 통해 18 ~ 29%번들 크기 감소
    - SSR을 대체하는 것은 아님
  - v18 Plan (21년 6월 발표) - 계획된 내용 공개
    - new root api
    - SSR support for suspense
    - features
      - startTransition
        - 특정 상태 전환 업데이트에 대해 "transition"으로 처리해, 응답성을 유지
      - useDeferredValue
        - 화면에서 덜 중요한 영역의 업데이트를 지연해, 중요한 영역이 우선되게 하는 기능
      - `<SuspenseList>(데모)`
        - 하위 트리에 있는 <Suspense>의 공개와 로딩 Indicator 노출 순서를 조율
      - Streaming SSR with selective hydrations
        - 앱 로드 및 인터렉티브 속도 향상
      - Automatic Batching
        - `batch?` 성능을 위해, 다중 상태 업데이트를 단일 재랜더링으로 수행
        - React 이벤트 핸들러내 작업만 배칭에서, Promise, setTimeout 등으로 확장
      - react-devtools
      - React Working Group
        - Github의 discussion을 사용한 워킹그룹으로 생태계의 v18 점진적 채택을 위한 준비
- Vue.js

  - IE 11 지원 중단
    - 꼭 필요한 경우에는 vue 2.7을 사용하는 것을 추천, (vue 3의 주요기능이 포함되어있음)
  - DX 개선 (Developer eXperience)

    - Authoring experience

      - `<script setup>`
        - SFC의 새로운 스크립트 타입으로, 최상위 바인딩을 템플릿에 노출
          ```javascript
          <script setup>console.log('hello script setup')</script>
          ```
      - `<style vars="{some}">` 변수 주입
        - SFC스타일에 컴포넌트 상태 CSS 변수 주입
      - Ref Sugar

        - 반응형 변수 `$()`사용을 위한 컴파일러 매크로 집합

        ```javascript
        // declaring a reactive variable backed by an underlying ref
        let count = $ref(1);

        // no need for .value anymore!
        console.log(count); // 1

        function inc() {
          // assignments are reactive
          count++;
        }
        ```

    - Vue Devtools
      - vue2,3 듀얼버전 지원
      - vuex 통합 예정
      - 타임라인 뷰, 성능 프로파일링
    - Better IDE/TS 지원
      - [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) - vue tooling for VS code
      - [VueDX](https://marketplace.visualstudio.com/items?itemName=znck.vue-language-features) - A set of tools for better DX for Vue

  - v3.2
    - 새로운 SFC 기능들: `<script setup>`, `<style> v-bind`(컴포넌트 상태값 바인딩)
    - Reactivity 시스템과 템플릿 컴파일러 성능 개선
    - SSR 개선: @vue/server-renderer 패키지 Node.ks 빌트인과 디커플링된 ESM빌드 제공.
      - 비 node.js 런타임에서 사용되도록 번들링 가능
      - [https://ssr.vuejs.org/](https://ssr.vuejs.org/)
    - 웹컴포넌트 요소인 Custom Elements 생성을 도와주는 새로운 defineCustomerElement 메서드
  - @vue/compat (Migration build)
    - 수정해주는 것은 아니고, 오류를 체크해주고, 수정은 사람이 해야함.

- Angular
  - v12
    - enableIvy: false 설정은 더이상 view Engine을 사용한 애플리케이션 개발은 지원되지 않는다.
    - Tooling은 webpack5를 사용하며, webpack4지원과 사용은 제거
    - 새로운 빌드 옵션 inlineStyleLanguage: 스타일의 인라인 컴포넌트 스타일 정의
      - CSS(기본값), Sass, SCSS, LESS 지원
    - Critical CSS 인라이닝은 기본 설정되며, 해제하려면, `inlineCritivcal: false` 를 설정해야한다.
    - `ng build`는 기본값으로 production빌드를 생성
    - 템플릿에서 ?? 문법 지원
  - v13
    - IE11 지원 중단, view Engine은 제거 예정
    - Modern Angular Package Format(APF)제안
      - npm에 배포되는 `Ivy-native`라이브러리 포맷으로, 기존 viewEngine 라이브러리 배포 포맷을 대체
      - APF는 UMD 번들 제거, ES2020 output
    - 빌드 경험 개선 `ng build`
      - CLI: JS optimizer로 esbule + terser 도입
        - 전체 빌드 파이프라인 개선과 빌드 속도 향상
          - build optimizer → Babel Transform 전환을 통해 빌드 속도 20% 향상
  - Protractor의 미래
    - e2e 테스트 프레임워크
    - 2013년 처음 개발 → 현재 환경 발전의 차이로 새로운 기술 활용에 문제 → 2022년 말에 개발 중단
    - Cypress, WebbdriverIO, TestCafe와 협업 진행중 이며 서드파티 포함 옵션으로 추가될 계획
- Svelte
  - stackoverflow 개발자들이 가장 관심갖는 프레임워크로 답변
  - SvelteKit
    - Sapper를 계승하는 애플리케이션 프레임워크 Next.js의 Svelte 버전이라고 생각하면 된다.
    - snowpack → vite로 전환
    - SvelteKit SSR 향상을 위한 신규 패키지 `svelte/ssr`
    - 21/3월 public bata 및 1.0까지 작업중이고, 마일스톤 상으로 84%완료
- Solid
  - 2016년부터 개발이 시작한 라이브러리
  - VDOM을 사용하지 않고, 템플릿을 통해 실제 DOM으로 컴파일
  - React의 철학과 유사하게 단방향 데이터 흐름, 읽기/쓰기 분리,
  - 불변성 인터페이스 원리를 따르지만, VDOM을 사용하지 않고 완전히 다르게 구현
  - (svelte보다 빠르다고 알려져있음)

## 4. Runtime

- Node.js
  - N-API → Node-API이름 변경
    - NAPI가 경멸적 용어로 오인될 소지가 있어, 이름을 변경
  - WASI(WebAssembly System Interface) 지원
    - 실험적 WASI API를 제공한다. WASI는 샌드박스된 wasm 애플리케이션에 OS의 POSIX 유사함수에 접근할 수 있게 한다.
  - next-10
    - 성공적이었던 지난 10년을 기반으로, 향후 10년에 대한 전략적 방향성 논의를 위한 기록 저장소
    - 커뮤니티간의 활발한 논의
  - [Corepack](https://ichi.pro/ko/node-jsui-corepackilan-mueos-ibnikka-231369824054851)
    - node와 package 매니져간 브릿지 처럼 동작
    - 패키지 관리자를 전역으로 설치하지 않고 사용할 수 있도록 도와줌
  - Pure ESM, Dual CJS/ESM
    - 가장 가까운 부모의 package.json에 `"type": "module"` 설정된 경우 `.js` 확장자는 ESM으로 로딩된다
    - 즉, 프로젝트 의존성 패키지가 `"type": "module"` 설정되었다면, 자신도 `"type": "module"`설정이 필요
    - 이 경우 `.js`는 ESM으로 처리되고, CJS는 `.cjs`확장자를 가져야한다.
    - 사용자 측면,
      - CJS를 ESM으로 전환하고, package.json에 `"type": "module"` 설정
      - 비동기 문맥에서는 `await import(...)`를 적용
      - ESM이동이 준비되지 않았다면, 현재 상태(의존성 패키지 버전 포함)를 유지
    - 라이브러리 측면
      - Dual CJS/ESM
        - 아직 생태계는 준비되지 않았으므로, Dual CJS/ESM를 제공하는 것 필요
- Deno
  - Deno Company 설립
  - 초기 투가에 Next.js의 Guillermo Rauch, Mozilla 주식회사 등이 참여
  - Deno Deploy 발표
    - Deno CLI를 통해 배포할 수 있는 분산 시스템 환경
    - 21년 10월, 현재 Beta 2상태로, 무료로 제공되나 이후 유료 전환 예정
    - 전세계 25개 리전을 통해 배포
  - [deno.land/](http://deno.land/s-)x- 패키지 레지스트리
  - deno 번들러: packup 개발중
  - MDN호환성 테이블에 Deno 항목 노출되기 시작

## 5. Package Manager

- npm
  - github에 npm 인수 (20년 3월) 후, 주요 소식은 Github 블로그를 통해 공유
  - npm v7 (20년 10월)
  - peer dependency 자동설치
    - v7 이전엔 개발자들이 직접 peer dependency설치 필요했지만,
    - 새로운 알고리즘은 node_module 트리에서 일치하는 패키지가 발견되도록 보장
  - 새로운 package-lock 포맷 v2, 그리고 yarn.lock 지원
    - 새로운 포맷은 재현 가능한 빌드 구성과, 패키지 트리 구축에 필요한 모든 정보를 포함
  - npm v8 (21/10월)
    - v8이 1년여 만에 새로 릴리스 되었고, Node.js의 LTS 생명주기에 맞추기 위한 목적
    - 이에 따라 `node<12` 지원중단
    - 지원되는 Node.js 버전이 아닌경우, 설치되지 않도록 변경
    - npm@6가 node@8환경에서 npm@7 설치가 가능해 발생했던 이슈를 제거
- yarn
  - facebook 소속은 이제 연관이 없어짐.
  - v3 작업 시작
    - node 10 지원중단
    - node corepack에서 지원
    - esbuild 지원
- pnpm
  - 효율적 디스크 사용으로 유명
  - 많은 프로젝트에서 동일한 패키지를 가지고 있을 경우에 다시 다운 받지 않고, 재사용하여 디스크 사용을 효율적으로 함

## 6. Tools: Bundler/Build

- esbuild
  - go로 작성된 번들로러 20년 1월에 개발되었다.
  - TS/JSX등 모던 번들러가 제공하는 기능들이 기본 제공된다.
  - yarn, Angular CLI, SvelteKit, PackUp
- Vite
  - quick을 뜻하는 프랑스어 "Vite"는 Evan you가 개발 (20년 4월 개발시작)한 빌드 도구다.
  - 개발사 번들링 수행않고, ESM으로 로딩
  - prebundling(CJS/UMD → ESM변환)은 esbuild, 배포버전은 Rollup사용.
  - Rollup플러그인 호환
  - 기존 vue-cli와 vite는 일단 공존하나, 장기적으론, 2개 도구와 통합 필요 → vite(스피드) + vue-cli(포괄적인 지원성)
- Rome
  - Babel을 개발하였던 사람들의 프로젝트로 20년 8월에 첫 배타 릴리스 하였다.
  - Babel, ESLint, Webpack, prettier, Jest 등 오늘날 모던 웹 애플리케이션 개발을 위해 필요한 툴 체인들을 단일 도구로 대체하기 위한 목적
- Parcel
  - 21년 10월에 v2작업 릴리스
    - babel AST 기반의 컴파일러 → Rust로 작성
    - Tree shaking 기본 활성화, 자동 코드분할
    - automatic differential bundling
      - 모던 브라우져를 위한 네이티브 ESM과 레거시 브라우져를 위한 fallback 2가지 버전 제공
      - 향상된 JSX지원 React 17의 JSX런타임 지원
- wmr
  - preact 개발자인 Jason Miller가 개발 의존성 없는 단일 파일 통합 개발도구
    - 엔트리 포인트 없이 스크립트 로딩만을 통해 실행
      - `<script type="module" src"/index.js">`
    - 스케폴딩을 위한 `create-wmr`제공
    - npm 패키지의 설치없이 import
    - HMR: preact 컴포넌트와 CSS 빌트인 TS 및 JSX 브라우져 디버깅 기능
    - 정적 자원들에 대한 hot reloading
    - Rollup 플러그인 지원
- Snowpack
  - 개발 모드에선 번들링 하지 않고, 각 파일은 빌드 후 캐싱 개발 파일들은 네이티브 ESM으로 로딩
  - npm의 CJS 모듈은 어떻게 로딩할까?
    - 브라우저 실행을 위해 snowpack은 이들을 단일 파일로 번들리하고, 네이티브 ESM으로 사용될 수 있게 한다.
    - svelteKit에서 채택되었지만, Vite에 밀려났다.

## 7. PWA

- 브라우저 벤더들의 서로 다른 방향성
  - Goolgle, MS, Samsung 에서는
    - 가능성/능력을 보고 좋게 평가
  - Apple, Mozilla 에서는
    - 개인정보보호 이슈를 가장 최우선으로 고려하기 때문에 웹에서의 새로운 가능성을 제공하는 기능들에 부정적 입장을 취한다.
- Fugu 프로젝트
  - Web Capabilities
    - 2019년 주요 벤더들(Google, MS, Intel, 삼성)이 네이티브(모바일/데스크톱) 앱에서 가능한 것들을 웹앱에서도 가능하게 만들기 위해 시작한 프로젝트
    - 네이티브 기능들이 웹에 노출되더라도, 사용자 보안, 신뢰 및 개인정보 보호 같은 핵심적 원칙은 유지되어야한다.
    - web API 형식으로 제공, OS네이티브 API와 애플리케이션간 추가적 레이어로 동작
- Store 배포
  - PWA가 웹에서 다운로드 받을 수 있지만, 패키징을 해야함. → PWA builder → google의 bubblewrap을 활용
  - 안드로이드 PWA를 다운로드 가능
  - Apple App Store도 다운로드 가능 하지만, 공식적인 문서가 제공되고 있지는 않기 때문에 배포에 어려움이 있음.

## 8. 네이티브로의 이동

- ES6 지원율
  - 주요 브라우저에서 98% ~ 100% 정도 되어서 ES6 이전의 버전으로 트랜스파일링을 할 필요는 없어지고 있다고 느껴짐
- 네이티브 전환의 걸림돌
  - JSX, Typescript에 대한 트랜스파일링
  - Tree-shaking과 같은 최적화 작업의 수행
- HTTP/2 Multiplexing
  - HTTP/2는 Multiplexing을 통해, 단일 TCP 연결을 통해 다중 요청/응답을 처리한다.
    - → 더는 HTTP Request 감소를 위한 다음같은 성능적 접근 유효성은 감소
      - 여러개의 파일을 단일 파일로 번들링
      - CSS Sprite
  - 21년 9월 기준 HTTP/2 점유율이 67%를 차지

## 요약

- webAssembly 실사용 확산은 더디지만, 미래의 얼굴
- 프레임워크는 여전히 React 강세
- IE11은 이제 그만
- PureESM: CJS → ESM 전환
- Toolchain: 자바스크립트를 위해서 비자바스크립트 언어로 지원하는 경향이 있음.
- PWA의 메인 스트림으로의 성장은 하고있지만, 결국 [webkit](https://ko.wikipedia.org/wiki/%EC%9B%B9%ED%82%B7)의 향방에 달려있다.

## 참조

- [https://ahnheejong.name/articles/ecmascript-tc39/](https://ahnheejong.name/articles/ecmascript-tc39/)
- [https://beomy.github.io/tech/javascript/cjs-amd-umd-esm/](https://beomy.github.io/tech/javascript/cjs-amd-umd-esm/)
- [https://ichi.pro/ko/node-jsui-corepackilan-mueos-ibnikka-231369824054851](https://ichi.pro/ko/node-jsui-corepackilan-mueos-ibnikka-231369824054851)
- [https://d2.naver.com/helloworld/8786166](https://d2.naver.com/helloworld/8786166)
