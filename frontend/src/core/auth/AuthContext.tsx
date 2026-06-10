// src/core/auth/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { piService, type PiUser } from '../pi/piService';
import type { AppRole } from '@/utils/constants';

interface AuthContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: AppRole | null;
  login: () => Promise<void>;
  logout: () => void;
  updateRole: (newRole: AppRole) => void;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // ==================== ROLE (Thống nhất qua selectedRole) ====================
  const [role, setRole] = useState<AppRole | null>(() => {
    const savedRole = localStorage.getItem('selectedRole') as AppRole | null;

    // Trong môi trường dev: tự động set 'sender' nếu chưa có
    if (!savedRole && import.meta.env.DEV) {
      localStorage.setItem('selectedRole', 'sender');
      return 'sender';
    }

    return savedRole;
  });

  const isAuthenticated = !!user;

  // ==================== RESTORE SESSION KHI REFRESH ====================
  useEffect(() => {
    const restoreSession = () => {
      const savedUsername = localStorage.getItem('piUsername');

      if (savedUsername) {
        // Khôi phục user tối thiểu từ localStorage
        setUser({
          uid: savedUsername,
          username: savedUsername,
          name: savedUsername,
        });
      }
    };

    restoreSession();
  }, []);

  // ==================== LOGIN ====================
  const login = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const loggedInUser = await piService.authenticate();

      if (loggedInUser?.username) {
        localStorage.setItem('piUsername', loggedInUser.username);
        setUser(loggedInUser);

        // Nếu dev và chưa có role → tự động set sender
        if (import.meta.env.DEV && !localStorage.getItem('selectedRole')) {
          localStorage.setItem('selectedRole', 'sender');
          setRole('sender');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== LOGOUT ====================
  const logout = () => {
    piService.logout();
    setUser(null);
    setRole(null);
    setLoginError(null);
    localStorage.removeItem('piUsername');
    localStorage.removeItem('selectedRole');
  };

  // ==================== UPDATE ROLE ====================
  const updateRole = (newRole: AppRole) => {
    setRole(newRole);
    localStorage.setItem('selectedRole', newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        login,
        logout,
        updateRole,
        loginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};