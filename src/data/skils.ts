export const SKIL_ID_LIST = [
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

export type SkilId = (typeof SKIL_ID_LIST)[number];

export type Skil = {
  [key in SkilId]: {
    readonly name: string;
    readonly iconUrl: string;
  };
};

export const SKILS_MAP: Skil = {
  react: {
    name: 'React',
    iconUrl: 'https://simpleicons.org/icons/react.svg',
  },
  next: {
    name: 'Next',
    iconUrl: 'https://simpleicons.org/icons/nextdotjs.svg',
  },
  vue: {
    name: 'Vue',
    iconUrl: 'https://simpleicons.org/icons/vue-dot-js.svg',
  },
  flutter: {
    name: 'Flutter',
    iconUrl: 'https://simpleicons.org/icons/flutter.svg',
  },
  tailwindcss: {
    name: 'Tailwind CSS',
    iconUrl: 'https://simpleicons.org/icons/tailwindcss.svg',
  },
  typescript: {
    name: 'TypeScript',
    iconUrl: 'https://simpleicons.org/icons/typescript.svg',
  },
  relay: {
    name: 'Relay',
    iconUrl: 'https://simpleicons.org/icons/relay.svg',
  },
  jest: {
    name: 'Jest',
    iconUrl: 'https://simpleicons.org/icons/jest.svg',
  },
  graphql: {
    name: 'GraphQL',
    iconUrl: 'https://simpleicons.org/icons/graphql.svg',
  },
  bitbucket_pipelines: {
    name: 'Bitbucket Pipelines',
    iconUrl: 'https://simpleicons.org/icons/bitbucket.svg',
  },
  datadog: {
    name: 'Datadog',
    iconUrl: 'https://simpleicons.org/icons/datadog.svg',
  },
  vite: {
    name: 'Vite',
    iconUrl: 'https://simpleicons.org/icons/vite.svg',
  },
  bun: {
    name: 'Bun',
    iconUrl: 'https://simpleicons.org/icons/bun.svg',
  },
  firebase: {
    name: 'Firebase',
    iconUrl: 'https://simpleicons.org/icons/firebase.svg',
  },
  nuxt: {
    name: 'Nuxt',
    iconUrl: 'https://simpleicons.org/icons/nuxt.svg',
  },
  vuetify: {
    name: 'Vuetify',
    iconUrl: 'https://simpleicons.org/icons/vuetify.svg',
  },
  pnpm: {
    name: 'pnpm',
    iconUrl: 'https://simpleicons.org/icons/pnpm.svg',
  },
  storybook: {
    name: 'Storybook',
    iconUrl: 'https://simpleicons.org/icons/storybook.svg',
  },
  yarn: {
    name: 'Yarn',
    iconUrl: 'https://simpleicons.org/icons/yarn.svg',
  },
  webpack: {
    name: 'Webpack',
    iconUrl: 'https://simpleicons.org/icons/webpack.svg',
  },
  quasar: {
    name: 'Quasar',
    iconUrl: 'https://simpleicons.org/icons/quasar.svg',
  },
  electron: {
    name: 'Electron',
    iconUrl: 'https://simpleicons.org/icons/electron.svg',
  },
  apollo_graphql: {
    name: 'Apollo GraphQL',
    iconUrl: 'https://simpleicons.org/icons/apollographql.svg',
  },
  aws_amplify: {
    name: 'AWS Amplify',
    iconUrl: 'https://simpleicons.org/icons/awsamplify.svg',
  },
};
