// src/pages/KhoHubPage.tsx
import { useState } from 'react';

type Mode = 'welcome' | 'register' | 'myHub' | 'partnerHub';

export default function KhoHubPage() {
  const [mode, setMode] = useState<Mode>('welcome');
  const [hubReputation] = useState(92);

  const getRepColor = (score: number): string => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    return '#ef4444';
  };

  const getRepBadge = (score: number): string => {
    return score >= 90 ? "🏆 Đối tác Xuất Sắc" : "⭐ Đối tác Uy Tín";
  };

  return (
    <>
      <div style={headerStyle}>
        <div style={{ fontSize: '52px' }}>📦</div>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>KHO TRUNG CHUYỂN</h1>
          <p style={{ color: '#94a3b8' }}>Mạng lưới Hub • Minh bạch On-chain • Web3</p>
        </div>
      </div>

      {mode === 'welcome' && (
        <div style={welcomeContainerStyle}>
          <div style={{ fontSize: '120px', marginBottom: '20px' }}>🏪</div>
          <h1 style={{ fontSize: '34px', color: '#22d3ee', marginBottom: '12px' }}>Mạng lưới Kho Trung Chuyển</h1>
          <h2 style={{ color: '#67e8f9', marginBottom: '32px' }}>GHN.PI</h2>
          <p style={welcomeTextStyle}>
            Kết nối kho hàng của bạn với hệ sinh thái GHN.PI<br />
            Gửi đơn đường dài nhanh chóng • Thanh toán Pi • Minh bạch on-chain
          </p>
          <button onClick={() => setMode('partnerHub')} style={registerButtonStyle}>
            + Đăng ký Kho Trung Chuyển ngay
          </button>
        </div>
      )}

      {mode === 'partnerHub' && (
        <>
          <div style={{ display: 'flex', gap: '12px', margin: '28px 0' }}>
            <button onClick={() => setMode('myHub')} style={primaryButtonStyle}>Quản trị hệ thống</button>
            <button style={secondaryButtonStyle}>Kho của tôi</button>
          </div>

          <div style={repHubStyle}>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: getRepColor(hubReputation) }}>
              {hubReputation} pts
            </div>
            <div style={{ color: getRepColor(hubReputation), fontWeight: 'bold', marginTop: '8px' }}>
              {getRepBadge(hubReputation)}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
              Kho TP.HCM (SG01) • Hoạt động on-chain
            </p>
          </div>

          <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Kho của bạn</h3>
          <div style={hubCardStyle}>
            <strong>TP.HCM Hub (SG01)</strong>
            <p style={{ color: '#4ade80' }}>Đang hoạt động • 189 đơn đường dài</p>
          </div>

          <h3 style={{ color: '#e2e8f0', margin: '30px 0 16px 0' }}>Đơn đường dài đang xử lý</h3>
          <div style={partnerStatusStyle}>
            Bạn đang là đối tác chính thức của GHN.PI<br />
            Tất cả giao dịch được ghi nhận trên Blockchain
          </div>
        </>
      )}
    </>
  );
}

/* ====================== STYLES ====================== */
const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '20px'
};

const welcomeContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: '#1e2937',
  borderRadius: '24px',
  border: '2px solid #334155'
};

const welcomeTextStyle: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '17px',
  maxWidth: '620px',
  margin: '0 auto 40px',
  lineHeight: '1.6'
};

const registerButtonStyle: React.CSSProperties = {
  padding: '18px 40px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 0 25px rgba(34, 211, 238, 0.7)'
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '16px 24px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '16px 24px',
  backgroundColor: '#334155',
  color: '#e2e8f0',
  border: '1px solid #475569',
  borderRadius: '9999px',
  fontWeight: '600',
  cursor: 'pointer'
};

const hubCardStyle: React.CSSProperties = {
  backgroundColor: '#1e2937',
  padding: '20px 24px',
  borderRadius: '16px',
  border: '1px solid #334155',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const repHubStyle: React.CSSProperties = {
  backgroundColor: '#1e2937',
  padding: '20px',
  borderRadius: '20px',
  border: '2px solid #eab308',
  textAlign: 'center',
  marginBottom: '24px'
};

const partnerStatusStyle: React.CSSProperties = {
  color: '#4ade80',
  padding: '30px',
  background: '#1e2937',
  borderRadius: '16px',
  textAlign: 'center',
  border: '1px solid #334155'
};