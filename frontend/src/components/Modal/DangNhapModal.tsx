import React, { useState } from 'react';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface DangNhapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (username: string) => void;
}

const DangNhapModal: React.FC<DangNhapModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePiLogin = async () => {
    // 1. Kiểm tra môi trường Pi Browser
    if (!(window as any).Pi) {
      alert("⚠️ Vui lòng mở ứng dụng trong Pi Browser để đăng nhập!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Gọi Pi SDK authenticate
      // Cấu trúc chuẩn: authenticate(scopes, onIncompletePayment, onReadyForData)
      await (window as any).Pi.authenticate(
        ['username', 'payments'],
        (payment: any) => {
          console.log("📌 Có thanh toán dang dở:", payment);
          return Promise.resolve();
        },
        async (authResult: any) => {
          // THÀNH CÔNG: Xử lý dữ liệu
          const userData = authResult.user;
          const realUsername = userData.username;

          console.log("✅ Đăng nhập Pi thành công:", realUsername);

          // 3. Lưu dữ liệu vào Firestore
          try {
            const userRef = doc(db, "users", realUsername);
            await setDoc(userRef, {
              username: realUsername,
              uid: userData.uid,
              lastLogin: new Date().toISOString(),
              role: 'user' // Vai trò mặc định
            }, { merge: true });
          } catch (fireStoreErr) {
            console.error("Lỗi Firestore:", fireStoreErr);
          }

          setIsLoading(false);
          onLoginSuccess?.(realUsername);
          onClose();
        },
        (error: any) => {
          // LỖI
          console.error("❌ Lỗi xác thực Pi:", error);
          setIsLoading(false);
          alert("❌ Kết nối Pi thất bại: " + error.message);
        }
      );
    } catch (err) {
      console.error("Lỗi hệ thống:", err);
      setIsLoading(false);
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h2 style={{ textAlign: 'center', color: '#4c1d95', marginBottom: '20px' }}>Đăng Nhập</h2>
        <button 
          onClick={handlePiLogin} 
          disabled={isLoading} 
          style={piButton}
        >
          {isLoading ? 'Đang kết nối...' : '🚀 Đăng nhập bằng Pi Network'}
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---
const modalOverlay: React.CSSProperties = { 
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', zIndex: 1000 
};
const modalContent: React.CSSProperties = { 
  background: 'white', padding: '24px', borderRadius: '24px', 
  width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
};
const piButton: React.CSSProperties = { 
  width: '100%', padding: '16px', background: '#4c1d95', color: 'white', 
  border: 'none', borderRadius: '9999px', fontSize: '17px', fontWeight: '700', 
  cursor: 'pointer', transition: 'background 0.3s' 
};

export default DangNhapModal;