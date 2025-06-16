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
      text: '업무 혹은 개인적으로 필요한 도구를 모듈화하여 라이브러리 형태로 배포한 경험을 가지고 있습니다. 이 경험에 대해서 공유하고자 합니다.',
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
      text: 'Troubleshooting1',
    },
    {
      __t: 'headline',
      level: 2,
      text: 'Troubleshooting2',
    },
    {
      __t: 'headline',
      level: 3,
      text: 'Troubleshooting3',
    },
    {
      __t: 'headline',
      level: 4,
      text: 'Troubleshooting4',
    },
    {
      __t: 'headline',
      level: 5,
      text: 'Troubleshooting5',
    },
    {
      __t: 'headline',
      level: 6,
      text: 'Troubleshooting6',
    },
    {
      __t: 'headline',
      level: 1,
      text: 'Troubleshooting11',
    },
    {
      __t: 'headline',
      level: 2,
      text: 'Troubleshooting22',
    },
    {
      __t: 'headline',
      level: 3,
      text: 'Troubleshooting33',
    },
    {
      __t: 'text',
      text: 'Library는 마켓보로의 사내 개발자 커뮤니티입니다. 개발자들이 자유롭게 기술을 공유하고, 서로의 경험을 나누는 공간으로, 다양한 기술 스택과 프로젝트에 대한 토론이 이루어집니다. 이 커뮤니티를 통해 개발자들은 최신 기술 동향을 파악하고, 서로의 지식을 확장할 수 있습니다.',
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
