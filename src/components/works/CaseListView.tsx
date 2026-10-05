import { ArrowUpRight } from 'lucide-react';
import { BriefLines, CompetencyChips } from '@/components/works/BriefLines';
import { groupByChapter, type WorkDigest } from '@/lib/workBriefs';

/**
 * 3분 보기 — 모든 케이스를 문제 → 결정 → 결과 세 줄로 훑는다.
 * 줄마다 덱의 그 케이스로 바로 이어진다.
 */
export const CaseListView = ({ digests }: { digests: WorkDigest[] }) => (
  <div className="flex flex-col gap-10 print:gap-4">
    {digests
      .filter((digest) => digest.briefs.length > 0)
      .map((digest) => (
        <section key={digest.id} id={`cases-${digest.id}`} className="scroll-mt-24">
          <header className="border-b border-border/40 pb-2 print:border-b-black">
            <h2 className="text-lg font-bold text-primary print:text-black print:text-[12pt]">
              <a href={digest.href} data-astro-reload className="hover:underline underline-offset-4">
                {digest.title}
              </a>
            </h2>
            <p className="mt-1 text-base leading-relaxed text-muted-foreground print:text-[9pt]">{digest.tldr}</p>
          </header>

          {groupByChapter(digest.briefs).map(({ chapter, briefs }) => (
            <div key={chapter ?? digest.id} className="mt-4">
              {chapter && (
                <h3 className="mb-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground/55">
                  {chapter}
                </h3>
              )}
              <ul className="flex flex-col gap-2">
                {briefs.map((brief) => (
                  <li key={brief.id} className="print:break-inside-avoid">
                    <a
                      href={brief.href}
                      data-astro-reload
                      className="group block rounded-lg border border-transparent px-3 py-3 -mx-3 hover:border-border/60 hover:bg-muted/40 transition-colors print:py-1"
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-muted-foreground/70">
                          {brief.label !== brief.title ? `${brief.label} · ${brief.title}` : brief.label}
                        </p>
                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/30 group-hover:text-primary/60 print:hidden" />
                      </div>
                      <BriefLines brief={brief} />
                      <div className="mt-2">
                        <CompetencyChips tags={brief.tags} />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
  </div>
);
