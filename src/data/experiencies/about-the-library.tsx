import type { Experience } from '@/data/experiencies/';
import BookFrontCover from '@/assets/experiencies/about-the-library/book-cover-front.webp';
import BookBackCover from '@/assets/experiencies/about-the-library/book-cover-back.webp';
import BookSideCover from '@/assets/experiencies/about-the-library/book-cover-spine.webp';
import Content from '@/docs/experiencies/about-the-library/index.mdx';
import { MDXReplacer } from '@/components/MDXReplacer';

export const EXPERIENCE_LIBRARY: Experience = {
  id: 'experience-library-development',
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
