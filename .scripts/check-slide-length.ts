/**
 * 발표 덱 슬라이드가 한 화면에 들어가는지 검사한다.
 *
 * 덱(/work/<id>/deck)은 슬라이드 한 장을 100dvh에 담는다. 문서로 읽을 때는 길어도
 * 상관없던 섹션이 발표에서는 화면 밖으로 넘치는데, 화면에서는 슬라이드 안 스크롤로
 * 가려지고 인쇄에서야 두 페이지로 드러난다. 그 전에 잡으려는 검사다.
 *
 * 경계는 rehype-work-sections의 groupSlides와 같다 — h2, h3, `---`, `{/* slide *\/}`.
 *
 * 분량은 "화면에서 차지할 행 수"로 어림한다. 덱 본문은 약 17px에 line-height 1.85라
 * 한 행이 대략 31px이고, 1000px 높이에서 여백과 제목을 빼면 스물몇 행이 남는다.
 * 정확한 렌더 높이가 아니라 "확실히 넘치는 것"을 걸러 내기 위한 눈금이다.
 *
 * 콘텐츠를 다듬는 동안에는 빌드를 막지 않는다(bun run build에 포함하지 않는다).
 * 목록을 보고 줄이거나, MDX에 `---`를 넣어 손으로 끊으면 된다.
 *
 * 실행: bun .scripts/check-slide-length.ts   (bun run check:slides)
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const WORKS_DIR = join(process.cwd(), 'src/content/works');

/** 한 슬라이드가 편하게 담는 행 수. 제목 2행을 포함한 값이다. */
const BUDGET = 24;

/** 한글 본문 한 행에 들어가는 글자 수 어림값. */
const CHARS_PER_LINE = 45;
const CHARS_PER_LIST_LINE = 50;

/**
 * 코드 블록 한 줄의 무게. 코드는 본문보다 작은 글꼴(약 0.8em)에 행간도 좁아서,
 * 같은 줄 수라도 차지하는 높이가 본문의 4분의 3쯤이다.
 */
const CODE_ROW = 0.75;

type Slide = {
  file: string;
  line: number;
  title: string;
  rows: number;
};

function collectMdx(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return collectMdx(full);
    return name.endsWith('.mdx') ? [full] : [];
  });
}

/** 이 줄이 화면에서 차지할 행 수. */
function rowsOf(line: string): number {
  const text = line.trim();
  if (text === '') return 0;
  if (text.startsWith('|')) return 1; // 표는 한 줄이 한 행
  if (/^#{2,3}\s/.test(text)) return 2; // 제목은 크고 아래 여백이 붙는다
  if (/^([-*]|\d+\.)\s/.test(text)) return Math.ceil(text.length / CHARS_PER_LIST_LINE);
  return Math.ceil(text.length / CHARS_PER_LINE);
}

function slidesOf(fullPath: string): Slide[] {
  const relPath = relative(WORKS_DIR, fullPath);
  const source = readFileSync(fullPath, 'utf-8');

  // 프론트매터를 걷어 내되 원본 줄 번호는 유지한다.
  const lines = source.split('\n');
  let start = 0;
  if (lines[0]?.trim() === '---') {
    const close = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
    if (close > 0) start = close + 1;
  }

  const slides: Slide[] = [];
  let chapter = '';
  let current: Slide | null = null;
  let fenced = false;

  const open = (title: string, line: number) => {
    current = { file: relPath, line, title, rows: 0 };
    slides.push(current);
  };

  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i];

    if (/^```/.test(line.trim())) {
      fenced = !fenced;
      if (current) current.rows += CODE_ROW;
      continue;
    }
    if (fenced) {
      if (current) current.rows += CODE_ROW;
      continue;
    }

    if (/^##\s/.test(line)) {
      chapter = line.replace(/^##\s*/, '').trim();
      open(chapter, i + 1);
    } else if (/^###\s/.test(line)) {
      const title = line.replace(/^###\s*/, '').trim();
      open(chapter ? `${chapter} · ${title}` : title, i + 1);
    } else if (/^---\s*$/.test(line) || /^\{\/\*\s*slide\s*\*\/\}$/.test(line.trim())) {
      current = null;
      continue;
    } else if (current === null && line.trim() !== '') {
      open('(도입)', i + 1);
    }

    if (current) current.rows += rowsOf(line);
  }

  return slides.filter((slide) => slide.rows > 0);
}

const files = collectMdx(WORKS_DIR).sort();
const slides = files.flatMap(slidesOf);
const over = slides.filter((slide) => slide.rows > BUDGET).sort((a, b) => b.rows - a.rows);

console.log(`슬라이드 ${slides.length}장 검사 (한 장 기준 ${BUDGET}행)`);

if (over.length === 0) {
  console.log('✓ 모든 슬라이드가 한 화면에 들어갑니다.');
  process.exit(0);
}

console.log(`\n한 화면을 넘치는 슬라이드 ${over.length}장:\n`);
for (const slide of over) {
  const overflow = slide.rows - BUDGET;
  console.log(`  ${String(Math.round(slide.rows)).padStart(3)}행 (+${Math.round(overflow)})  src/content/works/${slide.file}:${slide.line}`);
  console.log(`              ${slide.title}`);
}
console.log('\n줄이거나, 끊고 싶은 지점에 {/* slide */} 를 넣어 두 장으로 나누세요.');
