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
    readonly 역할: string[];
    readonly 주의?: string[];
    readonly 책: {
        표지: {
            앞: string;
            뒤: string;
            등: string;
        }
    };
    readonly 업적?: {
        id: string;
        제목: string;
        기술: 기술_key[];
        소개: React.ReactNode;
        성과: React.ReactNode;
    }[];
};

export const 프로젝트들: 프로젝트[] = [
    식봄,
    플러터_하이브리드_앱,
    마켓봄프로,
    협업툴_시냅스,
];