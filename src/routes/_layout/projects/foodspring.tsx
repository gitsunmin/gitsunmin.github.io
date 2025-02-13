import { createFileRoute } from '@tanstack/react-router';
import 식봄_프로젝트 from '@/docs/projects/식봄.mdx';

export const Route = createFileRoute('/_layout/projects/foodspring')({
  component: RouteComponent,
});

function RouteComponent() {
  return <식봄_프로젝트 />;
}
