import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { generateOGImage } from '@/lib/generateOGImage';

export const GET: APIRoute = async () => {
  const entries = await getCollection('til');
  const categories = new Set(entries.map((e: { id: string }) => e.id.split('/')[0]));

  const png = await generateOGImage({
    title: 'Today I Learned',
    description: `${categories.size}개 카테고리 · ${entries.length}개 항목`,
    section: 'til',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
