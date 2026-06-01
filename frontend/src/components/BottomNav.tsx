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
        padding: '12px 0 14px', display: 'flex',
        boxShadow: '0 -4px 15px rgba(76,29,149,0.15)', zIndex: 99999
      }}>
        <button onClick={() => goTo('/')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/') ? '#4c1d95' : '#666', minHeight: '52px' }}>
          <div style={{ fontSize: '22px' }}>🏠</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Trang chủ</span>
        </button>
        <button onClick={() => goTo('/dang-ky')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/dang-ky') ? '#4c1d95' : '#666', minHeight: '52px' }}>
          <div style={{ fontSize: '22px' }}>📝</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Đăng ký vai trò</span>
        </button>
      </div>
    );
  }

  // Người đã có vai trò → 4 tab (đã đồng bộ với AppRoutes)
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: '1px solid #e5d4ff',
      padding: '12px 0 14px', display: 'flex',
      boxShadow: '0 -4px 15px rgba(76,29,149,0.15)', zIndex: 99999
    }}>
      <button onClick={() => goTo('/')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/') ? '#4c1d95' : '#666', minHeight: '52px' }}>
        <div style={{ fontSize: '22px' }}>🏠</div>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Trang chủ</span>
      </button>
      <button onClick={() => goTo('/tracking')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/tracking') ? '#4c1d95' : '#666', minHeight: '52px' }}>
        <div style={{ fontSize: '22px' }}>🔍</div>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Theo dõi</span>
      </button>
      <button onClick={() => goTo('/orders')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/orders') || isActive('/don-hang') ? '#4c1d95' : '#666', minHeight: '52px' }}>
        <div style={{ fontSize: '22px' }}>📦</div>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Đơn hàng</span>
      </button>
      <button onClick={() => goTo('/ca-nhan')} style={{ flex: 1, background: 'none', border: 'none', color: isActive('/ca-nhan') || isActive('/profile') ? '#4c1d95' : '#666', minHeight: '52px' }}>
        <div style={{ fontSize: '22px' }}>👤</div>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Cá nhân</span>
      </button>
    </div>
  );
};

export default BottomNav;