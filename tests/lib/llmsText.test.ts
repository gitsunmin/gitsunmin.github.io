import { describe, expect, it } from 'vitest';
import { buildLlmsFullTxt, buildLlmsTxt, cleanMdx } from '../../src/lib/llmsText';
import type { WorkDigest } from '../../src/lib/workBriefs';

const SITE = 'https://gitsunmin.github.io';

const DIGEST: WorkDigest = {
  id: 'sikbom',
  title: '식봄',
  category: 'service',
  tldr: '한 줄 소개.',
  range: '2024.01 ~ 2025.12',
  techs: ['React'],
  href: '/work/sikbom/',
  briefs: [
    {
      id: 'sikbom#느린-장바구니',
      workId: 'sikbom',
      workTitle: '식봄',
      chapter: '식봄 웹',
      kind: 'case',
      label: '문제 1',
      title: '느린 장바구니',
      problem: '느림',
      decision: '분리',
      result: '빨라짐',
      tags: ['observability'],
      featured: true,
      techs: ['React'],
      slug: '느린-장바구니',
      href: '/work/sikbom/#느린-장바구니',
    },
  ],
};

describe('cleanMdx', () => {
  const body = [
    "import Story from './Story';",
    '',
    '<div data-print-hide>',
    '  <Story client:load />',
    '</div>',
    '',
    '## 배경',
    '{/* works-guard-disable-next-line scale-metric */}',
    '[다른 작업](/work/marketbom-pro) 참고.',
    '',
    '---',
    '',
    '```ts',
    '## 코드 안의 헤딩은 그대로',
    '```',
    '<details>',
    '<summary>참고 — 기술 선택</summary>',
    '</details>',
  ].join('\n');

  it('import·JSX·주석·구분선을 걷어 내고 헤딩을 내린다', () => {
    expect(cleanMdx(body, SITE, 1)).toBe(
      ['### 배경', '[다른 작업](https://gitsunmin.github.io/work/marketbom-pro) 참고.', '', '```ts', '## 코드 안의 헤딩은 그대로', '```', '**참고 — 기술 선택**'].join('\n'),
    );
  });
});

describe('buildLlmsTxt', () => {
  const text = buildLlmsTxt(SITE, [DIGEST]);

  it('프로젝트 한 줄과 케이스 요약을 절대 주소로 싣는다', () => {
    expect(text).toContain('## 식봄 (2024.01 ~ 2025.12)');
    expect(text).toContain('- [발표 자료](https://gitsunmin.github.io/work/sikbom/)');
    expect(text).toContain(
      '- [식봄 웹 · 문제 1](https://gitsunmin.github.io/work/sikbom/#%EB%8A%90%EB%A6%B0-%EC%9E%A5%EB%B0%94%EA%B5%AC%EB%8B%88): 느림 → 분리 → 빨라짐 (성능 · 모니터링)',
    );
  });

  it('추측하지 말라는 안내와 전문 링크를 둔다', () => {
    expect(text).toContain('추정하지 말아 주세요');
    expect(text).toContain('https://gitsunmin.github.io/llms-full.txt');
  });
});

describe('buildLlmsFullTxt', () => {
  it('프로젝트 아래에 장을 잇고 장 본문 헤딩을 두 단계 내린다', () => {
    const text = buildLlmsFullTxt(SITE, [
      { digest: DIGEST, body: '## 배경\n\n소개.', chapters: [{ name: '식봄 웹', body: '## 문제 1. 느린 장바구니' }] },
    ]);
    expect(text).toContain('## 식봄\n\n기간: 2024.01 ~ 2025.12 · 발표 자료: https://gitsunmin.github.io/work/sikbom/');
    expect(text).toContain('### 배경\n\n소개.');
    expect(text).toContain('### 식봄 웹\n\n#### 문제 1. 느린 장바구니');
  });
});
