import { 기술, 기술_key } from '@/data/기술';

type Props = {
  skill: 기술[기술_key];
};
export const Skill = ({ skill }: Props) => {
  return (
    <div className="max-w-12 lg:max-w-16 flex flex-col gap-y-2">
      <div className="peer">
        <img
          src={skill.아이콘_링크}
          alt={skill.이름}
          className="w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="peer-hover:flex peer-hover:visible invisible justify-center text-sm text-center">
        {skill.이름}
      </div>
    </div>
  );
};
