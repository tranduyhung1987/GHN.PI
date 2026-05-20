import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

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
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);