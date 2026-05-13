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
    return score >= 90 ? "🏆 Đối tác Xuất Sắc" : score >= 75 ? "⭐ Đối tác Uy Tín" : "📉 Cần cải thiện";
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      background: '#f3e8ff', 
      padding: '16px 14px 100px',
      boxSizing: 'border-box'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 }}>KHO TRUNG CHUYỂN</h1>
          <p style={{ color: '#6b21a8', margin: 0 }}>Mạng lưới Hub • Minh bạch On-chain • Web3</p>
        </div>
      </div>

      {mode === 'welcome' && (
        <div style={welcomeCard}>
          <div style={{ fontSize: '110px', marginBottom: '20px' }}>🏪</div>
          <h2 style={{ fontSize: '32px', color: '#4c1d95', marginBottom: '12px' }}>Mạng lưới Kho Trung Chuyển</h2>
          <h3 style={{ color: '#22d3ee', marginBottom: '32px' }}>GHN.PI</h3>
          
          <p style={welcomeText}>
            Kết nối kho hàng & bến bãi của bạn với hệ sinh thái GHN.PI<br />
            Gửi đơn đường dài nhanh • Thanh toán Pi • Minh bạch on-chain
          </p>

          <button onClick={() => setMode('partnerHub')} style={mainButton}>
            + Đăng ký Kho Trung Chuyển ngay
          </button>
        </div>
      )}

      {mode === 'partnerHub' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Reputation Card */}
          <div style={repCard}>
            <div style={{ fontSize: '52px', fontWeight: 'bold', color: getRepColor(hubReputation) }}>
              {hubReputation} <span style={{ fontSize: '24px' }}>pts</span>
            </div>
            <div style={{ color: getRepColor(hubReputation), fontWeight: '700', marginTop: '8px' }}>
              {getRepBadge(hubReputation)}
            </div>
            <p style={{ color: '#64748b', marginTop: '12px' }}>
              Kho TP.HCM (SG01) • Hoạt động mạnh • 189 đơn đường dài
            </p>
          </div>

          {/* Kho của bạn */}
          <div style={infoCard}>
            <h3 style={{ color: '#4c1d95', marginBottom: '12px' }}>Kho của bạn</h3>
            <div style={{ background: '#ede9fe', padding: '18px', borderRadius: '14px' }}>
              <strong>TP.HCM Hub (SG01)</strong>
              <p style={{ color: '#22c55e', margin: '6px 0' }}>Đang hoạt động • 24/7</p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Dung lượng: 450m² • 12 xe đường dài</p>
            </div>
          </div>

          {/* Trạng thái đối tác */}
          <div style={statusCard}>
            <h4 style={{ color: '#4c1d95' }}>Trạng thái đối tác</h4>
            <p style={{ color: '#22c55e', fontWeight: '600' }}>
              Bạn là Đối tác chính thức của GHN.PI<br />
              Tất cả giao dịch được ghi nhận trên Blockchain
            </p>
          </div>

          <button 
            onClick={() => alert('Chức năng quản trị kho đang phát triển')} 
            style={mainButton}
          >
            Quản trị kho & đơn hàng
          </button>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */
const welcomeCard = {
  background: '#ede9fe',
  padding: '60px 24px',
  borderRadius: '24px',
  textAlign: 'center' as const,
  border: '1px solid #c4b5fd',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
};

const welcomeText = {
  color: '#6b21a8',
  fontSize: '17px',
  lineHeight: '1.7',
  marginBottom: '40px'
};

const mainButton = {
  width: '100%',
  padding: '18px',
  fontSize: '17px',
  fontWeight: '700',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  cursor: 'pointer',
  boxShadow: '0 8px 25px rgba(34,211,238,0.4)'
};

const repCard = {
  background: '#1e2937',
  color: 'white',
  padding: '28px 24px',
  borderRadius: '20px',
  textAlign: 'center' as const,
  border: '2px solid #eab308'
};

const infoCard = {
  background: '#ede9fe',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #c4b5fd'
};

const statusCard = {
  background: '#ede9fe',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #22d3ee',
  textAlign: 'center' as const
};