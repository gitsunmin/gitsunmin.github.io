import type { APIRoute } from 'astro';
import { Works } from '@/data/works';
import { generateOGImage } from '@/lib/generateOGImage';

export const GET: APIRoute = async () => {
  const published = Works.filter((w) => !w.isDraft);

  const png = await generateOGImage({
    title: 'Works',
    description: `${published.length}개 프로젝트 · 서비스, 라이브러리, 도구`,
    section: 'works',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
