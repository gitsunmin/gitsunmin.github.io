import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 한글 등 IME로 글자를 조합하는 중에 눌린 키인지.
 * 조합 중 Enter를 제출로 처리하면 마지막 글자가 한 번 더 확정되어 "최적화화"처럼 중복된다.
 * Safari는 조합을 끝내는 Enter에서 isComposing이 false라 keyCode 229로도 확인한다.
 */
export const isImeComposing = (event: { nativeEvent: KeyboardEvent }) =>
  event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229;
