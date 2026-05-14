// src/layouts/AdminLayout.tsx
import React from 'react';
import BottomNav from '../components/BottomNav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {

  return (
    <div style={container}>
      {/* Admin Header */}
      <div style={adminHeader}>
        <h2 style={adminTitle}>GHN.PI - ADMIN</h2>
        <div style={roleBadge}>👑 Quản trị viên</div>
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

const adminHeader = {
  background: '#1e2937',
  color: '#fff',
  padding: '16px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const adminTitle = { margin: 0, fontSize: '22px', fontWeight: '800' };
const roleBadge = { 
  background: '#eab308', 
  color: '#1e2937', 
  padding: '6px 14px', 
  borderRadius: '9999px', 
  fontWeight: '700',
  fontSize: '14px'
};

const mainContent = {
  padding: '20px 16px'
};

export default AdminLayout;