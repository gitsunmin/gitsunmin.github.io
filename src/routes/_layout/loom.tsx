import { LoomPage } from '@/components/pages/Loom';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/loom')({
  component: LoomPage
});
