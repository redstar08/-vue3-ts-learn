import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'src',
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
})
