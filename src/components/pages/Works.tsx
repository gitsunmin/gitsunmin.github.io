import { Fragment, useMemo, useState } from 'react';
import { useWorkSearch } from '@/components/search/useWorkSearch';
import { SearchBox } from '@/components/works/SearchBox';
import { SearchResults } from '@/components/works/SearchResults';
import { WorkIndex } from '@/components/works/WorkIndex';
import { replaceSearchParams, useLocationSearch } from '@/hooks/useLocationSearch';
import type { WorkDigest } from '@/lib/workBriefs';
import { hrefOf, search, tokenize } from '@/lib/workSearch';
import { suggestionVocabulary } from '@/lib/workSuggest';
import { cn } from '@/lib/utils';

type Props = {
  /** 빌드 타임에 모은 요약(loadWorkDigests). 전체 작업 목록과 결과의 아이콘에 쓴다. */
  digests: WorkDigest[];
};

const QUERY_PARAM = 'q';

/** 첫 화면의 추천 검색어. 모두 결과가 나오는 말이다(인덱스로 확인). */
const SUGGESTED = ['성능', 'WebView', '어드민', '정산', '디자인 시스템', 'GraphQL', '레거시'];

const WORDMARK = 'gitsunmin';
const WORDMARK_COLORS = ['#4285f4', '#ea4335', '#fbbc05', '#4285f4', '#34a853', '#ea4335'];

const Wordmark = ({ size, onClick }: { size: 'home' | 'compact'; onClick?: () => void }) => {
  const letters = [...WORDMARK].map((letter, i) => (
    // 사이트 글자 크기 설정이 span을 1rem로 맞추므로, 크기는 부모(h1·button)를 그대로 따르게 한다.
    <span key={i} style={{ color: WORDMARK_COLORS[i % WORDMARK_COLORS.length], fontSize: 'inherit' }}>
      {letter}
    </span>
  ));
  const className = cn(
    'select-none font-medium tracking-tight',
    size === 'home' ? 'text-6xl md:text-7xl' : 'text-2xl',
  );
  return onClick ? (
    <button type="button" onClick={onClick} aria-label="검색 처음으로" className={cn(className, 'shrink-0')}>
      {letters}
    </button>
  ) : (
    <h1 aria-label={`${WORDMARK} works`} className={className}>
      {letters}
    </h1>
  );
};

const homeButton =
  'rounded-md border border-transparent bg-muted/70 px-4 py-2 text-sm text-foreground hover:border-border hover:shadow-sm dark:bg-[#303134] dark:hover:border-[#5f6368]';

/**
 * /works — Google식 검색이 맨 위, 그 아래 전체 작업 목록.
 *
 * 채용 담당자가 궁금한 말(기술, 문제, 도메인)로 직접 찾아보게 한다. 검색어는 주소(?q=)에만
 * 두어 결과 화면을 링크로 건넬 수 있다. 정적 HTML은 첫 화면으로 그려지고, 주소에 검색어가
 * 있으면 하이드레이션 뒤에 결과 화면으로 바뀐다.
 */
export const WorksPage = ({ digests }: Props) => {
  const locationSearch = useLocationSearch();
  const query = (new URLSearchParams(locationSearch).get(QUERY_PARAM) ?? '').trim();

  const state = useWorkSearch(true, null);
  // 훅의 검색어는 주소를 따른다. 렌더 중에 맞추는 React의 방식이다.
  if (state.query !== query) state.setQuery(query);

  // 입력 중인 말. 검색을 실행해야 주소에 오른다.
  const [draft, setDraft] = useState(query);
  const [shownQuery, setShownQuery] = useState(query);
  if (shownQuery !== query) {
    setShownQuery(query);
    setDraft(query);
  }

  const vocabulary = useMemo(() => (state.index ? suggestionVocabulary(state.index) : []), [state.index]);
  const icons = useMemo(() => Object.fromEntries(digests.map((d) => [d.id, d.icon])), [digests]);
  const needles = useMemo(() => tokenize(query).flat(), [query]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === '') return;
    state.remember(trimmed);
    replaceSearchParams({ [QUERY_PARAM]: trimmed });
    window.scrollTo({ top: 0 });
  };

  const goHome = () => {
    setDraft('');
    replaceSearchParams({ [QUERY_PARAM]: null });
  };

  // I'm Feeling Lucky — 검색어가 있으면 가장 잘 맞는 슬라이드로, 없으면 아무 프로젝트나 연다.
  const lucky = () => {
    if (!state.index) return;
    const trimmed = draft.trim();
    if (trimmed === '') {
      const works = state.index.filter((r) => r.kind === 'work');
      const pick = works[Math.floor(Math.random() * works.length)];
      if (pick) window.location.assign(`/work/${pick.workId}/`);
      return;
    }
    const [best] = search(state.index, trimmed);
    if (!best) {
      submit(trimmed);
      return;
    }
    state.remember(trimmed);
    window.location.assign(hrefOf(best, trimmed));
  };

  const box = (size: 'home' | 'compact') => (
    <SearchBox
      size={size}
      value={draft}
      onChange={setDraft}
      onSubmit={submit}
      vocabulary={vocabulary}
      recent={state.recent}
      onForget={state.forget}
      autoFocus={size === 'home'}
    />
  );

  if (query !== '') {
    return (
      <div className="w-full md:max-w-(--breakpoint-md) mx-auto pt-16 md:pt-20 px-4 md:px-0 pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Wordmark size="compact" onClick={goHome} />
          {box('compact')}
        </div>
        <div className="mt-4 mb-6 border-b border-border/70" />
        {state.error ? (
          <p className="text-sm text-muted-foreground">검색 색인을 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.</p>
        ) : !state.index ? (
          <p className="text-sm text-muted-foreground">검색하는 중…</p>
        ) : (
          <SearchResults
            query={query}
            needles={needles}
            groups={state.groups}
            total={state.hits.length}
            alternatives={state.alternatives}
            popularTechs={state.popularTechs}
            icons={icons}
            onPick={submit}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-(--breakpoint-md) mx-auto pt-16 md:pt-20 px-4 md:px-0 pb-16 print:pt-0 print:px-0">
      <section className="flex flex-col items-center pt-[8vh] pb-16 md:pt-[12vh] md:pb-24 print:hidden">
        <Wordmark size="home" />
        <p className="mt-3 mb-8 text-sm text-muted-foreground">프론트엔드 개발자 김선민의 작업물 검색</p>
        <div className="w-full max-w-[584px]">{box('home')}</div>
        <div className="mt-7 hidden gap-3 sm:flex">
          <button type="button" onClick={() => submit(draft)} className={homeButton}>
            Works 검색
          </button>
          <button type="button" onClick={lucky} className={homeButton}>
            I&apos;m Feeling Lucky
          </button>
        </div>
        <p className="mt-7 max-w-[584px] text-center text-sm leading-7 text-muted-foreground">
          추천 검색어:{' '}
          {SUGGESTED.map((word, i) => (
            <Fragment key={word}>
              {i > 0 && ' · '}
              <button
                type="button"
                onClick={() => submit(word)}
                className="text-[#1a0dab] hover:underline underline-offset-2 dark:text-[#99c3ff]"
              >
                {word}
              </button>
            </Fragment>
          ))}
        </p>
      </section>
      <WorkIndex digests={digests} />
    </div>
  );
};
