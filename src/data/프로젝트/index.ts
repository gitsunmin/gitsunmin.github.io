import { 회사_key } from '@/data/회사';
import { 기술_key } from '@/data/기술';

import { 식봄 } from '@/data/프로젝트/식봄';
import { 플러터_하이브리드_앱 } from '@/data/프로젝트/플러터_하이브리드_앱';
import { 마켓봄프로 } from '@/data/프로젝트/마켓봄프로';
import { 협업툴_시냅스 } from '@/data/프로젝트/협업툴_시냅스';

export type 프로젝트 = {
    readonly id: string;
    readonly parentId: string | null;
    readonly 회사key: 회사_key;
    readonly 이름: string;
    readonly 소개: React.ReactNode;
    readonly 기간: string;
    readonly 기술들: 기술_key[];
    readonly 주의?: string[];
    readonly 책: {
        readonly 표지: {
            readonly 앞: string;
            readonly 뒤: string;
            readonly 등: string;
        }
    };
    readonly 작업?: {
        readonly id: string;
        readonly 제목: string;
        readonly 기술: 기술_key[];
        readonly 소개: React.ReactNode;
        readonly 기여도: {
            readonly id: string;
            readonly 제목: string;
            readonly 내용: React.ReactNode;
        }[];
        readonly 트러블슈팅: {
            readonly id: string;
            readonly 문제점: string;
            readonly 해결방법: string;
            readonly 회고: string;
        }[]
    }[];
};

export const 프로젝트들: 프로젝트[] = [
    식봄,
    플러터_하이브리드_앱,
    마켓봄프로,
    협업툴_시냅스,
];