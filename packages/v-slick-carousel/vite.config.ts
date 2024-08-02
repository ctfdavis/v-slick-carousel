import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
//@ts-ignore
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslint(), dts({ include: ['lib'] })],
  server: {
    port: 4321
  },
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'lib')
    }
  },
  build: {
    copyPublicDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'Vue3SlickCarousel',
      fileName: (format) => `index.${format}.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
