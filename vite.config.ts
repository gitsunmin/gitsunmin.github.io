import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'node:path'
import { copyFileSync } from 'node:fs'
import mdx from '@mdx-js/rollup';
import { tilRouteGenerator } from './plugins/vite/til-route-generator';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {
  return {
    define: {
      '__MODE__': JSON.stringify(mode),
    },
    plugins: [
      tilRouteGenerator({ silent: mode === 'development', mode }),
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
      viteStaticCopy({
        targets: [
          {
            src: 'src/assets/til/**/*',
            dest: 'til'
          }
        ]
      })
    ],
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
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
        "@til": path.resolve(__dirname, "./src/docs/til"),
      },
    },
  }
});
