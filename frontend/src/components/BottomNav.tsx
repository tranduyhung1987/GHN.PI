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

  // Đồng bộ hóa State nội bộ với hệ thống thời gian thực
  useEffect(() => {
    const updateRole = () => {
      const savedRole = localStorage.getItem('userRole') || propRole || '';
      setUserRole(savedRole);
    };

    updateRole();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'userRole') updateRole();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [propRole]);

  // 🔽 CHỈ CHỈNH SỬA ĐÚNG HÀM LOGIC CHIA MENU NÀY ĐỂ HIỂN THỊ ĐÚNG VAI TRÒ
  const getNavItems = () => {
    // 1. Nếu chưa có vai trò hoặc tài khoản trống
    if (!userRole || userRole === '' || userRole === 'member' || userRole === 'guest') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Kích hoạt', icon: '🆔', page: 'dang-ky-vai-tro' },
      ];
    }

    // 2. Không gian làm việc của NGƯỜI GỬI HÀNG
    if (userRole === 'sender' || userRole === 'shop') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Gửi hàng', icon: '📦', page: 'gui-hang' },
        { label: 'Đơn hàng', icon: '📋', page: 'don-hang' },
        { label: 'Tracking', icon: '📍', page: 'tracking' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' },
      ];
    }

    // 3. Không gian làm việc của TÀI XẾ
    if (userRole === 'driver') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Nhận đơn', icon: '🛵', page: 'tai-xe' },
        { label: 'Đối soát', icon: '💰', page: 'doi-soat' },
        { label: 'Hỗ trợ', icon: '💬', page: 'chat' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' },
      ];
    }

    // 4. Không gian làm việc của ĐỐI TÁC KHO HUB
    if (userRole === 'warehouse') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Quản lý kho', icon: '🏢', page: 'kho-hub' },
        { label: 'Nhận hàng', icon: '📥', page: 'nhan-hang' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' },
      ];
    }

    // Dự phòng mặc định
    return [{ label: 'Trang chủ', icon: '🏠', page: 'home' }];
  };

  const navItems = getNavItems();
  const isActive = (page: string) => currentPage === page;

  return (
    <div style={bottomNavStyle}>
      <div style={navContainer}>
        {navItems.map((item) => {
          const active = isActive(item.page);
          return (
            <div key={item.page} onClick={() => onNavigate(item.page)} style={navItem}>
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

/* ===================== CẤM SỬA: GIỮ NGUYÊN 100% STYLE GIAO DIỆN GỐC CỦA BẠN ===================== */
const bottomNavStyle: React.CSSProperties = { position: 'fixed', bottom: 0, left: 0, right: 0, height: '76px', background: 'white', borderTop: '1px solid #e0d4ff', boxShadow: '0 -4px 25px rgba(0,0,0,0.12)', zIndex: 1000 };
const navContainer: React.CSSProperties = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', maxWidth: '600px', margin: '0 auto' };
const navItem: React.CSSProperties = { textAlign: 'center', cursor: 'pointer', flex: 1, padding: '6px 4px' };
const iconWrapper = (active: boolean): React.CSSProperties => ({ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px', transition: 'transform 0.35s ease', transform: active ? 'scale(1.18)' : 'scale(1)' });
const iconStyle = (active: boolean): React.CSSProperties => ({ fontSize: active ? '31px' : '26px', transition: 'all 0.35s ease', filter: active ? 'drop-shadow(0 4px 8px #7c3aed)' : 'none' });
const labelStyle = (active: boolean): React.CSSProperties => ({ fontSize: '12.2px', fontWeight: active ? '700' : '500', color: active ? '#4c1d95' : '#64748b', transition: 'all 0.35s ease', lineHeight: '1' });

export default BottomNav;