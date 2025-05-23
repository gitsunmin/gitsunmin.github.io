import { Skill } from '@/components/Skill';
import { type SkilId, SKILS_MAP } from '@/data/skils';

type Props = {
  list: SkilId[];
};

export const Skills = (props: Props) => {
  const { list } = props;
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {list.map((key) => (
        <Skill key={key} skill={SKILS_MAP[key]} />
      ))}
    </div>
  );
};
