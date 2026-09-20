import { ArrowRight, Clock, CornerDownLeft, FolderOpen, Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { SearchState } from '@/components/search/useWorkSearch';
import { tokenize, type MatchKind, type SearchHit } from '@/lib/workSearch';
import { cn } from '@/lib/utils';

/**
 * 검색 오버레이의 속 — 입력·스코프 칩·결과·빈 상태.
 * PC 다이얼로그와 모바일 시트가 같은 것을 담는다.
 */

const KIND_LABEL: Record<MatchKind, string> = {
  tech: '기술',
  title: '제목',
  contribution: '담당 범위',
  text: '본문',
};

/** 프로젝트 묶음 안에서 처음에 보여 주는 결과 수. 나머지는 "더 보기"로 편다. */
const PER_GROUP = 3;

export type SearchPanelProps = {
  state: SearchState;
  /** 결과를 골랐을 때. 오버레이가 닫는 것까지 호출한 쪽이 맡는다. */
  onSelect: (hit: SearchHit, query: string) => void;
  onClose: () => void;
  /** 모바일 시트에서는 입력 자동 포커스가 키보드를 바로 띄우므로 켠다. */
  autoFocus?: boolean;
};

export function SearchPanel({ state, onSelect, onClose, autoFocus = true }: SearchPanelProps) {
  const { query, setQuery, scope, setScope, groups, hits } = state;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // 검색어·스코프가 바뀌면 펼침과 커서를 처음으로. 렌더 중에 맞추는 React의 방식이다.
  const resultsKey = `${query}|${scope?.id ?? ''}`;
  const [prevResultsKey, setPrevResultsKey] = useState(resultsKey);
  if (prevResultsKey !== resultsKey) {
    setPrevResultsKey(resultsKey);
    setExpanded(new Set());
    setCursor(0);
  }

  /** 묶음 하나(스코프 안)라면 접을 이유가 없다. 여러 프로젝트가 섞일 때만 3개씩 보여 준다. */
  const shownOf = (group: (typeof groups)[number]) =>
    scope || expanded.has(group.workId) ? group.hits : group.hits.slice(0, PER_GROUP);

  /** 화면에 보이는 순서대로 편 결과. 키보드 이동은 이 목록 위를 다닌다. */
  const visible = useMemo(
    () => groups.flatMap((group) => shownOf(group).map((hit) => ({ hit, workId: group.workId }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, expanded, scope],
  );

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-cursor="${cursor}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const trimmed = query.trim();
  const hasQuery = trimmed !== '';
  const needles = useMemo(() => tokenize(trimmed).flat(), [trimmed]);

  const select = (hit: SearchHit) => onSelect(hit, trimmed);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((c) => Math.min(visible.length - 1, c + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (event.key === 'Enter') {
      const target = visible[cursor];
      if (target) {
        event.preventDefault();
        select(target.hit);
      }
    } else if (event.key === 'Backspace' && query === '' && scope) {
      event.preventDefault();
      setScope(null);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  const slideCount = hits.filter((h) => h.record.kind === 'slide').length;
  const summary = hasQuery
    ? [scope ? `${scope.title} 안에서` : `${groups.length}개 프로젝트`, `${hits.length}건`].join(' · ')
    : '';

  return (
    <div className="flex h-full min-h-0 flex-col" data-search-root onKeyDown={onKeyDown}>
      {/* ── 입력 ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />

        {scope && (
          <span className="inline-flex max-w-[45%] shrink-0 items-center gap-1 rounded-md border border-primary/30 bg-primary/10 py-0.5 pl-2 pr-1 text-xs font-medium text-primary">
            <FolderOpen className="size-3 shrink-0" />
            <span className="truncate">{scope.title}</span>
            <button
              type="button"
              onClick={() => {
                setScope(null);
                inputRef.current?.focus();
              }}
              aria-label={`${scope.title} 범위 해제 — 모든 프로젝트에서 찾기`}
              title="범위 해제 (Backspace)"
              className="rounded p-0.5 hover:bg-primary/20"
            >
              <X className="size-3" />
            </button>
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={scope ? `${scope.title} 안에서 찾기…` : '모든 프로젝트에서 찾기 — 예: GraphQL, WebView, 정산'}
          aria-label="works 검색"
          role="combobox"
          aria-expanded={visible.length > 0}
          aria-controls={listId}
          aria-activedescendant={visible.length > 0 ? `${listId}-${cursor}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          // 모바일에서는 16px 이상이어야 한다. iOS Safari는 그보다 작은 입력창에 포커스가
          // 가면 페이지를 통째로 확대해 버린다.
          className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/60 sm:text-[15px]"
        />

        {hasQuery ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="검색어 지우기"
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : (
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">esc</kbd>
        )}
      </div>

      {/* ── 결과 요약 ─────────────────────────────────────── */}
      {hasQuery && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground" aria-live="polite">
          <span className="truncate">
            <span className="font-semibold text-foreground">‘{trimmed}’</span>
            <span className="mx-1.5 opacity-50">·</span>
            {summary}
            {slideCount > 0 && slideCount !== hits.length && (
              <span className="opacity-70">{` (슬라이드 ${slideCount})`}</span>
            )}
          </span>
          {scope && hits.length > 0 && state.unscopedCount > hits.length && (
            <button type="button" onClick={() => setScope(null)} className="shrink-0 text-primary hover:underline">
              모든 프로젝트에서 {state.unscopedCount}건
            </button>
          )}
        </div>
      )}

      {/* ── 본문 ─────────────────────────────────────────── */}
      <div ref={listRef} id={listId} role="listbox" aria-label="검색 결과" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2">
        {state.error && (
          <p className="px-3 py-10 text-center text-sm text-muted-foreground">검색 인덱스를 불러오지 못했어요. 잠시 후 다시 열어 주세요.</p>
        )}
        {!state.error && state.loading && !state.index && (
          <p className="px-3 py-10 text-center text-sm text-muted-foreground">검색 준비 중…</p>
        )}

        {state.index && !hasQuery && <IdleState state={state} onPick={(q) => setQuery(q)} />}

        {state.index && hasQuery && hits.length === 0 && <EmptyState state={state} onPick={(q) => setQuery(q)} />}

        {hasQuery &&
          groups.map((group) => {
            const shown = shownOf(group);
            const rest = group.hits.length - shown.length;
            return (
              <section key={group.workId} className="mt-2">
                <div className="flex items-center justify-between px-2 pb-1 pt-2">
                  {scope ? (
                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground/70">{group.workTitle}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setScope({ id: group.workId, title: group.workTitle });
                        inputRef.current?.focus();
                      }}
                      title="이 프로젝트 안에서만 찾기"
                      className="group inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-muted-foreground/70 hover:text-primary"
                    >
                      {group.workTitle}
                      <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  )}
                  <span className="text-[11px] tabular-nums text-muted-foreground/50">{group.hits.length}</span>
                </div>

                <ul>
                  {shown.map((hit) => {
                    const index = visible.findIndex((v) => v.hit === hit);
                    return (
                      <li key={hit.record.id}>
                        <ResultRow
                          hit={hit}
                          id={`${listId}-${index}`}
                          index={index}
                          active={index === cursor}
                          onHover={() => setCursor(index)}
                          onSelect={() => select(hit)}
                          needles={needles}
                        />
                      </li>
                    );
                  })}
                </ul>

                {rest > 0 && (
                  <button
                    type="button"
                    onClick={() => setExpanded((prev) => new Set(prev).add(group.workId))}
                    className="mx-2 mt-1 text-xs text-primary hover:underline"
                  >
                    +{rest}개 더 보기
                  </button>
                )}
              </section>
            );
          })}
      </div>

      {/* ── 푸터 힌트 (PC) ────────────────────────────────── */}
      <div className="hidden items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground sm:flex">
        <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border px-1">↑</kbd><kbd className="rounded border border-border px-1">↓</kbd> 이동</span>
        <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border px-1"><CornerDownLeft className="inline size-2.5" /></kbd> 열기</span>
        {scope && <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border px-1">⌫</kbd> 범위 해제</span>}
        <span className="ml-auto opacity-70">기술 · 제목 · 담당 범위 · 본문에서 찾습니다</span>
      </div>
    </div>
  );
}

type RowProps = {
  hit: SearchHit;
  id: string;
  index: number;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
  /** 정규화된 검색 토큰(별칭 포함). */
  needles: string[];
};

function ResultRow({ hit, id, index, active, onHover, onSelect, needles }: RowProps) {
  const { record, kinds, snippet } = hit;
  // 기술에 걸렸으면 어느 칩이었는지 보여 준다. "기술"이라는 배지만으로는 무엇에 걸렸는지 모른다.
  const matchedTechs = kinds.includes('tech')
    ? (record.techs ?? []).filter((tech) => needles.some((n) => tech.toLowerCase().includes(n)))
    : [];
  const crumbs = [record.chapter, record.kind === 'slide' ? record.title : null].filter(Boolean) as string[];
  const heading = record.kind === 'slide' ? record.title.split(' · ').at(-1) ?? record.title : record.title;
  const path = record.kind === 'slide' ? [record.chapter, ...record.title.split(' · ').slice(0, -1)].filter(Boolean) : [];

  return (
    <button
      type="button"
      id={id}
      role="option"
      aria-selected={active}
      data-cursor={index}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={cn(
        'flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-left transition-colors',
        active ? 'bg-primary/10' : 'hover:bg-muted/60',
      )}
    >
      <div className="flex w-full items-start gap-2">
        <div className="min-w-0 flex-1">
          {path.length > 0 && (
            <div className="truncate text-[11px] text-muted-foreground/70">{path.join(' › ')}</div>
          )}
          <div className={cn('truncate text-sm font-medium', active ? 'text-primary' : 'text-foreground')}>
            {record.kind === 'chapter' && <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">장</span>}
            {record.kind === 'work' && <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">프로젝트</span>}
            {heading}
          </div>
        </div>
        <div className="flex shrink-0 gap-1 pt-0.5">
          {kinds.map((kind) => (
            <span
              key={kind}
              className={cn(
                'rounded border px-1 py-px text-[10px] leading-4',
                kind === 'tech'
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground',
              )}
            >
              {KIND_LABEL[kind]}
            </span>
          ))}
        </div>
      </div>

      {matchedTechs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {matchedTechs.map((tech) => (
            <span key={tech} className="rounded-full bg-muted px-2 py-px text-[11px] text-foreground/80">
              {tech}
            </span>
          ))}
        </div>
      )}

      {snippet.length > 0 && (
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {snippet.map((part, i) =>
            part.hit ? (
              <mark key={i} className="rounded-sm bg-primary/20 px-0.5 text-foreground">{part.text}</mark>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>
      )}
      {snippet.length === 0 && crumbs.length === 0 && record.text && (
        <p className="line-clamp-1 text-xs text-muted-foreground">{record.text}</p>
      )}
    </button>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      {children}
    </button>
  );
}

function IdleState({ state, onPick }: { state: SearchState; onPick: (q: string) => void }) {
  const { recent, forget, popularTechs, scope } = state;
  return (
    <div className="px-2 pt-3">
      {recent.length > 0 && (
        <section className="mb-4">
          <h3 className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">최근 검색</h3>
          <ul>
            {recent.map((q) => (
              <li key={q} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => onPick(q)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted/60"
                >
                  <Clock className="size-3.5 shrink-0 text-muted-foreground/60" />
                  <span className="truncate">{q}</span>
                </button>
                <button
                  type="button"
                  onClick={() => forget(q)}
                  aria-label={`최근 검색어 ‘${q}’ 지우기`}
                  className="rounded p-1 text-muted-foreground/50 opacity-0 hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {scope ? '이런 걸 찾아보세요' : '자주 쓰인 기술'}
        </h3>
        <div className="flex flex-wrap gap-1.5 px-2">
          {popularTechs.map((tech) => (
            <Chip key={tech} onClick={() => onPick(tech)}>{tech}</Chip>
          ))}
          {scope && ['문제', '결과', '성능'].map((word) => (
            <Chip key={word} onClick={() => onPick(word)}>{word}</Chip>
          ))}
        </div>
        <p className="px-2 pt-4 text-xs leading-relaxed text-muted-foreground/70">
          기술 이름은 한글·약어로 쳐도 됩니다(리액트, RN, TS). 두 단어를 띄어 쓰면 둘 다 들어 있는 슬라이드만 남습니다.
        </p>
      </section>
    </div>
  );
}

function EmptyState({ state, onPick }: { state: SearchState; onPick: (q: string) => void }) {
  const { query, scope, setScope, unscopedCount, alternatives, popularTechs } = state;
  const trimmed = query.trim();
  return (
    <div className="px-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">
        {scope ? (
          <><span className="font-medium text-foreground">{scope.title}</span> 안에는 ‘{trimmed}’가 없어요.</>
        ) : (
          <>‘<span className="font-medium text-foreground">{trimmed}</span>’로 찾은 결과가 없어요.</>
        )}
      </p>

      {scope && unscopedCount > 0 && (
        <button
          type="button"
          onClick={() => setScope(null)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          모든 프로젝트에서 찾기
          <span className="rounded-full bg-primary-foreground/20 px-1.5 tabular-nums">{unscopedCount}</span>
        </button>
      )}

      {alternatives.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs text-muted-foreground/70">이걸 찾으셨나요?</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {alternatives.map((alt) => (
              <Chip key={alt} onClick={() => onPick(alt)}>{alt}</Chip>
            ))}
          </div>
        </div>
      )}

      {alternatives.length === 0 && !(scope && unscopedCount > 0) && (
        <div className="mt-5">
          <p className="mb-2 text-xs text-muted-foreground/70">자주 쓰인 기술로 찾아보기</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {popularTechs.map((tech) => (
              <Chip key={tech} onClick={() => onPick(tech)}>{tech}</Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
