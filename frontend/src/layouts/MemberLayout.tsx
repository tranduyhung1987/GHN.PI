// src/layouts/MemberLayout.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MemberLayoutProps {
  children: React.ReactNode;
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
  const { role } = useAuth();

  return (
    <div style={container}>
      {/* Header chung cho Member */}
      <div style={header}>
        <h2 style={title}>GHN.PI</h2>
        <div style={roleBadge}>
          {role === 'shop' && '🛒 Shop'}
          {role === 'driver' && '🏍️ Tài Xế'}
          {role === 'warehouse' && '🏬 Kho Hub'}
          {role === 'admin' && '👑 Admin'}
        </div>
      </div>

      <main style={mainContent}>
        {children}
      </main>
    </div>
  );
};

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

const title = { margin: 0, fontSize: '20px', fontWeight: '700' };
const roleBadge = { fontSize: '14px', padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px' };

const mainContent = {
  padding: '16px'
};

export default MemberLayout;