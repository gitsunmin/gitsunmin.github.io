import { Article_경력 } from '@/components/Article_경력'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/careers')({
  component: () => <Article_경력 />,
})
