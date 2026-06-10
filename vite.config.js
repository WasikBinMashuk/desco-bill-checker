import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'desco-bill-checker' with your actual GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: '/desco-bill-checker/',
  server: {
    proxy: {
      '/api': {
        target: 'https://prepaid.desco.org.bd',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
