import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs-extra'
import path from 'path'

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
    {
      name: 'copy-public-files',
      closeBundle() {
        const publicDir = path.resolve(__dirname, 'public')
        const distDir = path.resolve(__dirname, 'dist')
        
        fs.copySync(publicDir, distDir, {
          filter: (src) => {
            const basename = path.basename(src)
            const relativePath = path.relative(publicDir, src)

            if (basename.startsWith('PutHelperHere')) return false
            if (relativePath.includes('models') && relativePath !== 'models' && relativePath !== path.join('models', 'PutModelHere')) return false
            return true
          }
        })
      }
    }
  ],
  publicDir: false,
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
