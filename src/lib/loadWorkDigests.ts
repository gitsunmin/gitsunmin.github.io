/**
 * 빌드 타임에 works 요약을 모은다 — /works 페이지, llms.txt가 부른다.
 *
 * 순서와 공개 범위는 search-index.json과 같다: data/works.ts의 순서대로, draft는 빼고,
 * 최상위 문서 뒤에 장(서브 레포)을 이어 붙인다.
 */
import { type CollectionEntry, getCollection, render } from 'astro:content';
import { Works } from '@/data/works';
import { type BriefSource, resolveBriefs, type WorkDigest, workHref } from '@/lib/workBriefs';

export async function loadWorkDigests(): Promise<WorkDigest[]> {
  const entries = await getCollection('works', ({ data }: CollectionEntry<'works'>) => !data.draft);
  const byId = new Map<string, CollectionEntry<'works'>>(
    entries.map((e: CollectionEntry<'works'>) => [e.id.replace(/\.mdx$/, ''), e]),
  );

  const briefsOf = async (entry: CollectionEntry<'works'> | undefined, doc: { workId: string; workTitle: string; chapter?: string; techs: string[] }) => {
    if (!entry?.data.briefs?.length) return [];
    const { headings } = await render(entry);
    return resolveBriefs({ ...doc, briefs: entry.data.briefs as BriefSource[], body: entry.body ?? '', headings });
  };

  const digests: WorkDigest[] = [];
  for (const work of Works) {
    if (work.isDraft) continue;
    const doc = { workId: work.id, workTitle: work.title };

    const briefs = await briefsOf(byId.get(work.id), { ...doc, techs: work.techs });
    for (const repo of work.subRepos ?? []) {
      briefs.push(...(await briefsOf(byId.get(`${work.id}/${repo.slug}`), { ...doc, chapter: repo.name, techs: repo.techs })));
    }

    digests.push({
      id: work.id,
      title: work.title,
      icon: work.icon,
      category: work.category,
      tldr: work.tldr,
      range: work.range,
      techs: work.techs,
      href: workHref(work.id),
      briefs,
    });
  }
  return digests;
}
