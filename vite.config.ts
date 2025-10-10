import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        "node-llama-cpp",
      ],
    },
  },  
  base: '',
  plugins: [
    vue(),
  ],
  server: {
    host: '127.0.0.1',
    port: 1450,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import  '@/assets/styles/variable.scss';
          @import  '@/assets/styles/mixin.scss';
        `
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
