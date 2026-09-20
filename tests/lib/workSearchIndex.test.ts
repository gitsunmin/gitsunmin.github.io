import { describe, expect, it } from 'vitest';
import { plainText, sliceSlides, slideRecords, type Heading } from '../../src/lib/workSearchIndex';

const BODY = `
import Story from '../../components/Story.tsx';

<div data-print-hide>
  <Story client:load />
</div>

## 배경

> *"인용문"*

**굵은** 글과 \`코드\`와 [링크](https://x.y)입니다.

## 문제 1. 느린 장바구니

### 상황

장바구니가 느렸습니다.

### 결과

빨라졌습니다.

---

## 문제 2. 또 다른 문제

### 상황

두 번째 상황.

{/* slide */}

이어지는 내용.

<details class="work-aux-details">
<summary>참고 — 기술 선택</summary>

### 구조

| 항목 | 값 |
|:---|:---|
| A | B |

</details>
`;

const HEADINGS: Heading[] = [
  { depth: 2, slug: '배경', text: '배경' },
  { depth: 2, slug: '문제-1-느린-장바구니', text: '문제 1. 느린 장바구니' },
  { depth: 3, slug: '상황', text: '상황' },
  { depth: 3, slug: '결과', text: '결과' },
  { depth: 2, slug: '문제-2-또-다른-문제', text: '문제 2. 또 다른 문제' },
  { depth: 3, slug: '상황-1', text: '상황' },
  { depth: 3, slug: '구조', text: '구조' },
];

describe('plainText', () => {
  it('마크다운 표기를 걷어 낸다', () => {
    expect(plainText('**굵은** 글과 `코드`와 [링크](https://x.y)입니다.')).toBe('굵은 글과 코드와 링크입니다.');
  });
  it('JSX·import·주석을 지운다', () => {
    expect(plainText("import A from 'a';\n<div data-x>\n  <A client:load />\n</div>\n{/* slide */}\n본문")).toBe('본문');
  });
  it('표 구분선과 세로줄을 지운다', () => {
    expect(plainText('| 항목 | 값 |\n|:---|:---|\n| A | B |')).toBe('항목 값 A B');
  });
});

describe('sliceSlides', () => {
  const slides = sliceSlides(BODY, HEADINGS);

  it('h2·h3·---·{/* slide */}에서 자르고 제목 사슬을 만든다', () => {
    expect(slides.map((s) => s.title)).toEqual([
      '배경',
      '문제 1 · 느린 장바구니',
      '문제 1 · 느린 장바구니 · 상황',
      '문제 1 · 느린 장바구니 · 결과',
      '문제 2 · 또 다른 문제',
      '문제 2 · 또 다른 문제 · 상황',
      '',
      '참고 — 기술 선택',
    ]);
  });

  it('케이스 h2의 slug는 문제-N- 접두사를 뗀다', () => {
    expect(slides[1].slug).toBe('느린-장바구니');
    expect(slides[4].slug).toBe('또-다른-문제');
    expect(slides[2].slug).toBe('상황');
    expect(slides[5].slug).toBe('상황-1');
  });

  it('details 블록은 안쪽 h3에서 나누지 않고 한 장이 된다', () => {
    const last = slides.at(-1)!;
    expect(last.slug).toBeUndefined();
    expect(plainText(last.body.join('\n'))).toContain('구조');
  });

  it('제목도 본문도 없는 Story 껍데기 장은 거른다', () => {
    expect(slides.some((s) => s.title === '' && plainText(s.body.join('\n')) === '')).toBe(false);
  });
});

describe('slideRecords', () => {
  it('딥링크와 소속 정보를 붙인 레코드를 만든다', () => {
    const records = slideRecords({ workId: 'w', workTitle: 'W', chapter: 'C', body: BODY, headings: HEADINGS });
    const situation = records.find((r) => r.slug === '상황')!;
    expect(situation).toMatchObject({
      id: 'w/C#상황',
      kind: 'slide',
      workId: 'w',
      chapter: 'C',
      title: '문제 1 · 느린 장바구니 · 상황',
      text: '장바구니가 느렸습니다.',
    });
  });
});
