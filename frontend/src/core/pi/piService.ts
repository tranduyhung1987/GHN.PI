// src/core/pi/piService.ts
import { PiAdapter } from "./PiAdapter";
import { MockPiService } from "./MockPiService";
import { RealPiService } from "./RealPiService";

// ==================== PI BROWSER DETECTION ====================
const isRunningInPiBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const hasPiSDK = typeof window.Pi !== 'undefined';

  return hasPiSDK || userAgent.includes('pibrowser');
};

let activeService: PiAdapter | null = null;

const decideAndGetService = (): PiAdapter => {
  if (activeService) {
    if (activeService.constructor.name === 'MockPiService' && isRunningInPiBrowser()) {
      console.log('%c[Pi Service] Upgrading to Real Pi SDK (late detection)', 'color: lime; font-weight: bold');
      activeService = new RealPiService();
    }
    return activeService;
  }

  try {
    const hostname = (typeof window !== 'undefined' && window.location) ? window.location.hostname : '';
    const inPiBrowser = isRunningInPiBrowser();

    if (inPiBrowser) {
      console.log('%c[Pi Service] → Real Pi SDK', 'color: lime; font-weight: bold');
      activeService = new RealPiService();
      return activeService;
    }

    if (hostname.includes('pages.dev') || hostname.includes('vercel.app') || hostname === 'localhost') {
      console.log('%c[Pi Service] → Mock Pi SDK (dev mode)', 'color: orange; font-weight: bold');
      activeService = new MockPiService();
      return activeService;
    }

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

/** Kiểm tra đang dùng Real Pi SDK hay không (dùng cho badge) */
export const isUsingRealPi = (): boolean => {
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('pibrowser') || typeof window.Pi !== 'undefined') {
      return true;
    }
  }
  const svc = decideAndGetService() as any;
  return svc && svc.constructor && svc.constructor.name === 'RealPiService';
};

/** Trả về môi trường Pi hiện tại — RẤT DỄ DÙNG ĐỂ HIỂN THỊ BADGE */
export type PiEnvironment = 'real' | 'sandbox' | 'mock';

export const getPiEnvironment = (): PiEnvironment => {
  if (typeof window === 'undefined') return 'mock';

  const ua = navigator.userAgent.toLowerCase();
  const hostname = window.location.hostname;

  if (ua.includes('pibrowser') || typeof window.Pi !== 'undefined' || hostname.includes('minepi.com')) {
    return 'real';
  }
  if (hostname.includes('sandbox.minepi.com')) {
    return 'sandbox';
  }
  return 'mock';
};

export * from './PiAdapter';