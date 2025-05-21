import { ProjectsPage } from '@/components/pages/project';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/projects/')({
  component: ProjectsPage,
});
