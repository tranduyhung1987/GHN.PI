import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // Port mặc định của Vite
    host: true,        // Cho phép truy cập từ điện thoại cùng mạng
    strictPort: true
  }
})