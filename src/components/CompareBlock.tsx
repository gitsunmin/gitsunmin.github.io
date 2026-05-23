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
      <div className={`min-w-0 ${isLast ? 'pb-1' : 'pb-5'}`}>
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
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5 flex-1 min-w-0">
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
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-5 flex-1 min-w-0">
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
