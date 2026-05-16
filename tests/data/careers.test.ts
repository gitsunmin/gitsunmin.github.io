import { describe, expect, it } from 'vitest';
import { Career } from '../../src/data/careers';

describe('Career 데이터', () => {
  it('모든 career 항목에 position 필드가 존재한다', () => {
    for (const career of Career) {
      expect(career.position).toBeDefined();
      expect(typeof career.position).toBe('string');
      expect(career.position.length).toBeGreaterThan(0);
    }
  });

  it('오타 필드 positoin이 존재하지 않는다', () => {
    for (const career of Career) {
      expect(career).not.toHaveProperty('positoin');
    }
  });

  it('모든 career 항목에 필수 필드가 존재한다', () => {
    const requiredFields = ['id', 'name', 'position', 'range', 'techs', 'links'] as const;
    for (const career of Career) {
      for (const field of requiredFields) {
        expect(career).toHaveProperty(field);
      }
    }
  });

  it('range 형식이 YYYY.MM ~ (YYYY.MM)? 이다', () => {
    const rangePattern = /^\d{4}\.\d{2}\s*~(\s*\d{4}\.\d{2})?$/;
    for (const career of Career) {
      expect(career.range.trim()).toMatch(rangePattern);
    }
  });

  it('techs 배열이 비어있지 않다', () => {
    for (const career of Career) {
      expect(career.techs.length).toBeGreaterThan(0);
    }
  });
});
