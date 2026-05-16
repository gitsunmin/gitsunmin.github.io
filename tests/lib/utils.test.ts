import { describe, expect, it } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('cn', () => {
  it('단일 클래스를 그대로 반환한다', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('여러 클래스를 공백으로 합친다', () => {
    expect(cn('text-red-500', 'bg-blue-200')).toBe('text-red-500 bg-blue-200');
  });

  it('falsy 값을 무시한다', () => {
    expect(cn('text-red-500', false, null, undefined, '')).toBe('text-red-500');
  });

  it('조건부 클래스를 처리한다', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
    expect(cn('base', !isActive && 'active')).toBe('base');
  });

  it('Tailwind 충돌 클래스를 마지막 것으로 병합한다', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('padding 충돌을 마지막 것으로 병합한다', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('객체 형태의 조건부 클래스를 처리한다', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500');
  });

  it('빈 호출은 빈 문자열을 반환한다', () => {
    expect(cn()).toBe('');
  });
});
