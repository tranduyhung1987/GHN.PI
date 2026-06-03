// src/core/pi/piService.ts
import { PiAdapter } from "./PiAdapter";
import { MockPiService } from "./MockPiService";
import { RealPiService } from "./RealPiService";

// ==================== IMPROVED PI BROWSER DETECTION ====================
// Hỗ trợ mở link pages.dev trực tiếp từ trong Pi Browser thật
const isRunningInPiBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const hasPiSDK = typeof window.Pi !== 'undefined';

  // Pi Browser injects window.Pi + userAgent chứa "pibrowser"
  // Ngay cả khi mở external URL như ghn-pi.pages.dev
  return hasPiSDK || userAgent.includes('pibrowser');
};

const createPiService = (): PiAdapter => {
  try {
    const hostname = (typeof window !== 'undefined' && window.location) ? window.location.hostname : '';
    const inPiBrowser = isRunningInPiBrowser();

    // Nếu đang ở trong Pi Browser thật → ưu tiên Real Pi SDK (dù URL là pages.dev)
    if (inPiBrowser) {
      console.log('%c[Pi Service] → Real Pi SDK (Detected inside Pi Browser on ' + hostname + ')', 'color: lime; font-weight: bold');
      return new RealPiService();
    }

    // Trên desktop / trình duyệt thường: ép Mock cho các deploy preview (pages.dev, vercel) + localhost
    if (hostname.includes('pages.dev') || hostname.includes('vercel.app') || hostname === 'localhost') {
      console.log('%c[Pi Service] → Mock Pi SDK (Forced on ' + hostname + ' - not in Pi Browser)', 'color: orange; font-weight: bold');
      return new MockPiService();
    }

    // Các trường hợp khác (custom domain production...)
    console.log('%c[Pi Service] → Real Pi SDK (Production domain)', 'color: lime; font-weight: bold');
    return new RealPiService();
  } catch (e) {
    console.error('[Pi Service] Detection failed, falling back to Mock:', e);
    return new MockPiService();
  }
};

export const piService = (createPiService());

/** Helper để UI biết đang dùng real hay mock */
export const isUsingRealPi = (): boolean => {
  // Kiểm tra lại runtime (hữu ích sau khi reload)
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('pibrowser') || typeof window.Pi !== 'undefined') {
      return true;
    }
  }
  // Fallback dựa trên instance type (không hoàn hảo nhưng dùng được)
  return piService.constructor.name === 'RealPiService';
};

export * from './PiAdapter';