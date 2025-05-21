import type { CareerId } from '@/data/careers';
import type { SkilId } from '@/data/skils';

export type Project = {
  readonly id: string;
  readonly parentId: string | null;
  readonly careerId: CareerId;
  readonly name: string;
  readonly introduce: React.ReactNode;
  readonly purpose: React.ReactNode;
  readonly dateRange: string;
  readonly skils: SkilId[];
  readonly caution?: string[];
  readonly book: {
    readonly cover: {
      readonly front: string;
      readonly back: string;
      readonly side: string;
    };
  };
  readonly work?: {
    readonly id: string;
    readonly title: string;
    readonly skils: SkilId[];
    readonly introduce: React.ReactNode;
    readonly contribution: {
      readonly id: string;
      readonly title: string;
      readonly description: React.ReactNode;
    }[];
    readonly troubleshooting: {
      readonly id: string;
      readonly title: string;
      readonly problem: React.ReactNode;
      readonly solution: React.ReactNode;
      readonly retrospect: React.ReactNode;
    }[];
  }[];
};

export const PROJECT_LIST: Project[] = [];
