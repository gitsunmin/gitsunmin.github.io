import { navigate } from 'gatsby';
import type { NavigateOptions } from '@reach/router';

let timer;
export const debounce = (callback, delay) => {
  return ((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback?.(args);
    }, delay);
  })();
};

export const movePath = (path: string, options?: NavigateOptions<{ previousPath: string }>) => {
  navigate(path, options ?? { state: { previousPath: location.pathname } });
};

export const copyToClipboard = (value: any) => {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = value;
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};