import { createLazyFileRoute } from '@tanstack/react-router';
import { Section_소개 } from '@/components/Section_소개';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <h1 className="text-4xl font-bold text-center">김선민</h1>
      <Section_소개 />
    </div>
  );
}
