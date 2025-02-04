import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { Readme } from '@/components/til/Readme'

export const Route = createFileRoute('/_layout/til/')({
  component: RouteComponent,
  loader: async () => {
    const content = await import('/modules/til/README.md?raw').then(
      (res) => res.default,
    )

    return {
      content,
    }
  },
})

function RouteComponent() {
  const { content } = getRouteApi('/_layout/til/').useLoaderData()

  return (
    <main className="mx-auto flex justify-center">
      <section className="max-w-sm px-4 md:max-w-md lg:max-w-screen-md">
        <Readme content={content} />
      </section>
    </main>
  )
}
