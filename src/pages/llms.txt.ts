/**
 * /llms.txt — 이 포트폴리오를 AI에게 읽힐 때의 목차(https://llmstxt.org 형식).
 *
 * 채용 담당자가 자기 AI에게 "이 지원자를 요약해 줘"라고 할 때 읽히는 문서다.
 * 내용은 lib/llmsText.ts가 짓고, 재료는 /works 요약 보기와 같은 loadWorkDigests다.
 */
import type { APIContext } from 'astro';
import { loadWorkDigests } from '@/lib/loadWorkDigests';
import { buildLlmsTxt } from '@/lib/llmsText';

export async function GET({ site }: APIContext) {
  const text = buildLlmsTxt(site?.toString() ?? 'https://gitsunmin.github.io', await loadWorkDigests());
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
