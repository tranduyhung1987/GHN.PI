import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

declare global {
  interface Window {
    Pi: any;
  }
}

interface ShopLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ 
  children, 
  onNavigate, 
  currentPage 
}) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');
  const [role, setRole] = useState<string>('shop');

  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then((user: any) => {
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Member');
        })
        .catch(() => setIsPiConnected(false));
    }
  }, []);

  return (
    <div style={container}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🛒</span>
          <h2 style={title}>GHN.PI</h2>
        </div>

        <div style={rightSection}>
          {isPiConnected ? (
            <div style={piBadge}>✅ @{piUsername}</div>
          ) : (
            <div style={piBadge}>🔗 Pi Network</div>
          )}
          <div style={roleBadge}>
            {role === 'shop' && '🛒 Shop'}
            {role === 'driver' && '🏍️ Tài Xế'}
            {role === 'warehouse' && '🏬 Kho Hub'}
            {role === 'admin' && '👑 Admin'}
            {role === 'sender' && '📦 Sender'}
          </div>
        </div>
      </div>

      <main style={mainContent}>
        {children}
      </main>

      <BottomNav onNavigate={onNavigate} currentPage={currentPage} />
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

const header = {
  background: '#4c1d95',
  color: '#fff',
  padding: '14px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const title = { margin: 0, fontSize: '22px', fontWeight: '700' };

const rightSection = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const roleBadge = { 
  fontSize: '14px', 
  padding: '6px 14px', 
  background: 'rgba(255,255,255,0.25)', 
  borderRadius: '9999px',
  fontWeight: '600'
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
  padding: '16px'
};

export default ShopLayout;