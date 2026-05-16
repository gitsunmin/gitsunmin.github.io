const TECH_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  React: '#149eca',
  'React Native': '#61dafb',
  Expo: '#4630eb',
  GraphQL: '#e10098',
  Relay: '#f26b00',
  'Cloudflare Workers': '#f38020',
  Prisma: '#5a67d8',
  'Tailwind CSS': '#06b6d4',
  Astro: '#ff5d01',
  'Three.js': '#6b7280',
  Vite: '#646cff',
  Turborepo: '#ef4444',
  Bun: '#c8a97e',
  'Vue.js': '#42b883',
  'Next.js': '#1a1a1a',
  'Node.js': '#339933',
  'AWS Amplify': '#ff9900',
  DataDog: '#632ca6',
  pnpm: '#f69220',
};

export const getTechColor = (tech: string): string =>
  TECH_COLORS[tech] ?? '#8b949e';
