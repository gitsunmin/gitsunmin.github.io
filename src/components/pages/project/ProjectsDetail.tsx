import { Default404 } from '@/components/Default404';
import { BookTemplate } from '@/components/project/BookTemplate';
import { PROJECT_LIST } from '@/data/projects';
import { PROJECT_BOROTER } from '@/data/projects/boronter';
import { useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { match, P } from 'ts-pattern';

const Contetnt = () => {
  const { projectId } = useParams({ from: '/_layout/projects/$projectId' });
  const project = PROJECT_LIST.find((project) => project.id === projectId);

  return match(project)
    .with(P.nonNullable, () => <BookTemplate project={PROJECT_BOROTER} />)
    .otherwise(() => <Default404 />);
};

export const ProjectDetailPage = () => {
  return (
    <Suspense>
      <Contetnt />
    </Suspense>
  );
};
