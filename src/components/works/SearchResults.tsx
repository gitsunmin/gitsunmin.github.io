import { Fragment, useState } from 'react';
import { hrefOf, type Highlight, highlight, type SearchGroup, type SearchHit } from '@/lib/workSearch';
import { cn } from '@/lib/utils';

type Props = {
  query: string;
  needles: string[];
  groups: SearchGroup[];
  total: number;
  alternatives: string[];
  popularTechs: string[];
  icons: Record<string, string | undefined>;
  onPick: (query: string) => void;
};

/** 한 프로젝트에서 처음에 보여 주는 결과 수. 첫 결과 아래에 들여 쓴 하위 결과로 붙는다. */
const PER_GROUP = 3;
const FALLBACK_SNIPPET = 140;
const SITE = 'gitsunmin.github.io';

/** 결과 제목 — `문제 1 · 제목 · 상황`에서 `문제 1`을 떼고 이어 쓴다. */
const headingOf = (hit: SearchHit) => {
  const { record } = hit;
  if (record.kind === 'work') return `${record.workTitle} — 프로젝트 개요`;
  if (record.kind === 'chapter') return `${record.chapter ?? record.title} — ${record.workTitle}`;
  return record.title
    .split(' · ')
    .filter((part) => !/^문제\s*\d+$/.test(part))
    .join(' — ');
};

/** 본문에 걸리지 않은 결과(기술·제목 매치)는 본문 앞부분을 보여 준다. */
const snippetOf = (hit: SearchHit, needles: string[]): Highlight[] => {
  if (hit.snippet.length > 0) return hit.snippet;
  const text = hit.record.text.replace(/\s+/g, ' ').trim();
  const cut = text.length > FALLBACK_SNIPPET ? `${text.slice(0, FALLBACK_SNIPPET)}…` : text;
  return highlight(cut, needles);
};

const Snippet = ({ parts }: { parts: Highlight[] }) => (
  <>
    {parts.map((part, i) =>
      part.hit ? (
        <em key={i} className="not-italic font-semibold text-foreground">
          {part.text}
        </em>
      ) : (
        // 사이트 글자 크기 설정이 span을 1rem로 맞추므로 맨 글자로 둔다 — 부모(text-sm)를 따르게.
        <Fragment key={i}>{part.text}</Fragment>
      ),
    )}
  </>
);

const titleClass =
  'text-[#1a0dab] visited:text-[#681da8] dark:text-[#99c3ff] dark:visited:text-[#c58af9] hover:underline underline-offset-2';

const Favicon = ({ src, title }: { src?: string; title: string }) => (
  <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-white">
    {src ? (
      <img src={src} alt="" className="size-[18px] object-contain" />
    ) : (
      <span className="text-xs font-semibold text-gray-600">{title.slice(0, 1)}</span>
    )}
  </span>
);

const MainResult = ({ hit, query, needles, icon }: { hit: SearchHit; query: string; needles: string[]; icon?: string }) => {
  const { record, kinds } = hit;
  const crumbs = [SITE, 'work', record.workId, record.chapter].filter(Boolean).join(' › ');
  const matchedTechs = kinds.includes('tech')
    ? (record.techs ?? []).filter((tech) => needles.some((n) => tech.toLowerCase().includes(n)))
    : [];

  return (
    <div>
      <a href={hrefOf(hit, query)} data-astro-reload className="group block">
        <div className="flex items-center gap-3">
          <Favicon src={icon} title={record.workTitle} />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm text-foreground">{record.workTitle}</p>
            <p className="truncate text-xs text-muted-foreground">{crumbs}</p>
          </div>
        </div>
        <h3 className={cn('mt-1.5 text-xl leading-snug', titleClass)}>{headingOf(hit)}</h3>
      </a>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        <Snippet parts={snippetOf(hit, needles)} />
      </p>
      {matchedTechs.length > 0 && (
        <p className="mt-1 text-sm text-muted-foreground">
          기술 ·{' '}
          {matchedTechs.map((tech, i) => (
            <Fragment key={tech}>
              {i > 0 && ', '}
              <em className="not-italic font-semibold text-foreground">{tech}</em>
            </Fragment>
          ))}
        </p>
      )}
    </div>
  );
};

const SubResult = ({ hit, query, needles }: { hit: SearchHit; query: string; needles: string[] }) => (
  <li>
    <a href={hrefOf(hit, query)} data-astro-reload className={cn('text-base leading-snug', titleClass)}>
      {headingOf(hit)}
    </a>
    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
      <Snippet parts={snippetOf(hit, needles)} />
    </p>
  </li>
);

const ResultGroup = ({ group, query, needles, icon }: { group: SearchGroup; query: string; needles: string[]; icon?: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [main, ...rest] = group.hits;
  const subs = expanded ? rest : rest.slice(0, PER_GROUP - 1);
  const hidden = rest.length - subs.length;

  return (
    <li>
      <MainResult hit={main} query={query} needles={needles} icon={icon} />
      {subs.length > 0 && (
        <ul className="mt-3 ml-5 flex flex-col gap-3 border-l border-border/60 pl-4 md:ml-10">
          {subs.map((hit) => (
            <SubResult key={hit.record.id} hit={hit} query={query} needles={needles} />
          ))}
        </ul>
      )}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 ml-5 pl-4 text-sm text-muted-foreground hover:text-foreground hover:underline md:ml-10"
        >
          {group.workTitle}에서 결과 {hidden}개 더보기
        </button>
      )}
    </li>
  );
};

const LinkButton = ({ children, onClick }: { children: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className={titleClass}>
    {children}
  </button>
);

/** 검색 결과 — 프로젝트마다 대표 결과 하나와 들여 쓴 하위 결과. 결과마다 덱의 그 슬라이드로 간다. */
export const SearchResults = ({ query, needles, groups, total, alternatives, popularTechs, icons, onPick }: Props) => {
  if (total === 0) {
    return (
      <div className="max-w-xl text-base leading-relaxed text-foreground">
        {alternatives.length > 0 && (
          <p className="mb-5 text-lg">
            <span className="text-lg text-[#c5221f] dark:text-[#f28b82]">이것을 찾으셨나요? </span>
            {alternatives.map((alt, i) => (
              <Fragment key={alt}>
                {i > 0 && ', '}
                <LinkButton onClick={() => onPick(alt)}>{alt}</LinkButton>
              </Fragment>
            ))}
          </p>
        )}
        <p>
          <span className="text-base font-semibold">‘{query}’</span>에 대한 검색결과가 없습니다.
        </p>
        <p className="mt-4">제안:</p>
        <ul className="mt-1 list-disc pl-8 text-sm leading-7 text-muted-foreground">
          <li>모든 단어의 철자가 정확한지 확인하세요.</li>
          <li>다른 검색어를 사용해 보세요. 기술 이름은 한글·약어로 써도 됩니다(리액트, RN, TS).</li>
          <li>검색어 수를 줄여 보세요. 띄어 쓴 단어는 모두 들어 있는 결과만 남습니다.</li>
        </ul>
        {popularTechs.length > 0 && (
          <p className="mt-5 text-sm">
            <span className="text-sm text-muted-foreground">자주 쓰인 기술: </span>
            {popularTechs.map((tech, i) => (
              <Fragment key={tech}>
                {i > 0 && <span className="text-sm text-muted-foreground"> · </span>}
                <LinkButton onClick={() => onPick(tech)}>{tech}</LinkButton>
              </Fragment>
            ))}
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        검색결과 {total}개 · 프로젝트 {groups.length}곳
      </p>
      <ol className="flex max-w-[652px] flex-col gap-8">
        {groups.map((group) => (
          <ResultGroup
            key={`${query}:${group.workId}`}
            group={group}
            query={query}
            needles={needles}
            icon={icons[group.workId]}
          />
        ))}
      </ol>
    </>
  );
};
