import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'guest' | 'member' | 'driver' | 'warehouse' | 'admin';

interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  piAddress?: string;
  points: number;
  level: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ghn_pi_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ghn_pi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ghn_pi_user');
    }
  }, [user]);

  const login = (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || 'user_' + Date.now(),
      name: userData.name || 'Người dùng GHN.PI',
      email: userData.email,
      role: userData.role || 'member',
      avatar: userData.avatar,
      piAddress: userData.piAddress,
      points: userData.points || 0,
      level: userData.level || 'Mới bắt đầu',
    };
    setUser(newUser);
  };

  const logout = () => setUser(null);
  const updateUser = (newData: Partial<User>) => {
    if (user) setUser({ ...user, ...newData });
  };
  const switchRole = (role: UserRole) => {
    if (user) setUser({ ...user, role });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout, updateUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};