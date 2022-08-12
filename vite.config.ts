import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    open: true,
    port: 8080
  },
  plugins: [vue(), eslintPlugin()]
})
