import { useId, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * 아치 — 모바일에서 "지금 어디"를 화면 가장자리를 따라 적는다.
 *
 * 헤더 상자를 두면 그만큼 슬라이드가 가려진다. 대신 글자를 화면 테두리를 따라
 * 굽혀 놓는다: 위 모서리를 돌아 양옆으로 내려오는 길 위에 SVG textPath로 얹는다.
 * 짧은 제목은 위 가장자리만 쓰고, 길어지면 그만큼 양옆으로 흘러내린다. 그래서
 * 한 줄에 못 담던 제목도 줄이지 않고 다 보이고, 화면 한가운데는 비워 둔다.
 *
 * 글자 뒤에는 같은 길을 따라 굽은 유리 띠를 깐다 — 뒤를 흐리는 배경(backdrop-filter)을
 * 같은 길을 굵게 그은 SVG로 마스크한 것이다. 마스크의 선은 dasharray로 글자가 놓인
 * 구간만 남기므로, 글자가 없는 곳에는 유리도 없다. 본문이 그 아래를 스크롤해
 * 지나가도 글자와 겹쳐 보이지 않는다.
 *
 * 글자 크기·길이·잘라내기는 렌더 뒤에 실제 폭을 재서 정한다. React state가 아니라
 * DOM에 바로 쓴다 — 재는 일과 그리는 일이 같은 프레임에 끝나야 깜빡이지 않는다.
 */
type Props = {
  /** `[장, 묶음, 슬라이드]` 순서. 사이는 ›로 잇는다. */
  crumbs: string[];
  onOpen: () => void;
  /** 아치 아래 가운데에 놓이는 것(검색 도착 칩). */
  children?: ReactNode;
};

/** 화면 모서리 반지름. 요즘 폰의 둥근 모서리와 비슷한 값. */
const CORNER = 44;
/** 유리 띠의 바깥 가장자리가 화면 가장자리에서 떨어진 거리. */
const GLASS_INSET = 4;
/** 글자 머리가 유리 띠 바깥 가장자리에서 떨어진 거리(글자 높이는 따로 더한다). */
const TEXT_GAP = 5;
/** 글자 기준선 아래로 유리 띠가 더 내려오는 거리. */
const GLASS_BELOW = 8;
const FONT_SIZES = [13, 12, 11];
/** 양옆으로 내려올 수 있는 최대 길이(화면 높이 비율). */
const MAX_DROP_RATIO = 0.42;
const ELLIPSIS = '…';

/**
 * 가장자리에서 `inset`만큼 안쪽으로 들어온, ∩ 모양의 길.
 * 왼쪽 아래에서 출발해 위 모서리를 돌아 오른쪽 아래로 끝난다 — textPath가
 * 이 방향으로 글자를 얹으므로 글자 머리가 바깥(가장자리)을 향한다.
 */
function archPath(width: number, top: number, inset: number, drop: number) {
  const r = Math.max(2, CORNER - inset);
  const x0 = inset;
  const x1 = width - inset;
  const y0 = top + inset;
  const yEnd = top + Math.max(drop, inset + r);
  return [
    `M ${x0} ${yEnd}`,
    `L ${x0} ${y0 + r}`,
    `A ${r} ${r} 0 0 1 ${x0 + r} ${y0}`,
    `L ${x1 - r} ${y0}`,
    `A ${r} ${r} 0 0 1 ${x1} ${y0 + r}`,
    `L ${x1} ${yEnd}`,
  ].join(' ');
}

/** 위 가장자리와 두 모서리만 도는 길의 길이. 이보다 긴 글은 옆으로 내려온다. */
function topLength(width: number, inset: number) {
  const r = Math.max(2, CORNER - inset);
  return width - 2 * inset - 2 * r + Math.PI * r;
}

/**
 * 유리 띠 마스크 — 글자 길의 한가운데를 지나는 길을 띠 너비만큼 굵게 긋되,
 * `from`부터 `length`만큼만 남긴다(dasharray). 양 끝은 둥글다.
 */
function bandMask(width: number, height: number, d: string, band: number, from: number, length: number, total: number) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<path d="${d}" fill="none" stroke="#000" stroke-width="${band}" stroke-linecap="round" ` +
    `stroke-dasharray="${length} ${total}" stroke-dashoffset="${-from}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function safeTop(element: Element) {
  return parseFloat(getComputedStyle(element).getPropertyValue('--deck-safe-top')) || 0;
}

export function DeckArch({ crumbs, onOpen, children }: Props) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const textPathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const probeRef = useRef<SVGTextElement>(null);
  const label = crumbs.join('  ›  ');

  useLayoutEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const probe = probeRef.current;
    const text = textRef.current;
    if (!root || !svg || !probe || !text) return;

    const layout = () => {
      const width = window.innerWidth;
      const top = safeTop(root);
      const maxDrop = Math.round(window.innerHeight * MAX_DROP_RATIO);

      let fontSize = FONT_SIZES[0];
      let shown = label;
      let textInset = 0;
      let drop = 0;

      // 글자 크기를 한 단계씩 줄여 가며, 옆으로 내려와도 되는 한계 안에 드는 크기를 찾는다.
      for (const size of FONT_SIZES) {
        fontSize = size;
        textInset = GLASS_INSET + TEXT_GAP + Math.round(size * 0.8);
        probe.setAttribute('font-size', String(size));
        probe.textContent = label;
        const need = probe.getComputedTextLength();
        const onTop = topLength(width, textInset);
        // 양옆으로 반씩 나눠 내려온다. 모서리 아래로 한 글자쯤 더 여유를 둔다.
        const r = CORNER - textInset;
        drop = need <= onTop ? textInset + r : textInset + r + (need - onTop) / 2 + size;
        if (drop <= maxDrop) break;
      }

      // 가장 작게 줄여도 넘치면 뒤를 잘라 …을 붙인다.
      if (drop > maxDrop) {
        drop = maxDrop;
        const r = CORNER - textInset;
        const room = topLength(width, textInset) + 2 * (maxDrop - textInset - r) - fontSize;
        probe.textContent = ELLIPSIS;
        const ellipsis = probe.getComputedTextLength();
        probe.textContent = label;
        let low = 0;
        let high = label.length;
        while (low < high) {
          const mid = (low + high + 1) >> 1;
          if (probe.getSubStringLength(0, mid) + ellipsis <= room) low = mid;
          else high = mid - 1;
        }
        shown = label.slice(0, low).trimEnd() + ELLIPSIS;
      }

      const height = Math.ceil(top + drop + fontSize);
      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      textPathRef.current?.setAttribute('d', archPath(width, top, textInset, drop));
      text.setAttribute('font-size', String(fontSize));
      const path = text.firstElementChild;
      if (path) path.textContent = shown;

      // 유리 띠: 글자 길의 한가운데를 지나는 길을 띠 너비만큼 긋고, 글자가 놓인
      // 구간(가운데 정렬이라 양쪽으로 같은 길이)에 여유를 더한 만큼만 남긴다.
      const glass = glassRef.current;
      const textPath = textPathRef.current;
      if (glass && textPath) {
        const inner = textInset + GLASS_BELOW;
        const mid = (GLASS_INSET + inner) / 2;
        const midPath = archPath(width, top, mid, drop);
        const total = textPath.getTotalLength();
        const shownLength = text.getComputedTextLength();
        const pad = fontSize * 1.2;
        const from = Math.max(0, (total - shownLength) / 2 - pad);
        const length = Math.min(total, shownLength + pad * 2);
        glass.style.height = `${height}px`;
        const mask = bandMask(width, height, midPath, inner - GLASS_INSET, from, length, total);
        glass.style.maskImage = mask;
        glass.style.webkitMaskImage = mask;
      }
    };

    layout();
    window.addEventListener('resize', layout);
    document.fonts?.ready.then(layout);
    return () => window.removeEventListener('resize', layout);
  }, [label]);

  return (
    <div ref={rootRef} className="deck-arch print:hidden" style={{ '--deck-safe-top': 'env(safe-area-inset-top, 0px)' } as CSSProperties}>
      {/* 유리 띠. 글자보다 아래에 깔리고, 모양은 layout()이 오린다. */}
      <div ref={glassRef} className="deck-arch-glass" aria-hidden="true" />

      {/* key로 제목이 바뀔 때마다 새로 그려 등장 연출이 걸리게 한다. */}
      <svg ref={svgRef} key={label} className="deck-arch-svg" aria-hidden="true" focusable="false">
        <defs>
          <path ref={textPathRef} id={`${id}-path`} />
        </defs>
        {/* 폭을 재는 용도. 그리지 않는다. */}
        <text ref={probeRef} className="deck-arch-probe" />
        <text ref={textRef} className="deck-arch-text">
          <textPath href={`#${id}-path`} startOffset="50%" textAnchor="middle" />
        </text>
      </svg>

      {/* 실제로 누르는 것은 SVG 위에 겹친 투명 버튼이다. 스크린 리더는 이것만 읽는다. */}
      <button type="button" onClick={onOpen} className="deck-arch-button" aria-label={`${label} — 목차 열기`} />

      {children && <div className="deck-arch-below">{children}</div>}
    </div>
  );
}
