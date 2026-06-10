// src/hooks/usePiAuth.ts
import { useAuth } from '../core/auth/AuthContext';

export const usePiAuth = () => {
  const auth = useAuth();

  return {
    piUsername: auth.user?.username || localStorage.getItem('piUsername') || '',
    isPiConnected: !!auth.isAuthenticated, // Ép kiểu boolean tường minh
    userRole: auth.role || 'sender',
    loading: !!auth.isLoading,
    loginWithPi: auth.login,
    logout: auth.logout,
  };
};