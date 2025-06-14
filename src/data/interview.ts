import { James, type User } from '@/data/user';

type Link = {
  __t: 'Link';
  label: string;
  path: string;
};

export type Chat = {
  user: User;
  contents: string;
  extend?: Link;
};

export const INTERVIEW: Chat[] = [
  {
    user: James,
    contents: '안녕하세요! 개발자 김선민님의 페이지에 오신 것을 환영합니다.',
  },
];
