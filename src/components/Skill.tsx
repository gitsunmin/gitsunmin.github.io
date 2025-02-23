import { 기술, 기술_key } from '@/data/기술';

type Props = {
  skill: 기술[기술_key];
};
export const Skill = ({ skill }: Props) => {
  return (
    <div className="max-w-12 lg:max-w-16 flex flex-col gap-y-2">
      <div>
        <img
          src={skill.아이콘_링크}
          alt={skill.이름}
          className="w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="text-center text-sm">{skill.이름}</div>
    </div>
  );
};
