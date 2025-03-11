import { 프로젝트 } from '@/data/프로젝트';

import BookHybridAppIntegrationFrameworkWithFlutterBackCover from '@/assets/book_hybrid_app_integration_framework_with_flutter_back_cover.webp';
import BookHybridAppIntegrationFrameworkWithFlutterFrontCover from '@/assets/book_hybrid_app_integration_framework_with_flutter_front_cover.webp';
import BookHybridAppIntegrationFrameworkWithFlutterSideCover from '@/assets/book_hybrid_app_integration_framework_with_flutter_side_cover.webp';

export const 플러터_하이브리드_앱: 프로젝트 = {
    id: 'hybrid-app-integration-framework-with-flutter',
    parentId: null,
    회사key: 'marketboro',
    이름: '하이브리드 앱 통합 프레임워크',
    소개: `마켓보로에서 사용중인 모든 하이브리드 앱을 하나의 코드로 통합하기 위해서 기본적인 하이브리드 앱을 개발할 수 있는 프래입워크를 개발하였습니다.`,
    기간: '2021.01 ~ ',
    기술들: ['flutter', 'firebase', 'bitbucket_pipelines'],
    책: {
        표지: {
            앞: BookHybridAppIntegrationFrameworkWithFlutterFrontCover,
            뒤: BookHybridAppIntegrationFrameworkWithFlutterBackCover,
            등: BookHybridAppIntegrationFrameworkWithFlutterSideCover,
        }
    }
};
