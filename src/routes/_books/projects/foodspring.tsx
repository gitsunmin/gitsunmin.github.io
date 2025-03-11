import { createFileRoute } from '@tanstack/react-router';
import { BookTemplate } from '@/components/project/BookTemplate';

import { 식봄 } from '@/data/프로젝트/식봄';

export const Route = createFileRoute('/_books/projects/foodspring')({
  component: RouteComponent,
});

function RouteComponent() {
  return <BookTemplate 프로젝트={식봄} />;
}
