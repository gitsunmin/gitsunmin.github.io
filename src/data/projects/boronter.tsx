import type { Project } from '@/data/projects';
import BookFrontCover from '@/assets/book_pages.webp';
import BookBackCover from '@/assets/book_pages.webp';
import BookSideCover from '@/assets/book_pages.webp';

export const PROJECT_BOROTER: Project = {
  id: 'project-boronter',
  relatedTo: null,
  careerId: 'marketboro',
  name: '인쇄 템플릿 라이브러리, Boronter',
  introduce: <></>,
  purpose: <></>,
  dateRange: '2023.01 ~ 2023.03',
  skils: ['bun', 'react', 'typescript'],
  book: {
    cover: {
      front: BookFrontCover,
      back: BookBackCover,
      side: BookSideCover,
    },
  },
};
