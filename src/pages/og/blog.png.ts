import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { generateOGImage } from '@/lib/generateOGImage';

export const GET: APIRoute = async () => {
  const posts = await getCollection(
    'blog',
    ({ data }: CollectionEntry<'blog'>) => !data.draft,
  );

  const png = await generateOGImage({
    title: 'Blog',
    description: `${posts.length}편의 글 · 개발, 경험, 그리고 생각`,
    section: 'blog',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
