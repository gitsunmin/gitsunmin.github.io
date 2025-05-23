import { Default404 } from '@/components/Default404';
import { BookTemplate } from '@/components/experiencies/BookTemplate';
import { EXPERIENCE_LIST } from '@/data/experiencies';
import { EXPERIENCE_BOROTER } from '@/data/experiencies/boronter';
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
    .with(P.nonNullable, () => <BookTemplate experience={EXPERIENCE_BOROTER} />)
    .otherwise(() => <Default404 />);
};

export const ExperienceDetailPage = () => {
  return (
    <Suspense>
      <Contetnt />
    </Suspense>
  );
};
