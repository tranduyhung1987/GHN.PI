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
  const { isAuthenticated, loginWithPi } = useAuth();

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
          children: <div style={{ textAlign: 'center', padding: '10px 0' }}>Vui lòng đăng nhập Pi Network để tiếp tục</div>,
          confirmText: "🚀 Đăng nhập ngay",
          onConfirm: () => {
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: "Đang kết nối Pi...", type: "success" } }));
            setTimeout(() => {
              loginWithPi();
              window.dispatchEvent(new CustomEvent('showToast', { detail: { message: "🎉 Chào mừng Thành viên Pi!", type: "success" } }));
              window.dispatchEvent(new CustomEvent('closeModal'));
            }, 1200);
          }
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
              style={navItem}
            >
              <div style={iconWrapper(isActive)}>
                <span style={iconStyle(isActive)}>{item.icon}</span>
              </div>
              <div style={labelStyle(isActive)}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===================== FIXED & STABLE ANIMATION ===================== */
const bottomNavStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '76px',                    // ← Chiều cao cố định
  background: 'white',
  borderTop: '1px solid #e0d4ff',
  boxShadow: '0 -4px 25px rgba(0, 0, 0, 0.12)',
  zIndex: 1000,
  padding: '6px 0 0',
};

const navContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: '100%',
  maxWidth: '600px',
  margin: '0 auto',
};

const navItem: React.CSSProperties = {
  textAlign: 'center',
  cursor: 'pointer',
  flex: 1,
  padding: '6px 4px',
  transition: 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
};

const iconWrapper = (active: boolean): React.CSSProperties => ({
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2px',
  transition: 'transform 0.35s ease',
  transform: active ? 'scale(1.18)' : 'scale(1)',
});

const iconStyle = (active: boolean): React.CSSProperties => ({
  fontSize: active ? '31px' : '26px',
  transition: 'all 0.35s ease',
  filter: active ? 'drop-shadow(0 4px 8px #7c3aed)' : 'none',
});

const labelStyle = (active: boolean): React.CSSProperties => ({
  fontSize: '12.2px',
  fontWeight: active ? '700' : '500',
  color: active ? '#4c1d95' : '#64748b',
  transition: 'all 0.35s ease',
  lineHeight: '1',
});

export default BottomNav;