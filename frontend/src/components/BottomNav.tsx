import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  onNavigate = () => {}, 
  currentPage = 'home' 
}) => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Trang chủ', icon: '🏠', page: 'home' },
    { label: 'Đơn hàng', icon: '📦', page: 'don-hang' },
    { label: 'Chat', icon: '💬', page: 'chat' },
    { label: 'Đối soát', icon: '📊', page: 'doi-soat' },
    { label: 'Khiếu nại', icon: '⚠️', page: 'khieu-nai' },
    { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' },
  ];

    const handleNavigate = (page: string) => {
    if (page !== 'home' && !isAuthenticated) {
      window.dispatchEvent(new CustomEvent('openModal', { 
        detail: {
          title: "Yêu cầu Đăng nhập",
          children: (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '16px', fontSize: '18px' }}>
                Vui lòng đăng nhập Pi Network để sử dụng tính năng này
              </p>
            </div>
          ),
          confirmText: "🚀 Đăng nhập ngay",
          onConfirm: () => {}
        }
      }));
      return;
    }
    onNavigate(page);
  };

  return (
    <div style={bottomNavStyle}>
      <div style={navContainer}>
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <div
              key={item.page}
              onClick={() => handleNavigate(item.page)}
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
  boxShadow: '0 -4px 25px rgba(0, 0, 0, 0.12)',
  zIndex: 1000,
  padding: '8px 0 4px',
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
  padding: '8px 4px',
  flex: 1,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '12px',
};

const activeNavItem: React.CSSProperties = {
  ...navItem,
  background: '#f3e8ff',
  transform: 'scale(1.12)',
  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
};

const iconStyle = (active: boolean): React.CSSProperties => ({
  fontSize: active ? '30px' : '26px',
  marginBottom: '4px',
  transition: 'all 0.3s ease',
  filter: active ? 'drop-shadow(0 3px 8px #7c3aed)' : 'none',
});

const labelStyle = (active: boolean): React.CSSProperties => ({
  fontSize: '12.5px',
  fontWeight: active ? '700' : '500',
  color: active ? '#4c1d95' : '#64748b',
  transition: 'all 0.3s ease',
});

export default BottomNav;