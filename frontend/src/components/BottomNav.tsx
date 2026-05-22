import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROLES, RoleType } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();

  const currentPage = location.pathname.split('/')[1] || 'home';

  const getNavItems = (): { label: string; icon: string; page: string }[] => {
    const currentRole = userRole as RoleType;

    if (!currentRole || currentRole === 'guest' || currentRole === 'member') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Đăng ký', icon: '🔑', page: 'dang-ky' }
      ];
    }

    if (currentRole === ROLES.DRIVER || currentRole === 'tai-xe') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Nhận đơn', icon: '🏍️', page: 'tai-xe' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' }
      ];
    }

    if (currentRole === ROLES.WAREHOUSE || currentRole === 'kho-hub') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Kho Hub', icon: '🏪', page: 'kho-hub' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' }
      ];
    }

    if (currentRole === ROLES.SENDER || currentRole === 'gui-hang') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Gửi hàng', icon: '📦', page: 'gui-hang' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' }
      ];
    }

    if (currentRole === ROLES.RECEIVER || currentRole === 'nhan-hang') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Nhận hàng', icon: '📬', page: 'nhan-hang' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' }
      ];
    }

    if (currentRole === ROLES.ADMIN || currentRole === 'admin') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Quản trị', icon: '🛠️', page: 'admin' },
        { label: 'Cá nhân', icon: '👤', page: 'ca-nhan' }
      ];
    }

    return [{ label: 'Trang chủ', icon: '🏠', page: 'home' }];
  };

  return (
    <div style={bottomNavStyle}>
      <div style={navContainer}>
        {getNavItems().map((item) => {
          const active = currentPage === item.page;
          return (
            <div 
              key={item.page} 
              style={navItem} 
              onClick={() => navigate(`/${item.page}`)}
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

const bottomNavStyle: React.CSSProperties = { 
  position: 'fixed', bottom: 0, left: 0, right: 0, height: '76px', 
  background: 'white', borderTop: '1px solid #e0d4ff', 
  boxShadow: '0 -4px 25px rgba(0,0,0,0.12)', zIndex: 1000 
};
const navContainer: React.CSSProperties = { 
  display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', 
  maxWidth: '600px', margin: '0 auto' 
};
const navItem: React.CSSProperties = { textAlign: 'center', cursor: 'pointer', flex: 1, padding: '6px 4px' };

const iconWrapper = (active: boolean): React.CSSProperties => ({ 
  height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
  marginBottom: '2px', transition: 'transform 0.35s ease', transform: active ? 'scale(1.18)' : 'scale(1)' 
});

const iconStyle = (active: boolean): React.CSSProperties => ({ 
  fontSize: active ? '31px' : '26px', 
  filter: active ? 'drop-shadow(0 4px 8px rgba(124,58,237,0.3))' : 'none', 
  transition: 'all 0.25s ease' 
});

const labelStyle = (active: boolean): React.CSSProperties => ({ 
  fontSize: '12px', fontWeight: active ? '700' : '500', 
  color: active ? '#7c3aed' : '#8e8a9f', transition: 'color 0.25s ease', marginTop: '2px' 
});

export default BottomNav;