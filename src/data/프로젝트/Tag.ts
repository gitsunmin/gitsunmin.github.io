export const 태그들 = [
  '웹 서비스',
  '하이브리드앱',
  '커머스',
  '라이브러리',
] as const;

export type 태그 = (typeof 태그들)[number];
