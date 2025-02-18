import { createFileRoute } from '@tanstack/react-router'
import Project from '@/docs/projects/co-working-solution-cnaps.mdx'

export const Route = createFileRoute(
  '/_books/projects/co-working-solution-cnaps',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Project
      components={{
        h1: (props) => <h1 className="text-6xl" {...props} />,
        h2: (props) => <h2 className="text-5xl" {...props} />,
        h3: (props) => <h3 className="text-4xl" {...props} />,
        h4: (props) => <h4 className="text-3xl" {...props} />,
        h5: (props) => <h5 className="text-2xl" {...props} />,
        h6: (props) => <h6 className="text-xl" {...props} />,
      }}
    />
  )
}
