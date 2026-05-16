import { describe, expect, it } from 'vitest';
import { getTechColor } from '../../src/lib/techColors';

describe('getTechColor', () => {
  it('TypeScript 색상을 반환한다', () => {
    expect(getTechColor('TypeScript')).toBe('#3178c6');
  });

  it('React 색상을 반환한다', () => {
    expect(getTechColor('React')).toBe('#149eca');
  });

  it('Tailwind CSS 색상을 반환한다', () => {
    expect(getTechColor('Tailwind CSS')).toBe('#06b6d4');
  });

  it('등록되지 않은 기술은 기본 색상(#8b949e)을 반환한다', () => {
    expect(getTechColor('UnknownTech')).toBe('#8b949e');
  });

  it('빈 문자열은 기본 색상을 반환한다', () => {
    expect(getTechColor('')).toBe('#8b949e');
  });

  it('대소문자가 정확히 일치해야 색상을 반환한다', () => {
    expect(getTechColor('typescript')).toBe('#8b949e');
    expect(getTechColor('TYPESCRIPT')).toBe('#8b949e');
  });
});
