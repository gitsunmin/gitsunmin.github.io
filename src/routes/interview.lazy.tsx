import { Article_인터뷰 } from '@/components/Article_인터뷰';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/interview')({
  component: () => <Article_인터뷰 />,
});
