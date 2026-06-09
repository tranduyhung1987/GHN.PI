// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from '@/core/auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// ==================== PI SDK + SANDBOX FILTER ====================
if (typeof window !== 'undefined') {
  // Lọc message spam từ Sandbox
  window.addEventListener('message', (event) => {
    if (event.origin.includes('sandbox.minepi.com')) {
      const data = event.data || {};
      if (data?.type === 'installHooks' || (typeof data?.action === 'string' && data.action.includes('No action'))) {
        return;
      }
    }
  });

  // Khởi tạo Pi SDK
  const initPi = () => {
    const Pi = (window as any).Pi;
    if (Pi && typeof Pi.init === 'function') {
      try {
        Pi.init({ version: "2.0", sandbox: true });
        console.log('%c[Pi] Initialized (Sandbox mode)', 'color:#22c55e');
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

// ==================== STATUS BANNER (HIỆN TRÊN ĐIỆN THOẠI) ====================
function createStatusBanner() {
  if (document.getElementById('app-status-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'app-status-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    background: #4c1d95;
    color: white;
    padding: 6px 12px;
    font-size: 13px;
    text-align: center;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  `;

  const hostname = window.location?.hostname || '';
  const isSandbox = hostname.includes('sandbox.minepi.com');

  banner.innerHTML = isSandbox 
    ? '🟣 <b>Pi Sandbox Mode</b> — Đang test' 
    : '🟢 Production Mode';

  document.body.prepend(banner);

  // Hàm toàn cục để hiển thị lỗi
  (window as any).showAppError = (msg: string) => {
    if (!banner) return;
    banner.style.background = '#991b1b';
    banner.innerHTML = `⚠️ ${msg}`;

    setTimeout(() => {
      if (banner) {
        banner.style.background = '#4c1d95';
        banner.innerHTML = isSandbox 
          ? '🟣 <b>Pi Sandbox Mode</b> — Đang test' 
          : '🟢 Production Mode';
      }
    }, 5000);
  };
}

// Tạo banner an toàn
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createStatusBanner);
  } else {
    createStatusBanner();
  }
}

// ==================== REACT ROOT ====================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
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
} else {
  console.error('Root element not found');
}