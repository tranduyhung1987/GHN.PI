import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav'; // vẫn giữ import (nếu cần sau này)

declare global {
  interface Window {
    Pi: any;
  }
}

interface ShipLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const ShipLayout: React.FC<ShipLayoutProps> = ({ 
  children, 
  onNavigate, 
  currentPage 
}) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');

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

  return (
    <div style={container}>
      {/* HEADER - TÀI XẾ */}
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

      {/* BOTTOM NAV ĐÃ BỔ SUNG "CÁ NHÂN" */}
      <div style={bottomNavContainer}>
        {/* Tab Trang chủ */}
        <div 
          onClick={() => onNavigate('home')}
          style={{
            ...navItemStyle,
            ...(currentPage === 'home' || currentPage === '' ? activeNavStyle : {})
          }}
        >
          <div style={navIcon}>🏠</div>
          <div style={navText}>Trang chủ</div>
        </div>

        {/* Tab Cá nhân */}
        <div 
          onClick={() => onNavigate('ca-nhan')}
          style={{
            ...navItemStyle,
            ...(currentPage === 'ca-nhan' ? activeNavStyle : {})
          }}
        >
          <div style={navIcon}>👤</div>
          <div style={navText}>Cá nhân</div>
        </div>
      </div>
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

const title = { margin: 0, fontSize: '22px', fontWeight: '800' };

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

/* ==================== BOTTOM NAV STYLES ==================== */
const bottomNavContainer: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '80px',
  background: 'white',
  borderTop: '1px solid #e0d4ff',
  display: 'flex',
  boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
  zIndex: 1000
};

const navItemStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64748b',
  fontSize: '12px',
  cursor: 'pointer',
  paddingTop: '8px'
};

const activeNavStyle: React.CSSProperties = {
  color: '#4c1d95',
  fontWeight: '700'
};

const navIcon: React.CSSProperties = {
  fontSize: '26px',
  marginBottom: '4px'
};

const navText: React.CSSProperties = {
  fontSize: '12px'
};

export default ShipLayout;