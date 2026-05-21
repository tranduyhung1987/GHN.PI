import React, { useState } from 'react';
import { db } from '../../firebase'; // Đảm bảo đường dẫn này đúng với project của bạn
import { doc, setDoc } from 'firebase/firestore';

interface DangNhapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (username: string) => void;
}

const DangNhapModal: React.FC<DangNhapModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<'pi' | 'email'>('pi');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

// Sửa lại hàm handlePiLogin trong DangNhapModal.tsx
const handlePiLogin = async () => {
  setIsLoading(true);
  try {
    await (window as any).Pi.authenticate(
      ['username', 'payments'], 
      (payment: any) => { 
        // Bắt buộc phải có callback này để xử lý payment dở dang
        console.log("Xử lý payment dở dang", payment);
        return Promise.resolve(); 
      },
      (authResult: any) => {
        // Callback thành công
        const realUsername = authResult.user.username;
        console.log("Đăng nhập thành công:", realUsername);
        // Lưu Firestore và xử lý tiếp...
        setIsLoading(false);
        onLoginSuccess?.(realUsername);
        onClose();
      },
      (error: any) => {
        // Callback lỗi
        console.error("Lỗi xác thực:", error);
        setIsLoading(false);
        alert("Kết nối Pi thất bại: " + error.message);
      }
    );
  } catch (err) {
    setIsLoading(false);
    console.error("Lỗi hệ thống:", err);
  }
};

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic email cũ của bạn
    alert("Vui lòng ưu tiên đăng nhập bằng Pi Network!");
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '24px', width: '90%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#4c1d95', marginBottom: '20px' }}>Đăng Nhập</h2>
        <div style={{ marginBottom: '20px' }}>
          {loginMethod === 'pi' ? (
            <button 
              onClick={handlePiLogin} 
              disabled={isLoading} 
              style={{
                width: '100%', padding: '16px', background: '#4c1d95', color: 'white', border: 'none',
                borderRadius: '9999px', fontSize: '17px', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Đang kết nối...' : '🚀 Đăng nhập bằng Pi Network'}
            </button>
          ) : (
            <form onSubmit={handleEmailLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
              <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
              <button type="submit" disabled={isLoading} style={emailButtonStyle}>Đăng Nhập</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = { width: '100%', padding: '14px', marginBottom: '12px', border: '1px solid #c4b5fd', borderRadius: '12px', fontSize: '15px', background: '#f8fafc', boxSizing: 'border-box' };
const emailButtonStyle: React.CSSProperties = { width: '100%', padding: '14px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' };

export default DangNhapModal;