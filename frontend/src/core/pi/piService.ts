// src/core/pi/piService.ts
import { PiAdapter } from "./PiAdapter";
import { MockPiService } from "./MockPiService";
import { RealPiService } from "./RealPiService";

// ==================== PHÁT HIỆN MÔI TRƯỜNG ====================

const isPiSdkAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).Pi !== 'undefined';
};

const isRunningInRealPiBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  
  // Pi Browser thật thường có user agent chứa "pibrowser"
  if (userAgent.includes('pibrowser')) return true;

  // Hoặc có window.Pi và đang chạy trên domain minepi.com
  if (isPiSdkAvailable() && window.location.hostname.includes('minepi.com')) {
    return true;
  }

  return false;
};

let activeService: PiAdapter | null = null;

const decideAndGetService = (): PiAdapter => {
  // Nếu đã có service rồi thì trả về luôn
  if (activeService) {
    // Trường hợp đặc biệt: đang dùng Mock nhưng Pi SDK xuất hiện muộn
    if (
      activeService.constructor.name === 'MockPiService' && 
      isPiSdkAvailable() && 
      isRunningInRealPiBrowser()
    ) {
      console.log('%c[Pi Service] Nâng cấp lên RealPiService (Pi Browser phát hiện muộn)', 'color: #22c55e');
      activeService = new RealPiService();
    }
    return activeService;
  }

  // === QUYẾT ĐỊNH CHÍNH ===
  if (isRunningInRealPiBrowser() && isPiSdkAvailable()) {
    console.log('%c[Pi Service] → Sử dụng RealPiService (Pi Browser thật)', 'color: #22c55e; font-weight: bold');
    activeService = new RealPiService();
    return activeService;
  }

  // Mặc định dùng Mock (Chrome thường, localhost, pages.dev, v.v.)
  console.log('%c[Pi Service] → Sử dụng MockPiService (Môi trường phát triển)', 'color: #f59e0b; font-weight: bold');
  activeService = new MockPiService();
  return activeService;
};

// ==================== EXPORT ====================

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
  const svc = decideAndGetService() as any;
  return svc && svc.constructor && svc.constructor.name === 'RealPiService';
};

export type PiEnvironment = 'real' | 'mock';

export const getPiEnvironment = (): PiEnvironment => {
  return isUsingRealPi() ? 'real' : 'mock';
};

export * from './PiAdapter';