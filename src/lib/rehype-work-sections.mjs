/**
 * works 문서의 섹션 종류를 빌드 타임에 표시하는 rehype 플러그인.
 *
 * 문서가 200줄을 넘어가면 `문제 1`과 `참고 — 기술 선택`이 같은 무게의 h2로 보여
 * "이슈와 해결이 어디인지" 스캔이 안 된다. 그래서 헤딩 텍스트를 읽어
 * data-* 속성을 붙이고, 실제 스타일은 /work/[id].astro의 CSS가 담당한다.
 *
 * 표시하는 것은 케이스 경계까지다. 케이스 안쪽(상황·원인·결과)은 h3 기본 스타일로
 * 충분해서 따로 표시하지 않는다.
 *
 * 헤딩 텍스트 판별을 런타임 MDX 컴포넌트에서 하지 않는 이유:
 * Astro가 MDX 컴포넌트에 넘기는 children은 React 엘리먼트가 아니라 Astro의
 * 내부 vnode라, React.Children으로 평문을 뽑을 수 없다(빈 문자열이 나온다).
 * hast를 직접 다루는 이 시점이 텍스트를 확실하게 읽을 수 있는 유일한 지점이다.
 *
 * 하는 일:
 *   1. `## 문제 N. …` h2에 data-work-section="case"를 붙이고 "문제 N. " 접두사를 지운다.
 *   2. 그 h2부터 다음 h2(또는 `---`) 직전까지를 <section data-work-case>로 묶는다.
 *      케이스 하나가 카드 한 장이 되도록 하는 그룹핑이며, CSS만으로는 할 수 없다.
 *   3. `## 참고 …`, `## 그 밖의 …` h2에는 data-work-section="aux"를 붙인다.
 *   4. `## 그 밖의 …`는 같은 방식으로 <section data-work-aux>로 묶고, 끝에 생략 표시를
 *      덧붙인다. 케이스처럼 깊이 쓴 글이 아니라 "대표적인 것만 골라 둔 목록"이라는 것을
 *      영역 경계와 말줄임으로 드러내기 위해서다.
 */

/** `## 문제 3. 저장 직전에 사라진 상품` */
const CASE_HEADING = /^문제\s*(\d+)\.\s*/;

/** 대비를 낮춰 다룰 보조 섹션. 이 중 `그 밖의 …`만 영역으로 묶는다. */
const AUX_HEADING = /^(참고|그 밖의)/;
const GROUPED_AUX_HEADING = /^그 밖의/;

/** hast 노드의 평문을 모은다. `<code>` 등이 섞여 있어도 안전. */
function textOf(node) {
  if (node.type === 'text') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(textOf).join('');
}

/** 첫 번째 텍스트 노드에서 앞 `length`글자를 잘라낸다(제목의 "문제 N. " 접두사 제거용). */
function trimLeadingText(node, length) {
  if (node.type === 'text') {
    node.value = node.value.slice(length);
    return true;
  }
  if (!Array.isArray(node.children)) return false;
  return node.children.some((child) => trimLeadingText(child, length));
}

const isElement = (node, tagName) => node?.type === 'element' && node.tagName === tagName;

/**
 * "여기 적은 것이 전부는 아니다"를 나타내는 말줄임.
 * 스크린 리더에는 점 세 개가 아니라 의미가 읽히도록 라벨을 따로 준다.
 */
function ellipsisNode() {
  return {
    type: 'element',
    tagName: 'p',
    properties: {
      'data-work-aux-more': '',
      role: 'note',
      'aria-label': '이 밖에도 담당한 작업이 더 있습니다',
    },
    children: [{ type: 'element', tagName: 'span', properties: { 'aria-hidden': 'true' }, children: [{ type: 'text', value: '···' }] }],
  };
}

/**
 * h2와 그 아래 내용을 <section>으로 묶어 영역 한 장이 되게 한다.
 * 케이스는 카드, `그 밖의 …`는 말줄임까지 붙은 보조 영역이 된다.
 */
function groupSections(root) {
  const children = root.children ?? [];
  const grouped = [];

  const boundaryOf = (node) => {
    if (!isElement(node, 'h2')) return null;
    const section = node.properties?.['data-work-section'];
    if (section === 'case') return { attribute: 'data-work-case', ellipsis: false };
    if (node.properties?.['data-work-aux-group'] !== undefined)
      return { attribute: 'data-work-aux', ellipsis: true };
    return null;
  };

  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    const boundary = boundaryOf(node);

    if (!boundary) {
      grouped.push(node);
      continue;
    }

    // 다음 h2나 `---`를 만날 때까지가 이 섹션의 본문이다.
    const collected = [node];
    let cursor = i + 1;
    while (cursor < children.length) {
      const next = children[cursor];
      if (isElement(next, 'h2') || isElement(next, 'hr')) break;
      collected.push(next);
      cursor += 1;
    }

    if (boundary.ellipsis) {
      // 그룹핑 표시는 여기까지가 쓰임새다. HTML에 남길 이유가 없다.
      delete node.properties['data-work-aux-group'];
      collected.push(ellipsisNode());
    }

    grouped.push({
      type: 'element',
      tagName: 'section',
      properties: { [boundary.attribute]: '' },
      children: collected,
    });

    // 섹션을 끝내는 `---`는 영역 경계가 대신하므로 버린다.
    if (isElement(children[cursor], 'hr')) cursor += 1;
    i = cursor - 1;
  }

  root.children = grouped;
}

export function rehypeWorkSections() {
  return (tree, file) => {
    // blog·til은 이 표기 체계를 쓰지 않으므로 works 문서에만 적용한다.
    const path = file?.history?.[0] ?? file?.path ?? '';
    if (!path.replaceAll('\\', '/').includes('/src/content/works/')) return;

    for (const node of tree.children ?? []) {
      if (!isElement(node, 'h2')) continue;
      node.properties ??= {};

      const text = textOf(node);
      const matched = text.match(CASE_HEADING);

      if (matched) {
        node.properties['data-work-section'] = 'case';
        // 번호는 노출하지 않기로 했으므로 "문제 N. " 접두사를 지운다.
        trimLeadingText(node, matched[0].length);
        continue;
      }

      if (AUX_HEADING.test(text)) {
        node.properties['data-work-section'] = 'aux';
        // `그 밖의 …`만 영역으로 묶는다. `참고 …`는 h2 하나로 충분하다.
        if (GROUPED_AUX_HEADING.test(text)) node.properties['data-work-aux-group'] = '';
      }
    }

    groupSections(tree);
  };
}
