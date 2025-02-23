import { 프로젝트들 } from '@/data/프로젝트';
import { Skill } from '../Skill';
import { Map_기술 } from '@/data/기술';

type Props = {
  id: (typeof 프로젝트들)[number]['id'];
};

export const SkillsOfProject = (props: Props) => {
  const { id } = props;
  const project = 프로젝트들.find((project) => project.id === id);
  if (!project) return null;
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {project.기술들.map((name) => (
        <Skill skill={Map_기술[name]} />
      ))}
    </div>
  );
};
