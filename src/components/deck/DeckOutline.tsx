import { ChevronDown, Printer, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import type { Outline, OutlineGroup } from '@/components/deck/outline';
import { MOBILE_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

/**
 * 전체 목차 패널.
 *
 * PC에서는 왼쪽에서 밀려 들어오는 사이드 패널이라 덱을 가리지 않고 옆에 붙는다 —
 * 목차를 열어 둔 채로 넘겨 읽는 쓰임새가 있다. 모바일은 그럴 자리가 없으니
 * 하단 시트(vaul)로 띄우고, 항목을 고르면 닫는다.
 *
 * 계층은 `장 › 묶음 › 슬라이드`. 케이스 안쪽(상황·접근·결과)은 접어 두고 지금 읽는
 * 케이스만 펼친다. 93장을 다 펼치면 목차가 아니라 또 하나의 긴 문서가 된다.
 */
type Props = {
  outline: Outline;
  active: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoTo: (index: number) => void;
};

export function DeckOutline({ outline, active, open, onOpenChange, onGoTo }: Props) {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const select = (index: number) => {
    onGoTo(index);
    if (isMobile) onOpenChange(false);
  };

  // 모바일은 시트를 닫고 나서 인쇄한다. 시트가 열려 있는 동안은 다이얼로그가 body에
  // overflow: hidden을 걸어 두는데, 그 상태로 인쇄하면 첫 장 뒤가 잘린다.
  // 닫힘 연출(500ms)이 끝나 시트가 내려간 뒤에 부른다.
  const print = () => {
    if (!isMobile) {
      window.print();
      return;
    }
    onOpenChange(false);
    window.setTimeout(() => window.print(), 650);
  };

  if (isMobile) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title="목차" height={0.85}>
        <OutlineList outline={outline} active={active} open={open} onSelect={select} onPrint={print} />
      </BottomSheet>
    );
  }

  return (
    <aside
      className="deck-outline print:hidden"
      data-open={open ? '' : undefined}
      aria-label="목차"
      aria-hidden={!open}
    >
      <div className="deck-outline-head">
        <span className="deck-eyebrow">목차</span>
        <button type="button" onClick={() => onOpenChange(false)} className="deck-outline-close" aria-label="목차 닫기" title="닫기 (Esc)">
          <X className="size-4" />
        </button>
      </div>
      <OutlineList outline={outline} active={active} open={open} onSelect={select} onPrint={print} />
    </aside>
  );
}

type ListProps = {
  outline: Outline;
  active: number;
  open: boolean;
  onSelect: (index: number) => void;
  onPrint: () => void;
};

const containsActive = (group: OutlineGroup, active: number) =>
  group.items.some((item) => item.index === active);

function OutlineList({ outline, active, open, onSelect, onPrint }: ListProps) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const listRef = useRef<HTMLDivElement>(null);

  // 열릴 때 지금 읽는 항목이 보이는 자리로 옮긴다. 처음부터 맨 위를 보여 주면
  // 60번째 슬라이드에서 연 사람이 매번 스크롤해 내려와야 한다.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      listRef.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'center' });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, active]);

  const normalized = query.trim().toLowerCase();
  const matches = (text: string) => normalized === '' || text.toLowerCase().includes(normalized);

  const filtered = useMemo(
    () =>
      outline
        .map((chapter) => ({
          ...chapter,
          groups: chapter.groups
            .map((group) => {
              const groupText = `${group.label ?? ''} ${group.title}`;
              // 묶음 제목이 맞으면 항목을 다 보여 주고, 아니면 맞는 항목만 남긴다.
              const items = matches(groupText) || matches(chapter.title)
                ? group.items
                : group.items.filter((item) => matches(item.label));
              return { ...group, items };
            })
            .filter((group) => group.items.length > 0),
        }))
        .filter((chapter) => chapter.groups.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [outline, normalized],
  );

  const total = filtered.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0), 0);

  const toggle = (index: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className="deck-outline-body">
      <label className="deck-outline-filter">
        <Search className="size-3.5 shrink-0 opacity-50" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="목차에서 찾기"
          aria-label="목차에서 찾기"
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="지우기" className="opacity-50 hover:opacity-100">
            <X className="size-3.5" />
          </button>
        )}
      </label>

      <div ref={listRef} className="deck-outline-list" role="navigation">
        {filtered.length === 0 && (
          <p className="deck-outline-empty">
            <span className="font-medium text-foreground">‘{query}’</span>에 맞는 슬라이드가 없어요.
          </p>
        )}

        {filtered.map((chapter) => (
          <section key={chapter.index} className="deck-outline-chapter">
            {outline.length > 1 && (
              <button
                type="button"
                onClick={() => onSelect(chapter.index)}
                className="deck-outline-chapter-title"
              >
                {chapter.title}
              </button>
            )}

            <ul>
              {chapter.groups.map((group) => {
                const isActiveGroup = containsActive(group, active);
                const single = group.items.length === 1;
                const isOpen = single || normalized !== '' || isActiveGroup || expanded.has(group.index);
                const first = group.items[0];

                return (
                  <li key={group.index} className="deck-outline-group" data-active={isActiveGroup ? '' : undefined}>
                    <div className="deck-outline-group-row">
                      <button
                        type="button"
                        onClick={() => onSelect(single ? first.index : group.index)}
                        aria-current={single && first.index === active ? 'true' : undefined}
                        className="deck-outline-group-title"
                      >
                        {group.label && <span className="deck-outline-case-label">{group.label}</span>}
                        <span className="truncate">{group.title}</span>
                      </button>
                      {!single && (
                        <button
                          type="button"
                          onClick={() => toggle(group.index)}
                          aria-expanded={isOpen}
                          aria-label={`${group.title} ${isOpen ? '접기' : '펼치기'}`}
                          className="deck-outline-toggle"
                        >
                          <ChevronDown className={cn('size-3.5 transition-transform', isOpen && 'rotate-180')} />
                        </button>
                      )}
                    </div>

                    {!single && isOpen && (
                      <ul className="deck-outline-items">
                        {group.items.map((item) => (
                          <li key={item.index}>
                            <button
                              type="button"
                              onClick={() => onSelect(item.index)}
                              aria-current={item.index === active ? 'true' : undefined}
                              className="deck-outline-item"
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="deck-outline-foot">
        <span className="tabular-nums" aria-live="polite">
          {normalized ? `${total}개 슬라이드` : `${active + 1} / ${total}`}
        </span>
        <button type="button" onClick={onPrint} className="deck-mode" title="덱 전체를 인쇄합니다">
          <Printer className="size-3" />
          인쇄
        </button>
      </div>
    </div>
  );
}
