import React, { useState, useEffect } from 'react';

interface BottomNavProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
  userRole?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  onNavigate, 
  currentPage = 'home',
  userRole: propRole = '' 
}) => {

  const [userRole, setUserRole] = useState<string>(propRole);

  useEffect(() => {
    const updateRole = () => {
      const savedRole = localStorage.getItem('userRole') || propRole || '';
      if (savedRole !== userRole) {
        setUserRole(savedRole);
        console.log('✅ BottomNav - Role updated:', savedRole);
      }
    };

    updateRole();

    // Chỉ lắng nghe storage, bỏ interval để tránh lag
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'userRole') updateRole();
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [propRole, userRole]);

  const getNavItems = () => {
    if (userRole === 'sender') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Gửi hàng', icon: '📦', page: 'gui-hang' },
        { label: 'Đơn hàng', icon: '📋', page: 'don-hang' },
        { label: 'Tracking', icon: '📍', page: 'tracking' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' },
      ];
    }

    // Default
    return [
      { label: 'Trang chủ', icon: '🏠', page: 'home' },
      { label: 'Đăng ký vai trò', icon: '👤', page: 'dang-ky-vai-tro' },
    ];
  };

  const navItems = getNavItems();
  const isActive = (page: string) => currentPage === page;

  return (
    <div style={bottomNavStyle}>
      <div style={navContainer}>
        {navItems.map((item) => {
          const active = isActive(item.page);
          return (
            <div
              key={item.page}
              onClick={() => onNavigate(item.page)}
              style={navItem}
            >
              <div style={iconWrapper(active)}>
                <span style={iconStyle(active)}>{item.icon}</span>
              </div>
              <div style={labelStyle(active)}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===================== STYLES ===================== */
const bottomNavStyle: React.CSSProperties = {
  position: 'fixed', bottom: 0, left: 0, right: 0, height: '76px',
  background: 'white', borderTop: '1px solid #e0d4ff',
  boxShadow: '0 -4px 25px rgba(0,0,0,0.12)', zIndex: 1000,
};

const navContainer: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-around', alignItems: 'center',
  height: '100%', maxWidth: '600px', margin: '0 auto',
};

const navItem: React.CSSProperties = { 
  textAlign: 'center', cursor: 'pointer', flex: 1, padding: '6px 4px' 
};

const iconWrapper = (active: boolean): React.CSSProperties => ({
  height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  marginBottom: '2px', transition: 'transform 0.35s ease',
  transform: active ? 'scale(1.18)' : 'scale(1)',
});

const iconStyle = (active: boolean): React.CSSProperties => ({
  fontSize: active ? '31px' : '26px',
  transition: 'all 0.35s ease',
  filter: active ? 'drop-shadow(0 4px 8px #7c3aed)' : 'none',
});

const labelStyle = (active: boolean): React.CSSProperties => ({
  fontSize: '12.2px', fontWeight: active ? '700' : '500',
  color: active ? '#4c1d95' : '#64748b',
  transition: 'all 0.35s ease', lineHeight: '1',
});

export default BottomNav;