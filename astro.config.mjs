import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://gitsunmin.github.io',
  base: '/',
  integrations: [react(), mdx()],
  vite: {
    css: {
      postcss: './postcss.config.js',
    },
    resolve: {
      alias: {
        '@': '/src',
        '@til': '/modules/til',
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
