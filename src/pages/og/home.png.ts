import type { APIRoute } from 'astro';
import { generateOGImage } from '@/lib/generateOGImage';

export const GET: APIRoute = async () => {
  const png = await generateOGImage({
    title: 'Sunmin Kim',
    description: 'Frontend Engineer · 경계를 탐험하는 개발자',
    section: 'home',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
