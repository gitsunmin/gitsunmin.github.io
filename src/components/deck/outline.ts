/**
 * 덱의 슬라이드 목록을 목차 계층으로 접는다.
 *
 * 슬라이드 제목은 rehype-work-sections가 `h2 · h3` 꼴로 이어 붙여 두었고, 케이스는
 * `문제 N · 제목 · 상황`처럼 머리표까지 붙어 있다. 도트로는 이 계층이 보이지 않아
 * 93장짜리 덱에서 "지금 어느 장의 어느 문제를 읽고 있는지"를 알 길이 없었다.
 * 여기서 제목 문자열만 읽어 `장(chapter) › 묶음(group) › 슬라이드(item)`로 되돌린다.
 *
 * DOM을 직접 만지지 않고 `{ id, title }`만 받는다 — 테스트하기 쉽고, 검색 인덱스처럼
 * DOM이 없는 곳에서도 같은 계층을 쓸 수 있다.
 */

export type OutlineSlide = {
  /** `data-slide` 값. 고정 슬라이드는 이름(cover, intro…), 본문 슬라이드는 빈 문자열. */
  id: string;
  /** `data-slide-title` 값. 도입부처럼 제목이 없는 슬라이드는 빈 문자열. */
  title: string;
};

export type OutlineItem = {
  /** slides 배열에서의 위치. goTo(index)에 그대로 쓴다. */
  index: number;
  /** 묶음 안에서 구분되는 짧은 이름(`상황`, `접근과 결정`…). */
  label: string;
};

export type OutlineGroup = {
  /** 묶음 제목. 케이스면 머리표를 뗀 제목이다. */
  title: string;
  /** `문제 1`처럼 제목 앞에 붙는 머리표. 케이스가 아니면 없다. */
  label?: string;
  /** 첫 슬라이드의 index. 묶음 제목을 눌렀을 때 가는 곳. */
  index: number;
  items: OutlineItem[];
};

export type OutlineChapter = {
  title: string;
  /** 간지 슬라이드의 index. 최상위 장은 표지가 그 자리다. */
  index: number;
  groups: OutlineGroup[];
};

export type Outline = OutlineChapter[];

/** 현재 슬라이드가 계층의 어디에 있는지. 위치 표시줄이 그대로 읽는다. */
export type OutlinePosition = {
  chapter: OutlineChapter;
  group: OutlineGroup;
  item: OutlineItem;
};

const CASE_LABEL = /^문제\s*\d+$/;
const SEPARATOR = ' · ';

/** 간지 슬라이드의 `data-slide`는 `chapter-<이름>`이다. */
const CHAPTER_PREFIX = 'chapter-';

/** 고정 슬라이드는 제목이 곧 묶음 이름이고, 이어지는 본문과 섞이지 않는다. */
const FIXED_IDS = new Set(['cover', 'intro', 'techs', 'thanks']);

/**
 * `문제 1 · 제목 · 상황` → { label: '문제 1', title: '제목', rest: '상황' }
 * `제목 · 상황`         → { title: '제목', rest: '상황' }
 * `제목`                → { title: '제목' }
 */
function parseTitle(raw: string): { label?: string; title: string; rest?: string } {
  const parts = raw.split(SEPARATOR);
  const label = CASE_LABEL.test(parts[0] ?? '') ? parts.shift() : undefined;
  const [title = '', ...rest] = parts;
  return { label, title, rest: rest.length > 0 ? rest.join(SEPARATOR) : undefined };
}

export function buildOutline(slides: OutlineSlide[], rootTitle: string): Outline {
  const chapters: OutlineChapter[] = [];
  let chapter: OutlineChapter | null = null;
  let group: OutlineGroup | null = null;
  /** 직전 묶음이 표지·소개 같은 고정 슬라이드였는지. */
  let fixedGroup = false;

  const openChapter = (title: string, index: number) => {
    chapter = { title, index, groups: [] };
    chapters.push(chapter);
    group = null;
  };

  const openGroup = (index: number, title: string, label?: string) => {
    if (!chapter) openChapter(rootTitle, index);
    group = { title, label, index, items: [] };
    chapter!.groups.push(group);
    return group;
  };

  slides.forEach(({ id, title }, index) => {
    if (id.startsWith(CHAPTER_PREFIX)) {
      openChapter(title || id.slice(CHAPTER_PREFIX.length), index);
      return;
    }

    if (FIXED_IDS.has(id)) {
      // 표지는 최상위 장의 간지 역할을 겸한다.
      if (id === 'cover' && !chapter) openChapter(rootTitle, index);
      openGroup(index, title).items.push({ index, label: title });
      fixedGroup = true;
      return;
    }

    // 제목 없는 슬라이드(도입 인용문, Story). 본문 묶음이 앞에 있으면 거기에 이어
    // 붙이고, 고정 슬라이드 뒤라면 본문의 시작이므로 '도입'으로 연다.
    if (title === '') {
      const target = group && !fixedGroup ? group : openGroup(index, '도입');
      target.items.push({ index, label: target.items.length === 0 ? target.title : '계속' });
      fixedGroup = false;
      return;
    }
    fixedGroup = false;

    const parsed = parseTitle(title);
    const sameGroup =
      group !== null && group.title === parsed.title && group.label === parsed.label;

    if (!sameGroup) group = openGroup(index, parsed.title, parsed.label);
    group!.items.push({ index, label: parsed.rest ?? (group!.items.length === 0 ? '개요' : '계속') });
  });

  return chapters;
}

/** index가 속한 장·묶음·슬라이드를 찾는다. 범위 밖이면 null. */
export function locate(outline: Outline, index: number): OutlinePosition | null {
  for (const chapter of outline) {
    for (const group of chapter.groups) {
      for (const item of group.items) {
        if (item.index === index) return { chapter, group, item };
      }
    }
    // 간지 슬라이드 자체는 어느 묶음에도 없다. 장의 첫 묶음으로 대신한다.
    if (chapter.index === index) {
      const group = chapter.groups[0];
      if (!group) return null;
      return { chapter, group, item: group.items[0] };
    }
  }
  return null;
}
