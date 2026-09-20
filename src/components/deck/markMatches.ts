import { tokenize } from '@/lib/workSearch';

/**
 * 슬라이드 안의 검색어를 <mark>로 감싼다. 검색 결과에서 도착한 장이 "왜 걸렸는지"를
 * 그 자리에서 보여 주기 위해서다.
 *
 * DOM을 직접 만지는 이유: 슬라이드는 서버가 렌더한 MDX라 React 트리가 아니다.
 * 되돌리는 함수를 돌려주므로 다음 이동 전에 깨끗이 지울 수 있다.
 */
export function markMatches(root: HTMLElement, query: string): () => void {
  const needles = tokenize(query).flat().filter((n) => n.length > 0);
  if (needles.length === 0) return () => {};

  const marks: HTMLElement[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = node.parentElement;
      if (!parent || parent.closest('mark, script, style')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  // 걷는 도중에 노드를 바꾸면 워커가 흔들리므로 먼저 모은다.
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);

  for (const node of nodes) {
    const text = node.data;
    const lower = text.toLowerCase();
    const ranges: Array<[number, number]> = [];
    for (const needle of needles) {
      let from = 0;
      while (from < lower.length) {
        const at = lower.indexOf(needle, from);
        if (at === -1) break;
        ranges.push([at, at + needle.length]);
        from = at + needle.length;
      }
    }
    if (ranges.length === 0) continue;
    ranges.sort((a, b) => a[0] - b[0]);

    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const [from, to] of ranges) {
      if (from < cursor) continue;
      if (from > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, from)));
      const mark = document.createElement('mark');
      mark.dataset.searchMark = '';
      mark.textContent = text.slice(from, to);
      fragment.appendChild(mark);
      marks.push(mark);
      cursor = to;
    }
    if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)));
    node.replaceWith(fragment);
  }

  return () => {
    for (const mark of marks) {
      const parent = mark.parentNode;
      if (!parent) continue;
      parent.replaceChild(document.createTextNode(mark.textContent ?? ''), mark);
      parent.normalize();
    }
  };
}
