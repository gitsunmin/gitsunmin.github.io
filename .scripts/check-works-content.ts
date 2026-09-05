/**
 * works 문서(src/content/works)의 민감 정보 검사기.
 *
 * 포트폴리오 문서에는 전 직장 사내 저장소 이야기가 섞여 있어, 아래 두 가지가
 * 실수로 다시 들어오는 것을 빌드 단계에서 막는다.
 *
 *   1. 커밋 수량 — 저장소 활동량은 공개 저장소든 사내 저장소든 전부 쓰지 않는다.
 *   2. 사내 규모 수치·KPI — 컴포넌트/페이지 개수, "n% 개선" 같은 내부 지표.
 *      전 직장 관련 문서(CONFIDENTIAL_DOCS)에만 적용한다.
 *
 * 이 밖에 시크릿·이메일·사설 IP·허용 목록 밖 URL은 전체 문서에 적용한다.
 *
 * 오탐이 확실한 줄은 바로 앞 줄에 아래 주석을 넣어 건너뛸 수 있다.
 *
 *   {\/* works-guard-disable-next-line commit-count *\/}
 *
 * 실행: bun .scripts/check-works-content.ts   (bun run check:works)
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const WORKS_DIR = join(process.cwd(), 'src/content/works');

/** 전 직장(사내 저장소) 관련 문서 — 규모 수치·KPI를 엄격히 검사한다. */
const CONFIDENTIAL_DOCS = [
  'sikbom.mdx',
  'sikbom/',
  'marketbom-pro.mdx',
  'marketbom-pro/',
  'hybrid-app-framework.mdx',
];

/** 사내 문서 최상위에 영업비밀 고지문이 있어야 하는 파일. */
const DISCLOSURE_REQUIRED = ['sikbom.mdx', 'marketbom-pro.mdx', 'hybrid-app-framework.mdx'];
/**
 * 고지는 두 자리 중 하나에 있으면 된다 — 본문 맨 위 블록인용이거나,
 * 프론트매터의 disclaimer다. 덱에서는 한 문장이 슬라이드 한 장·인쇄 한 쪽을
 * 통째로 쓰므로 프론트매터로 옮겨 소개 슬라이드의 각주로 붙인다.
 */
const DISCLOSURE_MARKER = /^>\s*\*\*(고지|참고)\*\*|^disclaimer:\s*\S/m;

/** 본문에 등장해도 되는 외부 링크 호스트. */
const ALLOWED_HOSTS = [
  'github.com',
  'www.npmjs.com',
  'marketplace.visualstudio.com',
  'apps.apple.com',
  'play.google.com',
  'gitsunmin.github.io',
  'forest.seonhamlabs.com',
  'www.foodspring.co.kr',
  'marketbom.com',
  'example.com',
  'staging.example.com',
  'localhost',
];

type Scope = 'all' | 'confidential';

type Rule = {
  id: string;
  scope: Scope;
  pattern: RegExp;
  message: string;
};

const RULES: Rule[] = [
  {
    id: 'commit-count',
    scope: 'all',
    pattern: /(\d[\d,]*\s*개(의)?\s*커밋|커밋\s*\d[\d,]*|\d[\d,]*\s*commits?\b)/gi,
    message: '커밋 수량은 문서에 남기지 않습니다. 역할·기여도를 정성 표현으로 서술하세요.',
  },
  {
    id: 'scale-metric',
    scope: 'confidential',
    pattern:
      /\d[\d,]*\s*개\s*(컴포넌트|페이지|페이지 영역|화면|모듈|테이블|엔드포인트|API|저장소|서비스)/g,
    message: '사내 저장소의 규모 수치입니다. "대규모", "다수의" 같은 정성 표현으로 바꾸세요.',
  },
  {
    id: 'scale-metric',
    scope: 'confidential',
    pattern: /\*\*\s*\d[\d,]*\s*개\s*[^*]*\*\*/g,
    message: '사내 저장소의 규모 수치를 강조 표기하고 있습니다. 정성 표현으로 바꾸세요.',
  },
  {
    id: 'kpi-metric',
    scope: 'confidential',
    pattern:
      /(\d+(\.\d+)?\s*%\s*(이상\s*)?(개선|향상|성장|증가|감소|단축|절감|상승|하락)|(개선|향상|성장|증가|감소|단축|절감)[^.\n]{0,8}\d+(\.\d+)?\s*%)/g,
    message: '사내 성과 지표(KPI)입니다. 수치 없이 개선 사실만 서술하세요.',
  },
  {
    id: 'kpi-metric',
    scope: 'confidential',
    pattern: /(장애|사고|이슈|클레임|오류)\s*\d+\s*건/g,
    message: '사내 운영 지표입니다. 수치 없이 결과만 서술하세요.',
  },
  {
    id: 'secret',
    scope: 'all',
    pattern: /\b(sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|Bearer\s+[A-Za-z0-9._-]{20,})\b/g,
    message: '자격 증명으로 보이는 문자열입니다. 즉시 제거하고 해당 키를 폐기하세요.',
  },
  {
    id: 'email',
    scope: 'all',
    pattern: /[\w.+-]+@[\w-]+\.[\w.]{2,}/g,
    message: '이메일 주소가 노출되어 있습니다.',
  },
  {
    id: 'private-ip',
    scope: 'all',
    pattern: /\b(10\.\d{1,3}|192\.168|172\.(1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/g,
    message: '사설 IP 주소가 노출되어 있습니다.',
  },
];

type Finding = {
  file: string;
  line: number;
  rule: string;
  match: string;
  message: string;
};

function collectMdx(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return collectMdx(full);
    return name.endsWith('.mdx') ? [full] : [];
  });
}

function isConfidential(relPath: string): boolean {
  return CONFIDENTIAL_DOCS.some((prefix) => relPath === prefix || relPath.startsWith(prefix));
}

/** 바로 앞 줄의 `works-guard-disable-next-line <rule>` 주석 여부. */
function isSuppressed(lines: string[], index: number, ruleId: string): boolean {
  const prev = lines[index - 1];
  if (!prev) return false;
  const matched = prev.match(/works-guard-disable-next-line\s+([\w-]+)/);
  return matched?.[1] === ruleId;
}

/** 코드 블록(```) 안은 예제 코드이므로 문장 규칙 대상에서 제외한다. */
function codeFenceLines(lines: string[]): Set<number> {
  const inside = new Set<number>();
  let open = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) {
      open = !open;
      inside.add(i);
      return;
    }
    if (open) inside.add(i);
  });
  return inside;
}

function checkUrls(relPath: string, lines: string[], findings: Finding[]): void {
  lines.forEach((line, i) => {
    for (const raw of line.match(/https?:\/\/[^\s)"'`\]]+/g) ?? []) {
      let host: string;
      try {
        host = new URL(raw).hostname;
      } catch {
        continue;
      }
      const allowed = ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
      if (allowed || isSuppressed(lines, i, 'external-url')) continue;
      findings.push({
        file: relPath,
        line: i + 1,
        rule: 'external-url',
        match: raw,
        message: '허용 목록에 없는 호스트입니다. 사내 주소라면 제거하거나 예시 값으로 바꾸세요.',
      });
    }
  });
}

function checkFile(fullPath: string): Finding[] {
  const relPath = relative(WORKS_DIR, fullPath);
  const source = readFileSync(fullPath, 'utf-8');
  const lines = source.split('\n');
  const fenced = codeFenceLines(lines);
  const confidential = isConfidential(relPath);
  const findings: Finding[] = [];

  for (const rule of RULES) {
    if (rule.scope === 'confidential' && !confidential) continue;

    lines.forEach((line, i) => {
      if (fenced.has(i) || isSuppressed(lines, i, rule.id)) return;
      for (const found of line.match(rule.pattern) ?? []) {
        findings.push({
          file: relPath,
          line: i + 1,
          rule: rule.id,
          match: found.trim(),
          message: rule.message,
        });
      }
    });
  }

  checkUrls(relPath, lines, findings);

  if (DISCLOSURE_REQUIRED.includes(relPath) && !DISCLOSURE_MARKER.test(source)) {
    findings.push({
      file: relPath,
      line: 1,
      rule: 'disclosure-notice',
      match: relPath,
      message: '전 직장 관련 문서에는 영업비밀 고지문(프론트매터 disclaimer 또는 > **고지**: ...)이 있어야 합니다.',
    });
  }

  return findings;
}

const files = collectMdx(WORKS_DIR).sort();
const findings = files.flatMap(checkFile);

if (findings.length === 0) {
  console.log(`✓ works 문서 검사 통과 (${files.length}개 파일)`);
  process.exit(0);
}

console.error(`\n✗ works 문서에서 ${findings.length}건의 민감 정보 후보를 발견했습니다.\n`);
for (const f of findings) {
  console.error(`  src/content/works/${f.file}:${f.line}  [${f.rule}]`);
  console.error(`    발견: ${f.match}`);
  console.error(`    조치: ${f.message}\n`);
}
console.error('오탐이라면 해당 줄 바로 위에 다음 주석을 추가하세요:');
console.error('  {/* works-guard-disable-next-line <rule-id> */}\n');
process.exit(1);
