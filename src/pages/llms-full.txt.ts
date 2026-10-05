/**
 * /llms-full.txt — works 문서 전문을 마크다운 한 파일로.
 *
 * 목차(/llms.txt)만으로 답하기 어려운 질문("이 사람은 금액 계산 문제를 어떻게 다뤘나")에
 * AI가 원문을 근거로 답하게 한다. 공개 범위는 /works와 같다 — draft는 빼고, 이력서는 넣지 않는다.
 */
import type { APIContext } from 'astro';
import { type CollectionEntry, getCollection } from 'astro:content';
import { Works } from '@/data/works';
import { loadWorkDigests } from '@/lib/loadWorkDigests';
import { buildLlmsFullTxt, type FullDoc } from '@/lib/llmsText';

export async function GET({ site }: APIContext) {
  const entries = await getCollection('works', ({ data }: CollectionEntry<'works'>) => !data.draft);
  const bodyOf = (id: string) => entries.find((e: CollectionEntry<'works'>) => e.id.replace(/\.mdx$/, '') === id)?.body ?? '';

  const docs: FullDoc[] = (await loadWorkDigests()).map((digest) => {
    const work = Works.find((w) => w.id === digest.id);
    return {
      digest,
      body: bodyOf(digest.id),
      chapters: (work?.subRepos ?? []).map((repo) => ({ name: repo.name, body: bodyOf(`${digest.id}/${repo.slug}`) })),
    };
  });

  const text = buildLlmsFullTxt(site?.toString() ?? 'https://gitsunmin.github.io', docs);
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
