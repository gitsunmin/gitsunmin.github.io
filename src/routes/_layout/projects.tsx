import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/projects')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_layout/projects"!</div>;
}
