import { Post } from '@/components/til/Post';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
export const Route = createFileRoute('/_layout/til/$category/$slug')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { category, slug } = params;
    // 파일 목록을 가져오는 glob 설정
    const modules = import.meta.glob('/modules/til/**/*.md', {
      query: 'raw',
    }) as Record<string, () => Promise<{ default: string }>>;

    // 동적 경로로 파일 찾기
    const filePath = `/modules/til/${category}/${slug}`;

    if (!modules[filePath]) {
      throw new Error(`File not found: ${filePath}`);
    }

    // 해당 파일 로드
    const content = await modules[filePath]().then((res) => res.default);

    return {
      content,
    };
  },
});

function RouteComponent() {
  const { content } = getRouteApi(
    '/_layout/til/$category/$slug'
  ).useLoaderData();
  return (
    <main className="mx-auto flex justify-center">
      <section className="rounded-2xl px-4 w-full break-all sm:max-w-screen-md pb-10">
        <Post content={content} />
      </section>
    </main>
  );
}
