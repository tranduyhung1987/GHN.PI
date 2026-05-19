import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

interface DangKyVaiTroPageProps {
  onNavigate: (page: string) => void;
}

const DangKyVaiTroPage: React.FC<DangKyVaiTroPageProps> = ({ onNavigate }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedPi = localStorage.getItem('piUsername');
    if (savedPi) {
      setIsPiConnected(true);
      setPiUsername(savedPi);
    }
  }, []);

  const handlePiLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const username = "ThanhPiUser";
      setIsPiConnected(true);
      setPiUsername(username);
      localStorage.setItem('piUsername', username);
      setIsLoading(false);
      alert(`✅ Đăng nhập Pi Network thành công!\nUsername: @${username}`);
    }, 1200);
  };

  const handleSelectRole = (role: string, label: string) => {
    console.log('🔥 Chọn vai trò:', role); // debug
    localStorage.setItem('userRole', role);
    localStorage.setItem('currentPage', 'home'); // Chuyển về trang chủ trong bộ nhớ
    alert(`🎉 ĐÃ CHỌN VAI TRÒ: ${label}\n\nTrang sẽ tải lại để áp dụng giao diện!`);
    window.location.reload();
  };

  const roles = [
    { id: 'sender', label: 'Người Gửi Hàng', icon: '📦', desc: 'Tạo đơn & thanh toán Pi' },
    { id: 'driver', label: 'Tài Xế', icon: '🏍️', desc: 'Nhận đơn giao hàng' },
    { id: 'warehouse', label: 'Kho Trung Chuyển', icon: '🏬', desc: 'Quản lý kho' },
    { id: 'receiver', label: 'Người Nhận Hàng', icon: '🖐️', desc: 'Xác nhận nhận hàng' },
  ];

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <div style={headerIcon}>👤</div>
        <h1 style={titleStyle}>CHỌN VAI TRÒ CỦA BẠN</h1>
        <p style={subtitleStyle}>
          {isPiConnected ? `✅ Đã kết nối @${piUsername}` : 'Bạn phải đăng nhập Pi Network trước khi chọn vai trò'}
        </p>
      </div>

      {!isPiConnected ? (
        <div style={warningBox}>
          <div style={warningContent}>
            <span style={{ fontSize: '28px', marginRight: '12px' }}>⚠️</span>
            <strong>Chưa kết nối Pi Network</strong>
          </div>
          <button onClick={handlePiLogin} disabled={isLoading} style={piLoginButton}>
            {isLoading ? 'Đang kết nối...' : '⭐ Đăng nhập với Pi Network'}
          </button>
        </div>
      ) : (
        <div style={rolesGrid}>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleSelectRole(role.id, role.label)}
              style={roleCard}
            >
              <div style={roleIcon}>{role.icon}</div>
              <h3 style={roleTitle}>{role.label}</h3>
              <p style={roleDesc}>{role.desc}</p>
            </div>
          ))}
        </div>
      )}

      <BottomNav
        onNavigate={onNavigate}
        currentPage="dang-ky-vai-tro"
      />
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)',
  padding: '20px 14px 90px',
  boxSizing: 'border-box',
};

const headerStyle: React.CSSProperties = { textAlign: 'center' as const, marginBottom: '30px' };
const headerIcon: React.CSSProperties = { fontSize: '62px', marginBottom: '12px' };
const titleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: '0 0 8px 0' };
const subtitleStyle: React.CSSProperties = { color: '#6b21a8', fontSize: '15.5px' };

const warningBox: React.CSSProperties = {
  background: 'white',
  border: '3px solid #ef4444',
  borderRadius: '20px',
  padding: '24px 20px',
  marginBottom: '30px',
  textAlign: 'center' as const,
};

const warningContent: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  fontSize: '17px',
  color: '#b91c1c',
};

const piLoginButton: React.CSSProperties = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer',
};

const rolesGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const roleCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '24px 16px',
  textAlign: 'center' as const,
  border: '1px solid #e0d4ff',
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
  cursor: 'pointer',
};
const roleIcon: React.CSSProperties = { fontSize: '52px', marginBottom: '12px' };
const roleTitle: React.CSSProperties = { fontSize: '17px', fontWeight: '700', color: '#4c1d95', margin: '0 0 6px 0' };
const roleDesc: React.CSSProperties = { fontSize: '13.5px', color: '#64748b', margin: 0 };

export default DangKyVaiTroPage;