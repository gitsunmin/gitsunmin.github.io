import type { CareerId } from '@/data/careers';

export const WORK_IDS = [
  'doldeuls-forest',
  'gitsunmin-github-io',
  'sikbom',
  'marketbom-pro',
  'hybrid-app-framework',
] as const;

export type WorkId = (typeof WORK_IDS)[number];

type SubRepo = {
  name: string;
  description: string;
  techs: string[];
};

type Work = {
  id: WorkId;
  title: string;
  icon: string;
  description: string;
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
    icon: '/assets/logos/seonhamlabs_logo.webp',
    description: `디지털 환경에서의 정서적 고립을 해소하고 싶어 만든 익명 P2P 힐링 커뮤니티입니다.
누군가와 연결되고 싶지만 신분을 드러내기 어려운 순간을 위해, 완전한 익명성을 보장하면서도 진심 어린 대화가 가능한 공간을 만들었습니다.`,
    techs: ['React Native', 'Expo', 'TypeScript', 'GraphQL', 'Relay', 'Cloudflare Workers', 'Prisma'],
    links: [
      { label: '돌들의 숲', url: 'https://forest.seonhamlabs.com' },
    ],
    range: '2025.01 ~',
    careerId: 'seonhamlabs',
    isFeatured: true,
  },
  {
    id: 'gitsunmin-github-io',
    title: 'gitsunmin.github.io',
    icon: '/assets/logos/github_logo.webp',
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
    icon: '/assets/logos/marketboro_logo.webp',
    description: `식자재 유통 플랫폼 식봄의 프론트엔드 전반을 담당했습니다.
Next.js 기반 주문 웹 서비스부터 PHP 마케팅 페이지, 관리자 웹, 인쇄 템플릿 라이브러리까지 다양한 레이어를 개발했습니다.`,
    techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Relay', 'PHP', 'Radix UI', 'Storybook', 'Datadog'],
    links: [],
    range: '2021.06 ~ 2025.12',
    careerId: 'marketboro',
    subRepos: [
      {
        name: '식봄 주문 웹 (Next.js)',
        description: 'Next.js 기반 식자재 주문 웹 서비스. GraphQL + Relay로 데이터 레이어를 구성하고 Tailwind CSS로 UI를 구현했습니다.',
        techs: ['Next.js', 'TypeScript', 'GraphQL', 'Relay', 'Tailwind CSS', 'Datadog'],
      },
      {
        name: '식봄 마케팅 페이지 (PHP)',
        description: '랜딩 페이지 및 마케팅 채널용 PHP 웹 서비스. SEO 최적화와 빠른 초기 로딩을 목표로 구성했습니다.',
        techs: ['PHP', 'HTML', 'CSS', 'JavaScript'],
      },
      {
        name: '식봄 관리자 웹',
        description: '식봄 서비스 운영을 위한 내부 관리자 웹 서비스. React + Radix UI 기반으로 다양한 운영 도구를 제공합니다.',
        techs: ['React', 'TypeScript', 'Radix UI', 'Datadog'],
      },
      {
        name: '인쇄 템플릿 라이브러리 (boronter-template)',
        description: '식봄 주문서·거래명세서 등 다양한 인쇄 문서를 React 컴포넌트로 제공하는 내부 라이브러리입니다.',
        techs: ['React', 'TypeScript'],
      },
    ],
    isFeatured: true,
  },
  {
    id: 'marketbom-pro',
    title: '마켓봄 프로',
    icon: '/assets/logos/marketboro_logo.webp',
    description: `식자재 유통사를 위한 B2B SaaS 플랫폼 마켓봄 프로의 프론트엔드를 담당했습니다.
웹 서비스, 하이브리드 앱, 정산 관리자, 디자인 시스템까지 전 레이어에 걸쳐 개발했습니다.`,
    techs: ['React', 'Vue.js', 'Nuxt.js', 'TypeScript', 'GraphQL', 'Apollo Client', 'Flutter', 'Firebase', 'MUI', 'Emotion', 'Storybook'],
    links: [],
    range: '2020.10 ~ 2025.12',
    careerId: 'marketboro',
    subRepos: [
      {
        name: '마켓봄 프로 웹 (macaron-front)',
        description: 'Nuxt.js + Vue.js 기반 유통사용 B2B 웹 서비스. Apollo Client + GraphQL로 데이터 레이어를 구성했습니다.',
        techs: ['Nuxt.js', 'Vue.js', 'TypeScript', 'GraphQL', 'Apollo Client'],
      },
      {
        name: '식자재 발주 하이브리드 앱',
        description: '식자재 발주를 위한 Flutter 하이브리드 앱. 플레이버 시스템을 활용해 다중 환경을 지원합니다.',
        techs: ['Flutter', 'Firebase', 'Dart'],
      },
      {
        name: '유통사 전용 하이브리드 앱',
        description: 'React 기반 웹뷰를 Flutter Shell로 감싼 유통사 전용 하이브리드 앱. Apollo + GraphQL로 데이터를 관리합니다.',
        techs: ['React', 'TypeScript', 'GraphQL', 'Apollo Client', 'MUI'],
      },
      {
        name: '마켓보로 정산 관리자',
        description: '정산 처리 및 운영을 위한 Nuxt.js 기반 내부 관리자 웹 서비스입니다.',
        techs: ['Nuxt.js', 'Vue.js', 'TypeScript', 'GraphQL', 'Apollo Client'],
      },
      {
        name: '디자인 시스템 (@marketboro/boronui)',
        description: '유통사 전용 앱을 위한 React 컴포넌트 라이브러리. MUI + Emotion 기반으로 Storybook을 통해 문서화했습니다.',
        techs: ['React', 'TypeScript', 'MUI', 'Emotion', 'Storybook'],
      },
    ],
    isFeatured: true,
  },
  {
    id: 'hybrid-app-framework',
    title: '하이브리드 앱 통합 프레임워크',
    icon: '/assets/logos/marketboro_logo.webp',
    description: `마켓보로의 여러 서비스 앱을 단일 Flutter 코드베이스로 통합하기 위해 설계한 하이브리드 앱 프레임워크입니다.
Flutter를 얇은 Shell로, 기존 React·Vue·Nuxt 웹 자산을 WebView로 렌더링하고, JS Bridge(\`window.nativeBridge\`)로 네이티브 기능을 웹에 노출합니다. Dart 3.0 Sealed Class Flavor 시스템으로 2개 서비스 × 3개 환경(LOCAL/TEST/PROD) = 6개 빌드 타깃을 관리하며, Firebase Remote Config로 배포 없이 버전 게이팅을 원격 제어합니다.`,
    techs: ['Flutter', 'Dart', 'Firebase', 'Firebase Remote Config'],
    links: [],
    range: '2023.08 ~ 2023.12',
    careerId: 'marketboro',
    isFeatured: true,
  },
];
