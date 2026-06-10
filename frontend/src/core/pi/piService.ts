// src/core/pi/piService.ts
import { PiAdapter } from "./PiAdapter";
import { MockPiService } from "./MockPiService";
import { RealPiService } from "./RealPiService";

// ==================== PI BROWSER / SANDBOX DETECTION ====================

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
  return hostname.includes('minepi.com') || hostname.includes('sandbox.minepi.com');
};

let activeService: PiAdapter | null = null;

const decideAndGetService = (): PiAdapter => {
  // SỬA LỖI: Nếu đã có Service và nó đã là RealPiService, dùng luôn, tuyệt đối không tạo lại
  if (activeService) {
    if (activeService.constructor.name === 'MockPiService' && (isPiSdkAvailable() || isRunningInPiBrowser())) {
      console.log('%c[Pi Service] Upgrading to Real Pi SDK (late detection)', 'color: lime; font-weight: bold');
      // Chỉ nâng cấp 1 lần duy nhất từ Mock lên Real
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

    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      console.log('%c[Pi Service] → Mock Pi SDK (localhost dev)', 'color: orange; font-weight: bold');
      activeService = new MockPiService();
      return activeService;
    }

    if (hostname.includes('pages.dev') || hostname.includes('vercel.app')) {
      console.log('%c[Pi Service] → Mock Pi SDK (deployed preview)', 'color: orange; font-weight: bold');
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

export * from './PiAdapter';