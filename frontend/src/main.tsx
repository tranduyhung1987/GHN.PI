// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from '@/core/auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// ==================== SANDBOX OPTIMIZATION ====================
if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  const isSandbox = hostname.includes('sandbox.minepi.com');

  // Lọc message spam từ Sandbox (giảm nhiễu + tránh re-render)
  window.addEventListener('message', (event) => {
    if (event.origin.includes('sandbox.minepi.com')) {
      const data = event.data || {};
      if (
        data?.type === 'installHooks' ||
        (typeof data?.action === 'string' && data.action.includes('No action'))
      ) {
        return;
      }
    }
  });

  // Khởi tạo Pi SDK
  const initPi = () => {
    const Pi = (window as any).Pi;
    if (Pi && typeof Pi.init === 'function') {
      try {
        Pi.init({
          version: "2.0",
          sandbox: isSandbox,
        });
        console.log(`%c[Pi] Initialized (${isSandbox ? 'Sandbox' : 'Production'} mode)`, 'color:#22c55e');
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

// ==================== STATUS BANNER ====================
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
  `;

  const isSandbox = window.location.hostname.includes('sandbox.minepi.com');
  banner.innerHTML = isSandbox 
    ? '🟣 <b>Pi Sandbox Mode</b> — Đang test' 
    : '🟢 Production Mode';

  document.body.prepend(banner);
}

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
}