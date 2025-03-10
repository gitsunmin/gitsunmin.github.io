
import BookFoodspringFrontCover from '@/assets/book_foodspring_front_cover.webp';
import BookFoodspringSideCover from '@/assets/book_foodspring_side_cover.webp';
import BookFoodspringBackCover from '@/assets/book_foodspring_back_cover.webp';
import { 프로젝트 } from '@/data/프로젝트';

export const 식봄: 프로젝트 = {
    id: 'foodspring',
    parentId: null,
    회사key: 'marketboro',
    이름: '식자재 E-Commerce, 식봄',
    소개: `식봄은 (주) 마켓보로에서 운영하는 B2B 식자재 오픈마켓입니다.`,
    기간: '2024.01 ~ ',
    기술들: ['react', 'next', 'tailwindcss', 'relay', 'jest', 'typescript', 'bitbucket_pipelines', 'datadog', 'vite', 'bun'],
    역할: [
        `서비스 내에서 사용자의 사용성을 책임지는 Discovery 스쿼드에 소속 (~2024년 06월)`,
        `PHP로 작성된 레거시 시스템을 Next.js로 전환 작업 수행.`,
        `Datadog을 활용하여 서버 로깅, 모니터링.`,
        `관리자용 웹 서비스 개발`,
    ],
    책: {
        표지: {
            앞: BookFoodspringFrontCover,
            등: BookFoodspringSideCover,
            뒤: BookFoodspringBackCover,
        }
    },
    업적: [
        {
            id: 'php-to-next-js-transition',
            제목: 'PHP to Next.js 전환/개선 및 UI 작업',
            기술: ['react', 'next', 'tailwindcss', 'relay', 'jest', 'typescript', 'bitbucket_pipelines', 'datadog', 'vite', 'bun'],
            소개: `식봄은 기존에 Code Igniter라는 PHP 프레임워크를 사용하고 있었으며, 프론트엔드는 Next.js, 백엔드는 Kotlin Spring Boot로 전환하는 프로젝트입니다.
                    전환 작업을 진행하면서 새로운 기능도 함께 개발하였고, 그 과정에서 다양한 문제와 해결방법을 찾을 수 있었습니다. 아래에서 그 내용을 이야기 하겠습니다.`,
            성과: '',
        }
    ],
};
