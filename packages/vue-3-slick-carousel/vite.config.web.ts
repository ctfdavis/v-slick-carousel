import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import md from 'unplugin-vue-markdown/vite'
import prism from 'markdown-it-prism'
import vike from 'vike/plugin'
//@ts-ignore
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vike({
      prerender: true
    }),
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    md({
      markdownItSetup(md) {
        md.use(prism)
      }
    }),
    eslint(),
    dts({ include: ['lib'] })
  ],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'lib')
    }
  },
  build: {
    copyPublicDir: false,
    sourcemap: true,
    outDir: 'web'
  }
})
