// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from '@/core/auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// ==================== PI SDK + SANDBOX NOISE FILTER ====================
if (typeof window !== 'undefined') {
  // Lọc bớt message spam từ Pi Sandbox
  window.addEventListener('message', (event) => {
    const origin = event.origin || '';
    const data = event.data || {};

    // Bỏ qua các message nội bộ của Sandbox (không cần thiết)
    if (origin.includes('sandbox.minepi.com')) {
      if (
        data?.type === 'installHooks' ||
        data?.action === 'No action for this app message' ||
        typeof data === 'string'
      ) {
        return; // bỏ qua
      }
    }
  });

  // Khởi tạo Pi SDK an toàn
  const initPi = () => {
    const Pi = (window as any).Pi;
    if (Pi && typeof Pi.init === 'function') {
      try {
        Pi.init({
          version: "2.0",
          sandbox: true,
        });
        console.log('%c[Pi] Initialized in Sandbox mode', 'color:#22c55e');
      } catch (e) {
        console.warn('[Pi] Init error:', e);
      }
    }
  };

  if (document.readyState === 'complete') {
    initPi();
  } else {
    window.addEventListener('load', initPi, { once: true });
  }
}

// ==================== GLOBAL ERROR DISPLAY (cho điện thoại) ====================
// Cho phép các nơi khác trong app gọi window.showGlobalError(msg)
(window as any).showGlobalError = (msg: string) => {
  const banner = document.getElementById('global-error-banner');
  if (banner) {
    banner.innerHTML = `⚠️ ${msg}`;
    banner.style.display = 'block';
    setTimeout(() => {
      if (banner) banner.style.display = 'none';
    }, 6000);
  }
};

// Tạo thanh hiển thị lỗi/status (nếu chưa có)
if (typeof document !== 'undefined' && !document.getElementById('global-error-banner')) {
  const banner = document.createElement('div');
  banner.id = 'global-error-banner';
  banner.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
    background: #fee2e2; color: #991b1b; padding: 8px 12px;
    font-size: 13px; text-align: center; display: none;
    border-bottom: 1px solid #fca5a5;
  `;
  document.body.appendChild(banner);
}

// ==================== REACT ROOT ====================
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