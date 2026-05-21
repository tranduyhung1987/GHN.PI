import React, { useState } from 'react';

interface DangNhapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (username: string) => void;   // ← Đã sửa đúng
}

const DangNhapModal: React.FC<DangNhapModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<'pi' | 'email'>('pi');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

const handlePiLogin = async () => {
  setIsLoading(true);

  if (typeof (window as any).Pi === 'undefined') {
    alert("⚠️ Vui lòng mở trong Pi Browser!");
    setIsLoading(false);
    return;
  }

  try {
    // 🔥 SỬA Ở ĐÂY: Thêm scope 'username' để lấy tên thật
    const scopes = ['username', 'payments'];

    const onIncompletePaymentFound = (payment: any) => {
      console.log("📌 Có payment dang dở:", payment);
      return Promise.resolve();
    };

    const authenticateResponse = await (window as any).Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );

    // Debug để xem toàn bộ dữ liệu trả về
    console.log("✅ Pi Auth Response:", authenticateResponse);

    const realUsername = authenticateResponse?.user?.username || "unknown";

    setIsLoading(false);
    onLoginSuccess?.(realUsername);
    onClose();

    alert(`✅ Đăng nhập Pi Network thành công!\nUsername: @${realUsername}`);
  } catch (error: any) {
    setIsLoading(false);
    console.error("Pi Auth error:", error);
    alert("❌ Đăng nhập Pi thất bại: " + (error?.message || error));
  }
};

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const username = "ThanhPiUser";
      onLoginSuccess?.(username);
      onClose();
      alert('✅ Đăng nhập bằng email thành công!');
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '420px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Đăng Nhập GHN.PI</h2>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '9999px', padding: '4px', marginBottom: '24px' }}>
            <button
              onClick={() => setLoginMethod('pi')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '9999px',
                border: 'none',
                background: loginMethod === 'pi' ? '#4c1d95' : 'transparent',
                color: loginMethod === 'pi' ? 'white' : '#64748b',
                fontWeight: '600'
              }}
            >
              Pi Network
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '9999px',
                border: 'none',
                background: loginMethod === 'email' ? '#4c1d95' : 'transparent',
                color: loginMethod === 'email' ? 'white' : '#64748b',
                fontWeight: '600'
              }}
            >
              Email
            </button>
          </div>

          {loginMethod === 'pi' ? (
            <button
              onClick={handlePiLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: '#22d3ee',
                color: '#0f172a',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '17px',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Đang kết nối Pi Network...' : '🚀 Đăng nhập bằng Pi Network'}
            </button>
          ) : (
            <form onSubmit={handleEmailLogin}>
              <input type="email" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
              <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
              <button type="submit" disabled={isLoading} style={emailButtonStyle}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '12px',
  border: '1px solid #c4b5fd',
  borderRadius: '12px',
  fontSize: '15px',
  background: '#f8fafc'
};

const emailButtonStyle = {
  width: '100%',
  padding: '16px',
  background: '#4c1d95',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  marginTop: '12px',
  cursor: 'pointer'
};

export default DangNhapModal;