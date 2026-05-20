import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  userRole: string | null;
  piUsername: string | null;
  loading: boolean;
  setAuth: (username: string, role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [piUsername, setPiUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm thiết lập khi người dùng đăng nhập
  const setAuth = (username: string, role: string) => {
    setPiUsername(username);
    setUserRole(role);
  };

  return (
    <AuthContext.Provider value={{ userRole, piUsername, loading, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider');
  return context;
};