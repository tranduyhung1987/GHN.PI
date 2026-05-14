// src/pages/DangKyVaiTroPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DangKyVaiTroPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const handleSelectRole = (selectedRole: 'shop' | 'driver' | 'warehouse') => {
    setRole(selectedRole);
    alert(`✅ Đã đăng ký vai trò: ${getRoleName(selectedRole)}`);
    navigate('/');
  };

  const getRoleName = (role: string) => {
    if (role === 'shop') return 'Chủ Shop / Người Gửi Hàng';
    if (role === 'driver') return 'Tài Xế';
    if (role === 'warehouse') return 'Kho Trung Chuyển';
    return role;
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <h1 style={title}>Đăng Ký Vai Trò</h1>
        <p style={subtitle}>Chọn vai trò bạn muốn tham gia trên GHN.PI</p>
      </div>

      <div style={cardsContainer}>
        {/* Vai trò Shop */}
        <div style={roleCard} onClick={() => handleSelectRole('shop')}>
          <div style={emoji}>🛒</div>
          <h3>Chủ Shop / Người Gửi Hàng</h3>
          <p style={desc}>Tạo đơn gửi hàng, quản lý đơn hàng của bạn</p>
          <button style={selectButton}>Chọn vai trò này</button>
        </div>

        {/* Vai trò Tài Xế */}
        <div style={roleCard} onClick={() => handleSelectRole('driver')}>
          <div style={emoji}>🏍️</div>
          <h3>Tài Xế</h3>
          <p style={desc}>Nhận đơn vận chuyển, kiếm thu nhập từ Pi</p>
          <button style={selectButton}>Chọn vai trò này</button>
        </div>

        {/* Vai trò Kho Hub */}
        <div style={roleCard} onClick={() => handleSelectRole('warehouse')}>
          <div style={emoji}>🏬</div>
          <h3>Kho Trung Chuyển</h3>
          <p style={desc}>Quản lý kho, bến bãi, xe đường dài</p>
          <button style={selectButton}>Chọn vai trò này</button>
        </div>
      </div>

      <button onClick={() => navigate('/')} style={backButton}>
        ← Quay lại Trang chủ
      </button>
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '20px 14px',
  boxSizing: 'border-box' as const
};

const header = { textAlign: 'center' as const, marginBottom: '40px' };
const title = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle = { color: '#6b21a8', marginTop: '8px' };

const cardsContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
  maxWidth: '420px',
  margin: '0 auto'
};

const roleCard = {
  background: '#fff',
  padding: '24px',
  borderRadius: '20px',
  border: '2px solid #c4b5fd',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const emoji = { fontSize: '52px', marginBottom: '12px' };
const desc = { color: '#6b21a8', fontSize: '14.5px', margin: '8px 0 16px' };

const selectButton = {
  width: '100%',
  padding: '14px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer'
};

const backButton = {
  display: 'block',
  width: '88%',
  maxWidth: '280px',
  margin: '40px auto 0',
  padding: '14px 20px',
  background: 'linear-gradient(90deg, #6b21a8, #7c3aed)',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer'
};

export default DangKyVaiTroPage;