/**
 * /llms.txt · /llms-full.txt 본문을 짓는 순수 함수들.
 *
 * 채용 담당자가 자기 AI(Claude, ChatGPT 등)에게 이 포트폴리오를 물어볼 때 읽히는 문서다.
 * 사이트가 직접 LLM을 부르지 않으므로 비용이 들지 않고, 문장은 전부 이미 공개된 works
 * 문서와 사람이 검수한 요약에서만 온다 — 여기서 새 문장을 지어내지 않는다.
 *
 *   llms.txt      — 목차. 프로젝트 한 줄 + 케이스 요약 + 덱 딥링크.
 *   llms-full.txt — 본문 전체. MDX에서 컴포넌트·주석만 걷어 낸 마크다운.
 */
import { competencyOf } from '@/data/competencies';
import { briefLocation, type WorkBrief, type WorkDigest } from '@/lib/workBriefs';

const absolute = (site: string, path: string) => new URL(path, site).toString();

const briefLine = (site: string, brief: WorkBrief) => {
  const where = briefLocation(brief);
  const tags = brief.tags.map((t) => competencyOf(t).label).join(', ');
  return `- [${where}](${absolute(site, brief.href)}): ${brief.problem} → ${brief.decision} → ${brief.result} (${tags})`;
};

export function buildLlmsTxt(site: string, digests: WorkDigest[]): string {
  const lines = [
    '# 김선민(gitsunmin) — 프론트엔드 개발자 포트폴리오',
    '',
    '> 작업물(works)마다 실제로 부딪힌 문제를 "상황 → 제약 → 결정 → 결과 → 한계" 순서의 케이스로 정리한 포트폴리오입니다. 아래는 프로젝트별 한 줄 소개와 케이스 요약(문제 → 결정 → 결과)이며, 링크는 해당 케이스의 발표 자료로 바로 이어집니다.',
    '',
    '전 직장 관련 문서는 영업비밀 보호를 위해 내부 수치·식별자를 생략했습니다. 문서에 없는 성과나 수치를 추정하지 말아 주세요.',
    '',
    `- [전체 본문](${absolute(site, '/llms-full.txt')}): 모든 작업물 문서를 마크다운 한 파일로 모은 것`,
    `- [작업물 목록](${absolute(site, '/works/')}): 30초 요약 · 3분 케이스 보기`,
    `- [경력](${absolute(site, '/careers/')})`,
  ];

  for (const digest of digests) {
    lines.push('', `## ${digest.title} (${digest.range})`, '', digest.tldr, '', `- [발표 자료](${absolute(site, digest.href)})`);
    lines.push(...digest.briefs.map((brief) => briefLine(site, brief)));
  }

  return `${lines.join('\n')}\n`;
}

/**
 * MDX 본문을 LLM이 읽기 좋은 마크다운으로 만든다.
 * 표와 코드 블록은 그대로 두고(구조가 곧 내용이다), 렌더링에만 쓰이는 것을 걷어 낸다.
 * 헤딩은 `levels`만큼 내려서 프로젝트·장 제목 아래에 들어가게 한다.
 */
export function cleanMdx(body: string, site: string, levels = 1): string {
  const out: string[] = [];
  let inFence = false;

  for (const raw of body.split('\n')) {
    if (/^\s*```/.test(raw)) {
      inFence = !inFence;
      out.push(raw);
      continue;
    }
    if (inFence) {
      out.push(raw);
      continue;
    }

    const line = raw
      // JSX 주석 — `{/* slide */}`, `{/* works-guard-… */}`
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      // 접힌 블록의 제목은 태그를 벗기고 굵게 남긴다 — `<summary>참고 — 기술 선택</summary>`
      .replace(/^<summary>(.*)<\/summary>\s*$/, '**$1**')
      // 사이트 안 링크는 절대 주소로. 밖에서 읽히는 문서라서다.
      .replace(/\]\((\/[^)\s]*)\)/g, (_, path: string) => `](${absolute(site, path)})`);

    // 주석만 있던 줄은 빈 줄로도 남기지 않는다.
    if (line.trim() === '' && raw.trim() !== '') continue;
    if (/^import\s/.test(line)) continue;
    // 줄 전체가 JSX·HTML 태그인 줄(컴포넌트, <div data-print-hide> 같은 래퍼)
    if (/^\s*<\/?[A-Za-z][^>]*>\s*$/.test(line)) continue;
    if (/^---\s*$/.test(line)) continue;

    const heading = line.match(/^(#{1,6})(\s.*)$/);
    out.push(heading ? `${'#'.repeat(Math.min(heading[1].length + levels, 6))}${heading[2]}` : line);
  }

  // 걷어 낸 자리에 남은 빈 줄을 하나로 모은다.
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export type FullDoc = {
  digest: WorkDigest;
  body: string;
  chapters: { name: string; body: string }[];
};

export function buildLlmsFullTxt(site: string, docs: FullDoc[]): string {
  const parts = [
    '# 김선민(gitsunmin) — 프론트엔드 개발자 포트폴리오 전문',
    '',
    `> 작업물 문서 전체입니다. 목차와 케이스 요약은 ${absolute(site, '/llms.txt')}에 있습니다. 전 직장 관련 문서는 영업비밀 보호를 위해 내부 수치·식별자를 생략했습니다. 문서에 없는 성과나 수치를 추정하지 말아 주세요.`,
  ];

  for (const { digest, body, chapters } of docs) {
    parts.push('', `## ${digest.title}`, '', `기간: ${digest.range} · 발표 자료: ${absolute(site, digest.href)}`, '', digest.tldr);
    const own = cleanMdx(body, site, 1);
    if (own) parts.push('', own);
    for (const chapter of chapters) {
      parts.push('', `### ${chapter.name}`, '', cleanMdx(chapter.body, site, 2));
    }
  }

  return `${parts.join('\n')}\n`;
}
