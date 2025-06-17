import type { Experience } from '@/data/experiencies';
import BookFrontCover from '@/assets/book_pages.webp';
import BookBackCover from '@/assets/book_pages.webp';
import BookSideCover from '@/assets/book_pages.webp';

export const EXPERIENCE_LIBRARY: Experience = {
  id: 'experience-library',
  careers: ['marketboro'],
  name: 'Library',
  introduce: [
    {
      __t: 'text',
      text: '업무 혹은 개인적으로 필요한 도구를 모듈화하여 라이브러리 형태로 배포한 경험들을 가지고 있습니다. 이 경험들에 대해서 공유하고자 합니다.',
    },
    {
      __t: 'text',
      text: '문제가 있었던 내용과 해결 방법 그리고 이 경험을 통해 배운 것들을 작성하였습니다.',
    },
    {
      __t: 'text',
      text: '언어나 프래임워크에 대한 의존을 최소화하였고, 라이브러리를 개발하는 행위 자체에 촛점을 두어 작성하였습니다.',
    },
  ],
  contents: [
    {
      __t: 'headline',
      level: 1,
      text: 'troubleshooting',
    },
    {
      __t: 'headline',
      level: 2,
      text: 'Problem: 공개할 수 없는 라이브러리',
    },
    {
      __t: 'text',
      text: '회사의 코드가 외부에 공개될 수 없는 상황이었습니다. 하지만, 요구사항을 분석하였을 때, 재사용성과 유지보수하기에 좋은 라이브러리 형태가 적합하다고 판단하였습니다.',
    },
    {
      __t: 'text',
      text: '외부에 공개하지 않더라도, 라이브러리 형태로 관리하는 것이 가능한 방법 2 가지가 있었습니다.',
    },
    {
      __t: 'text',
      text: '1. 패키지 레지스트리에서 제공하는 Private Registry를 이용하는 방법',
    },
    {
      __t: 'text',
      text: '2. Nexus Repository와 같은 패키지 레지스트리 서버를 구축하는 방법',
    },
  ],
  book: {
    cover: {
      front: BookFrontCover,
      back: BookBackCover,
      side: BookSideCover,
    },
  },
};
