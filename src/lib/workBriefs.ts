/**
 * works 요약(brief)을 화면이 쓰는 형태로 엮는 순수 함수들.
 *
 * 요약 문장은 MDX 프론트매터(briefs)에, 프로젝트 한 줄(tldr)은 data/works.ts에 있다.
 * 여기서는 그 둘을 합치고, 요약마다 덱 딥링크를 붙인다. 딥링크는 검색 인덱스와 같은
 * sliceSlides로 구한다 — 같은 규칙으로 만들어야 덱 앵커와 이름이 어긋나지 않는다.
 *
 * /works의 30초·3분 보기, 직무 렌즈, llms.txt, 덱의 케이스 목록이 모두 이 결과를 읽는다.
 */
import type { CompetencyId } from '@/data/competencies';
import type { WorkCategory } from '@/data/works';
import { type Heading, sliceSlides } from '@/lib/workSearchIndex';

const SEPARATOR = ' · ';

/** 프론트매터에 적힌 그대로의 요약. */
export type BriefSource = {
  case?: number;
  section?: string;
  problem: string;
  decision: string;
  result: string;
  tags: CompetencyId[];
  featured?: boolean;
};

export type WorkBrief = {
  /** `workId#slug` — 렌즈 결과·목록의 key. */
  id: string;
  workId: string;
  workTitle: string;
  /** 서브 레포(장) 이름. 최상위 문서의 요약에는 없다. */
  chapter?: string;
  /** 케이스(`## 문제 N.`)를 가리키는지, 사이드 프로젝트의 절을 가리키는지. */
  kind: 'case' | 'section';
  /** `문제 1` 또는 절 제목. */
  label: string;
  /** 케이스 제목(`문제 N.`을 뗀 h2) 또는 절 제목. */
  title: string;
  problem: string;
  decision: string;
  result: string;
  tags: CompetencyId[];
  featured: boolean;
  /** 이 요약이 속한 장(없으면 프로젝트)의 기술. 렌즈가 JD의 기술과 맞춰 본다. */
  techs: string[];
  /** 덱 안의 앵커(`#` 없이). */
  slug: string;
  /** 덱 딥링크. */
  href: string;
};

export type WorkDigest = {
  id: string;
  title: string;
  icon?: string;
  category: WorkCategory;
  tldr: string;
  range: string;
  techs: string[];
  href: string;
  briefs: WorkBrief[];
};

export const workHref = (workId: string) => `/work/${workId}/`;

type DocInput = {
  workId: string;
  workTitle: string;
  chapter?: string;
  techs: string[];
  briefs: BriefSource[];
  body: string;
  headings: Heading[];
};

/**
 * 문서 하나(최상위 또는 장)의 요약에 딥링크를 붙인다.
 * 가리키는 케이스·절이 본문에 없으면 빌드를 멈춘다 — check:works가 먼저 잡지만,
 * 여기서도 조용히 링크 없는 요약을 만들지 않는다.
 */
export function resolveBriefs({ workId, workTitle, chapter, techs, briefs, body, headings }: DocInput): WorkBrief[] {
  const slides = sliceSlides(body, headings);

  return briefs.map((brief) => {
    const prefix = brief.case !== undefined ? `문제 ${brief.case}${SEPARATOR}` : null;
    const slide = slides.find((s) =>
      prefix ? s.title.startsWith(prefix) : s.title === brief.section,
    );
    if (!slide?.slug) {
      throw new Error(
        `${workId}${chapter ? ` / ${chapter}` : ''}: 요약이 가리키는 ${prefix ?? brief.section}을(를) 본문에서 찾지 못했습니다.`,
      );
    }

    // 케이스 슬라이드 제목은 `문제 N · 제목`이고, 그 아래 h3는 `문제 N · 제목 · 상황`처럼 이어진다.
    const title = prefix ? slide.title.slice(prefix.length).split(SEPARATOR)[0] : slide.title;

    return {
      id: `${workId}#${slide.slug}`,
      workId,
      workTitle,
      chapter,
      kind: brief.case !== undefined ? 'case' : 'section',
      label: brief.case !== undefined ? `문제 ${brief.case}` : slide.title,
      title,
      problem: brief.problem,
      decision: brief.decision,
      result: brief.result,
      tags: brief.tags,
      featured: brief.featured ?? false,
      techs,
      slug: slide.slug,
      href: `${workHref(workId)}#${slide.slug}`,
    };
  });
}

/** 30초 보기의 대표 요약. 표시한 것이 없으면 첫 요약을 쓴다. */
export const featuredBrief = (digest: WorkDigest): WorkBrief | undefined =>
  digest.briefs.find((b) => b.featured) ?? digest.briefs[0];

/** 요약이 가리키는 위치. `마켓봄 웹 · 문제 1` */
export const briefLocation = (brief: WorkBrief) => [brief.chapter, brief.label].filter(Boolean).join(' · ');

/** 장 이름으로 묶는다. 최상위 문서의 요약은 이름 없는 묶음 하나가 된다. 순서는 등장 순. */
export function groupByChapter(briefs: WorkBrief[]): { chapter?: string; briefs: WorkBrief[] }[] {
  const groups: { chapter?: string; briefs: WorkBrief[] }[] = [];
  for (const brief of briefs) {
    const last = groups[groups.length - 1];
    if (last && last.chapter === brief.chapter) last.briefs.push(brief);
    else groups.push({ chapter: brief.chapter, briefs: [brief] });
  }
  return groups;
}
