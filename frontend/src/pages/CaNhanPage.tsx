// src/pages/CaNhanPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CaNhanPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [reputation] = useState(94);

  const getRepColor = (pts: number) => {
    if (pts >= 90) return '#22d3ee';
    if (pts >= 70) return '#eab308';
    return '#ef4444';
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={header}>
        <div style={avatar}>👤</div>
        <h2 style={name}>{user?.name || 'Người dùng'}</h2>
        <p style={roleText}>
          {role === 'shop' && '🛒 Chủ Shop'}
          {role === 'driver' && '🏍️ Tài Xế'}
          {role === 'warehouse' && '🏬 Kho Hub'}
          {role === 'admin' && '👑 Admin'}
          {role === 'guest' && 'Khách'}
        </p>
      </div>

      {/* Reputation Card */}
      <div style={repCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, color: '#6b21a8' }}>Điểm uy tín</p>
            <p style={{ fontSize: '42px', fontWeight: '700', color: getRepColor(reputation), margin: '4px 0' }}>
              {reputation} <span style={{ fontSize: '18px' }}>pts</span>
            </p>
          </div>
          <div style={{ fontSize: '52px' }}>🏆</div>
        </div>
        <p style={{ margin: '8px 0 0', color: '#22d3ee', fontWeight: '600' }}>Xuất Sắc</p>
      </div>

      {/* Balance Cards */}
      <div style={balanceContainer}>
        <div style={balanceCard}>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b21a8' }}>Số dư Pi</p>
          <p style={{ fontSize: '26px', fontWeight: '700', color: '#22d3ee', margin: '4px 0' }}>12.450 Pi</p>
        </div>
        <div style={balanceCard}>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b21a8' }}>Hạn mức tín dụng</p>
          <p style={{ fontSize: '26px', fontWeight: '700', color: '#eab308', margin: '4px 0' }}>60.000 đ</p>
        </div>
      </div>

      {/* Menu List */}
      <div style={menuContainer}>
        <div style={menuItem} onClick={() => navigate('/tracking')}>📋 Lịch sử đơn hàng</div>
        <div style={menuItem} onClick={() => alert('Chức năng đang phát triển')}>💰 Ví Pi</div>
        <div style={menuItem} onClick={() => alert('Chức năng đang phát triển')}>⭐ Đánh giá</div>
        <div style={menuItem} onClick={() => alert('Chức năng đang phát triển')}>⚙️ Cài đặt</div>
        <div style={logoutItem} onClick={handleLogout}>🚪 Đăng xuất</div>
      </div>
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 100px',
  boxSizing: 'border-box' as const
};

const header = { textAlign: 'center' as const, marginBottom: '24px' };
const avatar = { fontSize: '78px', marginBottom: '8px' };
const name = { margin: '0 0 4px 0', color: '#4c1d95', fontSize: '24px' };
const roleText = { margin: 0, color: '#6b21a8', fontWeight: '600' };

const repCard = {
  background: '#fff',
  padding: '20px',
  borderRadius: '20px',
  border: '2px solid #22d3ee',
  marginBottom: '20px'
};

const balanceContainer = { display: 'flex', gap: '12px', marginBottom: '24px' };
const balanceCard = {
  flex: 1,
  background: '#fff',
  padding: '16px',
  borderRadius: '16px',
  border: '1px solid #c4b5fd',
  textAlign: 'center' as const
};

const menuContainer = { display: 'flex', flexDirection: 'column' as const, gap: '10px' };
const menuItem = {
  background: '#fff',
  padding: '16px 20px',
  borderRadius: '16px',
  border: '1px solid #c4b5fd',
  fontSize: '16px',
  cursor: 'pointer'
};

const logoutItem = {
  ...menuItem,
  background: '#fee2e2',
  color: '#ef4444',
  borderColor: '#fecaca'
};

export default CaNhanPage;