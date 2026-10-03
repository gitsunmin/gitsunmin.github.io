/**
 * 본문(md/mdx) 안의 사이트 내부 링크 끝에 슬래시를 붙이는 rehype 플러그인.
 *
 * GitHub Pages는 `/blog/foo`를 `/blog/foo/`로 301 리다이렉트한다. 본문 링크가
 * 슬래시 없이 남아 있으면 크롤러가 매번 리다이렉트를 거치고, canonical·sitemap과
 * 주소가 어긋나 색인 신호가 흐려진다. astro.config의 `trailingSlash: 'always'`와
 * 짝을 이뤄 개발 서버에서도 같은 주소만 쓰도록 맞춘다.
 *
 * 글 원문을 고치지 않고 여기서 처리하는 이유: TIL 본문은 별도 저장소(서브모듈)라
 * 이 저장소에서 원문을 바꿀 수 없고, 앞으로 쓸 글도 신경 쓰지 않아도 되게 하기 위해서다.
 *
 * 건드리지 않는 것: 외부 링크, 프로토콜 상대 주소(`//`), 해시만 있는 링크,
 * 확장자가 있는 파일 주소(`/rss.xml`, `/assets/a.png` 등).
 */

/** `/blog/foo?x=1#y` → `/blog/foo/?x=1#y` */
export function withTrailingSlash(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;

  const suffixStart = href.search(/[?#]/);
  const path = suffixStart === -1 ? href : href.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? '' : href.slice(suffixStart);

  const lastSegment = path.split('/').pop() ?? '';
  if (path.endsWith('/') || lastSegment.includes('.')) return href;

  return `${path}/${suffix}`;
}

function visit(node) {
  if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
    node.properties.href = withTrailingSlash(node.properties.href);
  }
  if (Array.isArray(node.children)) node.children.forEach(visit);
}

export function rehypeTrailingSlash() {
  return (tree) => visit(tree);
}
