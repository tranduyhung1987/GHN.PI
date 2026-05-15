// src/layouts/ShipLayout.tsx
import React from 'react';
import BottomNav from '../components/BottomNav';

interface ShipLayoutProps {
  children: React.ReactNode;
}

const ShipLayout: React.FC<ShipLayoutProps> = ({ children }) => {
  return (
    <div style={container}>
      {/* Header cho Tài Xế */}
      <div style={shipHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🏍️</span>
          <h2 style={title}>GHN.PI - TÀI XẾ</h2>
        </div>
        <div style={roleBadge}>🚀 Tài Xế Giao Hàng</div>
      </div>

      <main style={mainContent}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
};

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

const roleBadge = { 
  background: '#22d3ee', 
  color: '#0f172a', 
  padding: '6px 16px', 
  borderRadius: '9999px', 
  fontWeight: '700',
  fontSize: '14px'
};

const mainContent = {
  padding: '20px 16px'
};

export default ShipLayout;