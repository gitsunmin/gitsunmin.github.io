import { describe, expect, it } from 'vitest';
import type { SearchRecord } from '../../src/lib/workSearch';
import { suggest, suggestionVocabulary } from '../../src/lib/workSuggest';

const record = (fields: Partial<SearchRecord>): SearchRecord =>
  ({ id: 'x', kind: 'slide', workId: 'w', workTitle: '식봄', title: '', text: '', ...fields }) as SearchRecord;

const INDEX: SearchRecord[] = [
  record({ kind: 'work', title: '식봄', techs: ['Next.js', 'GraphQL', 'React'] }),
  record({ kind: 'chapter', chapter: '식봄 관리자 웹', title: '식봄 관리자 웹', techs: ['React', 'Datadog'] }),
  record({ title: '문제 1 · 재현되지 않는 장바구니 성능' }),
  record({ title: '문제 1 · 재현되지 않는 장바구니 성능 · 상황' }),
  record({ title: '주요 기능' }),
];

describe('suggestionVocabulary', () => {
  it('기술·프로젝트·장·케이스 제목을 중복 없이 모은다', () => {
    expect(suggestionVocabulary(INDEX)).toEqual([
      { text: 'Next.js', kind: 'tech' },
      { text: 'GraphQL', kind: 'tech' },
      { text: 'React', kind: 'tech' },
      { text: 'Datadog', kind: 'tech' },
      { text: '식봄', kind: 'work' },
      { text: '식봄 관리자 웹', kind: 'work' },
      { text: '재현되지 않는 장바구니 성능', kind: 'case' },
    ]);
  });
});

describe('suggest', () => {
  const vocab = suggestionVocabulary(INDEX);

  it('빈 입력에는 최근 검색어만 낸다', () => {
    expect(suggest(vocab, ['정산', 'WebView'], '  ')).toEqual([
      { text: '정산', kind: 'recent' },
      { text: 'WebView', kind: 'recent' },
    ]);
  });

  it('앞에서 맞는 것을 중간에서 맞는 것보다 앞에 둔다', () => {
    expect(suggest(vocab, [], '식봄').map((s) => s.text)).toEqual(['식봄', '식봄 관리자 웹']);
    expect(suggest(vocab, [], '장바구니').map((s) => s.text)).toEqual(['재현되지 않는 장바구니 성능']);
  });

  it('대소문자를 가리지 않고, 최근 검색어와 겹치는 후보는 한 번만 낸다', () => {
    expect(suggest(vocab, ['react'], 'RE')).toEqual([{ text: 'react', kind: 'recent' }]);
  });
});
