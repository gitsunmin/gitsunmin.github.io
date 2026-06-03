import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { generateOGImage } from '@/lib/generateOGImage';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection(
    'blog',
    ({ data }: CollectionEntry<'blog'>) => !data.draft,
  );
  return posts.map((post: CollectionEntry<'blog'>) => ({
    params: { slug: post.id.replace(/\.mdx$/, '') },
    props: post,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const post = props as CollectionEntry<'blog'>;

  const png = await generateOGImage({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    section: 'blog',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
