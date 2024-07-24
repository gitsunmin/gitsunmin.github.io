import { Article_경력 } from '@/components/Article_경력';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/careers')({
  component: () => <Article_경력 />,
});
