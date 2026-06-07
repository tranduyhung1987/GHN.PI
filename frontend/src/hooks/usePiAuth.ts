// src/hooks/usePiAuth.ts
import { useAuth } from '../core/auth/AuthContext';
import { isUsingRealPi } from '../core/pi/piService';

/**
 * Detect môi trường Pi Browser / minepi.com để ƯU TIÊN REAL Pi SDK
 * Sử dụng chung helper từ piService để nhất quán (hỗ trợ late detection)
 */
const isPiBrowserEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    // Ưu tiên dùng logic đã có trong piService (có late upgrade Mock → Real)
    return isUsingRealPi();
  } catch {
    // Fallback an toàn
    const userAgent = navigator.userAgent || '';
    const hostname = window.location.hostname || '';
    return (
      /PiBrowser/i.test(userAgent) ||
      hostname.includes('minepi.com') ||
      hostname.includes('sandbox.minepi.com')
    );
  }
};

export const usePiAuth = () => {
  const auth = useAuth();

  const isRealPi = isPiBrowserEnvironment();

  /**
   * Wrapper loginWithPi — tự động ưu tiên real Pi khi ở Pi Browser
   * + log rõ ràng để debug dễ dàng
   */
  const loginWithPi = async () => {
    if (isRealPi) {
      console.log(
        '%c[usePiAuth] ✅ ƯU TIÊN REAL Pi SDK (Pi Browser / minepi.com)',
        'color: #22c55e; font-weight: bold'
      );
    } else {
      console.log(
        '%c[usePiAuth] ℹ️ Môi trường dev/pages.dev → Mock/Sandbox mode',
        'color: #f59e0b'
      );
    }
    return auth.login();
  };

  return {
    // === Dữ liệu người dùng ===
    piUsername: auth.user?.username || '',
    isPiConnected: auth.isAuthenticated,
    userRole: auth.role,
    loading: auth.isLoading,

    // === Cờ môi trường Pi (mới) ===
    isPiBrowser: isRealPi,
    isRealPiEnvironment: isRealPi,

    // === Hành động ===
    loginWithPi,           // Đã wrap → ưu tiên real Pi
    logout: auth.logout,
    refreshUser: auth.refreshUser,
  };
};