import { Skill } from '@/components/Skill';
import { 기술_key, Map_기술 } from '@/data/기술';

type Props = {
  list: 기술_key[];
};

export const Skills = (props: Props) => {
  const { list } = props;
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {list.map((key) => (
        <Skill key={key} skill={Map_기술[key]} />
      ))}
    </div>
  );
};
