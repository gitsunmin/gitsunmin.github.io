import { createFileRoute } from '@tanstack/react-router';
import { ProjectsPage } from '@/components/pages/Projects';

export const Route = createFileRoute('/_layout/projects')({
  component: ProjectsPage,
});
