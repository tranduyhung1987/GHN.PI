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
    <div style={pageContainer}>
      {/* Header Profile */}
      <div style={headerStyle}>
        <div style={avatarContainer}>
          <div style={avatarStyle}>👤</div>
        </div>
        
        <h1 style={nameStyle}>ABC Shop</h1>
        <p style={subtitleStyle}>Chủ cửa hàng • Thành viên VIP</p>

        {/* Reputation Card - ĐÃ GIẢM CHIỀU CAO */}
        <div style={repCardStyle}>
          <div style={{ 
            fontSize: '42px', 
            fontWeight: '800', 
            color: getRepColor(reputation),
            lineHeight: '1'
          }}>
            {reputation} <span style={{ fontSize: '22px' }}>pts</span>
          </div>
          <div style={{ 
            color: getRepColor(reputation), 
            fontWeight: '700', 
            marginTop: '4px',
            fontSize: '17px'
          }}>
            {getRepBadge(reputation)}
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div style={balanceContainer}>
        <div style={balanceCard}>
          <p style={{ color: '#6b21a8', marginBottom: '6px', fontSize: '15px' }}>Số dư Pi</p>
          <p style={{ fontSize: '29px', fontWeight: '700', color: '#22d3ee', margin: '4px 0' }}>
            12.450 <span style={{ fontSize: '18px' }}>Pi</span>
          </p>
        </div>
        <div style={balanceCard}>
          <p style={{ color: '#6b21a8', marginBottom: '6px', fontSize: '15px' }}>Hạn mức tín dụng</p>
          <p style={{ fontSize: '29px', fontWeight: '700', color: '#eab308', margin: '4px 0' }}>
            60.000 <span style={{ fontSize: '18px' }}>đ</span>
          </p>
        </div>
      </div>

      {/* QR Scan */}
      <div style={{ padding: '0 14px 24px' }}>
        <button onClick={handleScanQR} style={qrButtonStyle}>
          📷 QUÉT MÃ QR ĐƠN HÀNG
        </button>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '10px' }}>
          Nhận đơn • Thanh toán nhanh • Kiểm tra trạng thái
        </p>
      </div>

      {/* Menu List */}
      <div style={{ padding: '0 14px' }}>
        {[
          { icon: '📊', title: 'Báo cáo doanh thu', desc: 'Doanh thu hôm nay • 12 đơn' },
          { icon: '📦', title: 'Quản lý đơn hàng', desc: '28 đơn đang xử lý' },
          { icon: '🚛', title: 'Lịch sử vận chuyển', desc: '124 đơn đã hoàn thành' },
          { icon: '⭐', title: 'Đánh giá & Phản hồi', desc: '4.8/5 từ khách hàng' },
          { icon: '🏆', title: 'Uy tín Reputation', desc: 'Xem lịch sử đánh giá' },
          { icon: '⚙️', title: 'Cài đặt tài khoản', desc: 'Thông tin & bảo mật' },
        ].map((item, i) => (
          <div key={i} style={menuItemStyle} onClick={() => alert(`Mở: ${item.title}`)}>
            <div style={{ fontSize: '32px', width: '50px' }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', color: '#4c1d95', margin: '0 0 4px' }}>{item.title}</p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{item.desc}</p>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '26px' }}>›</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
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

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  width: '100%',
  background: '#f3e8ff',
  paddingBottom: '100px',
  boxSizing: 'border-box' as const
} as const;

const headerStyle = {
  background: '#ede9fe',
  padding: '32px 20px 20px',   // ← Giảm chiều cao
  textAlign: 'center' as const,
  borderBottom: '1px solid #c4b5fd'
} as const;

const avatarContainer = {
  marginBottom: '12px'
} as const;

const avatarStyle = {
  width: '110px',
  height: '110px',
  margin: '0 auto',
  borderRadius: '50%',
  border: '6px solid #22d3ee',
  background: '#f3e8ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '52px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
} as const;

const nameStyle = {
  fontSize: '26px',
  fontWeight: '700',
  color: '#4c1d95',
  margin: '0 0 4px'
} as const;

const subtitleStyle = {
  color: '#6b21a8',
  margin: 0,
  fontSize: '15.5px'
} as const;

const repCardStyle = {
  background: '#fff',
  margin: '16px auto',         // ← Giảm margin
  padding: '14px 28px',        // ← Giảm padding
  borderRadius: '20px',
  border: '2px solid #c4b5fd',
  maxWidth: '300px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
} as const;

const balanceContainer = {
  display: 'flex',
  gap: '12px',
  padding: '0 14px',
  marginBottom: '24px'
} as const;

const balanceCard = {
  flex: 1,
  background: '#fff',
  padding: '14px 16px',
  borderRadius: '16px',
  border: '1px solid #c4b5fd',
  textAlign: 'center' as const
} as const;

const qrButtonStyle = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 8px 25px rgba(34,211,238,0.4)'
} as const;

const menuItemStyle = {
  background: '#fff',
  marginBottom: '12px',
  padding: '18px 20px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  border: '1px solid #c4b5fd',
  cursor: 'pointer'
} as const;

const logoutStyle = {
  padding: '16px 60px',
  background: 'transparent',
  color: '#ef4444',
  border: '2px solid #ef4444',
  borderRadius: '9999px',
  fontWeight: '700',
  cursor: 'pointer'
} as const;