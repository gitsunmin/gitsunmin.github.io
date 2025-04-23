## Web Components

웹 컴포넌트(Web Components)는 재사용 가능한 사용자 인터페이스를 만들기 위해 웹 플랫폼의 네이티브 기능을 활용하는 방법입니다. 웹 컴포넌트는 크게 3가지 기술로 구성되어 있습니다:

1. **커스텀 엘리먼트(Custom Elements)**: 웹에서 사용자 정의 태그를 생성하고 동작을 정의할 수 있게 해줍니다.
2. **HTML 템플릿(HTML Templates)**: 마크업 구조를 '템플릿'으로 저장하여 필요할 때 렌더링하도록 돕습니다.
3. **Shadow DOM**: 주요 DOM에서 독립적인 DOM을 생성하여 스타일과 코드가 주변 코드나 스타일에 영향을 주거나 받지 않도록 합니다.

### 예시: 웹 컴포넌트 만들기

아래는 간단한 웹 컴포넌트를 만드는 예시입니다. 이 예시에서는 'user-card'라는 사용자 카드 컴포넌트를 만듭니다.

#### HTML 템플릿 정의

```html
<template id="user-card-template">
  <style>
    .card {
      border: 1px solid gray;
      padding: 10px;
      border-radius: 5px;
    }
  </style>
  <div class="card">
    <p><slot name="username"></slot></p>
    <p><slot name="email"></slot></p>
  </div>
</template>
```

#### 커스텀 엘리먼트 정의

```javascript
class UserCard extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM을 연결
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // 템플릿 가져오기 및 복제
    const template = document.getElementById('user-card-template');
    const instance = template.content.cloneNode(true);

    // Shadow DOM에 템플릿 붙이기
    shadowRoot.appendChild(instance);
  }
}

// 커스텀 엘리먼트 등록
customElements.define('user-card', UserCard);
```

#### HTML 페이지에서 사용

```html
<user-card>
  <span slot="username">홍길동</span>
  <span slot="email">hong@example.com</span>
</user-card>
```

#### 커스텀 엘리먼트 LifeCycle

- constructor: 커스텀 엘리먼트가 생성될 때 호출됩니다.
- connectedCallback: 커스텀 엘리먼트가 DOM에 연결될 때 호출됩니다.
- adoptedCallback: 커스텀 엘리먼트가 새 문서로 이동할 때 호출됩니다.
- attributeChangedCallback: 커스텀 엘리먼트의 속성이 추가, 제거, 변경될 때 호출됩니다.
- disconnectedCallback: 커스텀 엘리먼트가 DOM에서 제거될 때 호출됩니다.

ex)
```javascript
class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .card {
          border: 1px solid gray;
          padding: 10px;
          border-radius: 5px;
        }
      </style>
      <div class="card">
        <p><slot name="username"></slot></p>
        <p><slot name="email"></slot></p>
      </div>
    `;
  }

  static get observedAttributes() {
    return ['username', 'email'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'username') {
      this.querySelector('[slot="username"]').textContent = newValue;
    }
    if (name === 'email') {
      this.querySelector('[slot="email"]').textContent = newValue;
    }
  }

  disconnectedCallback() {
    console.log('UserCard가 DOM에서 제거되었습니다.');
  }

  adoptedCallback() {
    console.log('UserCard가 새 문서로 이동되었습니다.');
  }

  set username(value) {
    this.setAttribute('username', value);
  }

  get username() {
    return this.getAttribute('username');
  }

  set email(value) {
    this.setAttribute('email', value);
  }

  get email() {
    return this.getAttribute('email');
  }
}
```

props는 위에서와 같이 getter, setter를 사용하여 구현할 수 있습니다.

### 장점

- **재사용성**: 동일한 컴포넌트를 여러 프로젝트 또는 페이지에서 재사용할 수 있습니다.
- **독립성**: Shadow DOM 덕분에 스타일과 로직이 주변 환경과 격리되어 있습니다.
- **호환성**: 웹 컴포넌트는 웹 표준을 기반으로 하므로 다양한 프레임워크와 라이브러리와 호환됩니다.

### 결론

웹 컴포넌트는 웹에서 네이티브로 지원하는 컴포넌트 시스템을 활용하여 독립적이고 재사용 가능한 UI 구성 요소를 만드는 방법입니다. 이를 통해 개발자는 효과적으로 코드를 구성하고 유지 관리할 수 있습니다.
