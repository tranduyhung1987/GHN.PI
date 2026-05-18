import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Import CSS
import './index.css';

// Optional: Load Pi SDK script (nếu chưa có trong index.html)
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
    <App />
  </StrictMode>
);