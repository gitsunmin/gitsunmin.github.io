import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/til')({
  component: () => <div>Hello /til!</div>,
});
