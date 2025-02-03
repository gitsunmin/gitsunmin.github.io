import type { 기술_key } from './기술';
import type { 회사_key } from './회사';

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
};

export const 프로젝트들: 프로젝트[] = [
    {
        id: 'foodspring',
        parentId: null,
        회사key: 'marketboro',
        이름: 'B2B 식자재 오픈마켓, 식봄',
        소개: `식봄은 (주) 마켓보로에서 운영하는 B2B 식자재 오픈마켓입니다.`,
        기간: '2021.01 ~ ',
        기술들: ['react', 'next'],
        역할: ['프론트엔드 개발자'],
    },
    {
        id: 'marketbom-pro',
        parentId: null,
        회사key: 'marketboro',
        이름: '식자재 수발주 솔루션, 마켓봄 프로',
        소개: ``,
        기간: '2021.01 ~ ',
        기술들: ['react', 'next'],
        역할: ['프론트엔드 개발자'],
    },
    {
        id: 'marketbom-pro',
        parentId: null,
        회사key: 'korens',
        이름: '업무 협업 솔루션, 시냅스',
        소개: ``,
        기간: '2021.01 ~ ',
        기술들: ['react', 'next'],
        역할: ['프론트엔드 개발자'],
    },
];