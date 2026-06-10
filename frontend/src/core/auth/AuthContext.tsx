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

  // ✅ Load role từ localStorage khi app khởi động
  const [role, setRole] = useState<AppRole | null>(() => {
    const savedRole = localStorage.getItem('selectedRole') as AppRole | null;
    return savedRole;
  });

  const isAuthenticated = !!user;

  const login = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const loggedInUser = await piService.authenticate();
      if (loggedInUser?.username) {
        localStorage.setItem('piUsername', loggedInUser.username);
        setUser(loggedInUser);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    piService.logout();
    setUser(null);
    setRole(null);
    setLoginError(null);
    localStorage.removeItem('piUsername');
    localStorage.removeItem('selectedRole');
  };

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