import type { APIRoute, GetStaticPaths } from 'astro';
import { WORK_IDS, Works } from '@/data/works';
import { generateOGImage } from '@/lib/generateOGImage';

export const getStaticPaths: GetStaticPaths = async () => {
  return WORK_IDS.map((id) => ({ params: { id } }));
};

export const GET: APIRoute = async ({ params }) => {
  const work = Works.find((w) => w.id === params.id);

  const png = await generateOGImage({
    title: work?.title ?? params.id ?? 'Work',
    description: work?.description?.split('\n')[0],
    tags: work?.techs?.slice(0, 3),
    section: 'works',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
