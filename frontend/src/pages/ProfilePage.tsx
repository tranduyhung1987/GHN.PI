import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const username = user?.username || 'Người dùng';
  const userId = user?.uid || '154656565';

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      navigate('/dang-ky');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f1ff', paddingBottom: '90px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '30px 20px 20px' }}>
        <div style={{
          width: '90px',
          height: '90px',
          background: '#4c1d95',
          borderRadius: '9999px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '6px solid white',
          boxShadow: '0 4px 15px rgba(76, 29, 149, 0.3)'
        }}>
          <span style={{ color: 'white', fontSize: '42px', fontWeight: 'bold' }}>π</span>
        </div>

        <h2 style={{ marginTop: '16px', color: '#4c1d95', fontSize: '22px' }}>Cá Nhân</h2>
        <p style={{ color: '#64748b', marginTop: '4px' }}>ID: {userId}</p>
        <p style={{ color: '#4c1d95', fontWeight: 600, marginTop: '4px' }}>
          {role ? (role === 'sender' ? 'Người gửi hàng' : role === 'driver' ? 'Tài xế' : role === 'warehouse' ? 'Kho trung chuyển' : role === 'receiver' ? 'Người nhận hàng' : role === 'admin' ? 'Admin' : 'Người dùng') : 'Người mới (chưa chọn vai trò)'}
        </p>
      </div>

      {/* Điểm uy tín */}
      <div style={{
        margin: '0 20px 16px',
        background: 'white',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Điểm uy tín</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0ea5e9' }}>94 <span style={{ fontSize: '16px' }}>pts</span></p>
            <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: 600 }}>Xuất Sắc</p>
          </div>
          <div style={{ fontSize: '42px' }}>🏆</div>
        </div>
      </div>

      {/* Số dư & Hạn mức */}
      <div style={{ display: 'flex', gap: '12px', margin: '0 20px 24px' }}>
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Số dư Pi</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#4c1d95', marginTop: '4px' }}>
            12.450 Pi
          </p>
        </div>

        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Hạn mức tín dụng</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>
            60.000 đ
          </p>
        </div>
      </div>

      {/* Nút hành động */}
      <div style={{ padding: '0 20px' }}>
        <button
          onClick={() => navigate('/dang-ky')}
          style={{
            width: '100%',
            padding: '14px',
            background: '#4c1d95',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            marginBottom: '12px'
          }}
        >
          🔄 Đổi vai trò
        </button>

        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
              // logout logic
              navigate('/dang-ky');
            }
          }}
          style={{
            width: '100%',
            padding: '14px',
            background: '#fee2e2',
            color: '#dc2626',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
}