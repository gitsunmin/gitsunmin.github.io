/**
 * works 검색 — 인덱스 형식과 매칭.
 *
 * 채용 담당자가 "GraphQL", "WebView 인증", "정산" 같은 말로 찾았을 때 어느 프로젝트의
 * 어느 슬라이드에서 왜 걸렸는지까지 돌려준다. 문서가 스무 개 남짓이라 라이브러리 없이
 * 부분 문자열 매칭으로 충분하고, 그래야 한글 부분어("정산" → "정산 관리자")도 잡힌다.
 *
 * 인덱스는 빌드 타임에 /works/search-index.json으로 만들어지고(pages/works/search-index.json.ts),
 * 이 파일은 그 레코드를 읽는 쪽이다. 목차 패널의 필터도 같은 매칭을 쓴다.
 */

export type SearchRecordKind = 'work' | 'chapter' | 'slide';

export type SearchRecord = {
  /** 레코드 고유 id. `workId`, `workId/chapter`, `workId#slug…` */
  id: string;
  kind: SearchRecordKind;
  workId: string;
  workTitle: string;
  /** 서브 레포 이름. 최상위 문서의 슬라이드에는 없다. */
  chapter?: string;
  /** 슬라이드 제목 사슬(`문제 1 · 제목 · 상황`) 또는 프로젝트·장 이름. */
  title: string;
  /** 덱 딥링크(#slug). 헤딩이 없는 슬라이드에는 없다. */
  slug?: string;
  /** 평문 본문. 스니펫과 본문 매칭에 쓴다. */
  text: string;
  techs?: string[];
  contributions?: string[];
};

export type MatchKind = 'tech' | 'title' | 'contribution' | 'text';

/** 매치 종류의 무게. 기술 칩에 걸린 것이 본문 어딘가에 스친 것보다 믿을 만하다. */
const WEIGHT: Record<MatchKind, number> = { tech: 3, title: 2, contribution: 2, text: 1 };

export type Highlight = { text: string; hit: boolean };

export type SearchHit = {
  record: SearchRecord;
  score: number;
  kinds: MatchKind[];
  /** 검색어가 걸린 자리를 앞뒤로 조금 잘라 낸 본문. 본문 매치가 없으면 비어 있다. */
  snippet: Highlight[];
};

export type SearchGroup = {
  workId: string;
  workTitle: string;
  hits: SearchHit[];
  score: number;
};

/**
 * 별칭. 한글 표기·약어로 쳐도 기술 칩에 닿게 한다.
 * 값은 전부 정규화된 소문자여야 한다.
 */
const ALIASES: Record<string, string[]> = {
  리액트: ['react'],
  rn: ['react native'],
  '리액트 네이티브': ['react native'],
  ts: ['typescript'],
  타입스크립트: ['typescript'],
  넥스트: ['next.js'],
  nextjs: ['next.js'],
  next: ['next.js'],
  넉스트: ['nuxt.js'],
  nuxt: ['nuxt.js'],
  뷰: ['vue'],
  그래프큐엘: ['graphql'],
  gql: ['graphql'],
  아폴로: ['apollo'],
  릴레이: ['relay'],
  테일윈드: ['tailwind'],
  웹뷰: ['webview'],
  플러터: ['flutter'],
  다트: ['dart'],
  파이어베이스: ['firebase'],
  스토리북: ['storybook'],
  익스포: ['expo'],
  아스트로: ['astro'],
  번: ['bun'],
  터보레포: ['turborepo'],
  클라우드플레어: ['cloudflare'],
  프리즈마: ['prisma'],
  데이터독: ['datadog'],
  이모션: ['emotion'],
  비트: ['vite'],
  vscode: ['vscode extension'],
  k8s: ['kubernetes'],
};

/** 소문자·NFC·공백 정리. 모든 비교는 이 형태로 한다. */
export function normalize(text: string): string {
  return text.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** 검색어를 토큰으로 나눈다. 토큰마다 별칭을 붙여 "이 중 하나라도"로 본다. */
export function tokenize(query: string): string[][] {
  const normalized = normalize(query);
  if (normalized === '') return [];
  // 별칭 사전에 통째로 있는 구("리액트 네이티브")는 나누지 않는다.
  if (ALIASES[normalized]) return [[normalized, ...ALIASES[normalized]]];
  return normalized.split(' ').map((token) => [token, ...(ALIASES[token] ?? [])]);
}

const includesAny = (haystack: string, needles: string[]) => needles.some((n) => haystack.includes(n));

/**
 * 레코드 하나를 검색어에 대 본다. 토큰이 전부 어딘가에 걸려야 매치다(AND).
 * 종류별 점수는 토큰마다 더한다 — 두 토큰이 다 기술에 걸리면 기술 점수가 두 번.
 */
export function matchRecord(record: SearchRecord, tokens: string[][]): SearchHit | null {
  if (tokens.length === 0) return null;

  const techs = (record.techs ?? []).map(normalize);
  const title = normalize(record.title);
  const contributions = (record.contributions ?? []).map(normalize);
  const text = normalize(record.text);

  const kinds = new Set<MatchKind>();
  let score = 0;

  for (const needles of tokens) {
    let matched = false;
    if (techs.some((tech) => includesAny(tech, needles))) {
      kinds.add('tech');
      score += WEIGHT.tech;
      matched = true;
    }
    if (includesAny(title, needles)) {
      kinds.add('title');
      score += WEIGHT.title;
      matched = true;
    }
    if (contributions.some((c) => includesAny(c, needles))) {
      kinds.add('contribution');
      score += WEIGHT.contribution;
      matched = true;
    }
    if (includesAny(text, needles)) {
      kinds.add('text');
      score += WEIGHT.text;
      matched = true;
    }
    if (!matched) return null;
  }

  const order: MatchKind[] = ['tech', 'title', 'contribution', 'text'];
  return {
    record,
    score,
    kinds: order.filter((kind) => kinds.has(kind)),
    snippet: kinds.has('text') ? snippetOf(record.text, tokens) : [],
  };
}

const SNIPPET_BEFORE = 40;
const SNIPPET_AFTER = 90;

/**
 * 첫 매치 자리를 가운데 두고 본문을 잘라 하이라이트한다.
 * 원문과 정규화된 문자열은 NFC·소문자 변환으로 길이가 달라질 수 있어, 자르는 위치는
 * 정규화된 쪽에서 재고 원문도 같은 규칙으로 정규화한 것을 보여 준다.
 */
export function snippetOf(text: string, tokens: string[][]): Highlight[] {
  const source = text.normalize('NFC').replace(/\s+/g, ' ').trim();
  const lower = source.toLowerCase();
  const needles = tokens.flat();

  let first = -1;
  for (const needle of needles) {
    const at = lower.indexOf(needle);
    if (at !== -1 && (first === -1 || at < first)) first = at;
  }
  if (first === -1) return [];

  const start = Math.max(0, first - SNIPPET_BEFORE);
  const end = Math.min(source.length, first + SNIPPET_AFTER);
  const window = source.slice(start, end);
  const parts = highlight(window, needles);

  if (start > 0) parts.unshift({ text: '…', hit: false });
  if (end < source.length) parts.push({ text: '…', hit: false });
  return parts;
}

/** 문자열을 매치 구간과 나머지로 나눈다. 겹치는 구간은 합친다. */
export function highlight(text: string, needles: string[]): Highlight[] {
  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];

  for (const needle of needles) {
    if (needle === '') continue;
    let from = 0;
    while (from < lower.length) {
      const at = lower.indexOf(needle, from);
      if (at === -1) break;
      ranges.push([at, at + needle.length]);
      from = at + needle.length;
    }
  }
  if (ranges.length === 0) return [{ text, hit: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }

  const parts: Highlight[] = [];
  let cursor = 0;
  for (const [from, to] of merged) {
    if (from > cursor) parts.push({ text: text.slice(cursor, from), hit: false });
    parts.push({ text: text.slice(from, to), hit: true });
    cursor = to;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });
  return parts;
}

export type SearchOptions = {
  /** 이 프로젝트 안에서만 찾는다. */
  scope?: string;
};

/** 인덱스 전체를 검색한다. 점수 내림차순, 같으면 인덱스 순서. */
export function search(index: SearchRecord[], query: string, options: SearchOptions = {}): SearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const hits: SearchHit[] = [];
  for (const record of index) {
    if (options.scope && record.workId !== options.scope) continue;
    const hit = matchRecord(record, tokens);
    if (hit) hits.push(hit);
  }
  return hits.sort((a, b) => b.score - a.score);
}

/**
 * 결과를 프로젝트별로 묶는다. 묶음 순서는 묶음 안 최고 점수, `pin`이 있으면 그 프로젝트가
 * 맨 앞이다 — 상세 페이지에서 전체 검색으로 넓혔을 때 지금 보던 것이 먼저 보여야 한다.
 */
export function groupByWork(hits: SearchHit[], pin?: string): SearchGroup[] {
  const groups = new Map<string, SearchGroup>();
  for (const hit of hits) {
    const { workId, workTitle } = hit.record;
    let group = groups.get(workId);
    if (!group) {
      group = { workId, workTitle, hits: [], score: 0 };
      groups.set(workId, group);
    }
    group.hits.push(hit);
    group.score = Math.max(group.score, hit.score);
  }
  return [...groups.values()].sort((a, b) => {
    if (pin && a.workId === pin) return -1;
    if (pin && b.workId === pin) return 1;
    return b.score - a.score;
  });
}

/**
 * 빈 결과에서 대신 권할 검색어. 별칭이 있으면 그 표기를, 없으면 기술 칩 중에 검색어를
 * 품고 있는 것을 돌려준다("aws" → "AWS Lambda").
 */
export function suggestAlternatives(index: SearchRecord[], query: string, limit = 3): string[] {
  const normalized = normalize(query);
  if (normalized === '') return [];

  const allTechs = [...new Set(index.flatMap((r) => r.techs ?? []))];
  const out = new Set<string>();

  for (const alias of ALIASES[normalized] ?? []) {
    const tech = allTechs.find((t) => normalize(t).includes(alias));
    if (tech) out.add(tech);
  }
  for (const tech of allTechs) {
    if (out.size >= limit) break;
    const t = normalize(tech);
    // 한 글자 차이 정도의 오타는 잡지 않는다. 앞부분이 같거나 서로 품고 있으면 권한다.
    if (t !== normalized && (t.startsWith(normalized.slice(0, 3)) && normalized.length >= 3 || normalized.includes(t))) out.add(tech);
  }
  return [...out].slice(0, limit);
}

/** 인덱스에서 가장 많이 쓰인 기술. 빈 입력·빈 결과에서 추천 칩으로 쓴다. */
export function topTechs(index: SearchRecord[], limit = 6): string[] {
  const counts = new Map<string, number>();
  for (const record of index) {
    if (record.kind !== 'work') continue;
    for (const tech of record.techs ?? []) counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tech]) => tech);
}

/** 결과가 가리키는 주소. 검색어를 ?q=로 실어 보내 도착한 슬라이드가 하이라이트할 수 있게 한다. */
export function hrefOf(hit: SearchHit, query: string): string {
  const { record } = hit;
  const base = `/work/${record.workId}`;
  const search = query ? `?q=${encodeURIComponent(query)}` : '';
  const hash = record.slug ? `#${record.slug}` : '';
  return `${base}${search}${hash}`;
}
