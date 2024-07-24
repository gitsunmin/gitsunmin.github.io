export const 기술_key_목록 = [
    'react',
    'vue',
] as const;

export type 기술_key = typeof 기술_key_목록[number];

export type 기술 = {
    [key in 기술_key]: {
        readonly 이름: string;
        readonly 아이콘_링크: string;
        설명: string;
    }
};

export const Map_기술: 기술 = {
    react: {
        이름: 'React',
        아이콘_링크: 'https://simpleicons.org/icons/react.svg',
        설명: 'React를 주로 사용합니다.',
    },
    vue: {
        이름: 'Vue',
        아이콘_링크: 'https://simpleicons.org/icons/vue-dot-js.svg',
        설명: 'Vue.js로 처음 프론트엔드 개발자의 길을 걸었습니다.',
    },
};
