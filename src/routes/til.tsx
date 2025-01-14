import { TilPage } from '@/pages/til';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/til')({
  component: TilPage,
});
