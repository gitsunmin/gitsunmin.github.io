import JamesAvatar from '@/assets/avatar/james.webp';
import GitsunminAvatar from '@/assets/avatar/gitsunmin.webp';

export type User = {
  id: string;
  name: {
    first: string;
    last: string;
  };
  avatar: string;
  description: string;
};

export const James: User = {
  id: `user-${performance.now()}`,
  name: {
    first: 'James',
    last: 'Kim',
  },
  avatar: JamesAvatar,
  description: 'Interview page에서 인터뷰를 진행하는 담당자입니다.',
};

export const Gitsunmin: User = {
  id: `user-${performance.now() + 1}`,
  name: {
    first: 'Sunmin',
    last: 'Kim',
  },
  avatar: GitsunminAvatar,
  description: 'Gitsunmin 페이지의 개발자 김선민입니다.',
};
