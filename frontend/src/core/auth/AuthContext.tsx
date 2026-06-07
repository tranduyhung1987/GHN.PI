import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { piService, type PiUser, isUsingRealPi } from '../pi/piService';
import type { AppRole } from '@/utils/constants';

const getAdminUsernames = (): string[] => {
  const fromEnv = import.meta.env.VITE_ADMIN_USERNAMES as string | undefined;
  const envList = fromEnv ? fromEnv.split(',').map(u => u.trim().toLowerCase()) : [];
  const devOverride = localStorage.getItem('devAdminUsernames');
  const devList = devOverride ? devOverride.split(',').map(u => u.trim().toLowerCase()) : [];
  return Array.from(new Set([...envList, ...devList]));
};

const isAdminUsername = (username?: string): boolean => {
  if (!username) return false;
  const normalized = username.replace(/^@/, '').toLowerCase();
  const admins = getAdminUsernames().map(u => u.replace(/^@/, '').toLowerCase());
  return admins.includes(normalized);
};

const resolveEffectiveRole = (loggedInUser: PiUser | null, savedRole: AppRole | null): AppRole | null => {
  if (localStorage.getItem('devForceGuest') === 'true') return null;
  if (loggedInUser?.username && isAdminUsername(loggedInUser.username)) return 'admin';
  return savedRole || (loggedInUser?.role as AppRole) || null;
};

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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<AppRole | null>(null);

  const isAuthenticated = !!user;

  const loadUser = async () => {
    try {
      setIsLoading(true);
      let currentUser = await piService.getUser();

      // === FIX MẠNH: Ưu tiên tên thật Pi khi ở Pi Browser ===
      if (!currentUser) {
        const savedPiUsername = localStorage.getItem('piUsername');
        const inRealPi = isUsingRealPi();

        if (savedPiUsername) {
          const looksLikeDemo = savedPiUsername.toLowerCase().includes('demo') ||
                                savedPiUsername.toLowerCase().includes('mock') ||
                                savedPiUsername.toLowerCase().includes('test');

          if (!inRealPi || !looksLikeDemo) {
            currentUser = {
              uid: `pi-${savedPiUsername}`,
              username: savedPiUsername,
              name: savedPiUsername,
            };
          }
        }
      }

      setUser(currentUser);

      const savedRole = localStorage.getItem('selectedRole') as AppRole | null;
      const effectiveRole = resolveEffectiveRole(currentUser, savedRole);
      setRole(effectiveRole);
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const loggedInUser = await piService.authenticate();
      setUser(loggedInUser);

      if (loggedInUser?.username) {
        localStorage.setItem('piUsername', loggedInUser.username);
        // Đánh dấu lần đăng nhập này là real Pi để loadUser ưu tiên sau này
        if (isUsingRealPi()) {
          localStorage.setItem('lastLoginRealPi', 'true');
        }
      }

      const savedRole = localStorage.getItem('selectedRole') as AppRole | null;
      const effectiveRole = resolveEffectiveRole(loggedInUser, savedRole);
      setRole(effectiveRole);

      if (effectiveRole === 'admin') {
        localStorage.setItem('selectedRole', 'admin');
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    piService.logout();
    setUser(null);
    setRole(null);
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('lastLoginRealPi');
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const updateRole = (newRole: AppRole) => {
    if (newRole === 'admin' && user?.username && !isAdminUsername(user.username)) {
      console.warn('[Auth] Cảnh báo: Chỉ tài khoản Admin được phép có quyền Admin.');
      return;
    }
    setRole(newRole);
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
    }
    localStorage.setItem('selectedRole', newRole);
  };

  useEffect(() => {
    loadUser();
    const savedRole = localStorage.getItem('selectedRole') as AppRole | null;
    if (savedRole) setRole(savedRole);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    role,
    login,
    logout,
    refreshUser,
    updateRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};