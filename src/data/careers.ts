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
  isDraft?: boolean; // 추가된 isDraft 속성
};

export const Career: Career[] = [
  {
    id: 'seonhamlabs',
    name: '선함연구소',
    logo: '/assets/logos/seonhamlabs_logo.webp',
    introduce: `선함연구소는 '선함의 데이터화'를 슬로건으로 두 개의 서비스를 기획·개발·운영하는 1인 스타트업입니다. 대표 겸 개발자로서 기획·설계·개발·앱스토어 배포·운영까지 전 과정을 직접 수행하고 있습니다.

· 돌들의 숲 — 익명 P2P 힐링 커뮤니티. 2026년 3월 iOS·Android 정식 출시. React 웹 앱을 Expo 네이티브 Shell로 감싼 하이브리드 구조이며, 백엔드는 Cloudflare Workers 서버리스로 운영합니다.
· 남았던가 — 냉장고 식재료를 사진으로 기록해 음식물 낭비를 줄이는 앱. 2026년 3월 App Store 출시, 5월 v1.1.0 배포. 서버 없이 기기 로컬 SQLite만 사용하는 완전 프라이빗 아키텍처입니다.

두 서비스 모두 하이브리드 앱·서버리스·모노레포 환경에서 출시부터 운영까지의 사이클을 직접 다루고 있습니다.`,
    position: '대표 / 개발자',
    range: '2025.01 ~',
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
      'Three.js',
      'SQLite',
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
    isDraft: true, // draft 처리
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
