import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'guest' | 'member' | 'driver' | 'warehouse' | 'admin' | 'shop';
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

  // Load từ localStorage khi mở app
  useEffect(() => {
    const savedUser = localStorage.getItem('ghnpi_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginWithPi = async () => {
    // Giả lập kết nối Pi Network
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newUser: User = {
      id: 'pi_' + Date.now().toString(36),
      name: 'Người dùng Pi',
      role: 'member',           // Mặc định là member
      piAddress: 'Pi1abc...xyz123'
    };

    setUser(newUser);
    localStorage.setItem('ghnpi_user', JSON.stringify(newUser));
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