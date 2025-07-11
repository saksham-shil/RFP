import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://rfpdemo.velsof.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      },
    },
  },
})