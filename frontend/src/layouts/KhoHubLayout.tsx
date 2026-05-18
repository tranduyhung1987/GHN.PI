import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

declare global {
  interface Window {
    Pi: any;
  }
}

interface KhoHubLayoutProps {
  children: React.ReactNode;
}

const KhoHubLayout: React.FC<KhoHubLayoutProps> = ({ children }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');

  // Kiểm tra Pi Connection
  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then((user: any) => {
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Kho Partner');
        })
        .catch(() => setIsPiConnected(false));
    }
  }, []);

  // Dummy navigate cho Layout (có thể mở rộng sau)
  const handleNavigate = (page: string) => {
    console.log('KhoHub navigate to:', page);
    // Nếu cần chuyển trang thật thì dùng context hoặc window.location
  };

  return (
    <div style={container}>
      {/* Header riêng cho Kho Trung Chuyển */}
      <div style={khoHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>🏬</span>
          <h2 style={title}>GHN.PI - KHO TRUNG CHUYỂN</h2>
        </div>
        
        <div style={rightSection}>
          {isPiConnected ? (
            <div style={piBadge}>✅ @{piUsername}</div>
          ) : (
            <div style={piBadge}>🔗 Pi Network</div>
          )}
          <div style={roleBadge}>📦 Kho Hub Partner</div>
        </div>
      </div>

      <main style={mainContent}>
        {children}
      </main>

      <BottomNav onNavigate={handleNavigate} />
    </div>
  );
};

/* ===================== STYLES ===================== */
const container = {
  minHeight: '100vh',
  background: '#f3e8ff',
  paddingBottom: '90px',
  boxSizing: 'border-box' as const
};

const khoHeader = {
  background: '#1e3a8a',
  color: '#fff',
  padding: '16px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const title = { 
  margin: 0, 
  fontSize: '22px', 
  fontWeight: '800' 
};

const rightSection = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const roleBadge = { 
  background: '#67e8f9', 
  color: '#0f172a', 
  padding: '6px 16px', 
  borderRadius: '9999px', 
  fontWeight: '700',
  fontSize: '14px'
};

const piBadge = {
  background: '#22d3ee',
  color: '#0f172a',
  padding: '6px 12px',
  borderRadius: '9999px',
  fontSize: '13px',
  fontWeight: '600'
};

const mainContent = {
  padding: '20px 16px'
};

export default KhoHubLayout;