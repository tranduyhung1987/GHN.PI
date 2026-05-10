import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Role = 'guest' | 'shop' | 'driver' | 'warehouse' | 'admin';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  loginWithPi: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('guest');

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('ghnpi_role', newRole);
  };

  const loginWithPi = () => {
    alert('🔐 Đang đăng nhập với Pi Network...');
    setRole('shop');
  };

  const logout = () => {
    setRole('guest');
    alert('✅ Đã đăng xuất!');
  };

  return (
    <AuthContext.Provider value={{ role, setRole, loginWithPi, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
};