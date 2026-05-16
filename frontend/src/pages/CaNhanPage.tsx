import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CaNhanPageProps {
  onNavigate: (page: string) => void;
}

const CaNhanPage: React.FC<CaNhanPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Cá Nhân</h1>

      {isAuthenticated && user ? (
        <>
          {/* Profile Card - ĐÃ GIẢM CHIỀU CAO THEO VÙNG XANH */}
          <div style={profileCard}>
            <div style={avatar}>👤</div>
            <h2 style={nameStyle}>Thành viên Pi</h2>
            <p style={idStyle}>ID: {user.id}</p>
            
            <div style={infoContainer}>
              <div>Số dư Pi: <strong style={balance}>{user.balance?.toLocaleString()} π</strong></div>
              <div>Reputation: <strong style={reputation}>⭐ 94 pts</strong></div>
            </div>
          </div>

          {/* Menu items */}
          <div style={menuItem}>📦 Lịch sử đơn hàng</div>
          <div style={menuItem}>💰 Ví Pi</div>
          <div style={menuItem}>⚙️ Cài đặt</div>

          {/* NÚT ĐĂNG XUẤT Ở CUỐI TRANG */}
          <button onClick={logout} style={logoutBtn}>
            Đăng xuất
          </button>
        </>
      ) : (
        <div style={notLoginStyle}>
          <p>Bạn chưa đăng nhập</p>
          <button style={loginBtn} onClick={() => window.dispatchEvent(new CustomEvent('openModal', { detail: { title: "Yêu cầu Đăng nhập" } }))}>
            Đăng nhập với Pi Network
          </button>
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES - ĐÃ TỐI ƯU CHIỀU CAO ===================== */
const pageStyle: React.CSSProperties = {
  padding: '20px 16px 100px',
  background: '#f8fafc',
  minHeight: '100vh'
};

const titleStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: '700',
  color: '#4c1d95',
  textAlign: 'center',
  marginBottom: '20px'
};

const profileCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '20px 20px 24px',   // Giảm padding trên
  textAlign: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
  marginBottom: '24px'
};

const avatar: React.CSSProperties = {
  fontSize: '42px',           // Giảm từ 62px → 42px
  marginBottom: '1px'         // Giảm khoảng cách
};

const nameStyle: React.CSSProperties = {
  fontSize: '17px',           // Giảm nhẹ
  fontWeight: '700',
  color: '#4c1d95',
  margin: '4px 0 4px 0'       // Thu hẹp
};

const idStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '13.5px',
  marginBottom: '12px'
};

const infoContainer: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '1.7',
  marginBottom: '1px',        // Giảm mạnh
  fontSize: '15px'
};

const balance: React.CSSProperties = { color: '#10b981' };
const reputation: React.CSSProperties = { color: '#eab308' };

const logoutBtn: React.CSSProperties = {
  width: '100%',
  padding: '13px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '15.5px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '30px'
};

const menuItem: React.CSSProperties = {
  background: 'white',
  padding: '18px 20px',
  marginBottom: '12px',
  borderRadius: '16px',
  fontSize: '17px',
  cursor: 'pointer'
};

const notLoginStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 20px' };
const loginBtn: React.CSSProperties = {
  padding: '16px 40px',
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  cursor: 'pointer',
  marginTop: '20px'
};

export default CaNhanPage;