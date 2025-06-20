import { ExperienciesPage } from '@/components/pages/experiencies';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/experiencies/')({
  component: ExperienciesPage
});
