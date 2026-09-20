/**
 * MDX 본문을 검색 레코드로 자르는 순수 함수들. 빌드 타임 엔드포인트(pages/works/search-index.json.ts)가
 * 부르고, 테스트는 여기만 본다.
 *
 * 슬라이드 경계는 rehype-work-sections의 sliceIntoSlides와 같다 — h2, h3, `---`, `{/* slide *\/}`.
 * 제목 사슬(`문제 1 · 제목 · 상황`)도 같은 규칙으로 만들어야 목차·위치 표시줄과 검색 결과가
 * 같은 이름을 부른다.
 */
import { caseSlug } from '@/lib/rehype-work-sections.mjs';
import type { SearchRecord } from '@/lib/workSearch';

export type Heading = { depth: number; slug: string; text: string };

const CASE_HEADING = /^문제\s*(\d+)\.\s*/;
const SEPARATOR = ' · ';

/** 마크다운·MDX 표기를 걷어 내고 평문만 남긴다. 검색과 스니펫에 쓴다. */
export function plainText(markdown: string): string {
  return (
    markdown
      // JSX 주석 `{/* … */}`
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
      // import 문
      .replace(/^import\s.*$/gm, ' ')
      // 코드 펜스 표시는 지우되 안의 코드는 남긴다(라이브러리 이름이 코드에만 있는 글이 있다).
      .replace(/^```.*$/gm, ' ')
      // JSX·HTML 태그
      .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
      // 이미지·링크 — 이미지는 대체 텍스트, 링크는 글자만
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 강조·코드 표시
      .replace(/(\*\*|__|`|~~)/g, '')
      .replace(/(^|\s)[*_](?=\S)/g, '$1')
      .replace(/(?<=\S)[*_](?=\s|$)/g, '')
      // 헤딩 표시
      .replace(/^#{1,6}\s+/gm, '')
      // 표 구분선 `|:---|`
      .replace(/^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/gm, ' ')
      // 표의 세로줄, 인용 부호, 목록 머리표
      .replace(/\|/g, ' ')
      .replace(/^\s*>\s?/gm, '')
      .replace(/^\s*([-*]|\d+\.)\s+/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

type Slide = { title: string; slug?: string; body: string[] };

const isSlideBreak = (line: string) => /^\{\/\*\s*slide\s*\*\/\}\s*$/.test(line.trim());
const isRule = (line: string) => /^---\s*$/.test(line);

/**
 * 본문을 슬라이드로 자른다. 헤딩의 slug는 `headings`(Astro render가 준 목록)를 등장 순서대로
 * 소비해서 붙인다 — 슬러그 규칙을 여기서 다시 구현하지 않기 위해서다.
 * 케이스 h2의 `문제-N-` 접두사는 rehype와 같은 규칙으로 뗀다.
 */
export function sliceSlides(body: string, headings: Heading[]): Slide[] {
  const lines = body.split('\n');
  const slides: Slide[] = [];
  let current: Slide | null = null;
  let chapter = '';
  let inFence = false;
  const pendingHeadings = headings.filter((h) => h.depth === 2 || h.depth === 3);
  const usedIds = new Set<string>();

  const open = (title: string, slug?: string) => {
    current = { title, slug, body: [] };
    slides.push(current);
  };

  // rehype는 <details> 블록을 노드 하나로 보므로 안쪽 h3에서 슬라이드를 나누지 않는다.
  // 여기서도 블록 전체를 <summary> 이름의 한 장으로 다룬다.
  let inDetails = false;

  for (const line of lines) {
    if (/^```/.test(line)) inFence = !inFence;

    if (!inFence && /^<details\b/.test(line)) {
      inDetails = true;
      open('');
      continue;
    }
    if (!inFence && inDetails) {
      const summary = line.match(/^<summary>(.*)<\/summary>/);
      if (summary) slides[slides.length - 1].title = plainText(summary[1]);
      if (/^<\/details>/.test(line)) {
        inDetails = false;
        current = null;
        continue;
      }
      // 안쪽 헤딩의 slug는 소비만 하고 장을 나누지 않는다.
      if (/^(##|###)\s+/.test(line)) pendingHeadings.shift();
      slides[slides.length - 1].body.push(line);
      continue;
    }

    if (!inFence) {
      if (isRule(line) || isSlideBreak(line)) {
        current = null;
        continue;
      }

      const heading = line.match(/^(##|###)\s+(.*)$/);
      if (heading) {
        const depth = heading[1].length;
        const raw = heading[2].trim();
        const next = pendingHeadings.shift();
        let slug = next?.slug;

        if (depth === 2) {
          const matched = raw.match(CASE_HEADING);
          const title = matched ? raw.slice(matched[0].length) : raw;
          chapter = matched ? `문제 ${matched[1]}${SEPARATOR}${title}` : title;
          if (matched && slug) slug = caseSlug(slug, usedIds);
          open(chapter, slug);
        } else {
          open(chapter ? `${chapter}${SEPARATOR}${raw}` : raw, slug);
        }
        continue;
      }
    }

    if (line.trim() === '' && current === null) continue;
    if (current === null) open('');
    slides[slides.length - 1].body.push(line);
  }

  // 제목만 있는 장(케이스 표제)도 검색에는 남긴다 — 제목이 곧 내용이고 딥링크의 목적지다.
  // 제목도 본문도 없는 장(Story 껍데기)만 거른다.
  return slides.filter((slide) => slide.title !== '' || plainText(slide.body.join('\n')) !== '');
}

/** 슬라이드 본문은 이만큼만 담는다. 스니펫에 쓰기엔 충분하고 인덱스는 작게 유지된다. */
const MAX_TEXT = 700;

type DocInput = {
  workId: string;
  workTitle: string;
  chapter?: string;
  body: string;
  headings: Heading[];
};

/** 문서 하나(최상위 또는 서브 레포)의 슬라이드 레코드. */
export function slideRecords({ workId, workTitle, chapter, body, headings }: DocInput): SearchRecord[] {
  const prefix = chapter ? `${workId}/${chapter}` : workId;
  return sliceSlides(body, headings).map((slide, i) => ({
    id: `${prefix}#${slide.slug ?? `s${i}`}`,
    kind: 'slide',
    workId,
    workTitle,
    chapter,
    title: slide.title,
    slug: slide.slug,
    text: plainText(slide.body.join('\n')).slice(0, MAX_TEXT),
  }));
}
