import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

type Mode = 'welcome' | 'register' | 'myHub' | 'partnerHub';

interface KhoHubPageProps {
  onNavigate?: (page: string) => void;
}

export default function KhoHubPage({ onNavigate }: KhoHubPageProps) {
  const [mode, setMode] = useState<Mode>('welcome');
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');
  const [hubReputation] = useState(92);

  // Kiểm tra Pi Connection
  useEffect(() => {
    const checkPi = async () => {
      if (window.Pi) {
        try {
          const user = await window.Pi.authenticate(['payments'], {
            onIncompletePaymentFound: () => {}
          });
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Kho Partner');
        } catch (e) {
          setIsPiConnected(false);
        }
      }
    };
    checkPi();
  }, []);

  const getRepColor = (score: number): string => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    return '#ef4444';
  };

  const getRepBadge = (score: number): string => {
    return score >= 90 ? "🏆 Đối tác Xuất Sắc" : score >= 75 ? "⭐ Đối tác Uy Tín" : "📉 Cần cải thiện";
  };

  const handlePiLogin = async () => {
    if (!window.Pi) {
      alert("⚠️ Vui lòng mở trong Pi Browser!");
      return;
    }
    try {
      const user = await window.Pi.authenticate(['payments'], { 
        onIncompletePaymentFound: () => {} 
      });
      setIsPiConnected(true);
      setPiUsername(user?.username || 'Kho Partner');
      alert(`✅ Kho đã kết nối Pi Network!\nChào ${user?.username}`);
    } catch (e) {
      alert("❌ Kết nối Pi thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <div style={{ fontSize: '48px', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('home')}>
          ←
        </div>
        <div>
          <h1 style={titleStyle}>KHO TRUNG CHUYỂN</h1>
          <p style={subtitleStyle}>Mạng lưới Hub • Thanh toán Pi • On-chain</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isPiConnected ? (
          <p style={{ color: '#22d3ee', fontWeight: '600' }}>✅ Đã kết nối Pi @{piUsername}</p>
        ) : (
          <button onClick={handlePiLogin} style={piConnectButton}>
            🔗 Kết nối Pi Network
          </button>
        )}
      </div>

      {mode === 'welcome' && (
        <div style={welcomeCard}>
          <div style={{ fontSize: '110px', marginBottom: '20px' }}>🏪</div>
          <h2 style={welcomeTitle}>Mạng lưới Kho Trung Chuyển GHN.PI</h2>
          <p style={welcomeText}>
            Kết nối kho hàng của bạn với hệ sinh thái GHN.PI<br />
            Nhận đơn đường dài • Thanh toán Pi tự động • Minh bạch on-chain
          </p>

          <button onClick={() => setMode('partnerHub')} style={mainButton}>
            + Đăng ký Kho Trung Chuyển ngay
          </button>
        </div>
      )}

      {mode === 'partnerHub' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

          <div style={infoCard}>
            <h3 style={{ color: '#4c1d95', marginBottom: '12px' }}>Kho của bạn</h3>
            <div style={{ background: '#ede9fe', padding: '18px', borderRadius: '14px' }}>
              <strong>TP.HCM Hub (SG01)</strong>
              <p style={{ color: '#22c55e', margin: '6px 0' }}>Đang hoạt động • 24/7</p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Dung lượng: 450m² • 12 xe đường dài</p>
            </div>
          </div>

          <button 
            onClick={() => alert('Chức năng quản trị kho & theo dõi đơn Pi đang phát triển...')} 
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
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 100px',
  boxSizing: 'border-box' as const,
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginBottom: '24px'
};

const titleStyle = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitleStyle = { color: '#6b21a8', margin: 0 };

const welcomeCard = {
  background: '#ede9fe',
  padding: '60px 24px',
  borderRadius: '24px',
  textAlign: 'center' as const,
  border: '1px solid #c4b5fd',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
};

const welcomeTitle = { fontSize: '32px', color: '#4c1d95', marginBottom: '12px' };
const welcomeText = { color: '#6b21a8', fontSize: '17px', lineHeight: '1.7', marginBottom: '40px' };

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

const piConnectButton = {
  ...mainButton,
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  color: 'white'
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