import { describe, expect, it } from 'vitest';
import type { WorkBrief } from '../../src/lib/workBriefs';
import {
  extractFromJd,
  lensParamValues,
  parseLensParams,
  rankBriefs,
  techVocabulary,
} from '../../src/lib/workLens';

const make = (id: string, workId: string, tags: WorkBrief['tags'], techs: string[], featured = false): WorkBrief => ({
  id,
  workId,
  workTitle: workId,
  kind: 'case',
  label: id,
  title: id,
  problem: 'p',
  decision: 'd',
  result: 'r',
  tags,
  featured,
  techs,
  slug: id,
  href: `/work/${workId}/#${id}`,
});

const BRIEFS: WorkBrief[] = [
  make('ds-1', 'market', ['design-system'], ['React', 'Storybook']),
  make('ds-2', 'market', ['design-system', 'dx-tooling'], ['React', 'Storybook']),
  make('ds-3', 'market', ['design-system'], ['React']),
  make('perf', 'sikbom', ['observability'], ['Next.js', 'Datadog'], true),
  make('admin', 'sikbom', ['admin'], ['Vue.js', 'GraphQL']),
];

const VOCAB = techVocabulary(BRIEFS);

describe('techVocabulary', () => {
  it('중복 없이 처음 나온 표기로 모은다', () => {
    expect(VOCAB).toEqual(['React', 'Storybook', 'Next.js', 'Datadog', 'Vue.js', 'GraphQL']);
  });
});

describe('extractFromJd', () => {
  it('역량 키워드와 기술 이름을 찾는다', () => {
    const query = extractFromJd('사내 디자인 시스템과 Storybook 운영 경험, GraphQL 사용 경험 우대', VOCAB);
    expect(query.competencies).toEqual(['design-system']);
    expect(query.techs).toEqual(['Storybook', 'GraphQL']);
  });

  it('B2B 서비스와 어드민을 따로 알아본다', () => {
    expect(extractFromJd('거래처 발주 서비스', VOCAB).competencies).toEqual(['b2b']);
    expect(extractFromJd('사내 백오피스 개발', VOCAB).competencies).toEqual(['admin']);
  });

  it('한글 표기와 .js 생략을 영문 기술에 잇는다', () => {
    expect(extractFromJd('리액트와 넥스트 경험', VOCAB).techs).toEqual(['React', 'Next.js']);
    expect(extractFromJd('Vue 3 경험자', VOCAB).techs).toEqual(['Vue.js']);
  });

  it('한글 별칭은 낱말 안에서 잡지 않는다 — 웹뷰의 뷰는 Vue가 아니다', () => {
    expect(extractFromJd('웹뷰 기반 하이브리드 앱, 한 번 더', VOCAB).techs).toEqual([]);
    expect(extractFromJd('(리액트) 경험', VOCAB).techs).toEqual(['React']);
  });

  it('영문 용어는 단어 경계로만 잡는다', () => {
    expect(extractFromJd('circle 안의 reactive 값', VOCAB)).toEqual({ competencies: [], techs: [] });
  });

  it('빈 입력은 빈 질의', () => {
    expect(extractFromJd('   ', VOCAB)).toEqual({ competencies: [], techs: [] });
  });
});

describe('rankBriefs', () => {
  it('역량 일치를 기술 일치보다 무겁게 본다', () => {
    const [top] = rankBriefs(BRIEFS, { competencies: ['admin'], techs: ['React', 'Storybook'] });
    expect(top.brief.id).toBe('admin');
    expect(top.matchedTags).toEqual(['admin']);
  });

  it('한 프로젝트에서 두 개까지만 고른다', () => {
    const hits = rankBriefs(BRIEFS, { competencies: ['design-system'], techs: ['React'] });
    expect(hits.map((h) => h.brief.id)).toEqual(['ds-1', 'ds-2']);
  });

  it('같은 점수면 대표 요약이 앞선다', () => {
    const hits = rankBriefs(BRIEFS, { competencies: [], techs: ['Next.js', 'Vue.js'] });
    expect(hits.map((h) => h.brief.id)).toEqual(['perf', 'admin']);
  });

  it('고른 역량을 하나씩은 결과에 담는다', () => {
    // 디자인 시스템 셋이 같은 점수로 앞서지만, 관측 역량을 고른 이상 그 케이스도 들어와야 한다.
    const hits = rankBriefs(BRIEFS, { competencies: ['design-system', 'observability'], techs: [] });
    expect(hits.map((h) => h.brief.id)).toEqual(['perf', 'ds-1', 'ds-2']);
  });

  it('아무것도 걸리지 않으면 비운다', () => {
    expect(rankBriefs(BRIEFS, { competencies: ['hybrid-webview'], techs: [] })).toEqual([]);
  });
});

describe('주소 파라미터', () => {
  it('모르는 역량·기술은 버리고 표기를 맞춘다', () => {
    const params = new URLSearchParams('lens=design-system,nope,admin&tech=react,Unknown');
    expect(parseLensParams(params, VOCAB)).toEqual({ competencies: ['design-system', 'admin'], techs: ['React'] });
  });

  it('왕복해도 같은 질의가 된다', () => {
    const query = { competencies: ['observability' as const], techs: ['Next.js'] };
    const params = new URLSearchParams(
      Object.entries(lensParamValues(query)).flatMap(([k, v]) => (v ? [[k, v]] : [])),
    );
    expect(parseLensParams(params, VOCAB)).toEqual(query);
  });

  it('빈 질의는 파라미터를 지운다', () => {
    expect(lensParamValues({ competencies: [], techs: [] })).toEqual({ lens: null, tech: null });
  });
});
