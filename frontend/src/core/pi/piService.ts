// src/core/pi/piService.ts
import { PiAdapter } from "./PiAdapter";
import { MockPiService } from "./MockPiService";
import { RealPiService } from "./RealPiService";

// ==================== PI BROWSER DETECTION (runtime, not only at load) ====================
// Hỗ trợ mở link pages.dev trực tiếp từ trong Pi Browser thật
const isRunningInPiBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const hasPiSDK = typeof window.Pi !== 'undefined';

  // Pi Browser injects window.Pi + userAgent chứa "pibrowser"
  // Ngay cả khi mở external URL như ghn-pi.pages.dev
  return hasPiSDK || userAgent.includes('pibrowser');
};

let activeService: PiAdapter | null = null;

const decideAndGetService = (): PiAdapter => {
  if (activeService) {
    // If we previously chose Mock, but now Pi SDK is available (late injection), upgrade to Real
    if (activeService.constructor.name === 'MockPiService' && isRunningInPiBrowser()) {
      console.log('%c[Pi Service] Upgrading to Real Pi SDK (late detection of Pi Browser)', 'color: lime; font-weight: bold');
      activeService = new RealPiService();
    }
    return activeService;
  }

  try {
    const hostname = (typeof window !== 'undefined' && window.location) ? window.location.hostname : '';
    const inPiBrowser = isRunningInPiBrowser();

    // Prioritize real if we detect Pi Browser environment (at decision time, which is on user click)
    if (inPiBrowser) {
      console.log('%c[Pi Service] → Real Pi SDK (Detected inside Pi Browser on ' + hostname + ')', 'color: lime; font-weight: bold');
      activeService = new RealPiService();
      return activeService;
    }

    // Only force Mock for preview hosts when NOT in actual Pi Browser
    if (hostname.includes('pages.dev') || hostname.includes('vercel.app') || hostname === 'localhost') {
      console.log('%c[Pi Service] → Mock Pi SDK (Forced on ' + hostname + ' - not in Pi Browser)', 'color: orange; font-weight: bold');
      activeService = new MockPiService();
      return activeService;
    }

    // Other cases (prod custom domain etc)
    console.log('%c[Pi Service] → Real Pi SDK (Production domain)', 'color: lime; font-weight: bold');
    activeService = new RealPiService();
    return activeService;
  } catch (e) {
    console.error('[Pi Service] Detection failed, falling back to Mock:', e);
    activeService = new MockPiService();
    return activeService;
  }
};

// Proxy so that code using `piService.authenticate()` etc. works, but decision is lazy (on first call, e.g. user click login)
// This fixes timing issues where window.Pi is not yet injected at module load time.
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

/** Helper để UI biết đang dùng real hay mock */
export const isUsingRealPi = (): boolean => {
  // Re-check at call time
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('pibrowser') || typeof window.Pi !== 'undefined') {
      return true;
    }
  }
  // Force decision if not yet, then check
  const svc = decideAndGetService() as any;
  return svc && svc.constructor && svc.constructor.name === 'RealPiService';
};

export * from './PiAdapter';