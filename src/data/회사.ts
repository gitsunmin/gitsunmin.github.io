import { 프로젝트, 프로젝트들 } from './프로젝트';

import marketboro_logo from '@/assets/logos/marketboro_logo.webp';
import korens_logo from '@/assets/logos/korens_logo.webp';

export const 회사_key_목록 = [
  'marketboro',
  'korens',
] as const;

export type 회사_key = typeof 회사_key_목록[number];

type 회사 = {
  id: 회사_key;
  이름: string;
  로고: string;
  소개: string;
  주의?: string;
  직책: string;
  기간: string;
  프로젝트들: 프로젝트[];
  링크들: {
    label: string;
    url: string;
  }[];
};

export const 경력: 회사[] = [
  {
    id: 'marketboro',
    이름: '(주) 마켓보로',
    로고: marketboro_logo,
    소개: `(주) 마켓보로는 B2B 식자재 유통 시장에서 중간 과정을 최소화하여 비용 절감과 효율 증대를 실현하는 엔터프라이즈 푸드테크 플랫폼을 제공합니다. 
          또한 사업자 대상의 오픈 마켓인 식봄을 운영하고 있습니다. 
          저는 프론트엔드 개발자로서 React.js와 Next.js를 활용하여 웹과 모바일 애플리케이션의 사용자 인터페이스를 개발하고 있습니다. 
          특히, 기존 PHP로 개발된 식봄을 Next.js로 전환하는 프로젝트를 주도하며, 성능 최적화와 사용자 경험 향상을 달성하였습니다. 
          이러한 경험을 통해 다양한 디바이스에서의 접근성을 보장하고, 최신 기술 스택을 적극 활용하는 역량을 갖추게 되었습니다.`,
    기간: '2020.10 ~ ',
    직책: '프론트엔드 개발자',
    프로젝트들: 프로젝트들.filter((프로젝트) => 프로젝트.회사key === 'marketboro'),
    링크들: [
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
      }
    ],
  },
  {
    id: 'korens',
    이름: '(주) 코렌스',
    로고: korens_logo,
    소개: `(주) 코렌스는 자동차 부품 제조사로서, 소프트웨어 사업부를 신설하여 새로운 도전을 시작하였습니다. 
          이곳에서 프론트엔드 개발자로서의 커리어를 시작하였으며, 
          Vue.js를 활용한 프론트엔드 개발뿐만 아니라 백엔드 개발과 AWS Amplify를 통한 클라우드 서비스 구축 등 다양한 역할을 수행하였습니다. 
          특히, 초기 개발 환경과 프로세스 구축에 참여하여, 개발 역량뿐만 아니라 문제 해결 능력과 주도적인 업무 수행 능력을 함양하였습니다.`,
    직책: '프론트엔드 개발자',
    기간: '2019.07 ~ 2020.10',
    프로젝트들: 프로젝트들.filter((프로젝트) => 프로젝트.회사key === 'korens'),
    링크들: [{
      label: '코렌스 웹사이트',
      url: 'http://www.korens.com',
    }],
  }
];
