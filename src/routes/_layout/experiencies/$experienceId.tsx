import { ExperienceDetailPage } from '@/components/pages/experiencies/experienceDetail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/experiencies/$experienceId')({
  component: ExperienceDetailPage,
});
