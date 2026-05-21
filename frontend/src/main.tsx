// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import React Query
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// 1. Khởi tạo Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tự động tải lại khi quay lại tab
      retry: 1, // Thử lại 1 lần nếu lỗi
    },
  },
});

// Load Pi SDK
const loadPiSDK = () => {
  if (!document.getElementById('pi-sdk')) {
    const script = document.createElement('script');
    script.id = 'pi-sdk';
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    document.head.appendChild(script);
  }
};

loadPiSDK();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Bao bọc Provider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);