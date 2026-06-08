import { useAuth } from '../core/auth/AuthContext';

export const usePiAuth = () => {
  const auth = useAuth();

  return {
    piUsername: auth.user?.username || localStorage.getItem('piUsername') || '',
    isPiConnected: auth.isAuthenticated,
    userRole: auth.role,
    loading: auth.isLoading,
    loginWithPi: auth.login,
    logout: auth.logout,
  };
};