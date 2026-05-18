import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

declare global {
  interface Window {
    Pi: any;
  }
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');

  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then((user: any) => {
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Admin');
        })
        .catch(() => setIsPiConnected(false));
    }
  }, []);

  // Dummy navigate cho Admin (có thể mở rộng sau)
  const handleNavigate = (page: string) => {
    console.log('Admin navigate to:', page);
    // Nếu cần chuyển trang thật thì dùng window.location hoặc context
  };

  return (
    <div style={container}>
      {/* Admin Header */}
      <div style={adminHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>👑</div>
          <h2 style={adminTitle}>GHN.PI - ADMIN</h2>
        </div>
        
        <div style={rightHeader}>
          {isPiConnected ? (
            <div style={piBadge}>✅ @{piUsername}</div>
          ) : (
            <div style={piBadge}>🔗 Pi Network</div>
          )}
          <div style={roleBadge}>Quản trị viên</div>
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

const rightHeader = { display: 'flex', alignItems: 'center', gap: '12px' };

const roleBadge = { 
  background: '#eab308', 
  color: '#1e2937', 
  padding: '6px 14px', 
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

const mainContent = { padding: '20px 16px' };

export default AdminLayout;