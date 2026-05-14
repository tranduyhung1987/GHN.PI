// src/contexts/AuthContext.tsx
import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  type ReactNode   // ← Sửa lỗi đỏ ở đây
} from 'react';

export type Role = 'guest' | 'shop' | 'driver' | 'warehouse' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  piAddress?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  loginWithPi: () => Promise<void>;
  setRole: (newRole: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const role = user?.role || 'guest';
  const isAuthenticated = !!user && role !== 'guest';

  // Load user từ localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('ghnpi_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginWithPi = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tempUser: User = {
      id: 'pi_' + Date.now(),
      name: 'Người dùng Pi',
      role: 'guest',
      piAddress: 'Pi1abc...xyz'
    };
    
    setUser(tempUser);
    localStorage.setItem('ghnpi_user', JSON.stringify(tempUser));
  };

  const setRole = (newRole: Role) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('ghnpi_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ghnpi_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      isAuthenticated, 
      loginWithPi, 
      setRole, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};