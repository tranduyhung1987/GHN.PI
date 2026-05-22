import React, { useState } from 'react';
import { db } from '../../firebase'; 

interface DangNhapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (username: string) => void;
  onLogin: () => Promise<void>;
}

const DangNhapModal: React.FC<DangNhapModalProps> = ({ isOpen, onClose, onLogin, onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<'pi' | 'email'>('pi');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // === HÀM PI LOGIN ĐÚNG NHƯ COMMIT 5a1aa91 (ĐANG HOẠT ĐỘNG) ===
  const handlePiLogin = async () => {
    if (!window.Pi) {
      alert("Vui lòng mở ứng dụng trong Pi Browser để đăng nhập!");
      return;
    }

    setIsLoading(true);
    try {
      const scopes = ['username', 'payments'];

      const onIncompletePaymentFound = (payment: any) => {
        console.log("Payment incomplete:", payment);
        return Promise.resolve();
      };

      const authenticateResponse = await window.Pi.authenticate(
        scopes,
        onIncompletePaymentFound
      );

      console.log("✅ Pi Auth Response:", authenticateResponse);

      const userData = authenticateResponse.user;
      const realUsername = userData?.username || "unknown";

      // Lưu vào localStorage + AuthContext
      localStorage.setItem('piUsername', realUsername);
      setIsLoading(false);
      onLoginSuccess?.(realUsername);
      onClose();

      alert(`✅ Đăng nhập Pi Network thành công!\nUsername: @${realUsername}`);
    } catch (err) {
      console.error("❌ Lỗi Pi:", err);
      setIsLoading(false);
      alert("Kết nối Pi thất bại! Vui lòng thử lại.");
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
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