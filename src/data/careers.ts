export const CAREER_NAME = ['marketboro', 'korens'] as const;

export type CareerId = (typeof CAREER_NAME)[number];

type Career = {
  id: CareerId;
  name: string;
  logo: string;
  introduce: string;
  caution?: string;
  positoin: string;
  range: string;
  links: {
    label: string;
    url: string;
  }[];
};

export const Career: Career[] = [
  {
    id: 'marketboro',
    name: '(주) 마켓보로',
    logo: '/assets/logos/marketboro_logo.webp',
    introduce: `(주) 마켓보로는 B2B 식자재 유통 푸드테크 기업으로, ‘마켓봄 프로’와 ‘식봄’을 운영하는 회사입니다.
프론트엔드 개발자로서 두 서비스의 개발·운영에 참여했으며, PHP 기반 ‘식봄’을 React.js·Next.js로 전환하는 작업을 주로 수행했습니다.
성능 최적화, 접근성 개선, UX 향상 등의 경험을 쌓았습니다.`,
    range: '2020.10 ~ 2025.12',
    positoin: '프론트엔드 개발자',
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
        label: '마켓봄 프로',
        url: 'https://pro.marketbom.com',
      },
    ],
  },
  {
    id: 'korens',
    name: '(주) 코렌스',
    logo: '/assets/logos/korens_logo.webp',
    introduce: `(주) 코렌스는 자동차 부품 제조사로, 신설된 소프트웨어 사업부에서 프론트엔드 개발자로 커리어를 시작했습니다.
Vue.js 기반 프론트엔드 개발과 Node.js 기반 백엔드 개발, AWS Amplify를 활용한 클라우드 서비스 구축을 수행했습니다.
초기 개발 환경과 프로세스 구축에도 참여했습니다.`,
    positoin: '프론트엔드 개발자',
    range: '2019.07 ~ 2020.10',
    links: [
      {
        label: '코렌스 웹사이트',
        url: 'http://www.korens.com',
      },
    ],
  },
];
