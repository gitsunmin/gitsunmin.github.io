export const 기술_key_목록 = [
    'react',
    'next',
    'vue',
    'flutter',
    'tailwindcss',
    'typescript',
    'relay',
    'jest',
    'graphql',
    'bitbucket_pipelines',
    'datadog',
    'vite',
    'bun',
    'firebase',
    'nuxt',
    'vuetify',
    'pnpm',
    'storybook',
    'yarn',
    'webpack',
    'quasar',
    'electron',
    'apollo_graphql',
    'aws_amplify',
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
    flutter: {
        이름: 'Flutter',
        아이콘_링크: 'https://simpleicons.org/icons/flutter.svg',
    },
    tailwindcss: {
        이름: 'Tailwind CSS',
        아이콘_링크: 'https://simpleicons.org/icons/tailwindcss.svg',
    },
    typescript: {
        이름: 'TypeScript',
        아이콘_링크: 'https://simpleicons.org/icons/typescript.svg',
    },
    relay: {
        이름: 'Relay',
        아이콘_링크: 'https://simpleicons.org/icons/relay.svg',
    },
    jest: {
        이름: 'Jest',
        아이콘_링크: 'https://simpleicons.org/icons/jest.svg',
    },
    graphql: {
        이름: 'GraphQL',
        아이콘_링크: 'https://simpleicons.org/icons/graphql.svg',
    },
    bitbucket_pipelines: {
        이름: 'Bitbucket Pipelines',
        아이콘_링크: 'https://simpleicons.org/icons/bitbucket.svg',
    },
    datadog: {
        이름: 'Datadog',
        아이콘_링크: 'https://simpleicons.org/icons/datadog.svg',
    },
    vite: {
        이름: 'Vite',
        아이콘_링크: 'https://simpleicons.org/icons/vite.svg',
    },
    bun: {
        이름: 'Bun',
        아이콘_링크: 'https://simpleicons.org/icons/bun.svg',
    },
    firebase: {
        이름: 'Firebase',
        아이콘_링크: 'https://simpleicons.org/icons/firebase.svg',
    },
    nuxt: {
        이름: 'Nuxt',
        아이콘_링크: 'https://simpleicons.org/icons/nuxt.svg',
    },
    vuetify: {
        이름: 'Vuetify',
        아이콘_링크: 'https://simpleicons.org/icons/vuetify.svg',
    },
    pnpm: {
        이름: 'pnpm',
        아이콘_링크: 'https://simpleicons.org/icons/pnpm.svg',
    },
    storybook: {
        이름: 'Storybook',
        아이콘_링크: 'https://simpleicons.org/icons/storybook.svg',
    },
    yarn: {
        이름: 'Yarn',
        아이콘_링크: 'https://simpleicons.org/icons/yarn.svg',
    },
    webpack: {
        이름: 'Webpack',
        아이콘_링크: 'https://simpleicons.org/icons/webpack.svg',
    },
    quasar: {
        이름: 'Quasar',
        아이콘_링크: 'https://simpleicons.org/icons/quasar.svg',
    },
    electron: {
        이름: 'Electron',
        아이콘_링크: 'https://simpleicons.org/icons/electron.svg',
    },
    apollo_graphql: {
        이름: 'Apollo GraphQL',
        아이콘_링크: 'https://simpleicons.org/icons/apollographql.svg',
    },
    aws_amplify: {
        이름: 'AWS Amplify',
        아이콘_링크: 'https://simpleicons.org/icons/awsamplify.svg',
    },
};
