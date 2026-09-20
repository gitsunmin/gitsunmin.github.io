import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  groupByWork,
  search,
  suggestAlternatives,
  topTechs,
  type SearchGroup,
  type SearchHit,
  type SearchRecord,
} from '@/lib/workSearch';

/**
 * 검색 오버레이의 상태 — 인덱스 로드, 검색어, 스코프, 최근 검색어.
 *
 * 인덱스는 /works/search-index.json 하나를 처음 열 때 받아 모듈 변수에 둔다.
 * 페이지를 옮겨도(ClientRouter) 같은 모듈이 살아 있으면 다시 받지 않는다.
 */

export type SearchScope = { id: string; title: string };

const INDEX_URL = '/works/search-index.json';
const RECENT_KEY = 'works-search-recent';
const RECENT_MAX = 5;

let indexCache: SearchRecord[] | null = null;
let indexPromise: Promise<SearchRecord[]> | null = null;

export function loadIndex(): Promise<SearchRecord[]> {
  if (indexCache) return Promise.resolve(indexCache);
  indexPromise ??= fetch(INDEX_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`search index ${res.status}`);
      return res.json() as Promise<SearchRecord[]>;
    })
    .then((records) => {
      indexCache = records;
      return records;
    })
    .catch((error) => {
      indexPromise = null;
      throw error;
    });
  return indexPromise;
}

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* 사생활 모드 등에서는 조용히 넘어간다. */
  }
}

export type SearchState = {
  index: SearchRecord[] | null;
  loading: boolean;
  error: boolean;
  query: string;
  setQuery: (q: string) => void;
  scope: SearchScope | null;
  setScope: (scope: SearchScope | null) => void;
  /** 검색어가 있을 때의 결과. 스코프가 적용돼 있다. */
  hits: SearchHit[];
  groups: SearchGroup[];
  /** 스코프를 풀었을 때 몇 건인지. 스코프 안 결과가 없을 때 안내에 쓴다. */
  unscopedCount: number;
  alternatives: string[];
  popularTechs: string[];
  recent: string[];
  remember: (q: string) => void;
  forget: (q: string) => void;
};

export function useWorkSearch(open: boolean, initialScope: SearchScope | null): SearchState {
  const [index, setIndex] = useState<SearchRecord[] | null>(indexCache);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope | null>(initialScope);
  const [recent, setRecent] = useState<string[]>(readRecent);

  // 다시 열릴 때 스코프는 페이지 기본값으로 돌아간다 — 지난번에 칩을 뺐더라도 다시 열면
  // "이 글 안에서"부터 시작하는 편이 예측하기 쉽다. 렌더 중에 맞추는 React의 방식이다.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setScope(initialScope);
      setRecent(readRecent());
    }
  }

  // 인덱스는 처음 열릴 때 한 번 받는다.
  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    loadIndex()
      .then((records) => {
        if (!cancelled) setIndex(records);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  const loading = open && !index && !error;

  const hits = useMemo(
    () => (index ? search(index, query, { scope: scope?.id }) : []),
    [index, query, scope],
  );
  const groups = useMemo(() => groupByWork(hits, initialScope?.id), [hits, initialScope]);
  const unscopedCount = useMemo(
    () => (index && scope ? search(index, query).length : hits.length),
    [index, scope, query, hits.length],
  );
  const alternatives = useMemo(
    () => (index && query.trim() && hits.length === 0 ? suggestAlternatives(index, query) : []),
    [index, query, hits.length],
  );
  const popularTechs = useMemo(() => (index ? topTechs(index) : []), [index]);

  const remember = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((v) => v !== trimmed)].slice(0, RECENT_MAX);
      writeRecent(next);
      return next;
    });
  }, []);

  const forget = useCallback((q: string) => {
    setRecent((prev) => {
      const next = prev.filter((v) => v !== q);
      writeRecent(next);
      return next;
    });
  }, []);

  return {
    index,
    loading,
    error,
    query,
    setQuery,
    scope,
    setScope,
    hits,
    groups,
    unscopedCount,
    alternatives,
    popularTechs,
    recent,
    remember,
    forget,
  };
}
