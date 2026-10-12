import { Clock, Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { highlight, normalize } from '@/lib/workSearch';
import { suggest, type Suggestion, type SuggestionKind } from '@/lib/workSuggest';
import { cn } from '@/lib/utils';

const KIND_LABEL: Record<SuggestionKind, string> = {
  recent: '최근 검색',
  tech: '기술',
  work: '프로젝트',
  case: '케이스',
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  vocabulary: Suggestion[];
  recent: string[];
  onForget: (query: string) => void;
  /** home — 첫 화면의 큰 상자. compact — 결과 화면 맨 위. */
  size: 'home' | 'compact';
  autoFocus?: boolean;
  className?: string;
};

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]') !== null;

/**
 * Google식 검색창 — 둥근 상자, 입력하면 아래로 붙어 펼쳐지는 자동완성.
 *
 * 화살표로 제안을 고르면 입력창에도 그 말이 들어가고(Google과 같다), Esc는 입력하던 말로 돌아간다.
 * `/`와 ⌘K·Ctrl K로 어디서든 입력창에 들어온다.
 */
export const SearchBox = ({ value, onChange, onSubmit, vocabulary, recent, onForget, size, autoFocus, className }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [focused, setFocused] = useState(false);
  const [cursor, setCursor] = useState(-1);

  const items = useMemo(() => suggest(vocabulary, recent, value), [vocabulary, recent, value]);
  const open = focused && items.length > 0;
  const shown = cursor >= 0 && items[cursor] ? items[cursor].text : value;
  const typed = normalize(value);

  useEffect(() => {
    if (autoFocus && window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const isK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const isSlash = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target);
      if (!isK && !isSlash) return;
      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submit = (query: string) => {
    if (query.trim() === '') return;
    onChange(query);
    setCursor(-1);
    inputRef.current?.blur();
    onSubmit(query);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!open) return;
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      // -1(입력하던 말)까지 한 바퀴로 돈다.
      setCursor((prev) => ((prev + 1 + step + items.length + 1) % (items.length + 1)) - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      submit(shown);
    } else if (event.key === 'Escape') {
      if (cursor >= 0) setCursor(-1);
      else inputRef.current?.blur();
    }
  };

  const home = size === 'home';

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative z-20 flex items-center gap-3 border bg-background transition-shadow',
          home ? 'h-[52px] px-5' : 'h-11 px-4',
          open
            ? 'rounded-t-3xl border-transparent shadow-[0_1px_6px_rgba(32,33,36,0.28)] dark:bg-[#303134] dark:shadow-none'
            : 'rounded-full border-border hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] dark:bg-[#202124] dark:border-[#5f6368] dark:hover:bg-[#303134] dark:hover:shadow-none dark:focus-within:bg-[#303134]',
        )}
      >
        <Search className="size-[18px] shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="작업물 검색"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={cursor >= 0 ? `${listId}-${cursor}` : undefined}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          value={shown}
          onChange={(event) => {
            onChange(event.target.value);
            setCursor(-1);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setCursor(-1);
          }}
          onKeyDown={onKeyDown}
          placeholder={home ? '기술·경험·문제로 찾아보세요' : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden"
        />
        {value !== '' && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onChange('');
              setCursor(-1);
              inputRef.current?.focus();
            }}
            className="-mr-1 rounded-full p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="추천 검색어"
          className="absolute inset-x-0 top-full z-10 rounded-b-3xl bg-background pb-3 shadow-[0_4px_6px_rgba(32,33,36,0.28)] dark:bg-[#303134] dark:shadow-none"
        >
          <li aria-hidden className={cn('mb-2 border-t border-border/70 dark:border-[#5f6368]', home ? 'mx-5' : 'mx-4')} />
          {items.map((item, index) => (
            <li
              key={`${item.kind}:${item.text}`}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === cursor}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setCursor(-1)}
              onClick={() => submit(item.text)}
              className={cn(
                'group flex cursor-pointer items-center gap-3 py-1.5',
                home ? 'px-5' : 'px-4',
                index === cursor ? 'bg-muted dark:bg-[#3c4043]' : 'hover:bg-muted/70 dark:hover:bg-[#3c4043]',
              )}
            >
              {item.kind === 'recent' ? (
                <Clock className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <Search className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span className={cn('min-w-0 flex-1 truncate', item.kind === 'recent' && 'text-[#681da8] dark:text-[#c58af9]')}>
                {/* Google처럼 입력한 부분은 보통, 이어지는 부분은 굵게. */}
                {highlight(item.text, typed ? [typed] : []).map((part, i) => (
                  <span key={i} className={part.hit ? undefined : 'font-semibold'}>
                    {part.text}
                  </span>
                ))}
              </span>
              {item.kind === 'recent' ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onForget(item.text);
                  }}
                  className="shrink-0 text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  삭제
                </button>
              ) : (
                <span className="shrink-0 text-xs text-muted-foreground/70">{KIND_LABEL[item.kind]}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
