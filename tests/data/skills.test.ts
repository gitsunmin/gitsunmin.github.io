import { describe, expect, it } from 'vitest';
import { SKILL_ID_LIST, SKILLS_MAP } from '../../src/data/skills';

describe('skills 데이터', () => {
  it('SKILL_ID_LIST의 모든 id가 SKILLS_MAP에 존재한다', () => {
    for (const id of SKILL_ID_LIST) {
      expect(SKILLS_MAP).toHaveProperty(id);
    }
  });

  it('SKILLS_MAP의 모든 항목에 name과 iconUrl이 있다', () => {
    for (const id of SKILL_ID_LIST) {
      const skill = SKILLS_MAP[id];
      expect(skill.name).toBeTruthy();
      expect(skill.iconUrl).toBeTruthy();
    }
  });

  it('iconUrl이 https://로 시작한다', () => {
    for (const id of SKILL_ID_LIST) {
      expect(SKILLS_MAP[id].iconUrl).toMatch(/^https:\/\//);
    }
  });

  it('오타 네이밍(SKIL_ID_LIST)이 export되지 않는다', async () => {
    const module = await import('../../src/data/skills');
    expect(module).not.toHaveProperty('SKIL_ID_LIST');
    expect(module).not.toHaveProperty('SkilId');
    expect(module).not.toHaveProperty('SKILS_MAP');
  });
});
