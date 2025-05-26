import type { Experience } from '@/data/experiencies';
import BookFrontCover from '@/assets/book_pages.webp';
import BookBackCover from '@/assets/book_pages.webp';
import BookSideCover from '@/assets/book_pages.webp';

export const EXPERIENCE_BOROTER: Experience = {
  id: 'experience-boronter',
  relatedTo: null,
  careerId: 'marketboro',
  name: '인쇄 템플릿 라이브러리, Boronter',
  introduce: (
    <p>
      브라우저의 인쇄 기능을 사용하기 위한 SDL으로서 정의한 Object로 인쇄 기능을
      구현할 수 있고, 템플릿으로 만들어 반복 작업을 수행할 수 있도록 도움을 주는
      라이브러리입니다.
      <br />
      <br />
    </p>
  ),
  dateRange: '2023.01 ~ 2023.03',
  skils: ['bun', 'react', 'typescript'],
  book: {
    cover: {
      front: BookFrontCover,
      back: BookBackCover,
      side: BookSideCover,
    },
  },
  contents: [
    {
      id: 'experience-boronter-description-design',
      title: '라이브러리 설계',
      content: (
        <>
          <p>해당 프로젝트의 목적은 브라우저의 인쇄 기능을 사용하기 위한</p>
        </>
      ),
    },
  ],
  troubleshooting: [],
};
