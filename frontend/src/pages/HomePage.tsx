// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated, loginWithPi } = useAuth();

  const handlePiLogin = async () => {
    await loginWithPi();
    navigate('/dang-ky-vai-tro');
  };

  const featureCards = [
    { emoji: "📦", title: "Gửi Hàng", path: "/gui-hang" },
    { emoji: "🔎", title: "Tra Cước", path: "/tra-cuu-cuoc" },
    { emoji: "🚚", title: "Tracking", path: "/tracking" },
    { emoji: "📥", title: "Nhận Hàng", path: "/nhan-hang" },
    { emoji: "🏍️", title: "Tài Xế", path: "/tai-xe" },
    { emoji: "🏬", title: "Kho Hub", path: "/kho-hub" },
  ];

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={header}>
        <h1 style={logo}>GHN.PI</h1>
        <p style={tagline}>Vận chuyển nhanh • Thanh toán bằng Pi</p>
      </div>

      {/* Pi Login Button */}
      {!isAuthenticated && (
        <button onClick={handlePiLogin} style={piButton}>
          <span style={piIcon}>π</span>
          Đăng nhập với Pi Network
        </button>
      )}

      {/* Feature Cards */}
      <div style={cardsGrid}>
        {featureCards.map((card, index) => (
          <div
            key={index}
            style={cardStyle}
            onClick={() => navigate(card.path)}
          >
            <div style={emojiStyle}>{card.emoji}</div>
            <h3 style={cardTitle}>{card.title}</h3>
          </div>
        ))}
      </div>

      {/* Welcome Message */}
      {isAuthenticated && role !== 'guest' && (
        <div style={welcomeBox}>
          Chào mừng <strong>
            {role === 'shop' ? 'Chủ Shop' : 
             role === 'driver' ? 'Tài Xế' : 
             role === 'warehouse' ? 'Kho Hub' : 'Admin'}
          </strong>!
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '20px 14px 100px',
  boxSizing: 'border-box' as const,
};

const header = { textAlign: 'center' as const, marginBottom: '40px' };
const logo = { fontSize: '48px', fontWeight: '900', color: '#4c1d95', margin: 0, letterSpacing: '-2px' };
const tagline = { color: '#6b21a8', fontSize: '16px', marginTop: '8px' };

const piButton = {
  display: 'block',
  width: '100%',
  maxWidth: '340px',
  margin: '0 auto 40px',
  padding: '16px 24px',
  background: 'linear-gradient(90deg, #6b21a8, #7c3aed)',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
  cursor: 'pointer',
};

const piIcon = { marginRight: '12px', fontSize: '24px' };

const cardsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '16px',
};

const cardStyle = {
  background: '#fff',
  padding: '24px 16px',
  borderRadius: '20px',
  border: '2px solid #c4b5fd',
  textAlign: 'center' as const,
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
};

const emojiStyle = { fontSize: '42px', marginBottom: '12px' };
const cardTitle = { margin: 0, fontSize: '15.5px', fontWeight: '700', color: '#4c1d95' };

const welcomeBox = {
  marginTop: '30px',
  padding: '16px',
  background: '#ede9fe',
  borderRadius: '16px',
  textAlign: 'center' as const,
  color: '#4c1d95',
  fontWeight: '600',
};

export default HomePage;