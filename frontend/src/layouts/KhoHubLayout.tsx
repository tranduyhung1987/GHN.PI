// src/layouts/KhoHubLayout.tsx
import React from 'react';
import BottomNav from '../components/BottomNav';

interface KhoHubLayoutProps {
  children: React.ReactNode;
}

const KhoHubLayout: React.FC<KhoHubLayoutProps> = ({ children }) => {
  return (
    <div style={container}>
      {/* Header riêng cho Kho Trung Chuyển */}
      <div style={khoHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>🏬</span>
          <h2 style={title}>GHN.PI - KHO TRUNG CHUYỂN</h2>
        </div>
        <div style={roleBadge}>📦 Kho Hub • Minh bạch On-chain</div>
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

const khoHeader = {
  background: '#1e3a8a',           // Màu xanh đậm phù hợp với kho
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
  background: '#67e8f9', 
  color: '#0f172a', 
  padding: '6px 16px', 
  borderRadius: '9999px', 
  fontWeight: '700',
  fontSize: '14px'
};

const mainContent = {
  padding: '20px 16px'
};

export default KhoHubLayout;