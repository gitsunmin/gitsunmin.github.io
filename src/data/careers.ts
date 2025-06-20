import { EXPERIENCE_LIST, type Experience } from '@/data/experiencies';

import marketboro_logo from '@/assets/logos/marketboro_logo.webp';
import korens_logo from '@/assets/logos/korens_logo.webp';

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
  experiencies: Experience[];
  links: {
    label: string;
    url: string;
  }[];
};

export const Career: Career[] = [
  {
    id: 'marketboro',
    name: '(주) 마켓보로',
    logo: marketboro_logo,
    introduce: `(주) 마켓보로는 B2B 식자재 유통 시장에서 중간 과정을 최소화하여 비용 절감과 효율 증대를 실현하는 엔터프라이즈 푸드테크 플랫폼을 제공합니다. 
          또한 사업자 대상의 오픈 마켓인 식봄을 운영하고 있습니다. 
          저는 프론트엔드 개발자로서 React.js와 Next.js를 활용하여 웹과 모바일 애플리케이션의 사용자 인터페이스를 개발하고 있습니다. 
          특히, 기존 PHP로 개발된 식봄을 Next.js로 전환하는 프로젝트를 주도하며, 성능 최적화와 사용자 경험 향상을 달성하였습니다. 
          이러한 경험을 통해 다양한 디바이스에서의 접근성을 보장하고, 최신 기술 스택을 적극 활용하는 역량을 갖추게 되었습니다.`,
    range: '2020.10 ~ ',
    positoin: '프론트엔드 개발자',
    experiencies: EXPERIENCE_LIST.filter((experience) =>
      experience.careers.includes('marketboro')
    ),
    links: [
      {
        label: '마켓보로 웹사이트',
        url: 'https://www.marketboro.com'
      },
      {
        label: '식봄',
        url: 'https://www.foodspring.co.kr'
      },
      {
        label: '마켓봄 프로',
        url: 'https://pro.marketbom.com'
      }
    ]
  },
  {
    id: 'korens',
    name: '(주) 코렌스',
    logo: korens_logo,
    introduce: `(주) 코렌스는 자동차 부품 제조사로서, 소프트웨어 사업부를 신설하여 새로운 도전을 시작하였습니다. 
          이곳에서 프론트엔드 개발자로서의 커리어를 시작하였으며, 
          Vue.js를 활용한 프론트엔드 개발뿐만 아니라 백엔드 개발과 AWS Amplify를 통한 클라우드 서비스 구축 등 다양한 역할을 수행하였습니다. 
          특히, 초기 개발 환경과 프로세스 구축에 참여하여, 개발 역량뿐만 아니라 문제 해결 능력과 주도적인 업무 수행 능력을 함양하였습니다.`,
    positoin: '프론트엔드 개발자',
    range: '2019.07 ~ 2020.10',
    experiencies: EXPERIENCE_LIST.filter((experience) =>
      experience.careers.includes('marketboro')
    ),
    links: [
      {
        label: '코렌스 웹사이트',
        url: 'http://www.korens.com'
      }
    ]
  }
];
