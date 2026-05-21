import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userRole: string | null;
  piUsername: string | null;
  loading: boolean;
  setAuth: (username: string, role: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [piUsername, setPiUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // TỐI ƯU: Load từ localStorage khi app khởi động (đồng bộ 2 chiều)
  useEffect(() => {
    const savedUsername = localStorage.getItem('piUsername');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedUsername) setPiUsername(savedUsername);
    if (savedRole) setUserRole(savedRole);
    
    setLoading(false); // loading xong ngay
  }, []);

  // TỐI ƯU: setAuth đồng bộ localStorage + context
  const setAuth = (username: string, role: string) => {
    setPiUsername(username);
    setUserRole(role);
    localStorage.setItem('piUsername', username);
    localStorage.setItem('userRole', role);
    
    // (Tùy chọn) Gọi backend register-role ở đây nếu muốn
    // fetch('/api/users/register-role', { ... });
  };

  // Tiện ích logout / xóa auth
  const clearAuth = () => {
    setPiUsername(null);
    setUserRole(null);
    localStorage.removeItem('piUsername');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ 
      userRole, 
      piUsername, 
      loading, 
      setAuth,
      clearAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider');
  return context;
};