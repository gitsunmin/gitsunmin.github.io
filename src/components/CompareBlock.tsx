import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export function Then({ children }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base" aria-hidden="true">🕰️</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">라떼는</span>
      </div>
      <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mb-3 [&>ul]:pl-4 [&>ul]:list-disc">
        {children}
      </div>
    </div>
  );
}

export function Now({ children }: Props) {
  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base" aria-hidden="true">🤖</span>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400">지금은</span>
      </div>
      <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mb-3 [&>ul]:pl-4 [&>ul]:list-disc">
        {children}
      </div>
    </div>
  );
}

export function Compare({ children }: Props) {
  return (
    <div className="flex flex-col gap-4 my-8 not-prose">
      {children}
    </div>
  );
}
