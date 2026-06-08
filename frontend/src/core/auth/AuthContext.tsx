import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { piService, type PiUser } from '../pi/piService';
import type { AppRole } from '@/utils/constants';

interface AuthContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: AppRole | null;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<AppRole | null>(null);

  const isAuthenticated = !!user;

  const loadUser = async () => {
    setIsLoading(true);
    try {
      let currentUser = await piService.getUser();

      // Fallback đơn giản cho MVP
      if (!currentUser) {
        const saved = localStorage.getItem('piUsername');
        if (saved) {
          currentUser = { uid: `pi-${saved}`, username: saved, name: saved };
        }
      }

      setUser(currentUser);

      const savedRole = localStorage.getItem('selectedRole') as AppRole | null;
      setRole(savedRole);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setIsLoading(true);
    try {
      const loggedInUser = await piService.authenticate();
      setUser(loggedInUser);

      if (loggedInUser?.username) {
        localStorage.setItem('piUsername', loggedInUser.username);
      }

      const savedRole = localStorage.getItem('selectedRole') as AppRole | null;
      setRole(savedRole);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    piService.logout();
    setUser(null);
    setRole(null);
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('piUsername');
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const updateRole = (newRole: AppRole) => {
    setRole(newRole);
    localStorage.setItem('selectedRole', newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        login,
        logout,
        refreshUser,
        updateRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};