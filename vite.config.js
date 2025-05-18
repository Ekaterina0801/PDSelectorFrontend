import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    basicSsl({
      name: 'test',
      domains: ['titlecounter.ru']
    })
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  css: {
    preprocessorOptions: {
      scss: {
        sassOptions: {
          includePaths: [path.resolve(__dirname, 'src')],
        },
      }
    }
  }
})
