import type { CareerId } from '@/data/careers';
import { EXPERIENCE_LIBRARY } from '@/data/experiencies/about-the-library';
import type { JSX } from 'react/jsx-runtime';

export type Experience = {
  readonly id: string;
  readonly careers: CareerId[];
  readonly name: string;
  readonly book: {
    readonly cover: {
      readonly front: string;
      readonly back: string;
      readonly side: string;
    };
  };
  readonly content: JSX.Element;
};

export const EXPERIENCE_LIST: Experience[] = [EXPERIENCE_LIBRARY];
