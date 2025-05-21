import { ProjectDetailPage } from '@/components/pages/project/ProjectsDetail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/projects/$projectId')({
  component: ProjectDetailPage,
});
