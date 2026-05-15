import React from 'react';
import DangNhapModal from '../components/Modal/DangNhapModal';

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLogin, setShowLogin] = React.useState(false);

  return (
    <div>
      {/* Header chung cho Guest */}
      <div style={{
        background: '#4c1d95',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h2>GHN.PI</h2>
        <button 
          onClick={() => setShowLogin(true)}
          style={{
            background: '#22d3ee',
            color: '#0f172a',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '9999px',
            fontWeight: 'bold'
          }}
        >
          Đăng nhập
        </button>
      </div>

      <main>{children}</main>

      <DangNhapModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </div>
  );
};

export default GuestLayout;