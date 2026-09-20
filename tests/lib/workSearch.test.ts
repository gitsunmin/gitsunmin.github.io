import { describe, expect, it } from 'vitest';
import {
  groupByWork,
  hrefOf,
  highlight,
  matchRecord,
  search,
  snippetOf,
  suggestAlternatives,
  tokenize,
  topTechs,
  type SearchRecord,
} from '../../src/lib/workSearch';

const INDEX: SearchRecord[] = [
  {
    id: 'marketbom-pro',
    kind: 'work',
    workId: 'marketbom-pro',
    workTitle: '마켓봄',
    title: '마켓봄',
    text: '식자재 유통사를 위한 B2B SaaS 플랫폼',
    techs: ['React', 'Vue.js', 'GraphQL', 'Apollo Client'],
  },
  {
    id: 'marketbom-pro/order-app',
    kind: 'chapter',
    workId: 'marketbom-pro',
    workTitle: '마켓봄',
    chapter: '거래처 주문 앱',
    title: '거래처 주문 앱',
    text: '음식점 사장님이 발주하는 웹 앱',
    techs: ['Nuxt.js', 'GraphQL'],
    contributions: ['WebView 인증·히스토리 처리'],
  },
  {
    id: 'marketbom-pro#인증-url',
    kind: 'slide',
    workId: 'marketbom-pro',
    workTitle: '마켓봄',
    chapter: '거래처 주문 앱',
    title: '문제 2 · 네이티브가 넘겨준 인증 URL · 상황',
    slug: '인증-url',
    text: '네이티브 쉘이 WebView를 띄우면서 인증 토큰이 담긴 URL을 넘겨 줍니다. 그 URL이 히스토리에 남았습니다.',
  },
  {
    id: 'doldeuls-forest',
    kind: 'work',
    workId: 'doldeuls-forest',
    workTitle: '돌들의 숲',
    title: '돌들의 숲',
    text: '익명 P2P 힐링 커뮤니티',
    techs: ['React', 'React Native', 'GraphQL', 'Expo'],
  },
];

describe('tokenize', () => {
  it('공백으로 나누고 소문자로 만든다', () => {
    expect(tokenize('  WebView  인증 ')).toEqual([['webview'], ['인증']]);
  });
  it('별칭을 함께 붙인다', () => {
    expect(tokenize('리액트')).toEqual([['리액트', 'react']]);
    expect(tokenize('리액트 네이티브')).toEqual([['리액트 네이티브', 'react native']]);
  });
  it('빈 검색어는 빈 배열', () => {
    expect(tokenize('   ')).toEqual([]);
  });
});

describe('matchRecord', () => {
  it('기술 칩에 걸리면 tech, 점수 3', () => {
    const hit = matchRecord(INDEX[0], tokenize('graphql'));
    expect(hit?.kinds).toEqual(['tech']);
    expect(hit?.score).toBe(3);
  });
  it('제목과 본문에 같이 걸리면 둘 다 표시하고 점수를 더한다', () => {
    const hit = matchRecord(INDEX[2], tokenize('인증'));
    expect(hit?.kinds).toEqual(['title', 'text']);
    expect(hit?.score).toBe(3);
    expect(hit?.snippet.some((p) => p.hit && p.text === '인증')).toBe(true);
  });
  it('토큰이 하나라도 안 걸리면 null', () => {
    expect(matchRecord(INDEX[2], tokenize('인증 flutter'))).toBeNull();
  });
  it('담당 범위에 걸리면 contribution', () => {
    expect(matchRecord(INDEX[1], tokenize('히스토리'))?.kinds).toEqual(['contribution']);
  });
  it('한글 부분어도 잡는다', () => {
    expect(matchRecord(INDEX[1], tokenize('발주'))?.kinds).toEqual(['text']);
  });
});

describe('search', () => {
  it('점수 내림차순으로 정렬한다', () => {
    const hits = search(INDEX, 'webview');
    expect(hits.map((h) => h.record.id)).toEqual(['marketbom-pro/order-app', 'marketbom-pro#인증-url']);
  });
  it('scope로 프로젝트를 좁힌다', () => {
    expect(search(INDEX, 'react', { scope: 'doldeuls-forest' }).map((h) => h.record.id)).toEqual(['doldeuls-forest']);
  });
  it('별칭으로도 찾는다', () => {
    expect(search(INDEX, 'RN').map((h) => h.record.id)).toEqual(['doldeuls-forest']);
  });
});

describe('groupByWork', () => {
  it('프로젝트별로 묶고 최고 점수 순으로 놓는다', () => {
    const groups = groupByWork(search(INDEX, 'react'));
    expect(groups.map((g) => g.workId)).toEqual(['marketbom-pro', 'doldeuls-forest']);
  });
  it('pin이 있으면 그 프로젝트가 맨 앞', () => {
    const groups = groupByWork(search(INDEX, 'react'), 'doldeuls-forest');
    expect(groups[0].workId).toBe('doldeuls-forest');
  });
});

describe('highlight / snippet', () => {
  it('매치 구간을 나누고 겹치면 합친다', () => {
    expect(highlight('Apollo Client', ['apollo', 'apollo client'])).toEqual([{ text: 'Apollo Client', hit: true }]);
    expect(highlight('a-b-a', ['a'])).toEqual([
      { text: 'a', hit: true },
      { text: '-b-', hit: false },
      { text: 'a', hit: true },
    ]);
  });
  it('긴 본문은 첫 매치 주변만 잘라 말줄임을 붙인다', () => {
    const long = `${'앞 '.repeat(50)}WebView 토큰${' 뒤'.repeat(80)}`;
    const parts = snippetOf(long, [['webview']]);
    expect(parts[0]).toEqual({ text: '…', hit: false });
    expect(parts.at(-1)).toEqual({ text: '…', hit: false });
    expect(parts.some((p) => p.hit)).toBe(true);
  });
});

describe('suggestAlternatives / topTechs', () => {
  it('별칭 표기를 권한다', () => {
    expect(suggestAlternatives(INDEX, '리액트')).toContain('React');
  });
  it('가장 많이 쓰인 기술을 센다', () => {
    expect(topTechs(INDEX, 2)).toEqual(['GraphQL', 'React']);
  });
});

describe('hrefOf', () => {
  it('프로젝트 레코드는 표지가 아니라 소개 슬라이드(#intro)로 간다', () => {
    const hit = search([{ ...INDEX[0], slug: 'intro' }], '유통사')[0];
    expect(hrefOf(hit, '유통사')).toBe('/work/marketbom-pro?q=%EC%9C%A0%ED%86%B5%EC%82%AC#intro');
  });
  it('slug가 없으면 해시 없이 프로젝트로 간다', () => {
    const hit = search(INDEX, 'graphql')[0];
    expect(hrefOf(hit, '')).toBe(`/work/${hit.record.workId}`);
  });
});
