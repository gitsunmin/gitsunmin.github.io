import { Default404 } from '@/components/Default404';
import { ExperienceTemplate } from '@/components/experiencies/ExperienceTemplate';
import { EXPERIENCE_LIST } from '@/data/experiencies';
import { useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { match, P } from 'ts-pattern';

const Contetnt = () => {
  const { experienceId } = useParams({
    from: '/_layout/experiencies/$experienceId',
  });
  const experience = EXPERIENCE_LIST.find(
    (experience) => experience.id === experienceId,
  );

  return match(experience)
    .with(P.nonNullable, (experience) => (
      <ExperienceTemplate experience={experience} />
    ))
    .otherwise(() => <Default404 />);
};

export const ExperienceDetailPage = () => {
  return (
    <Suspense>
      <Contetnt />
    </Suspense>
  );
};
