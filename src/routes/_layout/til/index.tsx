import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { Readme } from '@/components/til/Readme';

export const Route = createFileRoute('/_layout/til/')({
  component: RouteComponent,
  loader: async () => {
    const content = await import('/modules/til/README.mdx?raw').then(
      (res) => res.default
    );

    return {
      content,
    };
  },
});

function RouteComponent() {
  const { content } = getRouteApi('/_layout/til/').useLoaderData();

  return (
    <article className="flex flex-col pt-8">
      <Readme content={content} />
    </article>
  );
}
