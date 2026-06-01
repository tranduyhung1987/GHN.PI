import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: 'es2020',
    sourcemap: false,           // Tắt sourcemap trên production để giảm size
    chunkSizeWarningLimit: 600, // Tăng nhẹ để giảm warning
    rollupOptions: {
      output: {
        // Tách vendor chunks để cache tốt hơn trên Vercel CDN
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },

  // Tối ưu dev server
  server: {
    port: 5173,
    open: false,
  },
});