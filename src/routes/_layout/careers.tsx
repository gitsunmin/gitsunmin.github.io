import { CareersPage } from '@/components/pages/Careers';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/careers')({
  component: CareersPage,
});
