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
 *   5. 마지막으로 문서 전체를 <section data-slide>로 쪼갠다. h2와 `---`가 경계이며,
 *      발표 덱이 슬라이드 한 장씩 배치할 단위가 된다.
 *
 * 슬라이드 분해를 런타임 DOM 조작이 아니라 여기서 하는 이유:
 * 슬라이드가 서버 렌더 HTML에 그대로 남아야 검색엔진·인쇄·헤딩 딥링크가 유지된다.
 * 문서 뷰(/work/[id])는 이 래퍼를 `display: contents`로 지워 레이아웃에 영향받지 않고,
 * 덱 뷰만 이 경계를 실제 슬라이드로 쓴다.
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

/**
 * 이 노드 아래에 React 컴포넌트가 있는지.
 *
 * MDX는 `<details>` 같은 평범한 HTML도 mdxJsxFlowElement로 만든다. 그래서 노드 종류만
 * 봐서는 `<DoldeulsForestStory/>`와 구분되지 않는다. 대문자로 시작하는 이름만 컴포넌트다.
 *
 * Story는 `<div data-print-hide>`로 한 겹 감싸여 있어 자식까지 훑어야 한다.
 */
function containsComponent(node) {
  if (node.type === 'mdxJsxFlowElement' && /^[A-Z]/.test(node.name ?? '')) return true;
  return Array.isArray(node.children) && node.children.some(containsComponent);
}

/**
 * 빈 슬라이드 껍데기.
 *
 * 내용은 곧바로 넣지 않고 <div data-slide-body>로 한 겹 감싼다. 슬라이드는 내용을
 * 화면 가운데에 놓아야 하는데, 자식이 여럿인 채로 flex 정렬을 걸면 문단들이 가로로
 * 늘어선다. 감싸는 상자가 하나 있어야 슬라이드는 '그 상자 하나'만 가운데 놓으면 되고,
 * 상자 안은 평범한 흐름이라 prose의 마진 상쇄도 그대로 유지된다.
 */
function makeSlide(title) {
  const body = {
    type: 'element',
    tagName: 'div',
    properties: { 'data-slide-body': '' },
    children: [],
  };

  const slide = {
    type: 'element',
    tagName: 'section',
    properties: title ? { 'data-slide': '', 'data-slide-title': title } : { 'data-slide': '' },
    children: [body],
  };

  return { slide, body };
}

const isBlank = (node) => node.type === 'text' && node.value.trim() === '';

/**
 * 슬라이드를 손으로 끊는 표시 — MDX에 `{/* slide *\/}`라고 적는다.
 *
 * `---`를 쓰지 않는 이유: 이 문서들에서 `---`는 이미 "케이스 카드가 여기서 끝난다"는
 * 뜻으로 쓰이고 있다(groupSections). 카드 안에서 슬라이드만 나누고 싶을 때 `---`를
 * 넣으면 카드가 두 동강 나 문서 뷰가 깨진다. 그래서 별도의 표시를 둔다.
 *
 * 주석이라 화면에도 인쇄에도 아무것도 남기지 않는다.
 */
const isSlideBreak = (node) =>
  node.type === 'mdxFlowExpression' && /^\s*\/\*\s*slide\s*\*\/\s*$/.test(node.value ?? '');

/**
 * 노드 목록을 슬라이드로 쪼갠다.
 *
 * 경계는 네 가지다.
 *   · h2 — 새 장(章)
 *   · h3 — 같은 장 안의 다음 화면. 케이스 글이 `상황 / 원인 / 결과`로 쓰여 있어,
 *          이 단위가 곧 발표 한 장이 된다. 제목에는 소속 h2를 붙여 목차에서 구분되게 한다.
 *   · `---` — 케이스 카드의 끝. 카드가 끝나면 슬라이드도 끝난다.
 *   · `{/* slide *\/}` — 글쓴이가 손으로 끊는 지점. 카드 안에서도 쓸 수 있다.
 *
 * 앞머리 내용(도입 인용문, 인터랙티브 Story 등)도 슬라이드 한 장이 된다.
 */
function sliceIntoSlides(children) {
  const slides = [];
  let current = null;
  let chapter = '';

  /** current는 내용을 담는 상자, current.slide는 바깥 <section>이다. */
  const open = (title) => {
    const made = makeSlide(title);
    current = made.body;
    current.slide = made.slide;
    slides.push(made.slide);
  };

  for (const node of children) {
    if (isBlank(node)) {
      if (current) current.children.push(node);
      continue;
    }

    if (isElement(node, 'hr') || isSlideBreak(node)) {
      current = null;
      continue;
    }

    if (isElement(node, 'h2')) {
      chapter = textOf(node).trim();
      open(chapter);
    } else if (isElement(node, 'h3')) {
      const title = textOf(node).trim();
      open(chapter ? `${chapter} · ${title}` : title);
    } else if (current === null) {
      open('');
    }

    current.children.push(node);
    if (containsComponent(node)) current.slide.properties['data-slide-full'] = '';
  }

  const bodyOf = (slide) => slide.children[0];

  // `---`로 끝나 내용이 없는 슬라이드를 걸러 낸다.
  const filled = slides.filter((slide) => bodyOf(slide).children.some((child) => !isBlank(child)));

  // 인터랙티브 컴포넌트 말고는 아무것도 없는 슬라이드를 표시한다.
  // 인쇄에서는 컴포넌트가 통째로 숨겨지므로, 그대로 두면 빈 종이 한 장이 나온다.
  for (const slide of filled) {
    if (bodyOf(slide).children.every((child) => isBlank(child) || containsComponent(child))) {
      slide.properties['data-slide-visual'] = '';
    }
  }

  return filled;
}

/**
 * 문서 전체를 슬라이드로 쪼갠다.
 *
 * 케이스·보조 영역(<section data-work-case> 등)은 문서 뷰에서 카드 한 장이므로
 * 그 껍데기는 그대로 두고 **안쪽**을 슬라이드로 나눈다. 문서 뷰는 슬라이드 래퍼를
 * display: contents로 지우므로 카드가 쪼개져 보이지 않고, 덱만 경계를 쓴다.
 */
function groupSlides(root) {
  /** MDX의 import/export. 모듈 최상위에 남아 있어야 한다. */
  const esm = [];
  const rest = [];

  for (const node of root.children ?? []) {
    // `import DoldeulsForestStory from …`. <section>으로 감싸면 바인딩이 끊겨
    // "No matching import has been found"로 빌드가 깨진다.
    if (node.type === 'mdxjsEsm') esm.push(node);
    else rest.push(node);
  }

  const isGrouped = (node) =>
    isElement(node, 'section') &&
    (node.properties?.['data-work-case'] !== undefined || node.properties?.['data-work-aux'] !== undefined);

  const output = [];
  let loose = [];

  const flushLoose = () => {
    if (loose.length > 0) output.push(...sliceIntoSlides(loose));
    loose = [];
  };

  for (const node of rest) {
    if (isGrouped(node)) {
      flushLoose();
      node.children = sliceIntoSlides(node.children ?? []);
      output.push(node);
      continue;
    }
    loose.push(node);
  }
  flushLoose();

  root.children = [...esm, ...output];
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
    groupSlides(tree);
  };
}
