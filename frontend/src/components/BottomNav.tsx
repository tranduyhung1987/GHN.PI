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

  // GHI CHÚ: Đồng bộ hóa vai trò người dùng theo thời gian thực với hệ thống và localStorage
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

  // GHI CHÚ: Hàm xử lý phân chia danh sách tab chức năng hiển thị động theo phân quyền
  const getNavItems = () => {
    // 1. NGƯỜI DÙNG MỚI / KHÁCH VÃNG LAI: Chưa chọn phân quyền cụ thể
    if (!userRole || userRole === '' || userRole === 'member' || userRole === 'guest') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Kích hoạt', icon: '🆔', page: 'dang-ky-vai-tro' }
      ];
    }

    // 2. BAN QUẢN TRỊ (ADMIN): Theo dõi số liệu toàn sàn
    if (userRole === 'admin') {
      return [
        { label: 'Tổng quan', icon: '🏠', page: 'home' },
        { label: 'Hệ thống', icon: '👑', page: 'admin' },
        { label: 'Hồ sơ', icon: '👤', page: 'ca-nhan' }
      ];
    }

    // 3. ĐỐI TÁC KHO HUB: Quản lý và tiếp nhận đơn hàng tại trạm bưu cục trung chuyển
    if (userRole === 'warehouse') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Bưu cục', icon: '🏬', page: 'kho-hub' },
        { label: 'Đơn Kho', icon: '📦', page: 'don-hang' },
        { label: 'Hồ sơ', icon: '👤', page: 'ca-nhan' }
      ];
    }

    // 4. VAI TRÒ TÀI XẾ (DRIVER): Đã sửa đổi - Hiển thị đầy đủ trọn bộ 4 tab chức năng
    if (userRole === 'driver') {
      return [
        { 
          label: 'Trang chủ', 
          icon: '🏠', 
          page: 'home' 
        },
        { 
          label: 'Nhận việc',  // Tab hỗ trợ tài xế xem danh sách đơn quanh đây và nhận cuốc xe
          icon: '🏍️', 
          page: 'tai-xe' 
        },
        { 
          label: 'Đơn hàng',   // Tab theo dõi các đơn hàng tài xế đang giao hoặc đã hoàn thành
          icon: '📋', 
          page: 'don-hang' 
        },
        { 
          label: 'Hồ sơ',      // Tab quản lý ví tiền Pi thu nhập, thông tin cá nhân tài xế
          icon: '👤', 
          page: 'ca-nhan' 
        }
      ];
    }

    // 5. NGƯỜI NHẬN HÀNG (RECEIVER): Theo dõi kiện hàng sắp được tài xế giao tới
    if (userRole === 'receiver') {
      return [
        { label: 'Trang chủ', icon: '🏠', page: 'home' },
        { label: 'Theo dõi', icon: '📍', page: 'tracking' },
        { label: 'Nhận hàng', icon: '🖐️', page: 'nhan-hang' },
        { label: 'Hồ sơ', icon: '👤', page: 'ca-nhan' }
      ];
    }

    // 6. CHỦ SHOP / NGƯỜI GỬI HÀNG (SENDER): Mặc định tạo đơn gửi hàng đi
    return [
      { label: 'Trang chủ', icon: '🏠', page: 'home' },
      { label: 'Gửi hàng', icon: '📦', page: 'gui-hang' },
      { label: 'Tra cước', icon: '📊', page: 'tra-cuu-cuoc' },
      { label: 'Theo dõi', icon: '📍', page: 'tracking' },
      { label: 'Hồ sơ', icon: '👤', page: 'ca-nhan' }
    ];
  };

  const navItems = getNavItems();

  return (
    <div style={bottomNavStyle}>
      <div style={navContainer}>
        {navItems.map((item) => {
          // GHI CHÚ: Xác định trạng thái kích hoạt (Active) dựa trên biến currentPage từ App.tsx truyền xuống
          const active = currentPage === item.page;
          return (
            <div
              key={item.page}
              style={navItem}
              onClick={() => onNavigate(item.page)}
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

/* ===================== TUÂN THỦ: GIỮ NGUYÊN 100% STYLE GIAO DIỆN GỐC CỦA BẠN ===================== */
const bottomNavStyle: React.CSSProperties = { position: 'fixed', bottom: 0, left: 0, right: 0, height: '76px', background: 'white', borderTop: '1px solid #e0d4ff', boxShadow: '0 -4px 25px rgba(0,0,0,0.12)', zIndex: 1000 };
const navContainer: React.CSSProperties = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', maxWidth: '600px', margin: '0 auto' };
const navItem: React.CSSProperties = { textAlign: 'center', cursor: 'pointer', flex: 1, padding: '6px 4px' };
const iconWrapper = (active: boolean): React.CSSProperties => ({ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px', transition: 'transform 0.35s ease', transform: active ? 'scale(1.18)' : 'scale(1)' });
const iconStyle = (active: boolean): React.CSSProperties => ({ fontSize: active ? '31px' : '26px', transition: 'all 0.25s ease', color: active ? '#7c3aed' : '#64748b' });
const labelStyle = (active: boolean): React.CSSProperties => ({ fontSize: '12px', fontWeight: active ? '700' : '500', color: active ? '#7c3aed' : '#64748b', transition: 'all 0.25s ease' });

export default BottomNav;