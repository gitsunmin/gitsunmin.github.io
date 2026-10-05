/**
 * 직무 렌즈 — "어떤 포지션을 보고 계신가요?"에 답해 먼저 볼 케이스를 고른다.
 *
 * LLM 없이 결정적으로 동작한다. 고른 역량(칩)과 붙여 넣은 채용공고에서 찾은 역량·기술을
 * 요약(brief)의 태그·기술과 맞춰 점수를 매긴다. 결정적이라 "왜 골랐는지"를 그대로
 * 보여 줄 수 있고, 같은 링크는 언제 열어도 같은 결과를 낸다.
 *
 * 채용공고 원문은 브라우저 밖으로 나가지 않고 주소에도 남기지 않는다.
 * 주소에는 거기서 뽑은 역량·기술만 남긴다.
 */
import { COMPETENCIES, COMPETENCY_IDS, type CompetencyId } from '@/data/competencies';
import type { WorkBrief } from '@/lib/workBriefs';
import { ALIASES, normalize } from '@/lib/workSearch';

export type LensQuery = {
  competencies: CompetencyId[];
  /** 요약의 기술 표기 그대로(예: `Next.js`). */
  techs: string[];
};

export type LensHit = {
  brief: WorkBrief;
  score: number;
  matchedTags: CompetencyId[];
  matchedTechs: string[];
};

export const MAX_LENS_COMPETENCIES = 3;
export const LENS_LIMIT = 3;
/** 한 프로젝트가 결과를 독차지하지 않게 한다. */
const PER_WORK = 2;

/** 태그는 "어떤 문제를 풀었나"라 기술 일치보다 무겁다. */
const TAG_WEIGHT = 3;
const TECH_WEIGHT = 1;
const MAX_TECH_MATCHES = 3;

export const isEmptyQuery = (query: LensQuery) => query.competencies.length === 0 && query.techs.length === 0;

/** `Vue.js`와 `vue`, `Next.js`와 `next`를 같은 것으로 본다. */
const techKey = (tech: string) => normalize(tech).replace(/\.js$/, '');

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * 정규화된 본문에 용어가 있는가. 영문 용어는 단어 경계로 본다 — `ci`가 `circle` 안에서,
 * `go`가 `google` 안에서 걸리지 않게. 한글은 조사가 붙으므로 부분 문자열로 본다.
 */
function containsTerm(text: string, term: string): boolean {
  const needle = normalize(term);
  if (!/^[\x20-\x7e]+$/.test(needle)) return text.includes(needle);
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}($|[^a-z0-9])`).test(text);
}

/**
 * 채용공고에서 한글 별칭(리액트, 넥스트)을 찾는다. 검색창과 달리 공고는 긴 글이라
 * 부분 문자열로 보면 엉뚱하게 걸린다 — `웹뷰`의 `뷰`가 Vue로, `한 번`의 `번`이 Bun으로.
 * 그래서 한글 별칭은 두 글자 이상만 쓰고, 낱말 첫머리에서 시작할 때만 인정한다.
 */
function containsAlias(text: string, alias: string): boolean {
  if (/^[\x20-\x7e]+$/.test(alias)) return containsTerm(text, alias);
  if ([...alias].length < 2) return false;
  return new RegExp(`(^|[^가-힣])${escapeRegExp(alias)}`).test(text);
}

/** 요약들에 등장하는 기술 이름(중복 없이, 처음 나온 표기). */
export function techVocabulary(briefs: WorkBrief[]): string[] {
  const seen = new Map<string, string>();
  for (const tech of briefs.flatMap((b) => b.techs)) {
    if (!seen.has(techKey(tech))) seen.set(techKey(tech), tech);
  }
  return [...seen.values()];
}

/** 채용공고에서 역량과 기술을 뽑는다. */
export function extractFromJd(jd: string, vocabulary: string[]): LensQuery {
  const text = normalize(jd);
  if (text === '') return { competencies: [], techs: [] };

  const competencies = COMPETENCIES.filter((c) => c.keywords.some((k) => containsTerm(text, k))).map((c) => c.id);

  // 한글 표기·약어(리액트, 넥스트)는 검색과 같은 별칭 사전으로 영문 이름에 잇는다.
  const aliased = Object.entries(ALIASES)
    .filter(([alias]) => containsAlias(text, alias))
    .flatMap(([, targets]) => targets.map((t) => t.replace(/\.js$/, '')));
  const techs = vocabulary.filter(
    (tech) => containsTerm(text, tech) || containsTerm(text, techKey(tech)) || aliased.includes(techKey(tech)),
  );

  return { competencies, techs };
}

/** 점수순으로 요약을 고른다. 아무것도 걸리지 않은 요약은 내지 않는다. */
export function rankBriefs(briefs: WorkBrief[], query: LensQuery, limit = LENS_LIMIT): LensHit[] {
  const wantedTechs = new Set(query.techs.map(techKey));

  const hits = briefs
    .map((brief, order) => {
      const matchedTags = brief.tags.filter((tag) => query.competencies.includes(tag));
      const matchedTechs = brief.techs.filter((tech) => wantedTechs.has(techKey(tech)));
      const score =
        matchedTags.length * TAG_WEIGHT + Math.min(matchedTechs.length, MAX_TECH_MATCHES) * TECH_WEIGHT;
      return { brief, score, matchedTags, matchedTechs, order };
    })
    .filter((hit) => hit.score > 0)
    // 같은 점수면 대표 요약을, 그다음은 문서 순서를 앞에 둔다.
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.brief.featured) - Number(a.brief.featured) ||
        a.order - b.order,
    );

  // 한 장씩 고르되, 아직 결과에 없는 역량을 채우는 요약을 먼저 고른다. 역량을 둘 골랐는데
  // 한쪽 케이스만 세 개 나오면 렌즈가 질문에 반만 답한 셈이라서다.
  const picked: LensHit[] = [];
  const perWork = new Map<string, number>();
  const covered = new Set<CompetencyId>();
  let pool = hits;

  while (picked.length < limit) {
    pool = pool.filter((hit) => (perWork.get(hit.brief.workId) ?? 0) < PER_WORK);
    if (pool.length === 0) break;
    const gain = (hit: (typeof pool)[number]) =>
      hit.score + hit.matchedTags.filter((tag) => !covered.has(tag)).length * TAG_WEIGHT;
    // pool은 이미 점수·대표·문서 순서로 정렬돼 있으므로, 가장 먼저 만나는 최대값이 동점 규칙도 지킨다.
    const best = pool.reduce((top, hit) => (gain(hit) > gain(top) ? hit : top));

    const { brief, score, matchedTags, matchedTechs } = best;
    picked.push({ brief, score, matchedTags, matchedTechs });
    perWork.set(brief.workId, (perWork.get(brief.workId) ?? 0) + 1);
    for (const tag of matchedTags) covered.add(tag);
    pool = pool.filter((hit) => hit !== best);
  }
  return picked;
}

/* ── 주소 ───────────────────────────────────────────────────── */

export const LENS_PARAM = 'lens';
export const TECH_PARAM = 'tech';

/** `?lens=design-system,admin&tech=React,GraphQL` → 질의. 모르는 값은 버린다. */
export function parseLensParams(params: URLSearchParams, vocabulary: string[]): LensQuery {
  const split = (value: string | null) => (value ?? '').split(',').map((v) => v.trim()).filter(Boolean);
  const competencies = split(params.get(LENS_PARAM))
    .filter((id): id is CompetencyId => (COMPETENCY_IDS as readonly string[]).includes(id))
    .slice(0, MAX_LENS_COMPETENCIES);
  const techs = split(params.get(TECH_PARAM)).flatMap((raw) => {
    const found = vocabulary.find((tech) => techKey(tech) === techKey(raw));
    return found ? [found] : [];
  });
  return { competencies: [...new Set(competencies)], techs: [...new Set(techs)] };
}

export function lensParamValues(query: LensQuery): Record<string, string | null> {
  return {
    [LENS_PARAM]: query.competencies.length ? query.competencies.join(',') : null,
    [TECH_PARAM]: query.techs.length ? query.techs.join(',') : null,
  };
}
