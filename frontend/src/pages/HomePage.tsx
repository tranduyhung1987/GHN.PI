import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { getIncompletePayments } from '../services/firebase/incompletePaymentService';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const piUsername = user?.username || '';

  const [incompleteCount, setIncompleteCount] = useState(0);

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

      {/* GRID CARDS */}
      <div style={cardsGrid}>
        <Card title="GỬI HÀNG" icon="📦" desc="Tạo đơn gửi hàng" onClick={() => navigate('/gui-hang')} />
        <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={() => navigate('/tra-cuu-cuoc')} />
        <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={() => navigate('/warehouse')} />
        <Card title="TÀI XẾ" icon="🏍️" desc="Đơn hàng tài xế" onClick={() => navigate('/driver')} />
        <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={() => navigate('/tracking')} />
        <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={() => navigate('/nhan-hang')} />
        
        <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} />
        <Card title="CHƯA CÓ VAI TRÒ?" icon="👋" desc="Đăng ký ngay" onClick={() => navigate('/dang-ky')} />
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

const pageContainer: React.CSSProperties = { padding: '20px', background: '#f3e8ff', minHeight: '100vh' };
const headerContainer: React.CSSProperties = { textAlign: 'center', marginBottom: '30px' };
const logoStyle: React.CSSProperties = { fontSize: '42px', fontWeight: 700, color: '#4c1d95', margin: 0 };
const subtitleStyle: React.CSSProperties = { color: '#64748b', fontSize: '15px', margin: '4px 0 0 0' };
const piButtonContainer: React.CSSProperties = { margin: '0 auto 30px', maxWidth: '340px' };
const piButton: React.CSSProperties = { padding: '18px 40px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 700, fontSize: '17px', width: '100%', cursor: 'pointer' };
const cardsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const cardStyle: React.CSSProperties = { background: 'white', padding: '20px 12px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', border: '2px solid #e0d4ff', cursor: 'pointer' };
const iconStyle: React.CSSProperties = { fontSize: '36px', marginBottom: '8px', display: 'block' };
const cardTitle: React.CSSProperties = { fontSize: '15px', fontWeight: 700, color: '#4c1d95', margin: '0 0 4px 0' };
const cardDesc: React.CSSProperties = { fontSize: '12px', color: '#64748b', margin: 0 };
const warningStyle: React.CSSProperties = { marginTop: '30px', padding: '16px', background: '#fef2f2', color: '#991b1b', borderRadius: '16px', fontSize: '13px', textAlign: 'center', border: '1px solid #f5a3a3' };