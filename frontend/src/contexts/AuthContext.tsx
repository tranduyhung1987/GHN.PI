import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  userRole: string | null;
  piUsername: string | null;
  loading: boolean;
  setAuth: (username: string, role: string) => Promise<void>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [piUsername, setPiUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load từ localStorage khi app khởi động
  useEffect(() => {
    const savedUsername = localStorage.getItem('piUsername');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedUsername) setPiUsername(savedUsername);
    if (savedRole) setUserRole(savedRole);
    
    setLoading(false);
  }, []);

  // TỐI ƯU: setAuth + lưu lên Firebase
  const setAuth = async (username: string, role: string) => {
    setPiUsername(username);
    setUserRole(role);
    localStorage.setItem('piUsername', username);
    localStorage.setItem('userRole', role);

    // === LƯU LÊN FIREBASE ===
    if (username) {
      try {
        await setDoc(doc(db, "users", username), {
          piUsername: username,
          role: role,
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true }); // merge = không ghi đè dữ liệu cũ
        console.log(`✅ Đã lưu role lên Firebase: ${username} → ${role}`);
      } catch (err) {
        console.error("❌ Lỗi lưu Firebase:", err);
      }
    }
  };

  const clearAuth = () => {
    setPiUsername(null);
    setUserRole(null);
    localStorage.removeItem('piUsername');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ userRole, piUsername, loading, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider');
  return context;
};