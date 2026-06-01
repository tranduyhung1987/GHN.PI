import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { getIncompletePayments } from '../services/firebase/incompletePaymentService';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const piUsername = user?.username || '';

  const [incompleteCount, setIncompleteCount] = useState(0);

  // Simple mobile detection for tighter layout on Pi Browser
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Kiểm tra Incomplete Payments (yêu cầu của Pi Network)
  useEffect(() => {
    const checkIncomplete = async () => {
      try {
        const list = await getIncompletePayments();
        setIncompleteCount(list.length);
      } catch {}
    };
    checkIncomplete();
  }, []);

  // === Return to original beautiful UI/UX (bc8ef68) as much as possible ===
  const mobile = isMobile;

  // Desktop: exact original beautiful sizes
  // Mobile (Pi Browser): only header & spacing reduced to make the 8 HOME cards visible; cards themselves stay decent
  const pageContainer: React.CSSProperties = { 
    padding: mobile ? '6px' : '20px', 
    background: '#f3e8ff', 
    minHeight: '100dvh', 
    boxSizing: 'border-box' 
  };
  const headerContainer: React.CSSProperties = { 
    textAlign: 'center', 
    marginBottom: mobile ? '3px' : '30px' 
  };
  const logoStyle: React.CSSProperties = { 
    fontSize: mobile ? '18px' : '42px', 
    fontWeight: 700, 
    color: '#4c1d95', 
    margin: 0 
  };
  const subtitleStyle: React.CSSProperties = { 
    color: '#64748b', 
    fontSize: mobile ? '9px' : '15px', 
    margin: mobile ? '0' : '4px 0 0 0' 
  };
  const piButtonContainer: React.CSSProperties = { 
    margin: mobile ? '0 auto 3px' : '0 auto 30px', 
    maxWidth: mobile ? '240px' : '340px' 
  };
  const piButton: React.CSSProperties = { 
    padding: mobile ? '9px 14px' : '18px 40px', 
    background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '9999px', 
    fontWeight: 700, 
    fontSize: mobile ? '13px' : '17px', 
    width: '100%', 
    cursor: 'pointer' 
  };
  const cardsGrid: React.CSSProperties = { 
    display: 'grid', 
    gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : '1fr 1fr', 
    gap: mobile ? '4px' : '16px' 
  };
  const warningStyle: React.CSSProperties = { 
    marginTop: mobile ? '4px' : '30px', 
    padding: mobile ? '4px 5px' : '16px', 
    background: '#fef2f2', 
    color: '#991b1b', 
    borderRadius: mobile ? '5px' : '16px', 
    fontSize: mobile ? '9px' : '13px', 
    textAlign: 'center', 
    border: '1px solid #f5a3a3' 
  };

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={headerContainer}>
        <div style={logoStyle}>🚚 GHN.PI</div>
        <p style={subtitleStyle}>Giao hàng nhanh • Thanh toán bằng Pi</p>

        {/* Pi Environment Indicator - original size on desktop, minimal on Pi */}
        <div style={{
          marginTop: mobile ? 2 : 8,
          fontSize: mobile ? 9 : 12,
          padding: mobile ? '1px 6px' : '2px 10px',
          borderRadius: 999,
          display: 'inline-block',
          background: (typeof window !== 'undefined' && window.Pi) ? '#dcfce7' : '#fef3c7',
          color: (typeof window !== 'undefined' && window.Pi) ? '#166534' : '#92400e',
        }}>
          {typeof window !== 'undefined' && window.Pi 
            ? '✓ Pi Browser' 
            : '⚠️ Development (Mock Pi)'}
        </div>

        {/* Incomplete Payment Warning - original on desktop, minimal on Pi */}
        {incompleteCount > 0 && (
          <div 
            onClick={() => navigate('/incomplete-payments')}
            style={{
              marginTop: mobile ? 3 : 10,
              background: '#fee2e2',
              color: '#991b1b',
              padding: mobile ? '4px 8px' : '10px 14px',
              borderRadius: mobile ? 6 : 10,
              fontSize: mobile ? 10 : 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid #fca5a5',
            }}
          >
            ⚠️ {incompleteCount} giao dịch Pi chưa hoàn tất
          </div>
        )}
      </div>

      {/* NÚT ĐĂNG NHẬP PI */}
      <div style={piButtonContainer}>
        <button style={piButton} onClick={() => navigate('/dang-ky')}>
          {piUsername ? `Đã kết nối: ${piUsername}` : '⭐ Đăng nhập với Pi Network'}
        </button>
      </div>

      {/* GRID CARDS - Role Specific (exact original beautiful on Chrome, extreme compact 2-col on Pi Browser so 8 HOME cards finally visible) */}
      <div style={cardsGrid}>
        {/* DRIVER */}
        {role === 'driver' && (
          <>
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📦" desc="Các đơn cần giao ngay" onClick={() => navigate('/driver')} mobile={mobile} />
            <Card title="BẢN ĐỒ" icon="🗺️" desc="Xem tuyến đường" onClick={() => navigate('/tracking')} mobile={mobile} />
            <Card title="LỊCH SỬ GIAO" icon="📋" desc="Đơn đã hoàn thành" onClick={() => navigate('/orders')} mobile={mobile} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} mobile={mobile} />
          </>
        )}

        {/* WAREHOUSE */}
        {role === 'warehouse' && (
          <>
            <Card title="NHẬP KHO" icon="📥" desc="Nhận hàng vào kho" onClick={() => navigate('/warehouse')} mobile={mobile} />
            <Card title="XUẤT KHO" icon="📤" desc="Giao hàng ra ngoài" onClick={() => navigate('/warehouse')} mobile={mobile} />
            <Card title="TỒN KHO" icon="📊" desc="Quản lý hàng tồn" onClick={() => navigate('/warehouse')} mobile={mobile} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={() => navigate('/tracking')} mobile={mobile} />
          </>
        )}

        {/* BUYER / SELLER (SHOP) */}
        {(role === 'sender' || role === 'receiver') && (
          <>
            <Card title="GỬI HÀNG MỚI" icon="📦" desc="Tạo đơn gửi hàng" onClick={() => navigate('/gui-hang')} mobile={mobile} />
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📋" desc="Quản lý đơn đã tạo" onClick={() => navigate('/orders')} mobile={mobile} />
            <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={() => navigate('/tra-cuu-cuoc')} mobile={mobile} />
            <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={() => navigate('/warehouse')} mobile={mobile} />
            <Card title="TÀI XẾ" icon="🏍️" desc="Đơn hàng tài xế" onClick={() => navigate('/driver')} mobile={mobile} />
            <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={() => navigate('/nhan-hang')} mobile={mobile} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} mobile={mobile} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} mobile={mobile} />
          </>
        )}

        {/* ADMIN */}
        {role === 'admin' && (
          <>
            <Card title="DASHBOARD" icon="📊" desc="Thống kê tổng quan" onClick={() => navigate('/admin')} mobile={mobile} />
            <Card title="QUẢN LÝ NGƯỜI DÙNG" icon="👥" desc="Quản lý tài khoản" onClick={() => navigate('/admin')} mobile={mobile} />
            <Card title="BÁO CÁO" icon="📈" desc="Báo cáo & thống kê" onClick={() => navigate('/admin')} mobile={mobile} />
            <Card title="INCOMPLETE PAYMENTS" icon="⚠️" desc="Giao dịch Pi chưa hoàn tất" onClick={() => navigate('/incomplete-payments')} mobile={mobile} />
          </>
        )}

        {/* NGƯỜI MỚI (guest) - 8 thẻ HOME chính (original spirit) */}
        {(!role || role === 'guest') && (
          <>
            {mobile && (
              <div style={{ gridColumn: '1 / -1', fontSize: '10px', fontWeight: 600, color: '#4c1d95', marginBottom: '2px', textAlign: 'center' }}>
                8 chức năng chính • Người mới
              </div>
            )}
            <Card title="GỬI HÀNG" icon="📦" desc="Tạo đơn gửi hàng" onClick={() => navigate('/gui-hang')} mobile={mobile} />
            <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={() => navigate('/tra-cuu-cuoc')} mobile={mobile} />
            <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={() => navigate('/warehouse')} mobile={mobile} />
            <Card title="TÀI XẾ" icon="🏍️" desc="Đơn hàng tài xế" onClick={() => navigate('/driver')} mobile={mobile} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={() => navigate('/tracking')} mobile={mobile} />
            <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={() => navigate('/nhan-hang')} mobile={mobile} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} mobile={mobile} />
            <Card title="ĐĂNG KÝ VAI TRÒ" icon="👋" desc="Chọn vai trò của bạn" onClick={() => navigate('/dang-ky')} mobile={mobile} />
          </>
        )}
      </div>

      {/* WARNING */}
      <div style={warningStyle}>
        ⚠️ Chỉ Admin mới có quyền passphrase Pi
      </div>
    </div>
  );
}

// Card: Original beautiful on desktop + decent readable on Pi Browser (not microscopic)
const Card = ({ 
  title, icon, desc, onClick, mobile = false 
}: { 
  title: string; icon: string; desc: string; onClick: () => void;
  mobile?: boolean;
}) => {
  const cardStyle: React.CSSProperties = mobile ? {
    // Decent compact for Pi Browser phone - 8 cards visible, still recognizable
    background: 'white',
    padding: '7px 5px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e0d4ff',
    cursor: 'pointer',
    minHeight: '56px',
  } : {
    // Exact original beautiful (bc8ef68)
    background: 'white',
    padding: '20px 12px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    border: '2px solid #e0d4ff',
    cursor: 'pointer',
  };

  const iconStyle: React.CSSProperties = { 
    fontSize: mobile ? '20px' : '36px', 
    marginBottom: mobile ? '2px' : '8px', 
    display: 'block',
    lineHeight: 1
  };
  const cardTitle: React.CSSProperties = { 
    fontSize: mobile ? '10px' : '15px', 
    fontWeight: 700, 
    color: '#4c1d95', 
    margin: mobile ? '0' : '0 0 4px 0',
    lineHeight: '1.15'
  };
  const cardDesc: React.CSSProperties = mobile ? {
    fontSize: '8px', 
    color: '#64748b', 
    margin: 0,
    lineHeight: '1.1',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  } : {
    fontSize: '12px', 
    color: '#64748b', 
    margin: 0
  };
  return (
    <div style={cardStyle} onClick={onClick}>
      <span style={iconStyle}>{icon}</span>
      <h3 style={cardTitle}>{title}</h3>
      <p style={cardDesc}>{desc}</p>
    </div>
  );
};

