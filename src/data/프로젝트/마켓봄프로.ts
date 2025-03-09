import { 프로젝트 } from '@/data/프로젝트';

import BookMarketbomProBackCover from '@/assets/book_marketbom_pro_back_cover.webp';
import BookMarketbomProFrontCover from '@/assets/book_marketbom_pro_front_cover.webp';
import BookMarketbomProSideCover from '@/assets/book_marketbom_pro_side_cover.webp';

export const 마켓봄프로: 프로젝트 =
{
    id: 'marketbom-pro',
    parentId: null,
    회사key: 'marketboro',
    이름: '식자재 수발주 솔루션, 마켓봄 프로',
    소개: ``,
    기간: '2021.01 ~ ',
    기술들: ['nuxt', 'typescript', 'vuetify', 'storybook', 'apollo_graphql', 'datadog', 'pnpm', 'yarn', 'react', 'vite', 'webpack'],
    역할: ['프론트엔드 개발자'],
    책: {
        표지: {
            앞: BookMarketbomProFrontCover,
            뒤: BookMarketbomProBackCover,
            등: BookMarketbomProSideCover,
        }
    }
};
