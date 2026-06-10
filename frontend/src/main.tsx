// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from '@/core/auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// ==================== CHỜ Pi SDK SẴN SÀNG (quan trọng với Sandbox) ====================
const waitForPiSDK = (): Promise<void> => {
  return new Promise((resolve) => {
    if ((window as any).Pi) {
      resolve();
      return;
    }
    const check = setInterval(() => {
      if ((window as any).Pi) {
        clearInterval(check);
        resolve();
      }
    }, 50);
  });
};

// ==================== SANDBOX MESSAGE FILTER (lọc mạnh) ====================
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.origin.includes('sandbox.minepi.com')) {
      const data = event.data || {};
      // Lọc tất cả message nội bộ của Sandbox
      if (
        data?.type === 'installHooks' ||
        data?.type === 'heartbeat' ||
        (typeof data?.action === 'string' && data.action.includes('No action'))
      ) {
        return;
      }
    }
  });
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

// ==================== KHỞI ĐỘNG APP (chờ Pi SDK trước) ====================
async function startApp() {
  await waitForPiSDK(); // Chờ Pi SDK sẵn sàng (rất quan trọng trong Sandbox)

  createStatusBanner();

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
}

startApp();