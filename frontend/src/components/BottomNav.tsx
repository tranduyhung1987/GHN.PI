import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';

interface BottomNavProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ onNavigate, currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const goTo = (path: string) => {
    if (onNavigate) onNavigate(path);
    else navigate(path);
  };

  const isActive = (path: string) => 
    currentPage ? currentPage === path : location.pathname === path;

  // Người mới chưa có vai trò → 2 tab
  if (!role) {
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e5d4ff',
        padding: '8px 0 10px', display: 'flex',
        boxShadow: '0 -4px 15px rgba(76,29,149,0.15)', zIndex: 99999
      }}>
        <button onClick={() => goTo('/')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/') ? '#4c1d95' : '#666' }}>
          🏠<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Trang chủ</span>
        </button>
        <button onClick={() => goTo('/dang-ky')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/dang-ky') ? '#4c1d95' : '#666' }}>
          📝<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Đăng ký vai trò</span>
        </button>
      </div>
    );
  }

  // Người đã có vai trò → 4 tab
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: '1px solid #e5d4ff',
      padding: '8px 0 10px', display: 'flex',
      boxShadow: '0 -4px 15px rgba(76,29,149,0.15)', zIndex: 99999
    }}>
      <button onClick={() => goTo('/')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/') ? '#4c1d95' : '#666' }}>
        🏠<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Trang chủ</span>
      </button>
      <button onClick={() => goTo('/tracking')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/tracking') ? '#4c1d95' : '#666' }}>
        🔍<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Theo dõi</span>
      </button>
      <button onClick={() => goTo('/orders')} style={{ flex: 1, background: 'none', border: 'none', color: '#666' }}>
        📦<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Đơn hàng</span>
      </button>
      <button onClick={() => goTo('/ca-nhan')} style={{ flex: 1, background: 'none', border: 'none', color: '#666' }}>
        👤<br /><span style={{ fontSize: '11px', fontWeight: 600 }}>Cá nhân</span>
      </button>
    </div>
  );
};

export default BottomNav;