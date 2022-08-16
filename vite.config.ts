import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    open: true,
    port: 8080
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  plugins: [vue(), eslintPlugin()],
  build: {
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue'],
      output: {
        // 在 umd 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    },
    lib: {
      entry: './src/packages/designer/index.ts',
      name: 'form-create-designer-vue3',
      formats: ['es', 'umd']
    }
  }
})
