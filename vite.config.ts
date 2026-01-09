import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import path from 'node:path';
import { copyFileSync } from 'node:fs';
import mdx from '@mdx-js/rollup';
import { tilRouteGenerator } from './plugins/vite/til-route-generator';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { imageDownloader } from './plugins/vite/image-downloader';

export default defineConfig(({ mode }) => {
  return {
    define: {
      __MODE__: JSON.stringify(mode),
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'src/assets/til/**/*',
            dest: 'til',
          },
        ],
      }),
      imageDownloader({
        active: mode === 'production',
        targets: [
          {
            url: 'https://avatars.githubusercontent.com/u/41544175?v=4',
            defaultImagePath: path.resolve(
              __dirname,
              'src/assets/avatar/default.webp',
            ),
            outputPath: path.resolve(
              __dirname,
              'src/assets/avatar/gitsunmin.webp',
            ),
          },
        ],
      }),
      tilRouteGenerator({ silent: mode === 'development', mode }),
      tanstackRouter({}),
      mdx(),
      react(),
      {
        name: 'generate-404-html', // 플러그인 이름
        apply: 'build', // build 단계에서 실행
        closeBundle() {
          try {
            copyFileSync('dist/index.html', 'dist/404.html');
            console.log('✅ 404.html created successfully');
          } catch (error) {
            console.error('❌ Failed to create 404.html:', error);
          }
        },
      },
    ],
    assetsInclude: [
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.webp',
      '**/*.svg',
    ],
    base: '/',
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@til': path.resolve(__dirname, './src/docs/til'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['tests/**/*.test.ts'],
      setupFiles: ['./tests/setup.ts'],
    },
  };
});
