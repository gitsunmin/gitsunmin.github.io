import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'node:path'
import { copyFileSync } from 'node:fs'
import mdx from '@mdx-js/rollup';
import { tilGenerator } from './.vite-plugin/vite-plugin-til-generator';

export default defineConfig(({ mode }) => {
  return {
    define: {
      '__MODE__': JSON.stringify(mode),
    },
    plugins: [
      tilGenerator({
        ignoreFolders: ['.husky', '.run'],
      }),
      TanStackRouterVite({}),
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
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.md', '**/*.mdx'],
    base: '/',
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@til": path.resolve(__dirname, "./modules/til"),
        "@vite-plugin": path.resolve(__dirname, "./.vite-plugin"),
      },
    },
  }
});
