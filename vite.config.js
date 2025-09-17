import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/nba-cdn': {
        target: 'https://cdn.nba.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nba-cdn/, ''),
      },
      '/espn-api': {
        target: 'https://site.api.espn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/espn-api/, ''),
      },
    },
  },
})
