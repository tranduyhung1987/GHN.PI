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

  // Người mới chưa có vai trò → 2 tab (có tab Đăng ký vai trò trực tiếp cho người mới)
  if (!role || role === 'guest') {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e5d4ff',
        padding: '12px 0 14px', display: 'flex',
        boxShadow: '0 -4px 15px rgba(76,29,149,0.15)', zIndex: 99999
      }} role="navigation" aria-label="Điều hướng chính cho người mới">
        <button 
          onClick={() => goTo('/')} 
          style={{ flex: 1, background: 'none', border: 'none', color: isActive('/') ? '#4c1d95' : '#666', minHeight: '52px' }}
          aria-label="Trang chủ"
          aria-current={isActive('/') ? 'page' : undefined}
        >
          <div style={{ fontSize: '22px' }}>🏠</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Trang chủ</span>
        </button>
        <button 
          onClick={() => goTo('/dang-ky')} 
          style={{ flex: 1, background: 'none', border: 'none', color: isActive('/dang-ky') ? '#4c1d95' : '#666', minHeight: '52px' }}
          aria-label="Đăng ký vai trò"
          aria-current={isActive('/dang-ky') ? 'page' : undefined}
        >
          <div style={{ fontSize: '22px' }}>📝</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Đăng ký vai trò</span>
        </button>
      </nav>
    );
  }

  // ===== ROLE-SPECIFIC BOTTOM NAV =====
  const renderDriverNav = () => (
    <nav style={navContainer} role="navigation" aria-label="Điều hướng Tài xế">
      <Tab icon="🏠" label="Trang chủ" path="/" isActive={isActive('/')} goTo={goTo} />
      <Tab icon="📦" label="Đơn hàng" path="/driver" isActive={isActive('/driver') || isActive('/orders')} goTo={goTo} />
      <Tab icon="🔍" label="Theo dõi" path="/tracking" isActive={isActive('/tracking')} goTo={goTo} />
      <Tab icon="👤" label="Cá nhân" path="/ca-nhan" isActive={isActive('/ca-nhan') || isActive('/profile')} goTo={goTo} />
    </nav>
  );

  const renderWarehouseNav = () => (
    <nav style={navContainer} role="navigation" aria-label="Điều hướng Kho trung chuyển">
      <Tab icon="🏠" label="Trang chủ" path="/" isActive={isActive('/')} goTo={goTo} />
      <Tab icon="📥" label="Nhập kho" path="/warehouse" isActive={isActive('/warehouse')} goTo={goTo} />
      <Tab icon="📤" label="Xuất kho" path="/warehouse" isActive={isActive('/warehouse')} goTo={goTo} />
      <Tab icon="👤" label="Cá nhân" path="/ca-nhan" isActive={isActive('/ca-nhan') || isActive('/profile')} goTo={goTo} />
    </nav>
  );

  const renderShopNav = () => (
    <nav style={navContainer} role="navigation" aria-label="Điều hướng Người gửi hàng">
      <Tab icon="🏠" label="Trang chủ" path="/" isActive={isActive('/')} goTo={goTo} />
      <Tab icon="📦" label="Gửi hàng" path="/gui-hang" isActive={isActive('/gui-hang')} goTo={goTo} />
      <Tab icon="📋" label="Đơn hàng" path="/orders" isActive={isActive('/orders') || isActive('/don-hang')} goTo={goTo} />
      <Tab icon="👤" label="Cá nhân" path="/ca-nhan" isActive={isActive('/ca-nhan') || isActive('/profile')} goTo={goTo} />
    </nav>
  );

  const renderReceiverNav = () => (
    <nav style={navContainer} role="navigation" aria-label="Điều hướng Người nhận hàng">
      <Tab icon="🏠" label="Trang chủ" path="/" isActive={isActive('/')} goTo={goTo} />
      <Tab icon="📥" label="Nhận hàng" path="/nhan-hang" isActive={isActive('/nhan-hang')} goTo={goTo} />
      <Tab icon="📋" label="Đơn hàng" path="/orders" isActive={isActive('/orders') || isActive('/don-hang')} goTo={goTo} />
      <Tab icon="👤" label="Cá nhân" path="/ca-nhan" isActive={isActive('/ca-nhan') || isActive('/profile')} goTo={goTo} />
    </nav>
  );

  const renderAdminNav = () => (
    <nav style={navContainer} role="navigation" aria-label="Điều hướng Admin">
      <Tab icon="🏠" label="Trang chủ" path="/" isActive={isActive('/')} goTo={goTo} />
      <Tab icon="📊" label="Dashboard" path="/admin" isActive={isActive('/admin')} goTo={goTo} />
      <Tab icon="👥" label="Quản lý" path="/admin" isActive={isActive('/admin')} goTo={goTo} />
      <Tab icon="👤" label="Cá nhân" path="/ca-nhan" isActive={isActive('/ca-nhan') || isActive('/profile')} goTo={goTo} />
    </nav>
  );

  // Mặc định cho buyer/seller hoặc các role khác
  const renderDefaultNav = () => (
    <nav style={navContainer} role="navigation" aria-label="Điều hướng chính">
      <Tab icon="🏠" label="Trang chủ" path="/" isActive={isActive('/')} goTo={goTo} />
      <Tab icon="📦" label="Gửi hàng" path="/gui-hang" isActive={isActive('/gui-hang')} goTo={goTo} />
      <Tab icon="🔍" label="Theo dõi" path="/tracking" isActive={isActive('/tracking')} goTo={goTo} />
      <Tab icon="👤" label="Cá nhân" path="/ca-nhan" isActive={isActive('/ca-nhan') || isActive('/profile')} goTo={goTo} />
    </nav>
  );

  // Chọn nav theo role (đã chuẩn hóa 5 vai trò)
  let navContent;
  switch (role) {
    case 'driver':
      navContent = renderDriverNav();
      break;
    case 'warehouse':
      navContent = renderWarehouseNav();
      break;
    case 'sender':
      navContent = renderShopNav(); // Focused for Người gửi: Trang chủ + Gửi hàng + Đơn hàng + Cá nhân
      break;
    case 'receiver':
      navContent = renderReceiverNav(); // Focused for Người nhận: Trang chủ + Nhận hàng + Đơn hàng + Cá nhân
      break;
    case 'admin':
      navContent = renderAdminNav();
      break;
    default:
      navContent = renderDefaultNav();
  }

  return navContent;
};

// Reusable Tab component
const Tab = ({ icon, label, path, isActive, goTo }: { 
  icon: string; 
  label: string; 
  path: string; 
  isActive: boolean; 
  goTo: (path: string) => void;
}) => (
  <button 
    onClick={() => goTo(path)} 
    style={{ 
      flex: 1, 
      background: 'none', 
      border: 'none', 
      color: isActive ? '#4c1d95' : '#666', 
      minHeight: '52px',
      padding: '4px 0'
    }}
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
    role="tab"
  >
    <div style={{ fontSize: '22px' }}>{icon}</div>
    <span style={{ fontSize: '12px', fontWeight: 600 }}>{label}</span>
  </button>
);

const navContainer: React.CSSProperties = {
  position: 'fixed', bottom: 0, left: 0, right: 0,
  background: 'white', borderTop: '1px solid #e5d4ff',
  padding: '12px 0 14px', display: 'flex',
  boxShadow: '0 -4px 15px rgba(76,29,149,0.15)', zIndex: 99999
};

export default BottomNav;