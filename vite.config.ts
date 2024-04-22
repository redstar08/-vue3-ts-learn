import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync } from 'node:fs'
import { resolve } from 'path'

const htmlFiles = readdirSync(resolve(__dirname, 'src/A-learn/pages'))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有标签前缀为 `my-` 的标签视为自定义元素
          isCustomElement: (tag) => tag.startsWith('my-'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    // 定义全局数据
    __HTML_PAGES__: htmlFiles,
  },
})
