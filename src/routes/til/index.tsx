import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { Readme } from '@/components/til/Readme';

export const Route = createFileRoute('/til/')({
  component: RouteComponent,
  loader: async () => {
    const content = await import('/modules/til/README.md?raw').then(
      (res) => res.default
    );

    return {
      content,
    };
  },
});

function RouteComponent() {
  const { content } = getRouteApi('/til/').useLoaderData();

  return (
    <main className="mx-auto flex justify-center">
      <section className="">
        <Readme content={content} />
      </section>
    </main>
  );
}
