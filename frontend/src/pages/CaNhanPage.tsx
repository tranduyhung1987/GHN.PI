// src/pages/CaNhanPage.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CaNhanPage() {
  const navigate = useNavigate();
  const [reputation] = useState(94);

  const getRepColor = (score: number): string => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    return '#ef4444';
  };

  const getRepBadge = (score: number): string => {
    if (score >= 90) return "🏆 Xuất Sắc";
    if (score >= 75) return "⭐ Tốt";
    return "⚠️ Cần cải thiện";
  };

  const handleScanQR = () => {
    alert('📷 Mở camera quét QR đơn hàng...\n\n(Chuẩn bị tích hợp QR Scanner thực tế)');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingBottom: '90px' }}>
      {/* HEADER + REPUTATION */}
      <div style={headerStyle}>
        <div style={avatarStyle}>👤</div>
        <h1 style={nameStyle}>ABC</h1>
        <p style={{ color: '#c4d0ff' }}>Chủ cửa hàng • Shop</p>

        {/* Reputation Card */}
        <div style={repCardStyle}>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: getRepColor(reputation) 
          }}>
            {reputation}
            <span style={{ fontSize: '20px' }}>pts</span>
          </div>
          <div style={{ 
            color: getRepColor(reputation), 
            fontWeight: 'bold', 
            marginTop: '4px' 
          }}>
            {getRepBadge(reputation)}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
            Uy tín cao • Ưu tiên xử lý đơn
          </p>
        </div>
      </div>

      {/* BALANCE */}
      <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
        <div style={balanceCard1}>
          <p style={{ color: '#94a3b8' }}>Số dư Pi</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#22d3ee' }}>0 xu</p>
        </div>
        <div style={balanceCard2}>
          <p style={{ color: '#94a3b8' }}>Hạn mức</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#eab308' }}>60.000 đ</p>
        </div>
      </div>

      {/* QUÉT QR */}
      <div style={{ padding: '0 20px 20px' }}>
        <button onClick={handleScanQR} style={qrButtonStyle}>
          📷 QUÉT MÃ QR ĐƠN HÀNG
        </button>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
          Nhận đơn • Thanh toán Pi • Kiểm tra trạng thái
        </p>
      </div>

      {/* MENU */}
      <div style={{ padding: '0 20px' }}>
        {[
          { icon: '📊', title: 'Báo cáo - Live', desc: 'Doanh thu hôm nay • 12 đơn' },
          { icon: '📦', title: 'Quản lý đơn hàng', desc: '28 đơn đang xử lý' },
          { icon: '🚛', title: 'Lịch sử vận chuyển', desc: '124 đơn đã hoàn thành' },
          { icon: '⭐', title: 'Đánh giá & Phản hồi', desc: '4.8/5 từ khách hàng' },
          { icon: '🏆', title: 'Uy tín Reputation', desc: 'Xem lịch sử đánh giá' },
          { icon: '⚙️', title: 'Cài đặt tài khoản', desc: 'Thông tin & bảo mật' },
        ].map((item, i) => (
          <div key={i} style={menuItemStyle} onClick={() => alert(`Mở: ${item.title}`)}>
            <div style={{ fontSize: '32px' }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', color: 'white' }}>{item.title}</p>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>{item.desc}</p>
            </div>
            <span style={{ color: '#64748b', fontSize: '24px' }}>›</span>
          </div>
        ))}
      </div>

      {/* ĐĂNG XUẤT */}
      <div style={{ padding: '30px 20px', textAlign: 'center' }}>
        <button 
          onClick={() => { if (confirm('Đăng xuất khỏi tài khoản?')) navigate('/'); }}
          style={logoutStyle}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

/* ====================== STYLES ====================== */
const headerStyle = {
  background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)',
  padding: '40px 20px 30px',
  textAlign: 'center' as const,
  position: 'relative' as const
};

const avatarStyle = {
  width: '100px', 
  height: '100px', 
  margin: '0 auto 12px',
  borderRadius: '50%', 
  border: '5px solid #22d3ee',
  background: '#1e2937', 
  display: 'flex',
  alignItems: 'center', 
  justifyContent: 'center',
  boxShadow: '0 0 40px rgba(34, 211, 238, 0.7)',
  fontSize: '48px'
};

const nameStyle = {
  fontSize: '28px', 
  fontWeight: 'bold', 
  color: 'white', 
  margin: '0 0 4px'
};

const repCardStyle = {
  background: '#1e2937',
  margin: '20px auto',
  padding: '16px 24px',
  borderRadius: '16px',
  border: '2px solid #eab308',
  maxWidth: '280px',
  boxShadow: '0 0 20px rgba(234, 179, 8, 0.4)'
};

const balanceCard1 = {
  flex: 1, 
  background: '#1e2937', 
  borderRadius: '16px', 
  padding: '20px', 
  border: '1px solid #22d3ee'
};

const balanceCard2 = {
  flex: 1, 
  background: '#1e2937', 
  borderRadius: '16px', 
  padding: '20px', 
  border: '1px solid #eab308'
};

const qrButtonStyle = {
  width: '100%', 
  padding: '18px', 
  background: 'linear-gradient(90deg, #22d3ee, #06b67f)',
  color: '#0f172a', 
  border: 'none', 
  borderRadius: '999px',
  fontSize: '18px', 
  fontWeight: 'bold', 
  cursor: 'pointer',
  boxShadow: '0 0 25px rgba(34, 211, 238, 0.6)',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '12px'
};

const menuItemStyle = {
  background: '#1e2937', 
  marginBottom: '12px', 
  padding: '18px 20px',
  borderRadius: '16px', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '16px',
  cursor: 'pointer', 
  border: '1px solid #334155'
};

const logoutStyle = {
  padding: '14px 50px', 
  background: 'transparent',
  color: '#ef4444', 
  border: '2px solid #ef4444',
  borderRadius: '999px', 
  fontWeight: 'bold'
};