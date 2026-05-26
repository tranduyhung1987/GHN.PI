import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { ROLES, AppRole } from '../utils/constants';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const getRoleDisplayName = (role: AppRole | null) => {
    if (!role) return 'Chưa xác định';
    switch (role) {
      case ROLES.ADMIN: return 'Quản trị viên (Admin)';
      case ROLES.WAREHOUSE: return 'Quản lý Kho Hub';
      case ROLES.DRIVER: return 'Tài xế giao hàng';
      case ROLES.BUYER: return 'Người gửi hàng';
      case ROLES.SELLER: return 'Người nhận hàng';
      default: return role;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
      navigate('/dang-ky');
    }
  };

  const username = user?.username || 'Người dùng';

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={headerStyle}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Quay lại</button>
        <h2 style={{ color: '#4c1d95', margin: 0 }}>Trang Cá Nhân</h2>
        <div style={{ width: 60 }}></div>
      </div>

      {/* Thông tin người dùng */}
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={avatarStyle}>👤</div>
          <h3 style={{ margin: '12px 0 4px', color: '#1e2937' }}>@{username}</h3>
          <p style={{ color: '#64748b', fontSize: 13 }}>Mã thành viên: T.H97</p>
        </div>

        {/* Vai trò hiện tại */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Vai trò hiện tại</label>
          <div style={roleBadge}>
            ✨ {getRoleDisplayName(role)}
          </div>
        </div>

        {/* Trạng thái */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Trạng thái</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a' }}>
            <span style={statusDot}></span>
            <span style={{ fontWeight: 600 }}>Đang hoạt động</span>
          </div>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button 
            onClick={() => navigate('/dang-ky')} 
            style={primaryBtn}
          >
            🔄 Đổi vai trò
          </button>

          <button 
            onClick={handleLogout} 
            style={logoutBtn}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      {/* Thông tin bổ sung (placeholder) */}
      <div style={sectionStyle}>
        <h4 style={{ color: '#4c1d95', marginBottom: 12 }}>Thông tin khác</h4>
        <div style={infoRow}>
          <span>Ngày tham gia</span>
          <span style={{ fontWeight: 600 }}>15/05/2026</span>
        </div>
        <div style={infoRow}>
          <span>Số đơn đã giao</span>
          <span style={{ fontWeight: 600 }}>47 đơn</span>
        </div>
      </div>
    </div>
  );
}

// ==================== STYLES ====================
const pageContainer: React.CSSProperties = { 
  minHeight: '100vh', 
  background: '#f8fafc', 
  padding: '20px' 
};

const headerStyle: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: 24 
};

const backBtn: React.CSSProperties = { 
  background: 'none', 
  border: 'none', 
  color: '#4c1d95', 
  fontSize: 16, 
  fontWeight: 600, 
  cursor: 'pointer' 
};

const cardStyle: React.CSSProperties = { 
  background: 'white', 
  borderRadius: 20, 
  padding: 24, 
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
  marginBottom: 24
};

const avatarStyle: React.CSSProperties = { 
  width: 90, 
  height: 90, 
  background: '#f3e8ff', 
  borderRadius: '9999px', 
  margin: '0 auto', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontSize: 42,
  border: '6px solid white',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const labelStyle: React.CSSProperties = { 
  fontSize: 13, 
  color: '#64748b', 
  marginBottom: 6, 
  fontWeight: 600 
};

const roleBadge: React.CSSProperties = { 
  display: 'inline-flex', 
  alignItems: 'center', 
  gap: 8, 
  padding: '8px 16px', 
  background: '#f3e8ff', 
  color: '#4c1d95', 
  borderRadius: 999, 
  fontWeight: 600 
};

const statusDot: React.CSSProperties = { 
  width: 10, 
  height: 10, 
  background: '#22c55e', 
  borderRadius: '50%', 
  display: 'inline-block' 
};

const primaryBtn: React.CSSProperties = { 
  width: '100%', 
  padding: 14, 
  background: '#4c1d95', 
  color: 'white', 
  border: 'none', 
  borderRadius: 12, 
  fontWeight: 700, 
  fontSize: 15,
  cursor: 'pointer'
};

const logoutBtn: React.CSSProperties = { 
  width: '100%', 
  padding: 14, 
  background: '#fee2e2', 
  color: '#dc2626', 
  border: 'none', 
  borderRadius: 12, 
  fontWeight: 700, 
  fontSize: 15,
  cursor: 'pointer'
};

const sectionStyle: React.CSSProperties = { 
  background: 'white', 
  borderRadius: 16, 
  padding: 20, 
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
};

const infoRow: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  padding: '10px 0', 
  borderBottom: '1px solid #f1e7ff',
  fontSize: 14
};