// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { role, loginWithPi, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await loginWithPi();
    navigate('/dang-ky-vai-tro');
  };

  const cards = [
    { title: "Gửi Hàng", emoji: "📦", path: "/gui-hang", color: "#22d3ee" },
    { title: "Tra Cước", emoji: "🔎", path: "/tra-cuu-cuoc", color: "#a855f7" },
    { title: "Tracking", emoji: "🚚", path: "/tracking", color: "#eab308" },
    { title: "Nhận Hàng", emoji: "📥", path: "/nhan-hang", color: "#10b981" },
    { title: "Tài Xế", emoji: "🏍️", path: "/tai-xe", color: "#f97316" },
    { title: "Kho Hub", emoji: "🏬", path: "/kho-hub", color: "#8b5cf6" },
  ];

  return (
    <div style={pageContainer}>
      <div style={header}>
        <h1 style={logo}>GHN.PI</h1>
        <p style={tagline}>Vận chuyển nhanh - Thanh toán bằng Pi</p>
      </div>

      {!isAuthenticated && (
        <button onClick={handleLogin} style={piButton}>
          <span style={piIcon}>π</span>
          Đăng nhập với Pi Network
        </button>
      )}

      <div style={cardsContainer}>
        {cards.map((card, index) => (
          <div 
            key={index} 
            style={cardStyle(card.color)}
            onClick={() => navigate(card.path)}
          >
            <div style={emojiStyle}>{card.emoji}</div>
            <h3 style={cardTitle}>{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '20px 14px 100px',
  boxSizing: 'border-box' as const
};

const header = { textAlign: 'center' as const, marginBottom: '30px' };
const logo = { fontSize: '42px', fontWeight: '900', color: '#4c1d95', margin: 0, letterSpacing: '-2px' };
const tagline = { color: '#6b21a8', marginTop: '8px', fontSize: '16px' };

const piButton = {
  width: '100%',
  maxWidth: '340px',
  margin: '0 auto 40px',
  display: 'block',
  padding: '16px 24px',
  background: 'linear-gradient(90deg, #6b21a8, #7c3aed)',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
  cursor: 'pointer'
};

const piIcon = { marginRight: '12px', fontSize: '22px' };

const cardsContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '16px'
};

const cardStyle = (color: string) => ({
  background: '#fff',
  padding: '24px 16px',
  borderRadius: '20px',
  textAlign: 'center' as const,
  border: `2px solid ${color}`,
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  cursor: 'pointer',
  transition: 'transform 0.2s'
});

const emojiStyle = { fontSize: '42px', marginBottom: '12px' };
const cardTitle = { margin: 0, color: '#4c1d95', fontWeight: '700', fontSize: '15.5px' };

export default HomePage;