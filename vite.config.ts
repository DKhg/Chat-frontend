import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    port: 3000,
    proxy: { '/ws-chat': {
      target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    global: 'window',          // global is not defined 해결
    'process.env': {},         // process 관련 에러 방지
    Buffer: [],                // 일부 crypto 함수가 Buffer를 참조할 때 대비
  },
})
