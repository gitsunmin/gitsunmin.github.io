import { ChevronRight, List } from 'lucide-react';
import type React from 'react';
import { DeckArrival } from '@/components/deck/DeckArrival';
import { type Outline, type OutlinePosition, positionCrumbs } from '@/components/deck/outline';

/**
 * 위치 표시줄 — "지금 어디"를 항상 글자로 보여 준다.
 *
 * 도트는 진행률만 말하고 위치는 말하지 않는다. 93장짜리 덱에서 스물 몇 번째 점이
 * 켜져 있다는 것으로는 어느 장의 어느 문제를 읽고 있는지 알 수 없다. 그래서
 * `장 › 묶음 › 슬라이드`를 그대로 적고, 누르면 전체 목차가 열린다.
 *
 * PC 전용 — 좌상단에 떠 있는 알약. 모바일은 DeckArch가 화면 가장자리를 따라 적는다.
 */
type Props = {
  outline: Outline;
  position: OutlinePosition | null;
  active: number;
  total: number;
  outlineOpen: boolean;
  onToggleOutline: () => void;
  /** 위치 표시줄 오른쪽에 붙는 검색 버튼. */
  search?: React.ReactNode;
  /** 검색 결과에서 넘어왔을 때의 검색어. 있으면 그 맥락을 칩으로 남긴다. */
  arrivedQuery?: string;
  onDismissArrival?: () => void;
};

export function DeckPosition({ outline, position, active, total, outlineOpen, onToggleOutline, search, arrivedQuery, onDismissArrival }: Props) {
  const crumbs = positionCrumbs(outline, position);

  return (
    <div className="deck-position print:hidden">
      <div className="deck-position-row">
      <button
        type="button"
        onClick={onToggleOutline}
        aria-expanded={outlineOpen}
        aria-label="목차 열기"
        title="목차 (T)"
        className="deck-position-button"
      >
        <List className="size-4 shrink-0" strokeWidth={1.75} />

        {/* key로 장이 바뀔 때마다 다시 그려 등장 연출이 걸리게 한다. */}
        <span className="deck-position-crumbs" key={position?.chapter.index ?? -1}>
          {crumbs?.chapter && (
            <>
              <span className="deck-crumb deck-crumb-chapter">{crumbs.chapter}</span>
              <ChevronRight className="deck-crumb-sep" />
            </>
          )}
          <span className="deck-crumb deck-crumb-group">{crumbs?.group ?? ''}</span>
          {crumbs?.item && (
            <>
              <ChevronRight className="deck-crumb-sep" />
              <span className="deck-crumb deck-crumb-item">{crumbs.item}</span>
            </>
          )}
        </span>

        <span className="deck-position-counter tabular-nums">
          {active + 1}
          <span className="opacity-40"> / {total}</span>
        </span>
      </button>

      {search}
      </div>

      {arrivedQuery && <DeckArrival query={arrivedQuery} onDismiss={onDismissArrival} />}

      {/* 모바일 전용 진행 바. PC는 오른쪽 레일이 대신한다. */}
      <div
        className="deck-progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={active + 1}
        aria-label="덱 진행률"
        style={{ '--deck-progress': total > 1 ? active / (total - 1) : 1 } as React.CSSProperties}
      />
    </div>
  );
}
