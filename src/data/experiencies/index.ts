import type { CareerId } from '@/data/careers';
import type { SkilId } from '@/data/skils';
import { EXPERIENCE_BOROTER } from './boronter';

export type Experience = {
  readonly id: string;
  readonly relatedTo: string | null;
  readonly careerId: CareerId;
  readonly name: string;
  readonly introduce: React.ReactNode;
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
  readonly contents?: {
    readonly id: string;
    readonly title: string;
    readonly content: React.ReactNode;
  }[];
  readonly troubleshooting: {
    readonly id: string;
    readonly title: string;
    readonly problem: React.ReactNode;
    readonly solution: React.ReactNode;
    readonly retrospect: React.ReactNode;
  }[];
};

export const EXPERIENCE_LIST: Experience[] = [EXPERIENCE_BOROTER];
