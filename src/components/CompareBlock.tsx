import { Children, createContext, Fragment, isValidElement, type ReactNode, useContext } from 'react';

// --- StepFlow / Step ---

type StepContextValue = { index: number; isLast: boolean };
const StepContext = createContext<StepContextValue>({ index: 0, isLast: true });

type StepProps = {
  title: string;
  number?: number;
  icon?: string;
  children: ReactNode;
};

export function Step({ title, number, icon, children }: StepProps) {
  const { index, isLast } = useContext(StepContext);
  const badge = icon ?? (number ?? index + 1);

  return (
    <div className="relative flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
          {badge}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-600 my-1" />}
      </div>
      <div className={`${isLast ? 'pb-1' : 'pb-5'}`}>
        <p className="font-semibold text-sm mb-1.5 text-gray-800 dark:text-gray-200">{title}</p>
        <div className="text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// MDX compiles sibling JSX elements into a React Fragment, so Children.toArray
// sees one Fragment instead of individual Step elements. This flattens it.
function flattenChildren(node: ReactNode): ReturnType<typeof Children.toArray> {
  return Children.toArray(node).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment) {
      return flattenChildren((child.props as { children?: ReactNode }).children);
    }
    return [child];
  });
}

export function StepFlow({ children }: { children: ReactNode }) {
  const steps = flattenChildren(children).filter(isValidElement);
  const total = steps.length;
  return (
    <div className="flex flex-col mt-3 mb-1">
      {steps.map((child, i) => (
        <StepContext.Provider key={child.key} value={{ index: i, isLast: i === total - 1 }}>
          {child}
        </StepContext.Provider>
      ))}
    </div>
  );
}

// --- Then / Now / Compare ---

type PanelProps = {
  label?: string;
  icon?: string;
  children: ReactNode;
};

export function Then({ label = '라떼는', icon = '🕰️', children }: PanelProps) {
  return (
    <div data-flip-role="then" className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5 flex-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base" aria-hidden="true">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</span>
      </div>
      <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mb-3 [&>ul]:pl-4 [&>ul]:list-disc">
        {children}
      </div>
    </div>
  );
}

export function Now({ label = '지금은', icon = '🤖', children }: PanelProps) {
  return (
    <div data-flip-role="now" className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-5 flex-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base" aria-hidden="true">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400">{label}</span>
      </div>
      <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mb-3 [&>ul]:pl-4 [&>ul]:list-disc">
        {children}
      </div>
    </div>
  );
}

export function Compare({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 my-8 not-prose">
      {children}
    </div>
  );
}

// --- TimelineMarker ---

export function TimelineMarker({ period, description }: { period: string; description: string }) {
  return (
    <div className="flex items-center gap-3 my-6 not-prose">
      <span className="shrink-0 font-mono text-xs font-bold px-3 py-1.5 rounded-full border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 whitespace-nowrap">
        {period}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
        {description}
      </span>
    </div>
  );
}

// --- FlipCompare ---
// children을 직접 렌더링하고, CSS가 data-view 속성을 기반으로 Then/Now 패널 가시성을 제어.
// Then/Now 컴포넌트에 data-flip-role 속성이 있어 CSS 선택자로 타겟팅 가능.
// 버튼 클릭은 [slug].astro의 initFlipCompare 스크립트가 처리.

export function FlipCompare({ children, left, right }: { children: ReactNode, left?: string; right?: string }) {
  return (
    <div className="my-8 not-prose backdrop-blur-md backdrop-saturate-150 shadow-xs dark:shadow-gray-800" data-component="flip-compare" data-view="then">
      <div className="flex justify-center mb-4" data-flip-toggle="">
        <div className="inline-flex rounded-full border border-gray-200 dark:border-gray-700 p-0.5 gap-0.5">
          <button
            type="button"
            data-flip-btn="then"
            data-active="true"
            className="flip-btn px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
          >
            {left}
          </button>
          <button
            type="button"
            data-flip-btn="now"
            data-active="false"
            className="flip-btn px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
          >
            {right}
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

// --- PromptBlock ---
// Typing animation is handled by vanilla JS in [slug].astro (initPromptBlocks).

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement(node)) {
    const { children } = node.props as { children?: ReactNode };
    return extractText(children);
  }
  return '';
}

export function PromptBlock({ children, speed = 15 }: { children: ReactNode; speed?: number }) {
  const fullText = extractText(children);

  return (
    <div
      className="rounded-lg bg-gray-900 dark:bg-gray-950 border border-gray-700 dark:border-gray-800 p-4 my-4 not-prose"
      data-component="prompt-block"
      data-text={fullText}
      data-speed={speed}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-gray-500 font-mono select-none">prompt</span>
      </div>
      <p className="font-mono text-sm text-green-400 leading-relaxed whitespace-pre-wrap wrap-break-word break-all m-0">
        <span className="text-gray-600 select-none mr-1">›</span>
        <span data-prompt-text="">{children}</span>
        <span
          data-prompt-cursor=""
          className="inline-block w-1.5 h-[1em] bg-green-400 align-middle ml-0.5 animate-pulse"
          aria-hidden="true"
        />
      </p>
    </div>
  );
}
