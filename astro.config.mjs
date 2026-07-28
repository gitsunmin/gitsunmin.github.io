import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { rehypeWorkSections } from './src/lib/rehype-work-sections.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://gitsunmin.github.io',
  base: '/',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    mdx(),
    // 이력서 등 비공개 페이지는 sitemap에서 제외해 검색엔진에 노출되지 않도록 함
    sitemap({ filter: (page) => !page.includes('/resume') }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
        '@til': '/modules/til',
      },
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react'],
      exclude: ['@resvg/resvg-js'],
    },
    ssr: {
      external: ['@resvg/resvg-js'],
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    // works 문서의 케이스/보조 섹션과 근거 마커에 data-* 표시를 붙인다 (스타일은 CSS 담당)
    rehypePlugins: [rehypeWorkSections],
  },
});
