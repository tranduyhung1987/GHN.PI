// src/hooks/usePiAuth.ts
import { useAuth } from '../core/auth/AuthContext';

/**
 * Detect Pi Browser hoặc domain minepi.com để ƯU TIÊN REAL Pi SDK
 * (thay vì mock/demo). Đây là logic cốt lõi để GHN.PI dùng Pi thật.
 */
const isPiBrowserEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent || '';
  const hostname = window.location.hostname || '';

  // Ưu tiên real Pi khi:
  // - Chạy trong Pi Browser chính thức (userAgent chứa "PiBrowser")
  // - Hoặc domain minepi.com / sandbox.minepi.com (Pi Sandbox)
  return (
    /PiBrowser/i.test(userAgent) ||
    hostname.includes('minepi.com') ||
    hostname.includes('sandbox.minepi.com')
  );
};

export const usePiAuth = () => {
  const auth = useAuth();

  const isRealPi = isPiBrowserEnvironment();

  // Wrapper loginWithPi: ưu tiên real Pi + log rõ ràng
  const loginWithPi = async () => {
    if (isRealPi) {
      console.log(
        '[usePiAuth] ✅ ƯU TIÊN REAL Pi SDK (Pi Browser / minepi.com detected). ' +
        'Đang gọi piService.authenticate() với Pi thật...'
      );
    } else {
      console.log(
        '[usePiAuth] ℹ️ Môi trường dev / pages.dev → dùng Mock/Sandbox. ' +
        'Để test real Pi: mở app trong Pi Browser hoặc domain đã whitelist trong Pi Developer Portal.'
      );
    }
    return auth.login();
  };

  return {
    piUsername: auth.user?.username || '',
    isPiConnected: auth.isAuthenticated,
    userRole: auth.role,
    loading: auth.isLoading,

    // MỚI: Cờ ưu tiên real Pi (dùng cho component hiển thị trạng thái)
    isPiBrowser: isRealPi,
    isRealPiEnvironment: isRealPi,

    loginWithPi,           // Đã wrap → tự động ưu tiên real Pi khi ở Pi Browser
    logout: auth.logout,
    refreshUser: auth.refreshUser,
  };
};