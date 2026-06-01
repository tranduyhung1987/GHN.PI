import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();                    // ← ĐÃ SỬA ĐÚNG
  const piUsername = user?.username || '';

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={headerContainer}>
        <div style={logoStyle}>🚚 GHN.PI</div>
        <p style={subtitleStyle}>Giao hàng nhanh • Thanh toán bằng Pi</p>
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