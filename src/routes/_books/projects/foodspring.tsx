import { createFileRoute } from '@tanstack/react-router';
import { BookTemplate } from '@/components/project/BookTemplate';

import { 식봄 } from '@/data/프로젝트/식봄';

export const Route = createFileRoute('/_books/projects/foodspring')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <BookTemplate
      title={식봄.이름}
      cover={{
        front: 식봄.책.표지.앞,
        back: 식봄.책.표지.뒤,
      }}
      achievements={식봄.역할}
      description={식봄.소개}
    />
  );
}
