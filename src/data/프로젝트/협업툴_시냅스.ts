import { 프로젝트 } from '@/data/프로젝트';

import BookCoWorkingSolutionCnapsBackCover from '@/assets/book_co_working_solution_cnaps_back_cover.webp';
import BookCoWorkingSolutionCnapsFrontCover from '@/assets/book_co_working_solution_cnaps_front_cover.webp';
import BookCoWorkingSolutionCnapsSideCover from '@/assets/book_co_working_solution_cnaps_side_cover.webp';

export const 협업툴_시냅스: 프로젝트 =
{
    id: 'co-working-solution-cnaps',
    parentId: null,
    회사key: 'korens',
    이름: '업무 협업 솔루션, 시냅스',
    소개: ``,
    기간: '2021.01 ~ ',
    기술들: ['vue', 'quasar', 'graphql', 'typescript', 'aws_amplify'],
    역할: ['프론트엔드 개발자'],
    책: {
        표지: {
            앞: BookCoWorkingSolutionCnapsFrontCover,
            뒤: BookCoWorkingSolutionCnapsBackCover,
            등: BookCoWorkingSolutionCnapsSideCover,
        }
    }
};
