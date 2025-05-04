import type { 프로젝트 } from '@/data/프로젝트';

import BookMarketbomProBackCover from '@/assets/book_marketbom_pro_back_cover.webp';
import BookMarketbomProFrontCover from '@/assets/book_marketbom_pro_front_cover.webp';
import BookMarketbomProSideCover from '@/assets/book_marketbom_pro_side_cover.webp';

export const 보론터: 프로젝트 = {
  id: 'boronter',
  parentId: null,
  회사key: 'marketboro',
  이름: '인쇄 템플릿 라이브러리, Boronter',
  소개: <></>,
  목적: '',
  기간: '2021.01 ~ ',
  기술들: [],
  책: {
    표지: {
      앞: BookMarketbomProFrontCover,
      뒤: BookMarketbomProBackCover,
      등: BookMarketbomProSideCover,
    },
  },
};
