import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LocalStorage } from '../../src/utils/LocalStorage';

describe('LocalStorage', () => {
  let originalWarn: typeof console.warn;

  beforeEach(() => {
    localStorage.clear();
    originalWarn = console.warn;
  });

  afterEach(() => {
    console.warn = originalWarn;
  });

  describe('get', () => {
    it('저장된 값을 반환한다', () => {
      localStorage.setItem('darkMode', 'true');
      expect(LocalStorage.get('darkMode')).toBe('true');
    });

    it('값이 없으면 null을 반환한다', () => {
      expect(LocalStorage.get('darkMode')).toBeNull();
    });
  });

  describe('set', () => {
    it('유효한 값을 저장한다', () => {
      LocalStorage.set('darkMode', 'true');
      expect(localStorage.getItem('darkMode')).toBe('true');
    });

    it('false 값도 저장한다', () => {
      LocalStorage.set('darkMode', 'false');
      expect(localStorage.getItem('darkMode')).toBe('false');
    });

    it('유효하지 않은 값은 저장하지 않고 경고를 출력한다', () => {
      let warnCalled = false;
      console.warn = () => { warnCalled = true; };
      // @ts-expect-error 유효하지 않은 값 테스트
      LocalStorage.set('darkMode', 'invalid');
      expect(localStorage.getItem('darkMode')).toBeNull();
      expect(warnCalled).toBe(true);
    });
  });
});
