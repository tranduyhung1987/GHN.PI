// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from '@/core/auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// ==================== CHỜ Pi SDK SẴN SÀNG ====================
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

// ==================== SANDBOX MESSAGE FILTER ====================
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.origin.includes('sandbox.minepi.com')) {
      const data = event.data || {};
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

// ==================== KHỞI ĐỘNG APP ====================
async function startApp() {
  await waitForPiSDK();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false, retry: 1 },
    },
  });

  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  }
}

startApp();