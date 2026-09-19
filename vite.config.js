import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss({
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  })],
})
