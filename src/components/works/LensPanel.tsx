import { ArrowUpRight, Check, Link2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AskAIButtons } from '@/components/works/AskAIButtons';
import { BriefLines, CompetencyChips } from '@/components/works/BriefLines';
import { COMPETENCIES, competencyOf, type CompetencyId } from '@/data/competencies';
import { replaceSearchParams, useLocationSearch } from '@/hooks/useLocationSearch';
import { briefLocation, type WorkBrief } from '@/lib/workBriefs';
import {
  extractFromJd,
  isEmptyQuery,
  type LensQuery,
  lensParamValues,
  MAX_LENS_COMPETENCIES,
  parseLensParams,
  rankBriefs,
  techVocabulary,
} from '@/lib/workLens';
import { cn } from '@/lib/utils';

type Props = {
  briefs: WorkBrief[];
};

const EMPTY: LensQuery = { competencies: [], techs: [] };

/**
 * 직무 렌즈 — 포지션을 고르면(또는 채용공고를 붙여 넣으면) 먼저 볼 케이스 세 개를 고른다.
 * 결과는 결정적이고, 고른 이유(일치한 역량·기술)를 함께 보여 준다.
 */
export const LensPanel = ({ briefs }: Props) => {
  const vocabulary = useMemo(() => techVocabulary(briefs), [briefs]);
  // 질의는 주소(?lens=, ?tech=)에만 둔다. 링크로 건네받은 렌즈가 그대로 열린다.
  const search = useLocationSearch();
  const query = useMemo(() => parseLensParams(new URLSearchParams(search), vocabulary), [search, vocabulary]);
  const [jdOpen, setJdOpen] = useState(false);
  const [jd, setJd] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const update = (next: LensQuery) => replaceSearchParams(lensParamValues(next));

  const toggle = (id: CompetencyId) => {
    const has = query.competencies.includes(id);
    if (!has && query.competencies.length >= MAX_LENS_COMPETENCIES) return;
    update({ ...query, competencies: has ? query.competencies.filter((c) => c !== id) : [...query.competencies, id] });
  };

  const applyJd = () => {
    const found = extractFromJd(jd, vocabulary);
    update({
      // 칩은 세 개까지라, 채용공고에서 찾은 역량이 많으면 앞의 것만 쓴다.
      competencies: [...new Set([...query.competencies, ...found.competencies])].slice(0, MAX_LENS_COMPETENCIES),
      techs: [...new Set([...query.techs, ...found.techs])],
    });
    setJdOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // 클립보드를 쓸 수 없으면 주소창의 주소를 그대로 쓰면 된다.
    }
  };

  const hits = useMemo(() => rankBriefs(briefs, query), [briefs, query]);
  const empty = isEmptyQuery(query);

  return (
    <section aria-labelledby="lens-title" className="mb-8 rounded-xl border border-border/70 bg-card px-5 py-5 print:hidden">
      <h2 id="lens-title" className="text-base font-semibold text-foreground">
        어떤 포지션을 보고 계신가요?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        최대 {MAX_LENS_COMPETENCIES}개를 고르면, 그 포지션 기준으로 먼저 보시면 좋은 케이스를 골라 드립니다.
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="역량">
        {COMPETENCIES.map(({ id, label, description }) => {
          const selected = query.competencies.includes(id);
          const disabled = !selected && query.competencies.length >= MAX_LENS_COMPETENCIES;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              title={description}
              onClick={() => toggle(id)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium border transition-colors',
                selected
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border/70 text-muted-foreground hover:text-foreground hover:border-border',
                disabled && 'opacity-40 cursor-not-allowed hover:text-muted-foreground',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {query.techs.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-sm text-muted-foreground/70">기술</span>
          {query.techs.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => update({ ...query, techs: query.techs.filter((t) => t !== tech) })}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-muted/70 text-muted-foreground hover:text-foreground"
              aria-label={`${tech} 빼기`}
            >
              {tech}
              <X className="size-3" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        {jdOpen ? (
          <div>
            <label htmlFor="lens-jd" className="text-sm font-medium text-foreground">
              포지션 설명 붙여넣기
            </label>
            <p id="lens-jd-hint" className="mt-1 text-sm text-muted-foreground">
              채용공고가 아니어도 괜찮습니다. 맡게 될 업무, 팀 소개, 기술 스택처럼 포지션을 설명하는 글이면 무엇이든
              됩니다.
            </p>
            <textarea
              id="lens-jd"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={5}
              aria-describedby="lens-jd-hint lens-jd-caution"
              placeholder="예) 사내 디자인 시스템 구축, React 기반 어드민 개발, 웹 성능 개선 경험 우대"
              className="mt-2 w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <p id="lens-jd-caution" className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              입력하신 글에서 역량·기술 낱말을 찾아 <strong className="font-medium text-foreground">대략적으로 필터링</strong>
              합니다. 문맥은 읽지 않으므로 &lsquo;불필요&rsquo;처럼 부정하는 표현도 일치로 잡힐 수 있습니다. 결과는 참고용으로
              봐 주시고, 위의 역량 칩으로 직접 고치실 수 있습니다.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">입력하신 글은 브라우저 밖으로 전송되지 않습니다.</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={applyJd}
                disabled={jd.trim() === ''}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                역량 찾기
              </button>
              <button
                type="button"
                onClick={() => setJdOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setJdOpen(true)}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            채용공고나 업무 설명을 붙여 넣어 고르기
          </button>
        )}
      </div>

      {!empty && (
        <div className="mt-6 border-t border-border/50 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {hits.length > 0 ? `이 포지션 기준으로 먼저 보시면 좋은 ${hits.length}가지` : '맞는 케이스를 찾지 못했습니다'}
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                {linkCopied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
                {linkCopied ? '복사했습니다' : '이 조건으로 링크 복사'}
              </button>
              <button
                type="button"
                onClick={() => update(EMPTY)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                초기화
              </button>
            </div>
          </div>

          {hits.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">아래 30초 요약에서 전체를 먼저 훑어보시는 것을 권합니다.</p>
          ) : (
            <ol className="mt-3 flex flex-col gap-2">
              {hits.map(({ brief, matchedTags, matchedTechs }) => (
                <li key={brief.id}>
                  <a
                    href={brief.href}
                    data-astro-reload
                    className="group block rounded-lg bg-muted/40 px-4 py-3 hover:bg-muted/70 transition-colors"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-muted-foreground/80">
                        {brief.workTitle} · {briefLocation(brief)}
                      </p>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/30 group-hover:text-primary/60" />
                    </div>
                    <BriefLines brief={brief} />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <CompetencyChips tags={brief.tags} active={matchedTags} />
                      {matchedTechs.length > 0 && (
                        <span className="text-sm text-muted-foreground/70">{matchedTechs.join(' · ')} 일치</span>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-4">
            <p className="mb-2 text-sm text-muted-foreground/70">
              더 궁금한 점은 쓰시는 AI에게 물어보세요. 이 포트폴리오 전문을 근거로 답하도록 질문을 채워 드립니다.
            </p>
            <AskAIButtons focus={query.competencies.map((id) => competencyOf(id).label)} />
          </div>
        </div>
      )}
    </section>
  );
};
