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
      text: 'Library를 개발했던 경험을 토대로 주의해야할 점과 배운 점을 공유합니다.',
    },
  ],
  contents: [
    {
      __t: 'text',
      text: 'Library는 마켓보로의 사내 개발자 커뮤니티입니다. 개발자들이 자유롭게 기술을 공유하고, 서로의 경험을 나누는 공간으로, 다양한 기술 스택과 프로젝트에 대한 토론이 이루어집니다. 이 커뮤니티를 통해 개발자들은 최신 기술 동향을 파악하고, 서로의 지식을 확장할 수 있습니다.',
    },
    {
      __t: 'text',
      text: 'Library는 마켓보로의 사내 개발자 커뮤니티입니다. 개발자들이 자유롭게 기술을 공유하고, 서로의 경험을 나누는 공간으로, 다양한 기술 스택과 프로젝트에 대한 토론이 이루어집니다. 이 커뮤니티를 통해 개발자들은 최신 기술 동향을 파악하고, 서로의 지식을 확장할 수 있습니다.',
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
