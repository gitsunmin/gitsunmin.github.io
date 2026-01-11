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
  avatar: '/assets/avatar/james.webp',
  description: 'Interview page에서 인터뷰를 진행하는 담당자 입니다.',
};

export const Gitsunmin: User = {
  id: `user-${performance.now() + 1}`,
  name: {
    first: 'Sunmin',
    last: 'Kim',
  },
  avatar: '/assets/avatar/gitsunmin.webp',
  description: 'Gitsunmin 페이지의 개발자 김선민 입니다.',
};
