import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

declare global {
  interface Window {
    Pi: any;
  }
}

interface ShipLayoutProps {
  children: React.ReactNode;
}

const ShipLayout: React.FC<ShipLayoutProps> = ({ children }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');

  // Kiểm tra Pi Connection cho Tài Xế
  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then((user: any) => {
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Tài Xế');
        })
        .catch(() => setIsPiConnected(false));
    }
  }, []);

  // Dummy navigate cho Layout
  const handleNavigate = (page: string) => {
    console.log('ShipLayout navigate to:', page);
    // Có thể mở rộng sau khi có routing context
  };

  return (
    <div style={container}>
      {/* Header cho Tài Xế */}
      <div style={shipHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🏍️</span>
          <h2 style={title}>GHN.PI - TÀI XẾ</h2>
        </div>
        
        <div style={rightSection}>
          {isPiConnected ? (
            <div style={piBadge}>✅ @{piUsername}</div>
          ) : (
            <div style={piBadge}>🔗 Pi Network</div>
          )}
          <div style={roleBadge}>🚀 Tài Xế Giao Hàng</div>
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

const shipHeader = {
  background: '#1e40af',
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
  background: '#22d3ee', 
  color: '#0f172a', 
  padding: '6px 16px', 
  borderRadius: '9999px', 
  fontWeight: '700',
  fontSize: '14px'
};

const piBadge = {
  background: '#67e8f9',
  color: '#0f172a',
  padding: '6px 12px',
  borderRadius: '9999px',
  fontSize: '13px',
  fontWeight: '600'
};

const mainContent = {
  padding: '20px 16px'
};

export default ShipLayout;