// src/main.tsx
// Updated with ErrorBoundary + global error handlers for Pi Browser stability
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from "@/core/auth/AuthContext";
import { ThemeProvider } from './contexts/ThemeContext';
import { initEngines } from '@/core/engines/initEngines';
import { useAppController } from '@/hooks/useAppController';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Global error handlers to prevent complete white screen on Pi Browser
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('[Global Error]', { message, source, lineno, colno, error });
    // Prevent default browser error overlay in some cases
    return true;
  };

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason);
    // Prevent the error from crashing the app completely
    event.preventDefault();
  });
}

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Khởi tạo engines + AppController một lần duy nhất khi app start
let enginesInitialized = false;

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { initApp } = useAppController();

  if (!enginesInitialized) {
    enginesInitialized = true;
    
    // Khởi động engines (EventBus, Realtime, TrackingEngine...)
    initEngines();

    // Khởi động AppController (sẽ restore state, init các engine khác, snapshot...)
    // Chạy async không chặn render
    initApp().catch((err) => {
      console.error('[AppInitializer] INIT_APP failed:', err);
    });

    console.log('%c[GHN.PI] Core engines + AppController initialized', 'color:#22d3ee; font-weight:600');
  }

  return <>{children}</>;
}

// Final safety net: try/catch around the entire React root render
try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <AppInitializer>
                <App />
              </AppInitializer>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );

  // Register PWA service worker (basic offline shell)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // silent fail ok for testnet
      });
    });
  }
} catch (err: unknown) {
  console.error('[Critical] Failed to mount React root:', err);
  const rootEl = document.getElementById('root');
  const errorMessage = err instanceof Error ? err.message : 'Unknown critical error';

  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding:40px;text-align:center;font-family:system-ui;background:#fee2e2;color:#991b1b;">
        <h2>Ứng dụng gặp lỗi nghiêm trọng khi khởi động</h2>
        <p>${errorMessage}</p>
        <button onclick="location.reload()" style="padding:12px 24px;background:#4c1d95;color:white;border:none;border-radius:8px;margin-top:16px;">
          Tải lại trang
        </button>
      </div>
    `;
  }
}