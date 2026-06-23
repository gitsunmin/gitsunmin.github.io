import type { CareerId } from '@/data/careers';

export type WorkCategory = 'service' | 'library' | 'vscode-extension' | 'framework' | 'website';

export const WORK_IDS = [
  'doldeuls-forest',
  'gitsunmin-github-io',
  'k-number',
  'graph-man',
  'sikbom',
  'marketbom-pro',
  'hybrid-app-framework',
] as const;

export type WorkId = (typeof WORK_IDS)[number];

type SubRepo = {
  name: string;
  description: string;
  techs: string[];
  slug: string;
};

type Work = {
  id: WorkId;
  title: string;
  icon?: string;
  description: string;
  category: WorkCategory;
  techs: string[];
  links: {
    label: string;
    url: string;
  }[];
  range: string;
  careerId?: CareerId;
  subRepos?: SubRepo[];
  isFeatured?: boolean;
  isDraft?: boolean;
};

export const Works: Work[] = [
  {
    id: 'doldeuls-forest',
    title: '돌들의 숲',
    icon: '/assets/logos/forest-of-stones.webp',
    category: 'service',
    description: `디지털 환경에서의 정서적 고립을 해소하고 싶어 만든 익명 P2P 힐링 커뮤니티입니다.
누군가와 연결되고 싶지만 신분을 드러내기 어려운 순간을 위해, 완전한 익명성을 보장하면서도 진심 어린 대화가 가능한 공간을 만들었습니다.`,
    techs: ['React', 'TypeScript', 'TanStack Router', 'Relay', 'Tailwind CSS', 'Three.js', 'Expo', 'React Native', 'Cloudflare Workers', 'Hono', 'GraphQL', 'Prisma', 'Astro', 'Turborepo', 'Bun'],
    links: [
      { label: '돌들의 숲', url: 'https://forest.seonhamlabs.com' },
    ],
    range: '2025.01 ~',
    careerId: 'seonhamlabs',
    isFeatured: true,
  },
  {
    id: 'k-number',
    title: '@gitsunmin/k-number',
    icon: '/assets/logos/github_logo.webp',
    category: 'library',
    description: `정수를 한글 수사로 변환하는 TypeScript 라이브러리입니다.
korean-only · unit-only · mixed 세 가지 출력 포맷과 BigInt(무량대수, 10⁶⁸까지) 지원, 예외 없는 에러 처리를 제공하며 ESM·CJS 이중 빌드로 npm에 배포되어 있습니다.`,
    techs: ['TypeScript', 'Vitest', 'Bun'],
    links: [
      { label: 'npm', url: 'https://www.npmjs.com/package/@gitsunmin/k-number' },
      { label: 'GitHub', url: 'https://github.com/gitsunmin/k-number' },
    ],
    range: '2024.01 ~',
    isFeatured: true,
  },
  {
    id: 'graph-man',
    title: 'Graph Man',
    icon: '/assets/logos/graph-man.webp',
    category: 'vscode-extension',
    description: `GraphQL 쿼리·뮤테이션을 VSCode 안에서 바로 테스트할 수 있는 확장 프로그램입니다.
멀티 환경 전환, URL 기반 스키마 로드, Fragment 인라이닝 등 GraphQL 개발에 필요한 기능을 에디터 내에서 완결합니다.`,
    techs: ['TypeScript', 'VSCode Extension API', 'GraphQL', 'esbuild', 'Vitest', 'Bun'],
    links: [
      { label: 'VS Code Marketplace', url: 'https://marketplace.visualstudio.com/items?itemName=gitsunmin.graph-man' },
      { label: 'GitHub', url: 'https://github.com/gitsunmin/graph-man' },
    ],
    range: '2024.06 ~',
    isFeatured: true,
  },
  {
    id: 'gitsunmin-github-io',
    title: 'gitsunmin.github.io',
    icon: '/assets/logos/github_logo.webp',
    category: 'website',
    description: `개인 블로그 겸 포트폴리오 사이트입니다.
단순한 정적 사이트가 아니라, 다양한 실험적 UI와 인터랙션을 직접 만들어보는 공간으로 활용하고 있습니다.`,
    techs: ['Astro', 'React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
    links: [
      { label: '사이트', url: 'https://gitsunmin.github.io' },
      { label: 'GitHub', url: 'https://github.com/gitsunmin/gitsunmin.github.io' },
    ],
    range: '2023.01 ~',
    isFeatured: true,
  },
  {
    id: 'sikbom',
    title: '식봄',
    category: 'service',
    description: `식자재 유통 플랫폼 식봄의 프론트엔드 전반을 담당했습니다.
Next.js 기반 주문 웹 서비스부터 PHP 마케팅 페이지, 관리자 웹, 인쇄 템플릿 라이브러리까지 다양한 레이어를 개발했습니다.`,
    techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Relay', 'PHP', 'Storybook', 'Datadog'],
    links: [],
    range: '2024.01 ~ 2025.12',
    careerId: 'marketboro',
    subRepos: [
      {
        slug: 'consumer-web',
        name: '식봄 웹 (Next.js)',
        description: 'Next.js 기반 식자재 주문 웹 서비스. GraphQL + Relay로 데이터 레이어를 구성하고 Tailwind CSS로 UI를 구현했습니다.',
        techs: ['Next.js', 'TypeScript', 'GraphQL', 'Relay', 'Tailwind CSS', 'Datadog'],
      },
      {
        slug: 'php-web',
        name: '식봄 레거시 웹 (PHP)',
        description: 'CodeIgniter 3 기반 레거시 소비자 웹. 검색·주문·결제 전 플로우를 운영하며 신규 앱과 병행 운영했습니다.',
        techs: ['PHP', 'CodeIgniter', 'Redis', 'Elasticsearch', 'MySQL'],
      },
      {
        slug: 'admin-web',
        name: '식봄 관리자 웹',
        description: '식봄 서비스 운영을 위한 내부 관리자 웹 서비스. React 기반으로 다양한 운영 도구를 제공합니다.',
        techs: ['React', 'TypeScript', 'Datadog'],
      },
      {
        slug: 'boronter-template',
        name: '인쇄 템플릿 라이브러리',
        description: '식봄 주문서·거래명세서 등 다양한 인쇄 문서를 React 컴포넌트로 제공하는 내부 라이브러리입니다.',
        techs: ['React', 'TypeScript'],
      },
    ],
    isFeatured: true,
  },
  {
    id: 'marketbom-pro',
    title: '마켓봄 (구 마켓봄 프로)',
    category: 'service',
    description: `식자재 유통사를 위한 B2B SaaS 플랫폼 마켓봄(구 마켓봄 프로)의 프론트엔드를 담당했습니다.
웹 서비스, 하이브리드 앱, 정산 관리자, 디자인 시스템까지 전 레이어에 걸쳐 개발했습니다.`,
    techs: ['React', 'Vue.js', 'Nuxt.js', 'TypeScript', 'GraphQL', 'Apollo Client', 'Emotion', 'Storybook', 'Datadog', 'ag-Grid', 'Vite'],
    links: [],
    range: '2020.10 ~ 2023.07',
    careerId: 'marketboro',
    subRepos: [
      {
        slug: 'macaron-front',
        name: '마켓봄 웹',
        description: 'Nuxt.js + Vue.js 기반 유통사용 B2B 웹 서비스. 자료 일괄 등록, 세금계산서 비교, 거래전표 등 핵심 업무 화면을 개발했습니다.',
        techs: ['Nuxt.js', 'Vue.js', 'TypeScript', 'GraphQL', 'Apollo Client', 'RealGrid', 'Datadog'],
      },
      {
        slug: 'order-app',
        name: '거래처 주문 앱',
        description: '거래처(음식점)가 모바일·PC에서 식자재를 발주하는 웹 앱. 네이티브 WebView Shell 안에서 실행되며, PC 버전 신규 개발 및 부가세 금액 계산 로직을 담당했습니다.',
        techs: ['Nuxt.js', 'Vue.js', 'TypeScript', 'GraphQL', 'Apollo Client', 'RealGrid', 'Vuex'],
      },
      {
        slug: 'vendor-app',
        name: '유통사 전용 앱',
        description: 'React 기반 웹뷰를 Flutter Shell로 감싼 유통사 전용 하이브리드 앱. BoronUI 디자인 시스템을 기반으로 수주 관리·바코드 환경설정을 담당했습니다.',
        techs: ['React', 'TypeScript', 'GraphQL', 'Apollo Client', 'Emotion', 'Recoil'],
      },
      {
        slug: 'settlement-admin',
        name: '통합 운영 관리자',
        description: '마켓봄·마켓봄프로·도매 세 서비스의 운영 업무를 통합한 내부 관리자 웹. React 18 + Vite로 신규 구축하고 ag-Grid로 대용량 정산 데이터를 처리했습니다.',
        techs: ['React', 'TypeScript', 'Vite', 'MUI', 'Tailwind CSS', 'GraphQL', 'ag-Grid', 'Recoil'],
      },
      {
        slug: 'boronui',
        name: '디자인 시스템',
        description: '유통사 앱 전용 React 컴포넌트 라이브러리. Emotion 기반 테마 시스템과 Storybook 문서화, ESM·CJS 듀얼 빌드를 구축했습니다.',
        techs: ['React', 'TypeScript', 'Emotion', 'Storybook', 'Vite'],
      },
    ],
    isFeatured: true,
  },
  {
    id: 'hybrid-app-framework',
    title: '하이브리드 앱 통합 프레임워크',
    category: 'framework',
    description: `마켓보로의 여러 서비스 앱을 단일 Flutter 코드베이스로 통합하기 위해 설계한 하이브리드 앱 프레임워크입니다.
Flutter를 얇은 Shell로, 기존 React·Vue·Nuxt 웹 자산을 WebView로 렌더링하고, JS Bridge(\`window.nativeBridge\`)로 네이티브 기능을 웹에 노출합니다. Dart 3.0 Sealed Class Flavor 시스템으로 2개 서비스 × 3개 환경(LOCAL/TEST/PROD) = 6개 빌드 타깃을 관리하며, Firebase Remote Config로 배포 없이 버전 게이팅을 원격 제어합니다.`,
    techs: ['Flutter', 'Dart', 'Firebase', 'Firebase Remote Config'],
    links: [],
    range: '2023.08 ~ 2023.12',
    careerId: 'marketboro',
    isFeatured: true,
  },
];
