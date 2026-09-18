import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark';
import { rehypeWorkSections } from './src/lib/rehype-work-sections.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://gitsunmin.github.io',
  base: '/',
  // Astro 7의 기본값은 'jsx'로, 인라인 요소 사이 줄바꿈 공백을 없앤다. 본문이
  // MDX라 인라인 마크업 사이 공백이 의미를 갖는 곳이 많아 기존 동작을 유지한다.
  compressHTML: true,
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
    // Astro 7부터 .md 기본 처리기가 Sätteri로 바뀌었다. 아래 rehype 플러그인들이
    // remark/rehype 파이프라인을 전제로 하므로 기존 처리기를 명시해 동작을 고정한다.
    processor: unified(),
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    // works 문서의 케이스/보조 섹션과 근거 마커에 data-* 표시를 붙인다 (스타일은 CSS 담당)
    // 헤딩 id를 먼저 박는다. rehypeWorkSections가 케이스 제목 안에 '문제 N' 머리표를
    // 넣기 때문에, 순서가 뒤집히면 슬러그가 '문제-1재현되지-않는-…'이 되어
    // 이력서가 가리키는 딥링크가 전부 끊긴다.
    rehypePlugins: [rehypeHeadingIds, rehypeWorkSections],
  },
});
