import type { Experience } from '@/data/experiencies/';
import BookFrontCover from '@/assets/experiencies/about-the-library/cover/book-cover-front.webp';
import BookBackCover from '@/assets/experiencies/about-the-library/cover/book-cover-back.webp';
import BookSideCover from '@/assets/experiencies/about-the-library/cover/book-cover-back.webp';
import Content from '@/docs/experiencies/about-the-library/index.mdx';
import { MDXReplacer } from '@/components/MDXReplacer';

export const EXPERIENCE_LIBRARY: Experience = {
  id: 'experience_about-the-library',
  careers: ['marketboro'],
  name: 'About The Library',
  content: <Content components={MDXReplacer({})} />,
  book: {
    cover: {
      front: BookFrontCover,
      back: BookBackCover,
      side: BookSideCover,
    },
  },
};
