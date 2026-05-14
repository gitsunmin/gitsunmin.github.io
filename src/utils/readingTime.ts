/** 한국어 기준 분당 500자로 읽기 시간 계산 */
export function calcReadingTime(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/^---[\s\S]*?---/, '');
  const charCount = text.replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(charCount / 500));
}
