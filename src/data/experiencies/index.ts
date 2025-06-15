import type { CareerId } from '@/data/careers';
import { EXPERIENCE_LIBRARY } from '@/data/experiencies/library';
import type { Content } from '@/data/contentTypes';

export type Experience = {
  readonly id: string;
  readonly careers: CareerId[];
  readonly name: string;
  readonly introduce: Content[];
  readonly book: {
    readonly cover: {
      readonly front: string;
      readonly back: string;
      readonly side: string;
    };
  };
  readonly contents?: Content[];
};

export const EXPERIENCE_LIST: Experience[] = [EXPERIENCE_LIBRARY];
