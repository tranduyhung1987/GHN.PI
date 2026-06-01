// src/main.tsx
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