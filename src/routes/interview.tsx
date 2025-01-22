import { Article_인터뷰 } from '@/components/Article_인터뷰'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/interview')({
  component: () => <Article_인터뷰 />,
  errorComponent: undefined,
  notFoundComponent: undefined,
  pendingComponent: undefined,
})
