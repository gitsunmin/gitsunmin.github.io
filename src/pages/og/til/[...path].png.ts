import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { generateOGImage } from '@/lib/generateOGImage';

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection('til');
  return entries.map((entry: CollectionEntry<'til'>) => ({
    params: { path: entry.id.replace(/\.mdx$/, '') },
    props: entry,
  }));
};

export const GET: APIRoute = async ({ props, params }) => {
  const entry = props as CollectionEntry<'til'>;
  const path = params.path as string;

  const category = path.split('/')[0];
  const title =
    entry.data.title || path.split('/').pop()?.replace(/-/g, ' ') || 'TIL';

  const png = await generateOGImage({
    title,
    description: entry.data.description || entry.data.summary,
    tags: entry.data.tags,
    section: 'til',
    subtitle: category,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
