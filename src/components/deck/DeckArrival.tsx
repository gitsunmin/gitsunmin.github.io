import { Search, X } from 'lucide-react';
import { OPEN_EVENT } from '@/components/search/WorkSearch';

/** 검색에서 왔다는 맥락. 누르면 그 검색어로 다시 연다. */
export function DeckArrival({ query, onDismiss }: { query: string; onDismiss?: () => void }) {
  return (
    <div className="deck-arrival">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { query } }))}
        className="deck-arrival-open"
        title="이 검색어로 다시 찾기"
      >
        <Search className="size-3" />
        <span>‘{query}’ 검색에서 옴</span>
      </button>
      <button type="button" onClick={onDismiss} aria-label="검색 맥락 닫기" className="deck-arrival-close">
        <X className="size-3" />
      </button>
    </div>
  );
}
