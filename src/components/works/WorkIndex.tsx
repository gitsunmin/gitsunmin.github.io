import { ArrowUpRight } from 'lucide-react';
import type { WorkCategory } from '@/data/works';
import type { WorkDigest } from '@/lib/workBriefs';

/** 운영 중인 서비스를 먼저, 도구·사이트를 뒤에 둔다. 객체 순서가 곧 목록 순서다. */
const CATEGORY_LABELS: Record<WorkCategory, string> = {
  service: '서비스',
  'side-project': '사이드 프로젝트',
  framework: '프레임워크',
  library: '라이브러리',
  'vscode-extension': 'VSCode 확장',
  website: '웹사이트',
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);
const byCategory = (a: WorkDigest, b: WorkDigest) =>
  CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);

/**
 * 전체 작업 — 프로젝트마다 한 줄. 검색 없이 훑어보고 덱으로 넘어가는 목차다.
 */
export const WorkIndex = ({ digests }: { digests: WorkDigest[] }) => (
  <section aria-labelledby="all-work">
    <h2 id="all-work" className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground print:text-black">
      전체 작업
    </h2>
    <ul className="divide-y divide-border/50 border-y border-border/50">
      {[...digests].sort(byCategory).map((digest) => (
        <li key={digest.id} className="print:break-inside-avoid">
          <a
            href={digest.href}
            data-astro-reload
            className="group flex items-start gap-3 py-4 hover:bg-muted/30 transition-colors -mx-3 px-3 rounded-lg print:mx-0 print:px-0"
          >
            {digest.icon ? (
              <img
                src={digest.icon}
                alt=""
                className="mt-0.5 size-8 shrink-0 rounded-lg object-contain bg-white border border-border/40 p-1 print:hidden"
              />
            ) : (
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted border border-border/40 text-xs font-semibold text-muted-foreground print:hidden">
                {digest.title.slice(0, 2)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold text-foreground group-hover:text-primary">{digest.title}</span>
                <span className="text-xs text-muted-foreground/70">
                  {CATEGORY_LABELS[digest.category]} · {digest.range}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground print:text-black">{digest.tldr}</p>
            </div>
            <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground/30 group-hover:text-primary/60 print:hidden" />
          </a>
        </li>
      ))}
    </ul>
  </section>
);
