/**
 * works 검색 인덱스 — /works/search-index.json
 *
 * 빌드 타임에 한 번 만들어지는 정적 JSON이다. 검색 오버레이가 처음 열릴 때 받아 두고
 * 브라우저 안에서 매칭한다(lib/workSearch.ts). 문서가 스무 개 남짓이라 100KB가 안 된다.
 *
 * 레코드 세 종류:
 *   work    — 프로젝트 자체(제목·설명·기술·기간)
 *   chapter — 서브 레포(이름·설명·기술·담당 범위)
 *   slide   — 덱 슬라이드 한 장(제목 사슬·본문·딥링크)
 */
import { type CollectionEntry, getCollection, render } from 'astro:content';
import { Career } from '@/data/careers';
import { Works } from '@/data/works';
import type { SearchRecord } from '@/lib/workSearch';
import { slideRecords } from '@/lib/workSearchIndex';

export async function GET() {
  const entries = await getCollection('works', ({ data }: CollectionEntry<'works'>) => !data.draft);
  const byId = new Map<string, CollectionEntry<'works'>>(
    entries.map((e: CollectionEntry<'works'>) => [e.id.replace(/\.mdx$/, ''), e]),
  );
  const companyOf = (careerId?: string) => Career.find((c) => c.id === careerId)?.name.replace(/^\(주\)\s*/, '');

  const records: SearchRecord[] = [];

  for (const work of Works) {
    if (work.isDraft) continue;
    const entry = byId.get(work.id);
    const company = companyOf(work.careerId);

    records.push({
      id: work.id,
      kind: 'work',
      workId: work.id,
      workTitle: work.title,
      title: work.title,
      // 프로젝트 레코드의 내용(설명·담당 범위)은 표지가 아니라 소개 슬라이드에 있다.
      slug: 'intro',
      text: [work.description, work.range, company].filter(Boolean).join(' '),
      techs: work.techs,
      contributions: entry?.data.contributions,
    });

    if (entry) {
      const { headings } = await render(entry);
      records.push(
        ...slideRecords({ workId: work.id, workTitle: work.title, body: entry.body ?? '', headings }),
      );
    }

    for (const repo of work.subRepos ?? []) {
      const subEntry = byId.get(`${work.id}/${repo.slug}`);
      records.push({
        id: `${work.id}/${repo.slug}`,
        kind: 'chapter',
        workId: work.id,
        workTitle: work.title,
        chapter: repo.name,
        title: repo.name,
        slug: repo.slug,
        text: [repo.description, subEntry?.data.summary].filter(Boolean).join(' '),
        techs: repo.techs,
        contributions: subEntry?.data.contributions,
      });

      if (subEntry) {
        const { headings } = await render(subEntry);
        records.push(
          ...slideRecords({
            workId: work.id,
            workTitle: work.title,
            chapter: repo.name,
            body: subEntry.body ?? '',
            headings,
          }),
        );
      }
    }
  }

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
