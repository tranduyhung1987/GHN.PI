// src/core/pi/piService.ts
import { PiAdapter } from "./PiAdapter";
import { MockPiService } from "./MockPiService";
import { RealPiService } from "./RealPiService";

// ==================== DETECTION MẠNH (ÉP MOCK TRÊN LOCALHOST) ====================
const isPiBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Tạm thời chỉ cho phép Real Pi khi ở Pi Browser thật
  const hostname = window.location.hostname;
  const userAgent = navigator.userAgent.toLowerCase();

  const isPiEnv = 
    hostname.includes('minepi.com') || 
    hostname.includes('pi.network') ||
    userAgent.includes('pibrowser');

  return typeof window.Pi !== 'undefined' && isPiEnv;
};

const createPiService = (): PiAdapter => {
  try {
    const hostname = (typeof window !== 'undefined' && window.location) ? window.location.hostname : '';

    // Luôn dùng Mock trên Cloudflare Pages / Vercel / localhost để tránh crash
    if (hostname.includes('pages.dev') || hostname.includes('vercel.app') || hostname === 'localhost') {
      console.log('%c[Pi Service] → Mock Pi SDK (Forced on ' + hostname + ')', 'color: orange; font-weight: bold');
      return new MockPiService();
    }

    if (isPiBrowser()) {
      console.log('%c[Pi Service] → Real Pi SDK (Pi Browser)', 'color: lime; font-weight: bold');
      return new RealPiService();
    } else {
      console.log('%c[Pi Service] → Mock Pi SDK (Development)', 'color: orange; font-weight: bold');
      return new MockPiService();
    }
  } catch (e) {
    console.error('[Pi Service] Detection failed, falling back to Mock:', e);
    return new MockPiService();
  }
};

export const piService = (createPiService());
export * from './PiAdapter';