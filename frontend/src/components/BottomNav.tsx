import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Người mới chưa có vai trò → chỉ 2 tab
  if (!role) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #e5d4ff',
        padding: '8px 0 10px',
        display: 'flex',
        boxShadow: '0 -4px 15px rgba(76,29,149,0.15)',
        zIndex: 99999
      }}>
        <button
          onClick={() => navigate('/')}
          style={{ flex: 1, background: 'none', border: 'none', color: isActive('/') ? '#4c1d95' : '#666' }}
        >
          🏠<br />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>Trang chủ</span>
        </button>
        <button
          onClick={() => navigate('/dang-ky')}
          style={{ flex: 1, background: 'none', border: 'none', color: isActive('/dang-ky') ? '#4c1d95' : '#666' }}
        >
          📝<br />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>Đăng ký vai trò</span>
        </button>
      </div>
    );
  }

  // Người đã có vai trò → 4 tab đầy đủ
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #e5d4ff',
      padding: '8px 0 10px',
      display: 'flex',
      boxShadow: '0 -4px 15px rgba(76,29,149,0.15)',
      zIndex: 99999
    }}>
      <button onClick={() => navigate('/')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/') ? '#4c1d95' : '#666' }}>
        🏠<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Trang chủ</span>
      </button>
      <button onClick={() => navigate('/tracking')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/tracking') ? '#4c1d95' : '#666' }}>
        🔍<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Theo dõi</span>
      </button>
      <button onClick={() => navigate('/orders')} style={{ flex: 1, background: 'none', border: 'none', color: '#666' }}>
        📦<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Đơn hàng</span>
      </button>
      <button onClick={() => navigate('/ca-nhan')} style={{ flex: 1, background: 'none', border: 'none', color: '#666' }}>
        👤<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Cá nhân</span>
      </button>
    </div>
  );
};

export default BottomNav;