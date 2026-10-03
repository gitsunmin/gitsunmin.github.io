import { describe, expect, it } from 'vitest';
import { withTrailingSlash } from '@/lib/rehype-trailing-slash.mjs';

describe('withTrailingSlash', () => {
  it('내부 페이지 주소 끝에 슬래시를 붙인다', () => {
    expect(withTrailingSlash('/blog/foo')).toBe('/blog/foo/');
  });
  it('쿼리와 해시는 슬래시 뒤로 보낸다', () => {
    expect(withTrailingSlash('/work/sikbom#문제')).toBe('/work/sikbom/#문제');
    expect(withTrailingSlash('/til/README?category=web')).toBe('/til/README/?category=web');
  });
  it('이미 슬래시가 있으면 그대로 둔다', () => {
    expect(withTrailingSlash('/blog/')).toBe('/blog/');
    expect(withTrailingSlash('/')).toBe('/');
  });
  it('외부·프로토콜 상대·해시 링크와 파일 주소는 건드리지 않는다', () => {
    expect(withTrailingSlash('https://example.com/a')).toBe('https://example.com/a');
    expect(withTrailingSlash('//cdn.example.com/a')).toBe('//cdn.example.com/a');
    expect(withTrailingSlash('#section')).toBe('#section');
    expect(withTrailingSlash('/rss.xml')).toBe('/rss.xml');
    expect(withTrailingSlash('/assets/blog/a.png')).toBe('/assets/blog/a.png');
  });
});
