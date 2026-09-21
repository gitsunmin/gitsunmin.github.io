import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import { SearchPanel } from '@/components/search/SearchPanel';
import { type SearchScope, useWorkSearch } from '@/components/search/useWorkSearch';
import { MOBILE_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import { hrefOf, type SearchHit } from '@/lib/workSearch';
import { cn } from '@/lib/utils';

/**
 * works 검색 오버레이 — /works와 /work/<id>가 같은 것을 띄운다.
 *
 * 다른 것은 시작 스코프뿐이다. 상세 페이지는 그 프로젝트가 칩으로 들어간 채 열리고,
 * 칩을 빼면 전체 검색이 된다. 어느 페이지에서 열었든 결과는 같은 모양이다.
 *
 * PC는 화면 위쪽 다이얼로그(<dialog>), 모바일은 vaul 하단 시트. 단축키는 ⌘K / Ctrl+K와 `/`.
 */

export type WorkSearchProps = {
  /** 열릴 때 칩으로 들어가 있을 프로젝트. 목록 페이지에서는 없다. */
  scope?: SearchScope | null;
  /**
   * 같은 페이지 안에서 처리할 수 있는 이동. true를 돌려주면 페이지를 옮기지 않는다.
   * 덱이 같은 프로젝트의 슬라이드로 스크롤할 때 쓴다.
   */
  onNavigateWithin?: (hit: SearchHit, query: string) => boolean;
  /** bar — 입력창처럼 생긴 넓은 버튼. icon — 돋보기 하나. */
  variant?: 'bar' | 'icon';
  className?: string;
};

/** `window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { query } }))`로 연다. */
export const OPEN_EVENT = 'works-search:open';

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]') !== null;

export function WorkSearch({ scope = null, onNavigateWithin, variant = 'bar', className }: WorkSearchProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const state = useWorkSearch(open, scope);

  // 단축키. 글자를 받는 곳에 포커스가 있으면 `/`는 양보하고, ⌘K는 어디서든 받는다.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 다른 컴포넌트(위치 표시줄의 "다시 열기" 칩)가 검색어를 실어 열 수 있게 한다.
  const { setQuery } = state;
  useEffect(() => {
    const onOpen = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query;
      if (typeof query === 'string') setQuery(query);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [setQuery]);

  const close = useCallback(() => setOpen(false), []);

  // 모바일에서 같은 프로젝트 안으로 이동할 때의 목표. 시트가 떠 있는 동안은 문서
  // 스크롤이 잠겨 있어(iOS Safari) 바로 가는 게 안 먹을 수 있으니, 시트가 다 내려간
  // 뒤에 한 번 더 간다.
  const pending = useRef<{ hit: SearchHit; query: string } | null>(null);
  const onClosed = useCallback(() => {
    const target = pending.current;
    pending.current = null;
    if (target) onNavigateWithin?.(target.hit, target.query);
  }, [onNavigateWithin]);

  const handleSelect = useCallback(
    (hit: SearchHit, query: string) => {
      state.remember(query);
      setOpen(false);
      if (onNavigateWithin?.(hit, query)) {
        if (isMobile) pending.current = { hit, query };
        return;
      }
      // 카드와 같은 이유로 ClientRouter를 거치지 않는다 — 덱은 무거워서 뷰 트랜지션이
      // 새 문서를 다 받을 때까지 이 페이지를 멈춘 것처럼 보이게 한다.
      window.location.assign(hrefOf(hit, query));
    },
    [onNavigateWithin, state, isMobile],
  );

  const shortcut = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';

  return (
    <>
      {variant === 'bar' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'group flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left shadow-sm',
            'transition-all hover:border-primary/40 hover:shadow-md',
            className,
          )}
        >
          <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            기술·경험으로 찾기 <span className="hidden text-muted-foreground/60 sm:inline">— 예: GraphQL, WebView, 정산</span>
          </span>
          <kbd className="hidden shrink-0 rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-sans text-[11px] text-muted-foreground sm:inline-block">{shortcut}</kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="검색"
          title={`검색 (${shortcut})`}
          className={className}
        >
          <Search className="size-4" strokeWidth={1.75} />
        </button>
      )}

      {isMobile ? (
        <BottomSheet open={open} onOpenChange={setOpen} onClosed={onClosed} title="works 검색" height={0.94}>
          <SearchPanel state={state} onSelect={handleSelect} onClose={close} />
        </BottomSheet>
      ) : (
        <SearchDialog open={open} onClose={close}>
          <SearchPanel state={state} onSelect={handleSelect} onClose={close} />
        </SearchDialog>
      )}
    </>
  );
}

/**
 * PC 다이얼로그. 네이티브 <dialog>라 포커스 가둠·Esc·배경 잠금이 따라온다.
 * 배경(::backdrop)을 누르면 닫는다 — 클릭 대상이 dialog 자신일 때가 그 경우다.
 */
function SearchDialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // showModal은 첫 포커스 가능 요소(스코프 칩의 ×)로 포커스를 옮긴다. 입력창이 먼저다.
      dialog.querySelector('input')?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-label="works 검색"
      className={cn(
        'work-search-dialog fixed inset-0 mx-auto mb-auto mt-[10vh] w-[min(40rem,calc(100vw-2rem))] max-h-[70vh] overflow-hidden rounded-2xl p-0',
        'border border-border bg-background text-foreground shadow-2xl shadow-black/20',
        'backdrop:bg-black/40 backdrop:backdrop-blur-[2px]',
      )}
    >
      {open && <div className="flex h-[min(70vh,36rem)] flex-col">{children}</div>}
    </dialog>
  );
}
