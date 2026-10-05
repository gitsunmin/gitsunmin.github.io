/** /works 보기 방식. 같은 작업물을 얼마나 깊게 볼지다. */
export const WORKS_VIEWS = [
  { id: 'all', label: '전체 목록' },
  { id: 'cases', label: '3분 케이스' },
  { id: 'brief', label: '30초 요약' },
] as const;

export type WorksView = (typeof WORKS_VIEWS)[number]['id'];

export const DEFAULT_VIEW: WorksView = 'brief';

export const isWorksView = (value: string | null): value is WorksView =>
  WORKS_VIEWS.some((v) => v.id === value);
