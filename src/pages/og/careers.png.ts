import type { APIRoute } from 'astro';
import { generateOGImage } from '@/lib/generateOGImage';

export const GET: APIRoute = async () => {
  const png = await generateOGImage({
    title: 'Careers',
    description: '프론트엔드 엔지니어 · 경력 및 이력',
    section: 'careers',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
