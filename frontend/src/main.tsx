// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from '@/core/auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// ==================== PI SDK INIT (Improved for Sandbox) ====================
if (typeof window !== 'undefined') {
  const initPi = () => {
    if ((window as any).Pi) {
      try {
        (window as any).Pi.init({
          version: "2.0",
          sandbox: true,
        });
        console.log('%c[Pi] Pi SDK initialized (Sandbox mode)', 'color:#22c55e');
      } catch (e) {
        console.warn('[Pi] Pi.init failed', e);
      }
    }
  };

  // Chỉ init 1 lần, tránh bị message spam gây re-init
  if (document.readyState === 'complete') {
    initPi();
  } else {
    window.addEventListener('load', initPi, { once: true });
  }
}

// Global error handlers
if (typeof window !== 'undefined') {
  window.onerror = () => true;
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
} catch (err) {
  console.error('[Critical] Failed to mount React:', err);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:40px;text-align:center;color:#991b1b">Lỗi khởi động ứng dụng. Vui lòng tải lại trang.</div>`;
  }
}