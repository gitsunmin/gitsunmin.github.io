---
title: Svelte의 동작
summary: Svelte의 동작을 자세하게 살펴보았습니다.
description: Svelte의 동작을 자세하게 살펴보았습니다.
date: 2021-09-28 12:00:00
image: /images/blogs/default_thumbnail.webp
author: 'Gitsunmin'
categories:
  - '2021'
tags:
  - Frontend
  - Svelte
---

## 1. 목표

- Svelte가 화면을 어떻게 그려내고 있는지를 확인한다.

## 2. svelte를 compile하는 방법

(저는 svelte 3.43.0버전을 사용하였습니다.)

svelte가 설치된 npm 프로젝트를 생성한다.

```bash
npm init -y
npm i --save-dev svelte
```

Root Path에 아래와 같이 코드를 작성 후에 실행을 시켜준다.

```javascript
// file 관련된 node 기본 라이브러리
const fs = require('fs');
const path = require('path');
// svelte의 compiler
const svelteCompiler = require('svelte/compiler');

// svelte파일
const pathToComponent = path.join(__dirname, './src/component.svelte');
// svelte파일을 text로 변환
const svelteCode = fs.readFileSync(pathToComponent, 'utf-8');
// 변환된 text를 input으로하여 svelte의 compiler를 실행
const compiled = svelteCompiler.compile(svelteCode);
/* 
compile method가 리턴하는 것들
  js
  css
  ast
  warnings
  vars
  stat
*/

// compiler의 output을 ./output.js 경로의 파일로 리턴 (js만 이용하여 리턴)
fs.writeFileSync(
  path.join(__dirname, './output.js'),
  compiled.js.code,
  'utf-8'
);
```

```bash
node ./index.js
```

`.svelte` 파일은 svelte 문법에 맞게 작성하기만 하면 된다. 저는 [github](https://github.com/gitsunmin/how-to-run-svelte-compiler/blob/master/src/component.svelte)에 이렇게 작성했습니다.

그러면 [github repository의 output](https://github.com/gitsunmin/how-to-run-svelte-compiler/blob/master/output.js) 처럼 compile된 javascript 코드를 확인할 수 있습니다.

## 3. svelte complier는 어떤 것들을 리턴하는가

[svelte 공식 docs](https://svelte.dev/docs#svelte_compile) 에 나와있는 내용과 직접 로그를 찍어 확인한 결과는 아래와 같습니다.

- 배경지식
  - source map
    - 소스맵은 말 그대로 원본소스와 변환된 소스를 맵핑해 주는 방법을 제안한 것이다.
  - AST(abstract syntax tree, 추상 구문 트리)
    - [https://ko.wikipedia.org/wiki/추상*구문*트리](https://ko.wikipedia.org/wiki/%EC%B6%94%EC%83%81_%EA%B5%AC%EB%AC%B8_%ED%8A%B8%EB%A6%AC)
- `js` 와 `css` 는 다음과 같은 properties를 가지는 Object입니다:
  - `code` : JavaScript 문자열
  - `map` : sourcemap(빌드한 파일과 원본 파일을 서로 연결시켜주는 정보)
- `ast` : 구성 요소의 구조를 나타내는 AST(abstract syntax tree)입니다.
- `warnings` : 컴파일하는 동안 생성된 경고 Object의 Array입니다. 각 warning에는 다음과 같은 여러 속성이 있습니다.
  - `code` : 경고 범주를 식별하는 문자열입니다.
  - `message` : 사람이 읽을 수 있는 용어로 문제를 설명합니다.
  - `start` 와 `end` :
    - 특정 위치에 관한 경우와 개체 `line`, `column`및 `character`(문자 위치) 속성
  - `frame`: 해당하는 경우 문제가 되는 코드를 줄 번호로 강조 표시하는 문자열
- `vars`: Object의 Array이며, 변수나 함수 등을 설명합니다. Object는 아래와 같은 속성이 있습니다.
  - `name`: 각 변수의 이름.
  - `export_name` : export하는 이름. (설정하지 않으면, `name` 으로 설정.)
  - `injected` : `true` 일 경우에는 직접작성한 것이 아닌, svelte에 의해 주입된 것
  - `module` : `<script context="module">` 를 사용했을 경우에 `true`.
  - `mutated`: `true`일 경우 component 내부에 할당된 변수.
    - → (어떻게 쓰이는지를 정확히 알아내지 못했습니다.)
  - `reassigned` :`true` 일 경우에는 Component 내부에서 재할당이 이루어진 변수임.
  - `referenced`: `true`일 경우 Template(svelte의 html영역)에서 참조중(사용중).
  - `referenced_from_script`: `true`일 경우 `<script>` 에서 참조중(사용중).
  - `writable`: `true` 인 경우에는 `let` or `var` 에 의해 선언된 것. (`const`, `class` 또는 `function` 은 `false`)
- `stats`: 컴파일러 진단을 위해 Svelte 개발자 팀에서 사용하는 객체입니다. 동일하게 유지하기 위해 그것에 의존하지 말라고 하네요!

## 4. compile된 javascript 코드는 화면을 어떻게 그리고있을까?

간단하게 `click` 버튼을 만들고, 버튼을 클릭하면, True/False가 토글되면서 보여지는 애플리케이션을 예시로, `compile`된 output.js를 간단하게 만들어 보았습니다. → [output.js](https://github.com/gitsunmin/how-to-run-svelte-compiler/blob/master/output.js)

- 처음 화면을 로드할 때의 실행 `init()`

  - `component.$$` 초기화 (component 관련 _state, lifecycle, 등_)
    - `component.$$` 의 `interface`와 실제 초기화되는 로직

  ```tsx
  interface T$$ {
    dirty: number[];
    ctx: null | any;
    bound: any;
    update: () => void;
    callbacks: any;
    after_update: any[];
    props: Record<string, 0 | string>;
    fragment: null | false | Fragment;
    not_equal: any;
    before_update: any[];
    context: Map<any, any>;
    on_mount: any[];
    on_destroy: any[];
    skip_bound: boolean;
    on_disconnect: any[];
    root: Element | ShadowRoot;
  }

  const $$: T$$ = (component.$$ = {
    fragment: null,
    ctx: null,

    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),

    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(
      options.context || (parent_component ? parent_component.$$.context : [])
    ),

    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root,
  });
  ```

  - `$$.ctx` 셋팅, output.js의 `instance`함수 실행 결과값 저장

    - instance 예시

    ```javascript
    function instance($$self, $$props, $$invalidate) {
      let isClick = false;

      function SMButtonClick() {
        $$invalidate(0, (isClick = !isClick));
      }

      return [isClick, SMButtonClick];
    }

    // 실제 동작하는 부분을 함수로 뺴둔 것입니다.
    const $$invalidate = (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
        if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
        if (ready) make_dirty(component, i);
      }
    };
    ```

  - `$$.fragment` 생성

    - `interface Fragment`
      ```javascript
      /**
       * INTERNAL, DO NOT USE. Code may change at any time.
       */
      export interface Fragment {
        key: string | null;
        first: null;
        /* create  */ c: () => void;
        /* claim   */ l: (nodes: any) => void;
        /* hydrate */ h: () => void;
        /* mount   */ m: (target: HTMLElement, anchor: any) => void;
        /* update  */ p: (ctx: any, dirty: any) => void;
        /* measure */ r: () => void;
        /* fix     */ f: () => void;
        /* animate */ a: () => void;
        /* intro   */ i: (local: any) => void;
        /* outro   */ o: (local: any) => void;
        /* destroy */ d: (detaching: 0 | 1) => void;
      }
      ```
    - `output.js` 예시

      ```javascript
      function create_fragment(ctx) {
        let h1;
        let t1;
        let div;
        let t2;
        let t3;
        let button;
        let mounted;
        let dispose;

        return {
          c() {
            h1 = element('h1');
            h1.textContent = 'Svelte Compiler는 어떻게 실행될까?';
            t1 = space();
            div = element('div');
            t2 = text(/*isClick*/ ctx[0]);
            t3 = space();
            button = element('button');
            button.textContent = '클릭';
            attr(div, 'class', 'cl svelte-17q3uc1');
          },
          m(target, anchor) {
            insert(target, h1, anchor);
            insert(target, t1, anchor);
            insert(target, div, anchor);
            append(div, t2);
            insert(target, t3, anchor);
            insert(target, button, anchor);

            if (!mounted) {
              dispose = listen(button, 'click', /*SMButtonClick*/ ctx[1]());
              mounted = true;
            }
          },
          p(ctx, [dirty]) {
            if (dirty & /*isClick*/ 1) set_data(t2, /*isClick*/ ctx[0]);
          },
          i: noop,
          o: noop,
          d(detaching) {
            if (detaching) detach(h1);
            if (detaching) detach(t1);
            if (detaching) detach(div);
            if (detaching) detach(t3);
            if (detaching) detach(button);
            mounted = false;
            dispose();
          },
        };
      }
      ```

  - `$$.fragment.c()` 실행
    `output.js`의 예시
    ```javascript
    c() {
      h1 = element("h1");
      h1.textContent = "Svelte Compiler는 어떻게 실행될까?";
      t1 = space();
      div = element("div");
      t2 = text(/*isClick*/ ctx[0]);
      t3 = space();
      button = element("button");
      button.textContent = "클릭";
      attr(div, "class", "cl svelte-17q3uc1");
    },
    // type에 맞게 선언이 되어짐.
    // text() 예시
    export function text(data: string) {
      return document.createTextNode(data); // 텍스트 노드를 리턴
      // https://developer.mozilla.org/ko/docs/Web/API/Document/createTextNode
    }
    ```
  - `mount_component()` → `$$.fragment.m() 실행`

    ```javascript
    // https://github.dev/sveltejs/svelte
    // src/runtime/internal/Component.ts
    export function mount_component(component, target, anchor, customElement) {
      const { fragment, on_mount, on_destroy, after_update } = component.$$;

      fragment && fragment.m(target, anchor);

      if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
          const new_on_destroy = on_mount.map(run).filter(is_function);
          if (on_destroy) {
            on_destroy.push(...new_on_destroy);
          } else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
          }
          component.$$.on_mount = [];
        });
      }

      after_update.forEach(add_render_callback);
    }
    ```

  - `$$.fragment.m()`

    ```javascript
    // output.js
    m(target, anchor) {
      insert(target, h1, anchor);
      insert(target, t1, anchor);
      insert(target, div, anchor);
      append(div, t2);
      insert(target, t3, anchor);
      insert(target, button, anchor);

      if (!mounted) {
        dispose = listen(button, "click", /*SMButtonClick*/ ctx[1]());
        mounted = true;
      }
    },

    // https://github.dev/sveltejs/svelte
    // src/runtime/internal/dom.ts
    export function insert(target: Node, node: Node, anchor?: Node) {
      target.insertBefore(node, anchor || null);
    }

    export function append(target: Node, node: Node) {
      target.appendChild(node);
    }

    export function listen(node: EventTarget, event: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | EventListenerOptions) {
      node.addEventListener(event, handler, options);
      return () => node.removeEventListener(event, handler, options);
    }
    ```

  - `flush()`

- 수정사항을 DOM에 반영하는 방법을 간단하게 소개하자면 아래와 같습니다.

  - 변경사항이 있을 때, `$$.dirty` 라는 변수로 값의 수정 여부를 반영하여 저장함.
    - `make_dirty()`
      ```javascript
      // src/runtime/internal/Component.ts
      function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
          dirty_components.push(component);
          schedule_update(); // 예약
          component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
      }
      ```
      - dirty를 추가하는 방식 [bitmasks](https://blog.bitsrc.io/the-art-of-bitmasking-ec58ab1b4c03)
      ```javascript
      component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
      // case 1
      // i = 1
      // $$.dirty[0] = 0b0000000000000000000000000000001 (2진법)
      // case 2
      // i = 32
      // $$.dirty[1] = 0b0000000000000000000000000000001 (2진법)
      ```
    - `$$.dirty`의 타입은 `number[]`이고, javascript에서 number로 31비트까지 저장을 할 수 있다.
      - (32비트인데 마이너스 부호가 1비트를 차지한다.)
    - 그러므로 $$.dirty의 한 index에 31가지의 True/False의 값을 저장할 수 있다.
  - 변경한 내용으로 DOM을 업데이트하도록 예약을 합니다. → `schedule_update()`
    - `schedule_update()`
      ```javascript
      // src/runtime/internal/scheduler.ts
      export function schedule_update() {
        if (!update_scheduled) {
          update_scheduled = true;
          resolved_promise.then(flush);
        }
      }
      ```
  - `$$.dirty`로 표시한 각 구성 요소에 대해 업데이트를 호출합니다. → `flush()`

    - `flush()`

      ```javascript
      // src/runtime/internal/scheduler.ts
      export function flush() {
        if (flushing) return;
        flushing = true;

        do {
          // first, call beforeUpdate functions
          // and update components
          for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
          }
          set_current_component(null);

          dirty_components.length = 0;

          while (binding_callbacks.length) binding_callbacks.pop()();

          // then, once components are updated, call
          // afterUpdate functions. This may cause
          // subsequent updates...
          for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];

            if (!seen_callbacks.has(callback)) {
              // ...so guard against infinite loops
              seen_callbacks.add(callback);

              callback();
            }
          }

          render_callbacks.length = 0;
        } while (dirty_components.length);

        while (flush_callbacks.length) {
          flush_callbacks.pop()();
        }

        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
      }
      ```

    - `update()`

      ```javascript
      function update($$) {
        if ($$.fragment !== null) {
          $$.update();
          run_all($$.before_update);
          const dirty = $$.dirty;
          $$.dirty = [-1]; // dirty를 초기화할 수 있도록 값을 변경
          $$.fragment && $$.fragment.p($$.ctx, dirty);

          $$.after_update.forEach(add_render_callback);
        }
      }
      ```

    - `$$.fragment.p($$.ctx, dirty)`

      ```javascript
      // output.js
      p(ctx, [dirty]) {
        // dirty에 저장될 때, 2진법으로 변환 되어서 2^0에 1로 저장이 되어있는지 확인
        // (수정이 되었는지 확인)
        if (dirty & /*isClick*/ 1) {
          set_data(t2, /*isClick*/ ctx[0]);
          // isClick을 변경
        }
      },

      // https://github.dev/sveltejs/svelte
      // src/runtime/internal/dom.ts
      export function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data) text.data = data;
      }
      ```

## 5.결론

- VirtureDOM을 사용하지 않고, DOM API만을 이용하여 화면을 그리고 있으며, 변경사항을 관리하는 방법을 bitmasks라는 것을 이용하여 변경사항을 관리함.

## 참조

[https://ichi.pro/ko/meolis-sog-e-svelte-keompail-247581368156757](https://ichi.pro/ko/meolis-sog-e-svelte-keompail-247581368156757)

[https://ichi.pro/ko/meolis-sog-e-svelte-keompailhagi-part-2-153926413705372](https://ichi.pro/ko/meolis-sog-e-svelte-keompailhagi-part-2-153926413705372)

[https://github.dev/sveltejs/svelte/blob/master/src/runtime/internal/dom.ts](https://github.dev/sveltejs/svelte/blob/master/src/runtime/internal/dom.ts)

[https://svelte.dev/docs#svelte_compile](https://svelte.dev/docs#svelte_compile)

[https://stackoverflow.com/questions/59541070/how-is-svelte-making-a-component-dirty](https://stackoverflow.com/questions/59541070/how-is-svelte-making-a-component-dirty)

[https://rebro.kr/63](https://rebro.kr/63)

[https://90byt.es/svelte/](https://90byt.es/svelte/)

[https://velog.io/@vnthf/svelte가-빠른-이유](https://velog.io/@vnthf/svelte%EA%B0%80-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EC%9C%A0)

[https://blog.bitsrc.io/the-art-of-bitmasking-ec58ab1b4c03](https://blog.bitsrc.io/the-art-of-bitmasking-ec58ab1b4c03)

[https://dev.to/somedood/bitmasks-a-very-esoteric-and-impractical-way-of-managing-booleans-1hlf](https://dev.to/somedood/bitmasks-a-very-esoteric-and-impractical-way-of-managing-booleans-1hlf)
