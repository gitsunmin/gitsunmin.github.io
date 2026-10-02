export const CAREER_NAME = ['seonhamlabs', 'marketboro', 'korens'] as const;

export type CareerId = (typeof CAREER_NAME)[number];

type Career = {
  id: CareerId;
  name: string;
  logo?: string;
  introduce: string;
  caution?: string;
  position: string;
  range: string;
  techs: string[];
  links: {
    label: string;
    url: string;
  }[];
  /**
   * 타임라인에서 어느 레인에 놓일지 결정한다.
   * 'personal'은 고용 이력에서 갈라져 나온 개인 작업 트랙으로 그린다. 기본값은 'employment'.
   */
  kind?: 'employment' | 'personal';
  /** kind가 'personal'일 때, 고용 트랙에서 갈라져 나온 시점에 붙일 캡션. */
  branchCaption?: string;
  isDraft?: boolean; // 추가된 isDraft 속성
};

export const Career: Career[] = [
  {
    id: 'seonhamlabs',
    name: '선함연구소',
    logo: '/assets/logos/seonhamlabs_logo.webp',
    introduce: `풀고 싶은 문제를 직접 정의하고 끝까지 만들어보고 싶어 시작한 개인 작업입니다. 마켓보로 퇴사 후 2026년 1월부터 앱을 만들고 운영하고 있습니다.

기획·설계·개발·앱스토어 심사·배포·운영까지 혼자 수행하며, 두 개의 앱을 출시해 운영 중입니다.`,
    position: '개인 개발 · 운영',
    range: '2026.01 ~',
    kind: 'personal',
    branchCaption: '퇴사 후 작업',
    techs: [
      'TypeScript',
      'React',
      'React Native',
      'Expo',
      'GraphQL',
      'Relay',
      'Cloudflare Workers',
      'Prisma',
      'Tailwind CSS',
      'Vite',
      'Astro',
      'Cloudflare D1',
      'Zustand',
      'Turborepo',
      'Bun',
    ],
    links: [
      {
        label: '선함연구소',
        url: 'https://seonhamlabs.com',
      },
      {
        label: '돌들의 숲',
        url: 'https://forest.seonhamlabs.com',
      },
    ],
  },
  {
    id: 'marketboro',
    name: '(주) 마켓보로',
    introduce: `(주) 마켓보로는 B2B 식자재 유통 푸드테크 기업으로, ‘마켓봄(구 마켓봄 프로)’와 ‘식봄’을 운영하는 회사입니다.
프론트엔드 개발자로서 두 서비스의 개발·운영에 참여했으며, 레거시 서비스 현대화와 신규 서비스 개발을 주로 수행했습니다.
React·Next.js 기반으로 핵심 사용자 흐름을 개발하고, 측정 기반 성능 개선, 인앱 WebView 하이브리드 앱, 금액 정합성·장애 대응 등 복잡한 커머스 도메인의 운영 이슈를 해결했습니다.`,
    range: '2020.10 ~ 2025.12',
    position: '프론트엔드 개발자',
    techs: ['Vue.js', 'React.js', 'Next.js', 'pnpm', 'Vite', 'Bun', 'Tailwind CSS', 'Relay', 'TypeScript', 'JavaScript', 'DataDog'],
    links: [
      {
        label: '마켓보로 웹사이트',
        url: 'https://www.marketboro.com',
      },
      {
        label: '식봄',
        url: 'https://www.foodspring.co.kr',
      },
      {
        label: '마켓봄 (구 마켓봄 프로)',
        url: 'https://pro.marketbom.com',
      },
    ],
  },
  {
    id: 'korens',
    name: '(주) 코렌스',
    introduce: `(주) 코렌스는 자동차 부품 제조사로, 신설된 소프트웨어 사업부에서 프론트엔드 개발자로 커리어를 시작했습니다.
Vue.js 기반 프론트엔드 개발과 Node.js 기반 백엔드 개발, AWS Amplify를 활용한 클라우드 서비스 구축을 수행했습니다.
초기 개발 환경과 프로세스 구축에도 참여했습니다.`,
    position: '프론트엔드 개발자',
    range: '2019.07 ~ 2020.10',
    techs: ['Vue.js', 'Node.js', 'AWS Amplify', 'JavaScript', 'TypeScript'],
    links: [
      {
        label: '코렌스 웹사이트',
        url: 'http://www.korens.com',
      },
    ],
  },
];
