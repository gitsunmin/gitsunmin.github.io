export const 기술_key_목록 = [
    'react',
    'next',
    'vue',
] as const;

export type 기술_key = typeof 기술_key_목록[number];

export type 기술 = {
    [key in 기술_key]: {
        readonly 이름: string;
        readonly 아이콘_링크: string;
    }
};

export const Map_기술: 기술 = {
    react: {
        이름: 'React',
        아이콘_링크: 'https://simpleicons.org/icons/react.svg',
    },
    next: {
        이름: 'Next',
        아이콘_링크: 'https://simpleicons.org/icons/nextdotjs.svg',
    },
    vue: {
        이름: 'Vue',
        아이콘_링크: 'https://simpleicons.org/icons/vue-dot-js.svg',
    },
};
