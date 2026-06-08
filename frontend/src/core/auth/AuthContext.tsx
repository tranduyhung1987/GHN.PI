import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  const [role, setRole] = useState<AppRole | null>(
    (localStorage.getItem('selectedRole') as AppRole) || null
  );

  const isAuthenticated = !!user;

  const login = async () => {
    setIsLoading(true);
    try {
      // Gọi trực tiếp Real Pi
      const loggedInUser = await piService.authenticate();

      if (loggedInUser?.username) {
        // Lưu ngay và set state ngay lập tức
        localStorage.setItem('piUsername', loggedInUser.username);
        setUser(loggedInUser);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    piService.logout();
    setUser(null);
    setRole(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};