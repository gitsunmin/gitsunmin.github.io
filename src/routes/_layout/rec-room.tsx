import { RecRoom } from '@/components/pages/RecRoom';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/rec-room')({
  component: RecRoom,
});
