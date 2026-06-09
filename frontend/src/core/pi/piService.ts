// src/core/pi/piService.ts
import { PiAdapter } from "./PiAdapter";
import { MockPiService } from "./MockPiService";
import { RealPiService } from "./RealPiService";

// ==================== PI BROWSER / SANDBOX DETECTION (Improved for Pi Sandbox) ====================

const isPiSdkAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).Pi !== 'undefined';
};

const isRunningInPiBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent.toLowerCase();
  return isPiSdkAvailable() || userAgent.includes('pibrowser');
};

const isPiSandboxOrMinepiContext = (): boolean => {
  if (typeof window === 'undefined' || !window.location) return false;
  const hostname = window.location.hostname.toLowerCase();
  // Covers both real Pi and Sandbox environments when hostname is minepi.com domains
  return hostname.includes('minepi.com') || hostname.includes('sandbox.minepi.com');
};

let activeService: PiAdapter | null = null;

const decideAndGetService = (): PiAdapter => {
  if (activeService) {
    // Late upgrade: if Mock but Pi SDK appears later (common in sandbox injection)
    if (activeService.constructor.name === 'MockPiService' && (isPiSdkAvailable() || isRunningInPiBrowser())) {
      console.log('%c[Pi Service] Upgrading to Real Pi SDK (late detection - Sandbox or Pi Browser)', 'color: lime; font-weight: bold');
      activeService = new RealPiService();
    }
    return activeService;
  }

  try {
    const inPiContext = isRunningInPiBrowser() || isPiSdkAvailable() || isPiSandboxOrMinepiContext();

    if (inPiContext) {
      console.log('%c[Pi Service] → Real Pi SDK (Pi Browser or Sandbox)', 'color: lime; font-weight: bold');
      activeService = new RealPiService();
      return activeService;
    }

    const hostname = (typeof window !== 'undefined' && window.location) ? window.location.hostname : '';

    // Only use Mock for pure local/dev environments WITHOUT Pi SDK
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      console.log('%c[Pi Service] → Mock Pi SDK (localhost dev)', 'color: orange; font-weight: bold');
      activeService = new MockPiService();
      return activeService;
    }

    // For deployed previews (pages.dev / vercel) without Pi context → Mock (safe for normal visitors)
    if (hostname.includes('pages.dev') || hostname.includes('vercel.app')) {
      console.log('%c[Pi Service] → Mock Pi SDK (deployed preview without Pi context)', 'color: orange; font-weight: bold');
      activeService = new MockPiService();
      return activeService;
    }

    // Default to Real for other cases
    activeService = new RealPiService();
    return activeService;
  } catch (e) {
    console.error('[Pi Service] Detection failed, fallback to Mock:', e);
    activeService = new MockPiService();
    return activeService;
  }
};

export const piService: PiAdapter = {
  authenticate: () => decideAndGetService().authenticate(),
  getUser: () => decideAndGetService().getUser(),
  isAuthenticated: () => decideAndGetService().isAuthenticated(),
  logout: () => decideAndGetService().logout(),
  createPayment: (payment) => {
    const svc = decideAndGetService();
    return svc.createPayment ? svc.createPayment(payment) : Promise.resolve({ success: false, error: 'createPayment not available' });
  },
};

/** Kiểm tra đang dùng Real Pi SDK hay không */
export const isUsingRealPi = (): boolean => {
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('pibrowser') || typeof (window as any).Pi !== 'undefined') {
      return true;
    }
  }
  const svc = decideAndGetService() as any;
  return svc && svc.constructor && svc.constructor.name === 'RealPiService';
};

/** Trả về môi trường Pi hiện tại — dùng để hiển thị badge */
export type PiEnvironment = 'real' | 'sandbox' | 'mock';

export const getPiEnvironment = (): PiEnvironment => {
  if (typeof window === 'undefined') return 'mock';

  const ua = navigator.userAgent.toLowerCase();
  const hostname = window.location.hostname.toLowerCase();

  if (ua.includes('pibrowser') || typeof (window as any).Pi !== 'undefined') {
    return 'real';
  }
  if (hostname.includes('sandbox.minepi.com')) {
    return 'sandbox';
  }
  if (hostname.includes('minepi.com')) {
    return 'real';
  }
  return 'mock';
};

// Optional: Hỗ trợ VITE_PI_SANDBOX=true để force sandbox mode trong tương lai
// if (import.meta.env.VITE_PI_SANDBOX === 'true') { ... }

export * from './PiAdapter';