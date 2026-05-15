import React, { useState, useRef } from 'react';

interface CaNhanPageProps {
  onNavigate: (page: string) => void;
}

const CaNhanPage: React.FC<CaNhanPageProps> = ({ onNavigate }) => {
  const [userId] = useState('154656565');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePiClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={pageContainer}>
      {/* HEADER NGẮN - Không có mũi tên ← */}
      <div style={header}>
        <h1 style={title}>Cá Nhân</h1>
      </div>

      {/* PI LOGO */}
      <div style={piLogoContainer} onClick={handlePiClick}>
        <div style={piCircle}>
          <span style={piSymbol}>π</span>
        </div>
      </div>

      {/* ID và Thông tin */}
      <div style={infoSection}>
        <p style={idStyle}>ID: <span style={idNumber}>{userId}</span></p>
        <p style={roleStyle}>Chủ cửa hàng • Shop</p>
      </div>

      {/* Điểm uy tín */}
      <div style={reputationCard}>
        <div>
          <div style={repLabel}>Điểm uy tín</div>
          <div style={points}>94 pts</div>
          <div style={rank}>Xuất Sắc</div>
        </div>
        <div style={trophy}>🏆</div>
      </div>

      {/* Stats */}
      <div style={statsContainer}>
        <div style={statCard}>
          <div style={statLabel}>Số dư Pi</div>
          <div style={piAmount}>12.450 Pi</div>
        </div>
        <div style={statCard}>
          <div style={statLabel}>Hạn mức tín dụng</div>
          <div style={creditAmount}>60.000 đ</div>
        </div>
      </div>

      {/* Menu */}
      <div style={menuContainer}>
        <MenuItem icon="📋" label="Lịch sử đơn hàng" onClick={() => onNavigate('don-hang')} />
        <MenuItem icon="💰" label="Ví Pi" />
        <MenuItem icon="⭐" label="Đánh giá của tôi" />
        <MenuItem icon="⚙️" label="Cài đặt tài khoản" />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 90px',
  boxSizing: 'border-box'
};

const header: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '20px',
  paddingTop: '10px'
};

const title: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: '700',
  color: '#4c1d95',
  margin: 0
};

const piLogoContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  margin: '10px 0 20px'
};

const piCircle: React.CSSProperties = {
  width: '130px',
  height: '130px',
  background: 'linear-gradient(135deg, #6b21a8, #4c1d95)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 25px rgba(76, 29, 149, 0.3)',
  cursor: 'pointer',
  border: '8px solid white'
};

const piSymbol: React.CSSProperties = {
  fontSize: '78px',
  color: '#f3e8ff',
  fontWeight: 'bold'
};

const infoSection: React.CSSProperties = { textAlign: 'center' as const, marginBottom: '30px' };
const idStyle: React.CSSProperties = { fontSize: '17px', color: '#64748b', margin: '0 0 4px' };
const idNumber: React.CSSProperties = { color: '#4c1d95', fontWeight: '700' };
const roleStyle: React.CSSProperties = { color: '#6b21a8', fontSize: '16px' };

const reputationCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  border: '1px solid #c4b5fd'
};

const repLabel: React.CSSProperties = { color: '#64748b', fontSize: '14px' };
const points: React.CSSProperties = { fontSize: '42px', fontWeight: '700', color: '#22d3ee' };
const rank: React.CSSProperties = { color: '#15803d', fontWeight: '600' };
const trophy: React.CSSProperties = { fontSize: '58px' };

const statsContainer: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginBottom: '30px'
};

const statCard: React.CSSProperties = {
  background: 'white',
  padding: '18px',
  borderRadius: '16px',
  textAlign: 'center' as const,
  border: '1px solid #e0d4ff'
};

const statLabel: React.CSSProperties = { color: '#64748b', fontSize: '14px' };
const piAmount: React.CSSProperties = { fontSize: '22px', fontWeight: '700', color: '#4c1d95' };
const creditAmount: React.CSSProperties = { fontSize: '22px', fontWeight: '700', color: '#eab308' };

const menuContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px'
};

const MenuItem = ({ icon, label, onClick }: any) => (
  <div style={menuItemStyle} onClick={onClick}>
    <span style={{ fontSize: '26px', marginRight: '16px' }}>{icon}</span>
    <span>{label}</span>
  </div>
);

const menuItemStyle: React.CSSProperties = {
  background: 'white',
  padding: '16px 20px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '16.5px',
  cursor: 'pointer',
  border: '1px solid #e0d4ff'
};

export default CaNhanPage;