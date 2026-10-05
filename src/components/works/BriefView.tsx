import { ArrowRight, Calendar } from 'lucide-react';
import { BriefLines } from '@/components/works/BriefLines';
import { briefLocation, featuredBrief, type WorkDigest } from '@/lib/workBriefs';

type Props = {
  digests: WorkDigest[];
  /** 3분 보기로 넘어가 해당 프로젝트로 내려간다. */
  onShowCases: (workId: string) => void;
};

/**
 * 30초 보기 — 프로젝트마다 한 장. 무엇을 했는지 한두 문장과, 그것을 보여 주는
 * 대표 케이스 하나만 둔다. 더 보고 싶으면 3분 보기나 덱으로 넘어간다.
 */
export const BriefView = ({ digests, onShowCases }: Props) => (
  <ol className="flex flex-col gap-4 print:gap-0">
    {digests.map((digest) => {
      const brief = featuredBrief(digest);
      return (
        <li
          key={digest.id}
          className="rounded-xl border border-border/70 bg-card px-5 py-5 print:border-0 print:border-b print:border-b-gray-300 print:rounded-none print:bg-transparent print:px-0 print:py-3 print:break-inside-avoid"
        >
          <div className="flex items-start gap-3">
            {digest.icon && (
              <img
                src={digest.icon}
                alt=""
                className="size-9 rounded-lg object-contain bg-white border border-border/40 shrink-0 p-1 print:hidden"
              />
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-primary leading-snug print:text-black print:text-[12pt]">
                {digest.title}
              </h2>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground/80 print:text-gray-500 print:text-[9pt]">
                <Calendar className="size-3.5 print:hidden" />
                {digest.range}
              </p>
            </div>
          </div>

          <p className="mt-3 text-base leading-relaxed text-muted-foreground print:text-black print:text-[10pt]">
            {digest.tldr}
          </p>

          {brief && (
            <a
              href={brief.href}
              data-astro-reload
              className="group mt-4 block rounded-lg bg-muted/40 px-4 py-3 hover:bg-muted/70 transition-colors print:bg-transparent print:px-0 print:py-1"
            >
              <p className="mb-2 text-sm font-medium text-muted-foreground/70 print:text-gray-500">
                대표 케이스 · {briefLocation(brief)}
              </p>
              <BriefLines brief={brief} />
              <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary/80 group-hover:text-primary print:hidden">
                이 케이스 자세히 보기 <ArrowRight className="size-3.5" />
              </span>
            </a>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm print:hidden">
            {digest.briefs.length > 1 && (
              <button
                type="button"
                onClick={() => onShowCases(digest.id)}
                className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                케이스 {digest.briefs.length}개 한눈에 보기
              </button>
            )}
            <a
              href={digest.href}
              data-astro-reload
              className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              전체 발표 자료 열기
            </a>
          </div>
        </li>
      );
    })}
  </ol>
);
