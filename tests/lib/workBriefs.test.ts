import { describe, expect, it } from 'vitest';
import { type BriefSource, featuredBrief, groupByChapter, resolveBriefs, type WorkDigest } from '../../src/lib/workBriefs';
import type { Heading } from '../../src/lib/workSearchIndex';

const BODY = `
## 문제 1. 느린 장바구니

### 상황

장바구니가 느렸습니다.

---

## 문제 2. 놓친 알림

### 결과

알림이 줄었습니다.

## 주요 기능

### 검색

검색합니다.
`;

const HEADINGS: Heading[] = [
  { depth: 2, slug: '문제-1-느린-장바구니', text: '문제 1. 느린 장바구니' },
  { depth: 3, slug: '상황', text: '상황' },
  { depth: 2, slug: '문제-2-놓친-알림', text: '문제 2. 놓친 알림' },
  { depth: 3, slug: '결과', text: '결과' },
  { depth: 2, slug: '주요-기능', text: '주요 기능' },
  { depth: 3, slug: '검색', text: '검색' },
];

const brief = (ref: Partial<BriefSource>): BriefSource => ({
  problem: '문제',
  decision: '결정',
  result: '결과',
  tags: ['observability'],
  ...ref,
});

const resolve = (briefs: BriefSource[], chapter?: string) =>
  resolveBriefs({ workId: 'sikbom', workTitle: '식봄', chapter, techs: ['React'], briefs, body: BODY, headings: HEADINGS });

describe('resolveBriefs', () => {
  it('케이스 번호를 덱 앵커로 잇는다 — 문제-N- 접두사를 뗀 슬러그', () => {
    const [first, second] = resolve([brief({ case: 1 }), brief({ case: 2 })]);
    expect(first).toMatchObject({
      kind: 'case',
      label: '문제 1',
      title: '느린 장바구니',
      slug: '느린-장바구니',
      href: '/work/sikbom/#느린-장바구니',
      id: 'sikbom#느린-장바구니',
    });
    expect(second.title).toBe('놓친 알림');
  });

  it('절 제목을 h2 앵커로 잇는다', () => {
    const [found] = resolve([brief({ section: '주요 기능' })]);
    expect(found).toMatchObject({ kind: 'section', label: '주요 기능', title: '주요 기능', href: '/work/sikbom/#주요-기능' });
  });

  it('장 이름과 기술을 싣는다', () => {
    const [found] = resolve([brief({ case: 1 })], '식봄 웹');
    expect(found.chapter).toBe('식봄 웹');
    expect(found.techs).toEqual(['React']);
  });

  it('본문에 없는 케이스를 가리키면 멈춘다', () => {
    expect(() => resolve([brief({ case: 9 })])).toThrow(/문제 9/);
    expect(() => resolve([brief({ section: '없는 절' })])).toThrow(/없는 절/);
  });
});

describe('featuredBrief / groupByChapter', () => {
  const briefs = [
    ...resolve([brief({ case: 1 })], '장 A'),
    ...resolve([brief({ case: 2, featured: true })], '장 B'),
    ...resolve([brief({ section: '주요 기능' })], '장 B'),
  ];
  const digest = { briefs } as WorkDigest;

  it('featured를 고르고, 없으면 첫 요약을 쓴다', () => {
    expect(featuredBrief(digest)?.label).toBe('문제 2');
    expect(featuredBrief({ briefs: briefs.slice(0, 1) } as WorkDigest)?.label).toBe('문제 1');
    expect(featuredBrief({ briefs: [] } as unknown as WorkDigest)).toBeUndefined();
  });

  it('장 이름으로 묶되 등장 순서를 지킨다', () => {
    expect(groupByChapter(briefs).map((g) => [g.chapter, g.briefs.length])).toEqual([
      ['장 A', 1],
      ['장 B', 2],
    ]);
  });
});
