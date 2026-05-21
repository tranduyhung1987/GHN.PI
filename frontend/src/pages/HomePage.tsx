// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DangNhapModal from '../components/Modal/DangNhapModal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, piUsername } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (window.Pi) {
      window.Pi.init({ version: "2.0" }).catch(console.warn);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>GHN.PI</h1>
        <p>Chào mừng {piUsername || 'bạn'} đã quay trở lại!</p>
      </header>

      <div style={gridStyle}>
        <button style={btnStyle} onClick={() => navigate('/gui-hang')}>📦 Gửi hàng</button>
        <button style={btnStyle} onClick={() => navigate('/nhan-hang')}>📥 Nhận hàng</button>
        <button style={btnStyle} onClick={() => navigate('/kho-hub')}>🏢 Kho Hub</button>
        <button style={btnStyle} onClick={() => navigate('/tracking')}>🔍 Tra cứu</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button style={loginBtnStyle} onClick={() => setShowLoginModal(true)}>
          {piUsername ? `Đang kết nối: ${piUsername}` : 'Đăng nhập Pi'}
        </button>
      </div>

      {showLoginModal && (
        <DangNhapModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}
    </div>
  );
};

// Đặt Styles ở đây để TypeScript nhận diện được trước khi dùng trong hàm return
const containerStyle: React.CSSProperties = { padding: '20px', minHeight: '100vh', background: '#f8fafc' };
const headerStyle: React.CSSProperties = { marginBottom: '30px', textAlign: 'center' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const btnStyle: React.CSSProperties = { 
  padding: '20px', borderRadius: '16px', border: 'none', background: 'white', 
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '16px', fontWeight: '600', color: '#4c1d95', cursor: 'pointer' 
};
const loginBtnStyle: React.CSSProperties = { 
  width: '100%', padding: '15px', borderRadius: '12px', border: 'none', 
  background: '#4c1d95', color: 'white', fontWeight: 'bold', cursor: 'pointer' 
};

export default HomePage;