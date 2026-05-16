import type { SkillId, SkillMap } from '@/data/skills';

type Props = {
  skill: SkillMap[SkillId];
};
export const Skill = ({ skill }: Props) => {
  return (
    <div className="max-w-12 lg:max-w-16 flex flex-col gap-y-2">
      <div className="peer">
        <img
          src={skill.iconUrl}
          alt={skill.name}
          className="w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="peer-hover:flex peer-hover:visible invisible justify-center text-sm text-center">
        {skill.name}
      </div>
    </div>
  );
};
