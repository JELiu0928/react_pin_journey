import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/'
//   base: '/repository-name/', // 替換為你儲存庫的名稱
})
