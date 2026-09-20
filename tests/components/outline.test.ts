import { describe, expect, it } from 'vitest';
import { buildOutline, locate, type OutlineSlide } from '../../src/components/deck/outline';

const s = (id: string, title: string): OutlineSlide => ({ id, title });

const DECK: OutlineSlide[] = [
  s('cover', '표지'),
  s('intro', '소개'),
  s('', ''), // 도입 인용문
  s('', '배경'),
  s('', '기술 스택'),
  s('chapter-거래처 주문 앱', '거래처 주문 앱'),
  s('', '문제 1 · CS가 계속 들어왔다'),
  s('', '문제 1 · CS가 계속 들어왔다 · 상황'),
  s('', '문제 1 · CS가 계속 들어왔다 · 접근과 결정'),
  s('', '문제 2 · 인증 URL'),
  s('', '문제 2 · 인증 URL · 상황'),
  s('', '그 밖의 담당 기여'),
  s('', '그 밖의 담당 기여 · Apollo Link 체인'),
  s('thanks', 'Q&A'),
];

describe('buildOutline', () => {
  const outline = buildOutline(DECK, '마켓봄');

  it('간지 슬라이드를 장 경계로 삼고, 그 앞은 rootTitle 장으로 묶는다', () => {
    expect(outline.map((c) => c.title)).toEqual(['마켓봄', '거래처 주문 앱']);
    expect(outline[0].index).toBe(0);
    expect(outline[1].index).toBe(5);
  });

  it('고정 슬라이드는 제목 그대로 묶음 하나가 된다', () => {
    const [root] = outline;
    expect(root.groups[0]).toMatchObject({ title: '표지', index: 0 });
    expect(root.groups[1]).toMatchObject({ title: '소개', index: 1 });
  });

  it('고정 슬라이드 뒤의 제목 없는 슬라이드는 도입으로 연다', () => {
    const [root] = outline;
    expect(root.groups[1].items.map((i) => i.label)).toEqual(['소개']);
    expect(root.groups[2]).toMatchObject({ title: '도입', index: 2 });
  });

  it('본문 묶음 뒤의 제목 없는 슬라이드는 앞 묶음에 붙는다', () => {
    const result = buildOutline([s('', '배경'), s('', '')], 'X');
    expect(result[0].groups[0].items.map((i) => i.label)).toEqual(['개요', '계속']);
  });

  it('케이스는 머리표를 분리하고 h3를 항목으로 접는다', () => {
    const chapter = outline[1];
    expect(chapter.groups[0]).toMatchObject({ label: '문제 1', title: 'CS가 계속 들어왔다', index: 6 });
    expect(chapter.groups[0].items.map((i) => i.label)).toEqual(['개요', '상황', '접근과 결정']);
    expect(chapter.groups[1]).toMatchObject({ label: '문제 2', title: '인증 URL' });
  });

  it('케이스가 아닌 h2 · h3도 같은 규칙으로 묶는다', () => {
    const chapter = outline[1];
    expect(chapter.groups[2]).toMatchObject({ title: '그 밖의 담당 기여', label: undefined });
    expect(chapter.groups[2].items.map((i) => i.label)).toEqual(['개요', 'Apollo Link 체인']);
  });

  it('마무리 슬라이드는 마지막 장에 붙는다', () => {
    const chapter = outline[1];
    expect(chapter.groups.at(-1)).toMatchObject({ title: 'Q&A', index: 13 });
  });

  it('제목 없는 슬라이드로 시작해도 무너지지 않는다', () => {
    const result = buildOutline([s('', ''), s('', '배경')], 'X');
    expect(result[0].groups[0]).toMatchObject({ title: '도입' });
    expect(result[0].groups[1]).toMatchObject({ title: '배경' });
  });
});

describe('locate', () => {
  const outline = buildOutline(DECK, '마켓봄');

  it('슬라이드 index로 장·묶음·항목을 찾는다', () => {
    const pos = locate(outline, 8);
    expect(pos?.chapter.title).toBe('거래처 주문 앱');
    expect(pos?.group.label).toBe('문제 1');
    expect(pos?.item.label).toBe('접근과 결정');
  });

  it('간지 슬라이드는 그 장의 첫 묶음을 돌려준다', () => {
    const pos = locate(outline, 5);
    expect(pos?.chapter.title).toBe('거래처 주문 앱');
    expect(pos?.group.label).toBe('문제 1');
  });

  it('없는 index면 null', () => {
    expect(locate(outline, 99)).toBeNull();
  });
});
