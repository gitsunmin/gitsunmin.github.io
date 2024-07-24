import { Section_소개 } from '@/components/Section_소개';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/interview')({
  component: () => (
    <div>
      <Section_소개 />
    </div>
  ),
});
