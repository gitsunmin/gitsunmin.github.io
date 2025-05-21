export const TAG_LIST = [
  '웹 서비스',
  '하이브리드앱',
  '커머스',
  '라이브러리',
] as const;

export type Tag = (typeof TAG_LIST)[number];
