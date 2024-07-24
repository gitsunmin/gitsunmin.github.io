import type { 기술_key } from './기술';

export type 프로젝트 = {
    id: string;
    이름: string;
    소개: string;
    기간: string;
    기술들: 기술_key[];
    주의?: string[];
    역할: string[];
    내용: React.ReactNode;
};