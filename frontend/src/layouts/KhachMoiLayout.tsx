import React, { useState } from 'react';
import DangNhapModal from '../components/Modal/DangNhapModal';

interface KhachMoiLayoutProps {
  children: React.ReactNode;
}

const KhachMoiLayout: React.FC<KhachMoiLayoutProps> = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={pageContainer}>
      {/* Guest Header */}
      <div style={guestHeader}>
        <div style={logo}>
          🚚 GHN.PI
        </div>
        <p style={subtitle}>Giao hàng nhanh • Thanh toán bằng Pi</p>

        <button 
          onClick={() => setShowLogin(true)}
          style={loginButton}
        >
          ⭐ Đăng nhập Pi Network
        </button>
      </div>

      <main style={mainContent}>
        {children}
      </main>

      <DangNhapModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  boxSizing: 'border-box'
};

const guestHeader: React.CSSProperties = {
  background: '#4c1d95',
  color: 'white',
  padding: '20px 16px',
  textAlign: 'center' as const,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
};

const logo: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: '800',
  marginBottom: '8px'
};

const subtitle: React.CSSProperties = {
  color: '#c4b5fd',
  marginBottom: '20px',
  fontSize: '15px'
};

const loginButton: React.CSSProperties = {
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  padding: '14px 32px',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 6px 20px rgba(34,211,238,0.4)'
};

const mainContent: React.CSSProperties = {
  padding: '16px 14px',
  paddingBottom: '100px'
};

export default KhachMoiLayout;