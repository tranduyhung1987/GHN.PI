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

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={headerContainer}>
        <div style={logoStyle}>🚚 GHN.PI</div>
        <p style={subtitleStyle}>Giao hàng nhanh • Thanh toán bằng Pi</p>

        {/* Pi Environment Indicator - rất hữu ích khi test trên Pi Browser */}
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
            ? '✓ Chạy trong Pi Browser (Real Pi SDK)' 
            : '⚠️ Môi trường Development (dùng Mock Pi)'}
        </div>

        {/* Incomplete Payment Warning (Pi Network requirement) */}
        {incompleteCount > 0 && (
          <div 
            onClick={() => navigate('/incomplete-payments')}
            style={{
              marginTop: 10,
              background: '#fee2e2',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid #fca5a5',
            }}
          >
            ⚠️ Có {incompleteCount} giao dịch Pi chưa hoàn tất. <u>Nhấn để xem & xử lý</u>
          </div>
        )}
      </div>

      {/* NÚT ĐĂNG NHẬP PI */}
      <div style={piButtonContainer}>
        <button style={piButton} onClick={() => navigate('/dang-ky')}>
          {piUsername ? `Đã kết nối: ${piUsername}` : '⭐ Đăng nhập với Pi Network'}
        </button>
      </div>

      {/* GRID CARDS - Role Specific */}
      <div style={cardsGrid}>
        {/* DRIVER */}
        {role === 'driver' && (
          <>
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📦" desc="Các đơn cần giao ngay" onClick={() => navigate('/driver')} />
            <Card title="BẢN ĐỒ" icon="🗺️" desc="Xem tuyến đường" onClick={() => navigate('/tracking')} />
            <Card title="LỊCH SỬ GIAO" icon="📋" desc="Đơn đã hoàn thành" onClick={() => navigate('/orders')} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} />
          </>
        )}

        {/* WAREHOUSE */}
        {role === 'warehouse' && (
          <>
            <Card title="NHẬP KHO" icon="📥" desc="Nhận hàng vào kho" onClick={() => navigate('/warehouse')} />
            <Card title="XUẤT KHO" icon="📤" desc="Giao hàng ra ngoài" onClick={() => navigate('/warehouse')} />
            <Card title="TỒN KHO" icon="📊" desc="Quản lý hàng tồn" onClick={() => navigate('/warehouse')} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={() => navigate('/tracking')} />
          </>
        )}

        {/* BUYER / SELLER (SHOP) */}
        {(role === 'sender' || role === 'receiver') && (
          <>
            <Card title="GỬI HÀNG MỚI" icon="📦" desc="Tạo đơn gửi hàng" onClick={() => navigate('/gui-hang')} />
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📋" desc="Quản lý đơn đã tạo" onClick={() => navigate('/orders')} />
            <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={() => navigate('/tra-cuu-cuoc')} />
            <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={() => navigate('/warehouse')} />
            <Card title="TÀI XẾ" icon="🏍️" desc="Đơn hàng tài xế" onClick={() => navigate('/driver')} />
            <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={() => navigate('/nhan-hang')} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} />
          </>
        )}

        {/* ADMIN */}
        {role === 'admin' && (
          <>
            <Card title="DASHBOARD" icon="📊" desc="Thống kê tổng quan" onClick={() => navigate('/admin')} />
            <Card title="QUẢN LÝ NGƯỜI DÙNG" icon="👥" desc="Quản lý tài khoản" onClick={() => navigate('/admin')} />
            <Card title="BÁO CÁO" icon="📈" desc="Báo cáo & thống kê" onClick={() => navigate('/admin')} />
            <Card title="INCOMPLETE PAYMENTS" icon="⚠️" desc="Giao dịch Pi chưa hoàn tất" onClick={() => navigate('/incomplete-payments')} />
          </>
        )}

        {/* NGƯỜI MỚI (guest) - Hiển thị đầy đủ 8 thẻ như ban đầu */}
        {(!role || role === 'guest') && (
          <>
            <Card title="GỬI HÀNG" icon="📦" desc="Tạo đơn gửi hàng" onClick={() => navigate('/gui-hang')} />
            <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={() => navigate('/tra-cuu-cuoc')} />
            <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={() => navigate('/warehouse')} />
            <Card title="TÀI XẾ" icon="🏍️" desc="Đơn hàng tài xế" onClick={() => navigate('/driver')} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={() => navigate('/tracking')} />
            <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={() => navigate('/nhan-hang')} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} />
            <Card title="ĐĂNG KÝ VAI TRÒ" icon="👋" desc="Chọn vai trò của bạn" onClick={() => navigate('/dang-ky')} />
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

/* ==================== CARD COMPONENT & STYLES ==================== */
const Card = ({ title, icon, desc, onClick }: { title: string; icon: string; desc: string; onClick: () => void }) => (
  <div style={cardStyle} onClick={onClick}>
    <span style={iconStyle}>{icon}</span>
    <h3 style={cardTitle}>{title}</h3>
    <p style={cardDesc}>{desc}</p>
  </div>
);

const pageContainer: React.CSSProperties = { 
  padding: isMobile ? '8px' : '12px', 
  background: '#f3e8ff', 
  minHeight: '100dvh', 
  boxSizing: 'border-box' 
};
const headerContainer: React.CSSProperties = { 
  textAlign: 'center', 
  marginBottom: isMobile ? '6px' : '10px' 
};
const logoStyle: React.CSSProperties = { 
  fontSize: isMobile ? '22px' : '28px', 
  fontWeight: 700, 
  color: '#4c1d95', 
  margin: 0 
};
const subtitleStyle: React.CSSProperties = { 
  color: '#64748b', 
  fontSize: isMobile ? '10px' : '11px', 
  margin: '0' 
};
const piButtonContainer: React.CSSProperties = { 
  margin: isMobile ? '0 auto 4px' : '0 auto 8px', 
  maxWidth: '280px' 
};
const piButton: React.CSSProperties = { 
  padding: isMobile ? '8px 12px' : '10px 16px', 
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', 
  color: 'white', 
  border: 'none', 
  borderRadius: '9999px', 
  fontWeight: 700, 
  fontSize: isMobile ? '13px' : '14px', 
  width: '100%', 
  cursor: 'pointer' 
};
const cardsGrid: React.CSSProperties = { 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: isMobile ? '5px' : '8px' 
};
const cardStyle: React.CSSProperties = { 
  background: 'white', 
  padding: isMobile ? '6px 3px' : '8px 4px', 
  borderRadius: '10px', 
  textAlign: 'center', 
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)', 
  border: '1px solid #e0d4ff', 
  cursor: 'pointer' 
};
const iconStyle: React.CSSProperties = { 
  fontSize: isMobile ? '18px' : '20px', 
  marginBottom: '1px', 
  display: 'block' 
};
const cardTitle: React.CSSProperties = { 
  fontSize: isMobile ? '10px' : '11px', 
  fontWeight: 700, 
  color: '#4c1d95', 
  margin: '0' 
};
const cardDesc: React.CSSProperties = { 
  fontSize: isMobile ? '9px' : '9.5px', 
  color: '#64748b', 
  margin: 0 
};
const warningStyle: React.CSSProperties = { 
  marginTop: isMobile ? '4px' : '6px', 
  padding: isMobile ? '4px 6px' : '5px 7px', 
  background: '#fef2f2', 
  color: '#991b1b', 
  borderRadius: '6px', 
  fontSize: isMobile ? '9px' : '10px', 
  textAlign: 'center', 
  border: '1px solid #f5a3a3' 
};