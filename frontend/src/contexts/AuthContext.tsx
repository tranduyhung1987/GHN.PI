import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'guest' | 'member' | 'driver' | 'warehouse' | 'admin' | 'shop';

export interface User {
  id: string;
  name: string;
  role: Role;
  piAddress?: string;
  balance?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithPi: () => Promise<void>;
  logout: () => void;
  role?: Role;
  setRole?: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ghnpi_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const loginWithPi = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: 'pi_' + Date.now().toString(36),
      name: 'Thành viên Pi',
      role: 'member',
      piAddress: 'Pi1abc...xyz',
      balance: 12450
    };

    setUser(newUser);
    localStorage.setItem('ghnpi_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ghnpi_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loginWithPi, 
      logout,
      role: user?.role,
      setRole: (newRole: Role) => {
        if (user) {
          const updatedUser = { ...user, role: newRole };
          setUser(updatedUser);
          localStorage.setItem('ghnpi_user', JSON.stringify(updatedUser));
         }
       }      
    }}>
      {children}
    </AuthContext.Provider>
   );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};