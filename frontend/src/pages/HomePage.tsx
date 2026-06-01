import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { getIncompletePayments } from '../services/firebase/incompletePaymentService';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const piUsername = user?.username || '';

  const [incompleteCount, setIncompleteCount] = useState(0);

  // Mobile detection - more aggressive for Pi Browser WebView
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
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

  // === Original beautiful desktop + Pi Browser phone mode (ultra minimal header so 8 cards show) ===
  const mobile = isMobile;

  // Desktop = exact original beautiful (bc8ef68)
  const pageContainer: React.CSSProperties = { 
    padding: mobile ? '4px' : '20px', 
    background: '#f3e8ff', 
    minHeight: '100dvh', 
    boxSizing: 'border-box' 
  };
  const headerContainer: React.CSSProperties = { 
    textAlign: 'center', 
    marginBottom: mobile ? '2px' : '30px' 
  };
  const logoStyle: React.CSSProperties = { 
    fontSize: mobile ? '14px' : '42px', 
    fontWeight: 700, 
    color: '#4c1d95', 
    margin: 0 
  };
  const subtitleStyle: React.CSSProperties = { 
    color: '#64748b', 
    fontSize: mobile ? '7px' : '15px', 
    margin: '0' 
  };
  const piButtonContainer: React.CSSProperties = { 
    margin: mobile ? '0 auto 2px' : '0 auto 30px', 
    maxWidth: mobile ? '200px' : '340px' 
  };
  const piButton: React.CSSProperties = { 
    padding: mobile ? '6px 10px' : '18px 40px', 
    background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '9999px', 
    fontWeight: 700, 
    fontSize: mobile ? '11px' : '17px', 
    width: '100%', 
    cursor: 'pointer' 
  };
  const cardsGrid: React.CSSProperties = { 
    display: 'grid', 
    gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : '1fr 1fr', 
    gap: mobile ? '3px' : '16px' 
  };
  const warningStyle: React.CSSProperties = { 
    marginTop: mobile ? '2px' : '30px', 
    padding: mobile ? '2px 3px' : '16px', 
    background: '#fef2f2', 
    color: '#991b1b', 
    borderRadius: mobile ? '3px' : '16px', 
    fontSize: mobile ? '7px' : '13px', 
    textAlign: 'center', 
    border: '1px solid #f5a3a3' 
  };

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={headerContainer}>
        <div style={logoStyle}>🚚 GHN.PI</div>
        <p style={subtitleStyle}>Giao hàng nhanh • Thanh toán bằng Pi</p>

        {/* Pi Environment Indicator - hidden on Pi Browser to save space */}
        {!mobile && (
          <div style={{
            marginTop: 8,
            fontSize: 12,
            padding: '2px 10px',
            borderRadius: 999,
            display: 'inline-block',
            background: (typeof window !== 'undefined' && window.Pi) ? '#dcfce7' : '#fef3c7',
            color: (typeof window !== 'undefined' && window.Pi) ? '#166534' : '#92400e',
          }}>
            {typeof window !== 'undefined' && window.Pi 
              ? '✓ Pi Browser (Real SDK)' 
              : '⚠️ Development (Mock Pi)'}
          </div>
        )}

        {/* Incomplete Payment Warning - hidden on Pi Browser */}
        {!mobile && incompleteCount > 0 && (
          <div 
            onClick={() => navigate('/incomplete-payments')}
            style={{
              marginTop: 10,
              background: '#fee2e2',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid #fca5a5',
            }}
          >
            ⚠️ {incompleteCount} giao dịch Pi chưa hoàn tất. <u>Xem & xử lý</u>
          </div>
        )}
      </div>

      {/* NÚT ĐĂNG NHẬP PI */}
      <div style={piButtonContainer}>
        <button style={piButton} onClick={() => navigate('/dang-ky')}>
          {piUsername ? `Đã kết nối: ${piUsername}` : '⭐ Đăng nhập với Pi Network'}
        </button>
      </div>

      {/* On Pi Browser: show clear "8 thẻ HOME Người mới" + easy reset */}
      {mobile && (
        <div style={{ textAlign: 'center', margin: '2px 0 4px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#4c1d95' }}>
            8 THẺ CHÍNH • NGƯỜI MỚI
          </div>
          {role && role !== 'guest' && (
            <button 
              onClick={() => { localStorage.removeItem('selectedRole'); window.location.reload(); }}
              style={{ fontSize: '9px', marginTop: '2px', background: 'none', border: '1px solid #e0d4ff', padding: '1px 6px', borderRadius: '4px', color: '#4c1d95' }}
            >
              Đặt lại về Người mới (xem 8 thẻ gốc)
            </button>
          )}
        </div>
      )}

      {/* GRID CARDS - Role Specific (exact original beautiful on Chrome, decent 2-col on Pi Browser) */}
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

        {/* NGƯỜI MỚI (guest) - exact 8 HOME cards user wants */}
        {(!role || role === 'guest') && (
          <>
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

// Card: Exact original beautiful on desktop + decent usable on Pi Browser phone (8 cards visible)
const Card = ({ 
  title, icon, desc, onClick, mobile = false 
}: { 
  title: string; icon: string; desc: string; onClick: () => void;
  mobile?: boolean;
}) => {
  const cardStyle: React.CSSProperties = mobile ? {
    // Good size for Pi Browser 2-col so 8 HOME cards are clear and tappable
    background: 'white',
    padding: '8px 4px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    border: '1px solid #e0d4ff',
    cursor: 'pointer',
    minHeight: '54px',
  } : {
    // Exact original beautiful (from bc8ef68)
    background: 'white',
    padding: '20px 12px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    border: '2px solid #e0d4ff',
    cursor: 'pointer',
  };

  const iconStyle: React.CSSProperties = { 
    fontSize: mobile ? '22px' : '36px', 
    marginBottom: mobile ? '2px' : '8px', 
    display: 'block',
    lineHeight: 1
  };
  const cardTitle: React.CSSProperties = { 
    fontSize: mobile ? '11px' : '15px', 
    fontWeight: 700, 
    color: '#4c1d95', 
    margin: mobile ? '0' : '0 0 4px 0',
    lineHeight: '1.2'
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

