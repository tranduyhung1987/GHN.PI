import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { piService, type PiUser } from '../pi/piService';
import type { AppRole } from '@/utils/constants';

// ==================== ADMIN HARDCODE (Phương án 1 - Tối ưu cho giai đoạn hiện tại) ====================
// Chỉ những Pi username trong danh sách này mới được tự động gán quyền Admin.
// Khuyến nghị: Đặt trong .env dưới dạng VITE_ADMIN_USERNAMES=username1,username2
const getAdminUsernames = (): string[] => {
  const fromEnv = import.meta.env.VITE_ADMIN_USERNAMES as string | undefined;
  const envList = fromEnv ? fromEnv.split(',').map(u => u.trim().toLowerCase()) : [];

  // Hỗ trợ override trong development (rất hữu ích khi test)
  const devOverride = localStorage.getItem('devAdminUsernames');
  const devList = devOverride ? devOverride.split(',').map(u => u.trim().toLowerCase()) : [];

  // Kết hợp + loại trùng
  return Array.from(new Set([...envList, ...devList]));
};

const isAdminUsername = (username?: string): boolean => {
  if (!username) return false;

  // Normalize: remove @ if user pastes with it, and lowercase
  const normalized = username.replace(/^@/, '').toLowerCase();

  const admins = getAdminUsernames().map(u => u.replace(/^@/, '').toLowerCase());

  const isAdmin = admins.includes(normalized);
  if (isAdmin) {
    console.log(`[Auth] ✓ Auto-assigned ADMIN role for username: ${username}`);
  }
  return isAdmin;
};

/**
 * Resolve role với ưu tiên (dành cho dev + production):
 * - devForceGuest (chỉ dùng khi test local): ép về trạng thái Người mới để test flow khóa thẻ
 * - Admin hardcode
 * - Role đã lưu
 */
const resolveEffectiveRole = (loggedInUser: PiUser | null, savedRole: AppRole | null): AppRole | null => {
  // 1. Dev helper: ép về guest để dễ test luồng "Người mới bị khóa thẻ"
  if (localStorage.getItem('devForceGuest') === 'true') {
    return null;
  }

  // 2. Admin hardcode (ưu tiên cao)
  if (loggedInUser?.username && isAdminUsername(loggedInUser.username)) {
    return 'admin';
  }

  // 3. Role đã lưu hoặc từ service
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
  updateRole: (newRole: AppRole) => void;   // ← MỚI: Cho phép chọn vai trò sau login
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
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

      // Fallback: if no user from Pi service (e.g. getUser failed silently in real Pi), 
      // but we have persisted piUsername from previous real login + role register, use it for UI (display connected state).
      // Full real features (payments etc) will still go through real piService when called.
      if (!currentUser) {
        const savedPiUsername = localStorage.getItem('piUsername');
        if (savedPiUsername) {
          currentUser = {
            uid: `pi-${savedPiUsername}`,
            username: savedPiUsername,
            name: savedPiUsername,
          };
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

      // Persist username so after role register / reload / getUser fallback, the Home shows "Đã kết nối: @realuser"
      if (loggedInUser?.username) {
        localStorage.setItem('piUsername', loggedInUser.username);
      }

      const savedRole = localStorage.getItem('selectedRole') as AppRole | null;
      const effectiveRole = resolveEffectiveRole(loggedInUser, savedRole);
      setRole(effectiveRole);

      // Nếu là admin do hardcode → cũng lưu lại để lần sau load nhanh
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

    // Full reset to guest (Người mới) state: clear selected role so Home shows original 8 cards + Pi login
    localStorage.removeItem('selectedRole');

    // Xóa dev helper khi logout (giữ devForceGuest nếu user muốn test tiếp)
    // localStorage.removeItem('devForceGuest'); // Bỏ comment nếu muốn auto clear
  };

  const refreshUser = async () => {
    await loadUser();
  };

  // === CẬP NHẬT VAI TRÒ (dùng cho RegisterRolePage) ===
  const updateRole = (newRole: AppRole) => {
    // Bảo vệ: Không cho phép user thường tự set thành admin
    if (newRole === 'admin' && user?.username && !isAdminUsername(user.username)) {
      console.warn('[Auth] Cảnh báo: Chỉ tài khoản Admin được phép có quyền Admin.');
      return;
    }

    setRole(newRole);

    // Cập nhật vào user object nếu có
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
    }

    // Lưu vào localStorage để giữ sau khi reload (dùng cho cả Mock và Real)
    localStorage.setItem('selectedRole', newRole);

    console.log(`[Auth] Role updated to: ${newRole}`);
  };

  useEffect(() => {
    loadUser();

    // Khôi phục role từ localStorage (sẽ bị override nếu là admin hardcode)
    const savedRole = localStorage.getItem('selectedRole') as AppRole | null;
    if (savedRole) {
      // Chỉ set tạm, loadUser() sẽ resolve đúng (ưu tiên admin hardcode)
      setRole(savedRole);
    }
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