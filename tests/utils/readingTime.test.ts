import { describe, expect, it } from 'vitest';
import { calcReadingTime } from '../../src/utils/readingTime';

describe('calcReadingTime', () => {
  it('빈 문자열은 최소 1분을 반환한다', () => {
    expect(calcReadingTime('')).toBe(1);
  });

  it('500자 미만 텍스트는 1분을 반환한다', () => {
    const text = '가'.repeat(300);
    expect(calcReadingTime(text)).toBe(1);
  });

  it('500자 텍스트는 1분을 반환한다', () => {
    const text = '가'.repeat(500);
    expect(calcReadingTime(text)).toBe(1);
  });

  it('501자 텍스트는 2분을 반환한다', () => {
    const text = '가'.repeat(501);
    expect(calcReadingTime(text)).toBe(2);
  });

  it('1000자 텍스트는 2분을 반환한다', () => {
    const text = '가'.repeat(1000);
    expect(calcReadingTime(text)).toBe(2);
  });

  it('공백은 글자 수에서 제외한다', () => {
    const textWithSpaces = '가 '.repeat(500); // 500자지만 공백 포함 → 실제 500자
    const textNoSpaces = '가'.repeat(500);
    expect(calcReadingTime(textWithSpaces)).toBe(calcReadingTime(textNoSpaces));
  });

  it('코드 블록(```)을 글자 수에서 제외한다', () => {
    const code = '```\n' + 'a'.repeat(2000) + '\n```';
    expect(calcReadingTime(code)).toBe(1);
  });

  it('인라인 코드(`)를 글자 수에서 제외한다', () => {
    const inline = '`' + 'a'.repeat(2000) + '`';
    expect(calcReadingTime(inline)).toBe(1);
  });

  it('frontmatter(---)를 글자 수에서 제외한다', () => {
    const frontmatter = '---\ntitle: test\n---\n' + '가'.repeat(500);
    expect(calcReadingTime(frontmatter)).toBe(1);
  });
});
