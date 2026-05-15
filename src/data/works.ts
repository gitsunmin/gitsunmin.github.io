export const WORK_IDS = ['doldeuls-forest', 'gitsunmin-github-io'] as const;

export type WorkId = (typeof WORK_IDS)[number];

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
];
