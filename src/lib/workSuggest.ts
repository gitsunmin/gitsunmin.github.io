/**
 * works 검색창의 자동완성 — 입력 중인 말을 인덱스에 실제로 있는 말로 이어 준다.
 *
 * 후보는 기술, 프로젝트·장 이름, 케이스 제목이다. 모두 인덱스에서 오므로 제안을 고르면
 * 결과가 반드시 하나 이상 나온다. 최근 검색어는 브라우저에만 있고 맨 앞에 둔다.
 */
import { normalize, type SearchRecord } from '@/lib/workSearch';

export type SuggestionKind = 'recent' | 'tech' | 'work' | 'case';

export type Suggestion = { text: string; kind: SuggestionKind };

const KIND_ORDER: SuggestionKind[] = ['recent', 'tech', 'work', 'case'];
const CASE_PREFIX = /^문제\s*\d+$/;

/** 인덱스에서 자동완성 후보를 모은다. 같은 말은 처음 나온 표기 하나만 남긴다. */
export function suggestionVocabulary(index: SearchRecord[]): Suggestion[] {
  const seen = new Set<string>();
  const out: Suggestion[] = [];
  const add = (text: string | undefined, kind: SuggestionKind) => {
    if (!text) return;
    const key = normalize(text);
    if (key === '' || seen.has(key)) return;
    seen.add(key);
    out.push({ text, kind });
  };

  for (const record of index) for (const tech of record.techs ?? []) add(tech, 'tech');
  for (const record of index) {
    if (record.kind === 'work') add(record.workTitle, 'work');
    if (record.kind === 'chapter') add(record.chapter ?? record.title, 'work');
  }
  // 케이스 제목만 — `문제 1 · 제목 · 상황`의 두 번째 마디. 하위 슬라이드(상황, 결과)는 너무 많고 비슷하다.
  for (const record of index) {
    if (record.kind !== 'slide') continue;
    const [head, title] = record.title.split(' · ');
    if (CASE_PREFIX.test(head) && title) add(title, 'case');
  }
  return out;
}

/** 얼마나 잘 맞는가. 낮을수록 앞이다 — 앞에서 시작 < 낱말 첫머리 < 중간. 안 맞으면 null. */
function rank(text: string, query: string): number | null {
  const target = normalize(text);
  if (target.startsWith(query)) return 0;
  const at = target.indexOf(query);
  if (at === -1) return null;
  return /[\s·(/-]/.test(target[at - 1] ?? '') ? 1 : 2;
}

/**
 * 입력에 맞는 제안. 입력이 비어 있으면 최근 검색어만 돌려준다.
 * 같은 순위면 최근 검색 → 기술 → 프로젝트 → 케이스, 그다음은 짧은 말이 앞이다.
 */
export function suggest(vocabulary: Suggestion[], recent: string[], input: string, limit = 8): Suggestion[] {
  const query = normalize(input);
  const recentItems: Suggestion[] = recent.map((text) => ({ text, kind: 'recent' }));
  if (query === '') return recentItems.slice(0, limit);

  const recentKeys = new Set(recent.map(normalize));
  return [...recentItems, ...vocabulary.filter((s) => !recentKeys.has(normalize(s.text)))]
    .map((s) => ({ s, r: rank(s.text, query) }))
    .filter((x): x is { s: Suggestion; r: number } => x.r !== null)
    .sort(
      (a, b) =>
        a.r - b.r ||
        KIND_ORDER.indexOf(a.s.kind) - KIND_ORDER.indexOf(b.s.kind) ||
        a.s.text.length - b.s.text.length,
    )
    .slice(0, limit)
    .map((x) => x.s);
}
