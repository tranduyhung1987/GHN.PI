import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

declare global {
  interface Window {
    Pi: any;
  }
}

// FIX LỖI ĐỎ: Bổ sung định nghĩa cấu trúc props nhận thuộc tính điều hướng
interface KhoHubLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const KhoHubLayout: React.FC<KhoHubLayoutProps> = ({ 
  children, 
  onNavigate, 
  currentPage 
}) => {
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

  return (
    <div style={container}>
      {/* Header riêng cho Kho Trung Chuyển */}
      <div style={khoHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>📦</span>
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

      {/* ĐỒNG BỘ ĐIỀU HƯỚNG THỜI GIAN THỰC */}
      <BottomNav onNavigate={onNavigate} currentPage={currentPage} />
    </div>
  );
};

/* ===================== STYLES ===================== */
const container = {
  minHeight: '100vh',
  background: '#f3e8ff',
  paddingBottom: '16px 14px 90px',
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
  padding: '16px 14px'
};

export default KhoHubLayout;