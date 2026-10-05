/**
 * "AI에게 묻기" — 사이트는 LLM을 부르지 않고, 읽는 사람의 AI에 질문을 채워 넘긴다.
 */
const SITE = import.meta.env.SITE ?? 'https://gitsunmin.github.io';

/**
 * 채용 담당자의 AI에게 넘길 질문. 근거 링크를 요구하고 추측을 막는 문장을 꼭 넣는다 —
 * 포트폴리오 밖의 성과를 AI가 지어내면 그게 곧 지원자의 말처럼 읽히기 때문이다.
 */
export const askPrompt = (focus: string[]) => {
  const source = new URL('/llms-full.txt', SITE).toString();
  const lens = focus.length > 0 ? `${focus.join(', ')} 관점에서 ` : '';
  return [
    `${source} 문서를 읽고, ${lens}이 프론트엔드 개발자의 강점 세 가지를 알려 주세요.`,
    '각 강점마다 근거가 되는 케이스의 링크를 붙여 주세요.',
    '문서에 없는 성과나 수치는 추측하지 말고, 문서에 적힌 한계도 함께 알려 주세요.',
  ].join(' ');
};

/**
 * 프롬프트를 미리 채운 채 새 탭을 여는 주소.
 * 서비스가 ?q= 미리 채우기를 바꾸거나 막을 수 있어서, 옆에 "질문 복사"를 늘 함께 둔다.
 */
export const AI_TARGETS = [
  { id: 'claude', label: 'Claude에게 묻기', href: (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}` },
  { id: 'chatgpt', label: 'ChatGPT에게 묻기', href: (prompt: string) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}` },
] as const;
