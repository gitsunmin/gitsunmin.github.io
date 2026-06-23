import { ChevronDown, ChevronRight, FileText, Folder, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type CategoryEntry = { url: string; title: string };
type Category = { category: string; entries: CategoryEntry[] };

type Props = {
  categories: Category[];
  totalCount: number;
};

const resolveUrlCategory = (categories: Category[]): string | null => {
  if (typeof window === 'undefined') return null;
  const cat = new URLSearchParams(window.location.search).get('category');
  return categories.find((c) => c.category === cat)?.category ?? null;
};

const resolveUrlQuery = (): string => {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q') ?? '';
};

export const TILExplorer = ({ categories, totalCount }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(
    () => resolveUrlCategory(categories) ?? categories[0]?.category ?? '',
  );
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set([resolveUrlCategory(categories) ?? categories[0]?.category ?? '']),
  );
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(
    () => resolveUrlCategory(categories),
  );
  const [searchQuery, setSearchQuery] = useState(() => resolveUrlQuery());

  const sidebarRef = useRef<HTMLUListElement>(null);
  const mobileRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const initialHighlight = useRef(highlightedCategory);

  useEffect(() => {
    const highlighted = initialHighlight.current;
    if (!highlighted) return;

    const t1 = setTimeout(() => {
      mobileRefs.current.get(highlighted)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    const t2 = setTimeout(() => setHighlightedCategory(null), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return categories.flatMap(({ category, entries }) =>
      entries
        .filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            category.toLowerCase().includes(q),
        )
        .map((e) => ({ ...e, category })),
    );
  }, [searchQuery, categories]);

  const selectedEntries =
    categories.find((c) => c.category === selectedCategory)?.entries ?? [];

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    const url = new URL(window.location.href);
    url.searchParams.set('category', category);
    window.history.replaceState({}, '', url.toString());
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    const url = new URL(window.location.href);
    if (q.trim()) {
      url.searchParams.set('q', q);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  };

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
      {/* 검색창 */}
      <div className="relative mb-6">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="제목 또는 카테고리 검색..."
          className={cn(
            'w-full pl-9 pr-9 py-2.5 rounded-lg text-sm',
            'bg-accent/40 border border-border',
            'focus:outline-none focus:ring-2 focus:ring-primary/40',
            'placeholder:text-muted-foreground',
          )}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => handleSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded transition-colors duration-150"
            aria-label="검색어 지우기"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="mb-8 flex items-baseline gap-3">
        <p className="text-muted-foreground text-sm">
          총{' '}
          <span className="text-foreground font-semibold">{totalCount}</span>개
          기록
        </p>
      </div>

      {searchResults !== null ? (
        /* 검색 결과 뷰 (데스크톱·모바일 공통 단일 컬럼) */
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            <span className="text-foreground font-semibold">{searchResults.length}</span>개 검색 결과
          </p>
          {searchResults.length === 0 ? (
            <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
          ) : (
            <ul className="space-y-1">
              {searchResults.map((entry) => (
                <li key={entry.url}>
                  <a
                    href={entry.url}
                    className={cn(
                      'group flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm',
                      'text-foreground/80 hover:text-foreground',
                      'hover:bg-accent/50 transition-all duration-150',
                    )}
                  >
                    <FileText
                      size={14}
                      className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors duration-150"
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150 min-w-0 truncate">
                      {entry.title}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground capitalize shrink-0">
                      {entry.category.replace(/_/g, ' ')}
                    </span>
                    <ChevronRight
                      size={12}
                      className="text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 shrink-0"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          {/* 데스크톱: 2단 레이아웃 */}
          <div className="hidden md:flex gap-8 items-start">
            {/* 좌측 사이드바 */}
            <nav className="w-44 shrink-0 sticky top-24 self-start">
              <ul className="space-y-0.5" ref={sidebarRef}>
                {categories.map(({ category, entries }, index) => {
                  const isSelected = selectedCategory === category;
                  const isHighlighted = highlightedCategory === category;

                  return (
                    <li key={category}>
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(category)}
                        className={cn(
                          'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm',
                          'transition-all duration-200',
                          'hover:bg-accent/60',
                          isSelected
                            ? 'bg-accent text-accent-foreground font-semibold border-l-2 border-primary pl-2.5'
                            : 'text-muted-foreground',
                          isHighlighted && !isSelected && 'animate-pulse',
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
                              'shrink-0 transition-all duration-200',
                              isSelected || isHighlighted
                                ? 'text-primary scale-110'
                                : 'text-muted-foreground',
                            )}
                          />
                          <span className="truncate capitalize">
                            {category.replace(/_/g, ' ')}
                          </span>
                        </span>
                        <span
                          className={cn(
                            'text-xs px-1.5 py-0.5 rounded-md shrink-0 transition-all duration-200',
                            isSelected
                              ? 'bg-primary/15 text-primary'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {entries.length}
                        </span>
                      </button>
                    </li>
                  );
                })}
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
                      <ChevronRight
                        size={12}
                        className="ml-auto text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 shrink-0"
                      />
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
              const isHighlighted = highlightedCategory === category;

              return (
                <div
                  key={category}
                  ref={(el) => {
                    if (el) mobileRefs.current.set(category, el);
                    else mobileRefs.current.delete(category);
                  }}
                  className={cn(
                    'border border-border rounded-lg overflow-hidden',
                    'transition-shadow duration-300',
                    isHighlighted && 'ring-2 ring-primary/40 shadow-md',
                  )}
                >
                  <button
                    type="button"
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
                        className={cn(
                          'transition-all duration-200',
                          isOpen || isHighlighted ? 'text-primary scale-110' : 'text-muted-foreground',
                        )}
                      />
                      <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded-md transition-all duration-200',
                          isOpen
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {entries.length}
                      </span>
                      <ChevronDown
                        size={15}
                        className={cn(
                          'transition-all duration-300',
                          isOpen ? 'text-primary rotate-0' : 'text-muted-foreground -rotate-90',
                        )}
                      />
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
                              'group flex items-center gap-2 px-3 py-2.5 rounded-md text-sm',
                              'text-foreground/75 hover:text-foreground hover:bg-accent/50',
                              'transition-colors duration-150',
                            )}
                          >
                            <FileText
                              size={13}
                              className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors duration-150"
                            />
                            <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                              {entry.title}
                            </span>
                            <ChevronRight
                              size={12}
                              className="ml-auto text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 shrink-0"
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
