import React from 'react';

interface BottomNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ onNavigate, currentPage }) => {
  const navItems = [
    { label: 'Trang chủ', icon: '🏠', page: 'home' },
    { label: 'Đơn hàng', icon: '📦', page: 'don-hang' },
    { label: 'Chat', icon: '💬', page: 'chat' },
    { label: 'Đối soát', icon: '📊', page: 'doi-soat' },
    { label: 'Khiếu nại', icon: '⚠️', page: 'khieu-nai' },
    { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' },
  ];

  return (
    <div style={bottomNavStyle}>
      <div style={navContainer}>
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <div
              key={item.page}
              onClick={() => onNavigate(item.page)}
              style={isActive ? activeNavItem : navItem}
            >
              <div style={iconStyle(isActive)}>{item.icon}</div>
              <div style={labelStyle(isActive)}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===================== STYLES ===================== */
const bottomNavStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'white',
  borderTop: '1px solid #e0d4ff',
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  padding: '6px 0 2px',
};

const navContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  maxWidth: '600px',
  margin: '0 auto',
};

const navItem: React.CSSProperties = {
  textAlign: 'center',
  cursor: 'pointer',
  padding: '6px 4px',
  flex: 1,
  transition: 'all 0.25s ease',
};

const activeNavItem: React.CSSProperties = {
  ...navItem,
  transform: 'scale(1.08)',
};

const iconStyle = (active: boolean): React.CSSProperties => ({
  fontSize: '27px',
  marginBottom: '3px',
  filter: active ? 'drop-shadow(0 0 6px #22d3ee)' : 'none',
  transition: 'all 0.25s ease',
});

const labelStyle = (active: boolean): React.CSSProperties => ({
  fontSize: '12px',
  fontWeight: active ? '700' : '500',
  color: active ? '#4c1d95' : '#64748b',
  transition: 'all 0.25s ease',
});

export default BottomNav;