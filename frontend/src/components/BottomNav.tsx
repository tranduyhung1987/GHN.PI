// src/components/BottomNav.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleClick = (path: string) => {
    if (!isAuthenticated && path !== '/') {
      alert("Vui lòng đăng nhập với Pi Network trước!");
      return;
    }
    navigate(path);
  };

  const navItems = [
    { icon: "🏠", label: "Trang chủ", path: "/" },
    { icon: "📦", label: "Gửi hàng", path: "/gui-hang" },
    { icon: "🔎", label: "Tra cước", path: "/tra-cuu-cuoc" },
    { icon: "🚚", label: "Tracking", path: "/tracking" },
    { icon: "👤", label: "Cá nhân", path: "/ca-nhan" },
  ];

  return (
    <div style={navContainer}>
      {navItems.map((item, index) => (
        <div 
          key={index} 
          style={location.pathname === item.path ? activeNav : navItem}
          onClick={() => handleClick(item.path)}
        >
          <div style={iconStyle}>{item.icon}</div>
          <span style={labelStyle}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const navContainer = {
  position: 'fixed' as const,
  bottom: 0,
  left: 0,
  right: 0,
  background: '#f3e8ff',
  borderTop: '1px solid #c4b5fd',
  display: 'flex',
  justifyContent: 'space-around',
  padding: '8px 0 4px',
  zIndex: 1000,
  boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
};

const navItem = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  color: '#6b21a8',
  fontSize: '12px',
  cursor: 'pointer',
  padding: '6px 8px',
  borderRadius: '12px',
  flex: 1
};

const activeNav = {
  ...navItem,
  color: '#4c1d95',
  background: '#ede9fe'
};

const iconStyle = { fontSize: '24px', marginBottom: '2px' };
const labelStyle = { fontWeight: '600' };

export default BottomNav;