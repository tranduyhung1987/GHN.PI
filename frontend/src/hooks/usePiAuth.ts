// src/hooks/usePiAuth.ts
import { useAuth } from '../core/auth/AuthContext';

export const usePiAuth = () => {
  const auth = useAuth();

  return {
    // ✅ Chỉ lấy từ AuthContext (Single Source of Truth)
    piUsername: auth.user?.username || '',

    // Trạng thái kết nối Pi
    isPiConnected: auth.isAuthenticated,

    // Role hiện tại
    role: auth.role,

    // Trạng thái loading
    isLoading: auth.isLoading,

    // Hàm đăng nhập / đăng xuất
    loginWithPi: auth.login,
    logout: auth.logout,

    // Giữ lại loginError nếu cần dùng ở UI
    loginError: auth.loginError,
  };
};