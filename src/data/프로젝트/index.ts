import type { CareerKey } from '@/data/회사';
import type { 기술_key } from '@/data/기술';

export type 프로젝트 = {
  readonly id: string;
  readonly parentId: string | null;
  readonly 회사key: CareerKey;
  readonly 이름: string;
  readonly 소개: React.ReactNode;
  readonly 목적: React.ReactNode;
  readonly 기간: string;
  readonly 기술들: 기술_key[];
  readonly 주의?: string[];
  readonly 책: {
    readonly 표지: {
      readonly 앞: string;
      readonly 뒤: string;
      readonly 등: string;
    };
  };
  readonly 작업?: {
    readonly id: string;
    readonly 제목: string;
    readonly 도구: 기술_key[];
    readonly 소개: React.ReactNode;
    readonly 기여도: {
      readonly id: string;
      readonly 제목: string;
      readonly 내용: React.ReactNode;
    }[];
    readonly 트러블슈팅: {
      readonly id: string;
      readonly 제목: string;
      readonly 문제점: React.ReactNode;
      readonly 해결방법: React.ReactNode;
      readonly 회고: React.ReactNode;
    }[];
  }[];
};

export const 프로젝트들: 프로젝트[] = [];
