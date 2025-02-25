import type { 기술_key } from './기술';
import type { 회사_key } from './회사';

import BookFoodspringFrontCover from '@/assets/book_foodspring_front_cover.webp';
import BookFoodspringSideCover from '@/assets/book_foodspring_side_cover.webp';
import BookFoodspringBackCover from '@/assets/book_foodspring_back_cover.webp';
import BookHybridAppIntegrationFrameworkWithFlutterBackCover from '@/assets/book_hybrid_app_integration_framework_with_flutter_back_cover.webp';
import BookHybridAppIntegrationFrameworkWithFlutterFrontCover from '@/assets/book_hybrid_app_integration_framework_with_flutter_front_cover.webp';
import BookHybridAppIntegrationFrameworkWithFlutterSideCover from '@/assets/book_hybrid_app_integration_framework_with_flutter_side_cover.webp';
import BookMarketbomProBackCover from '@/assets/book_marketbom_pro_back_cover.webp';
import BookMarketbomProFrontCover from '@/assets/book_marketbom_pro_front_cover.webp';
import BookMarketbomProSideCover from '@/assets/book_marketbom_pro_side_cover.webp';
import BookCoWorkingSolutionCnapsBackCover from '@/assets/book_co_working_solution_cnaps_back_cover.webp';
import BookCoWorkingSolutionCnapsFrontCover from '@/assets/book_co_working_solution_cnaps_front_cover.webp';
import BookCoWorkingSolutionCnapsSideCover from '@/assets/book_co_working_solution_cnaps_side_cover.webp';

export type 프로젝트 = {
    readonly id: string;
    readonly parentId: string | null;
    readonly 회사key: 회사_key;
    readonly 이름: string;
    readonly 소개: string;
    readonly 기간: string;
    readonly 기술들: 기술_key[];
    readonly 역할: string[];
    readonly 주의?: string[];
    readonly 책: {
        표지: {
            앞: string;
            뒤: string;
            등: string;
        }
    };
};

export const 프로젝트들: 프로젝트[] = [
    {
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
        }
    },
    {
        id: 'foodspring-php-to-next-js-transition-and-ui',
        parentId: 'foodspring',
        회사key: 'marketboro',
        이름: 'PHP to Next.js 전환/개선 및 UI 작업',
        소개: `식봄은 (주) 마켓보로에서 운영하는 B2B 식자재 오픈마켓입니다.`,
        기간: '2024.01 ~ ',
        기술들: ['react', 'next', 'tailwindcss', 'relay', 'jest', 'typescript', 'bitbucket_pipelines', 'datadog', 'vite', 'bun'],
        역할: ['프론트엔드 개발자'],
        책: {
            표지: {
                앞: BookFoodspringFrontCover,
                등: BookFoodspringSideCover,
                뒤: BookFoodspringBackCover,
            }
        }
    },
    {
        id: 'hybrid-app-integration-framework-with-flutter',
        parentId: null,
        회사key: 'marketboro',
        이름: '하이브리드 앱 통합 프레임워크',
        소개: `마켓보로에서 사용중인 모든 하이브리드 앱을 하나의 코드로 통합하기 위해서 기본적인 하이브리드 앱을 개발할 수 있는 프래입워크를 개발하였습니다.`,
        기간: '2021.01 ~ ',
        기술들: ['flutter', 'firebase', 'bitbucket_pipelines'],
        역할: ['프론트엔드 개발자'],
        책: {
            표지: {
                앞: BookHybridAppIntegrationFrameworkWithFlutterFrontCover,
                뒤: BookHybridAppIntegrationFrameworkWithFlutterBackCover,
                등: BookHybridAppIntegrationFrameworkWithFlutterSideCover,
            }
        }
    },
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
    },
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
    },
];