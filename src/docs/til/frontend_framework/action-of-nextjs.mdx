# Action of nextjs

1. SSR 개요

Next.js의 SSR(Server-Side Rendering)은 클라이언트의 요청에 따라 서버에서 React 컴포넌트를 실행하고, HTML을 생성하여 반환하는 방식입니다. 이를 통해 초기 로딩 속도 향상, SEO 최적화, 첫 화면 표시 속도 개선 등의 장점이 있습니다.

2. SSR의 처리 과정

클라이언트 요청: 사용자가 특정 페이지를 요청하면 Next.js 서버가 해당 URL과 매핑된 페이지를 찾습니다.

데이터 패칭: getServerSideProps를 사용해 서버에서 데이터를 가져옵니다.

React 컴포넌트 렌더링: ReactDOMServer를 사용하여 React 요소를 HTML 문자열로 변환합니다.

HTML 응답 전송: Next.js 서버가 완성된 HTML을 브라우저로 반환합니다.

클라이언트 하이드레이션: React는 ReactDOM.hydrate()를 실행하여 이벤트 핸들러를 추가하고, 브라우저에서 React 앱을 활성화합니다.

3. React 코드의 컴파일과 HTML 변환 과정

Next.js는 빌드 시 서버 번들과 클라이언트 번들을 각각 생성합니다.

SSR 요청 시, Next.js는 ReactDOMServer의 renderToString() 또는 renderToReadableStream()을 사용하여 React 컴포넌트를 HTML로 변환합니다.

변환된 HTML을 _document.js의 템플릿과 결합하여 최종 HTML을 구성합니다.

4. Next.js SSR 구현의 핵심 라이브러리

(1) ReactDOMServer

renderToString(): SSR을 위해 React 컴포넌트를 HTML 문자열로 변환하는 API.

renderToReadableStream(): React 18부터 추가된 스트리밍 SSR 지원 API.

(2) 데이터 패칭 메커니즘

getServerSideProps: 요청 시 실행되며, 데이터를 가져와 SSR 페이지의 props로 전달됨.

getStaticProps: 빌드 시 데이터를 가져와 정적 페이지를 생성하는 방식.

getInitialProps: _app.js에서 실행되며, 전역적인 데이터 패칭을 담당함.

(3) 번들링 및 코드 스플리팅

Next.js는 페이지별 코드 스플리팅을 수행하여 불필요한 자바스크립트 로드를 방지함.

서버 전용 코드(getServerSideProps 등)는 클라이언트 번들에 포함되지 않음.

5. Hydration 과정 (클라이언트 처리)

초기 HTML 렌더링: 서버에서 받은 HTML이 먼저 표시됨.

JS 번들 다운로드: 클라이언트에서 필요한 JavaScript 파일을 로드.

React Hydration: ReactDOM.hydrate()를 실행하여 기존 DOM에 이벤트 핸들러와 React의 상태를 연결.

인터랙션 활성화: Hydration이 완료되면 React 컴포넌트가 정상적으로 동작하며, 상태 변경 및 이벤트 처리가 가능해짐.

6. SSR의 장점 및 고려 사항

✅ 장점

SEO 최적화: 크롤러가 완전한 HTML을 수집 가능.

빠른 초기 로딩: 브라우저가 즉시 HTML을 렌더링할 수 있음.

서버 기반 데이터 패칭: 페이지 요청마다 최신 데이터를 반영할 수 있음.

⚠️ 고려 사항

서버 부하: 요청마다 SSR이 실행되므로 트래픽이 많은 경우 부담이 커질 수 있음.

Hydration 성능 문제: 서버에서 렌더링된 HTML과 클라이언트에서 생성한 React 가상 DOM이 일치해야 함.

SSR + CSR 하이브리드 전략 필요: Next.js는 첫 페이지 로딩 후 클라이언트 내비게이션을 CSR 방식으로 수행함.

7. 결론

Next.js의 SSR은 서버에서 React 컴포넌트를 실행하여 HTML을 생성하고, 클라이언트에서 Hydration을 통해 동적 기능을 활성화하는 방식입니다. 이를 통해 빠른 로딩, SEO 개선, 최신 데이터 제공 등의 이점을 얻을 수 있지만, 서버 부하 관리 및 Hydration 최적화가 중요합니다.

