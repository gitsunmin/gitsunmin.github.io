import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';
import { useState } from 'react';

type CategoryEntry = { url: string; title: string };
type Category = { category: string; entries: CategoryEntry[] };

type Props = {
  categories: Category[];
  totalCount: number;
};

export const TILExplorer = ({ categories, totalCount }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.category ?? '',
  );
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set([categories[0]?.category ?? '']),
  );

  const selectedEntries =
    categories.find((c) => c.category === selectedCategory)?.entries ?? [];

  const toggleMobileCategory = (category: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-baseline gap-3">
        <p className="text-muted-foreground text-sm">
          총{' '}
          <span className="text-foreground font-semibold">{totalCount}</span>개
          기록
        </p>
      </div>

      {/* 데스크톱: 2단 레이아웃 */}
      <div className="hidden md:flex gap-8 items-start">
        {/* 좌측 사이드바 */}
        <nav className="w-44 shrink-0 sticky top-24 self-start">
          <ul className="space-y-0.5">
            {categories.map(({ category, entries }, index) => (
              <li key={category}>
                <button
                  type='button'
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    'hover:bg-accent/60',
                    selectedCategory === category
                      ? 'bg-accent text-accent-foreground font-semibold border-l-2 border-primary pl-2.5'
                      : 'text-muted-foreground',
                  )}
                  style={{
                    animationName: 'til-sidebar-enter',
                    animationDuration: '300ms',
                    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    animationFillMode: 'both',
                    animationDelay: `${index * 40}ms`,
                  }}
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <Folder
                      size={14}
                      className={cn(
                        'shrink-0',
                        selectedCategory === category
                          ? 'text-primary'
                          : 'text-muted-foreground',
                      )}
                    />
                    <span className="truncate capitalize">
                      {category.replace(/_/g, ' ')}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded-md shrink-0',
                      selectedCategory === category
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {entries.length}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 우측 항목 목록 */}
        <div key={selectedCategory} className="flex-1 min-w-0">
          <div className="mb-4 pb-3 border-b border-border">
            <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
              <Folder size={18} className="text-primary" />
              {selectedCategory.replace(/_/g, ' ')}
              <span className="text-sm font-normal text-muted-foreground">
                ({selectedEntries.length})
              </span>
            </h2>
          </div>
          <ul className="space-y-1">
            {selectedEntries.map((entry, index) => (
              <li
                key={entry.url}
                style={{
                  animationName: 'til-item-enter',
                  animationDuration: '250ms',
                  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  animationFillMode: 'both',
                  animationDelay: `${index * 35}ms`,
                }}
              >
                <a
                  href={entry.url}
                  className={cn(
                    'group flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                    'text-foreground/80 hover:text-foreground',
                    'hover:bg-accent/50 transition-all duration-150',
                  )}
                >
                  <FileText
                    size={14}
                    className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors duration-150"
                  />
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                    {entry.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 모바일: 아코디언 레이아웃 */}
      <div className="flex flex-col md:hidden gap-1">
        {categories.map(({ category, entries }) => {
          const isOpen = openCategories.has(category);
          return (
            <div
              key={category}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                type='button'
                onClick={() => toggleMobileCategory(category)}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-4 py-3',
                  'text-sm font-medium transition-colors duration-150',
                  isOpen
                    ? 'bg-accent/60 text-foreground'
                    : 'bg-card text-muted-foreground hover:bg-accent/30',
                )}
              >
                <span className="flex items-center gap-2">
                  <Folder
                    size={15}
                    className={isOpen ? 'text-primary' : 'text-muted-foreground'}
                  />
                  <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded-md',
                      isOpen
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {entries.length}
                  </span>
                  {isOpen ? (
                    <ChevronDown size={15} className="text-primary" />
                  ) : (
                    <ChevronRight size={15} className="text-muted-foreground" />
                  )}
                </span>
              </button>

              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-out',
                  isOpen ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0',
                )}
              >
                <ul className="px-2 py-2 space-y-0.5">
                  {entries.map((entry) => (
                    <li key={entry.url}>
                      <a
                        href={entry.url}
                        className={cn(
                          'group flex items-center gap-2 px-3 py-2 rounded-md text-sm',
                          'text-foreground/75 hover:text-foreground hover:bg-accent/50',
                          'transition-colors duration-150',
                        )}
                      >
                        <FileText
                          size={13}
                          className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors duration-150"
                        />
                        {entry.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
