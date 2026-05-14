<<<<<<< HEAD
// src/pages/HomePage.tsx
import React from 'react';
=======
>>>>>>> parent of e55601f (Update HomePage.tsx)
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
<<<<<<< HEAD
    <div style={pageContainer}>
      <div style={header}>
        <h1 style={logo}>GHN.PI</h1>
        <p style={tagline}>Vận chuyển nhanh - Thanh toán bằng Pi</p>
      </div>

      {!isAuthenticated && (
        <button onClick={handleLogin} style={piButton}>
          <span style={piIcon}>π</span>
          Đăng nhập với Pi Network
=======
    <div style={{
      minHeight: '100vh',
      overflowY: 'auto',
      paddingBottom: '140px',     // ← TĂNG LÊN để lộ rõ 2 card dưới cùng
      backgroundColor: '#0f172a'
    }}>
      {/* ==================== HEADER - LOGO ==================== */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '25px',
        paddingTop: '20px'
      }}>
        <div 
          onClick={() => navigate('/')}
          style={neonLogoStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 45px #22d3ee, 0 0 70px rgba(34, 211, 238, 0.8)';
            e.currentTarget.style.borderColor = '#67e8f9';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px #22d3ee';
            e.currentTarget.style.borderColor = '#22d3ee';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ fontSize: '52px' }}>🚚</div>
          <div>
            <h1 style={logoTitleStyle}>GHN.PI</h1>
            <p style={logoSubtitleStyle}>Logistics Ecosystem v14 Pro</p>
          </div>
        </div>
      </div>

      {/* NÚT ĐĂNG NHẬP VỚI PI */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '35px' }}>
        <button 
          onClick={() => alert('🔗 Đang kết nối với Pi Network...')}
          style={piButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 45px #c026d3, 0 0 70px rgba(192, 38, 211, 0.8)';
            e.currentTarget.style.borderColor = '#e879f9';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px #c026d3';
            e.currentTarget.style.borderColor = '#c026d3';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⭐ Đăng nhập với Pi
>>>>>>> parent of e55601f (Update HomePage.tsx)
        </button>
      )}

<<<<<<< HEAD
      <div style={cardsContainer}>
        {cards.map((card, index) => (
          <div 
            key={index} 
            style={cardStyle(card.color)}
            onClick={() => navigate(card.path)}
=======
      {/* 6 CARDS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px',
        padding: '0 16px'
      }}>
        {cards.map((card) => (
          <div
            key={card.path}
            onClick={() => navigate(card.path)}
            style={neonCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#22d3ee';
              e.currentTarget.style.boxShadow = '0 0 35px #22d3ee, 0 0 55px rgba(34, 211, 238, 0.6)';
              e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#334155';
              e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
>>>>>>> parent of e55601f (Update HomePage.tsx)
          >
            <div style={emojiStyle}>{card.emoji}</div>
            <h3 style={cardTitle}>{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

<<<<<<< HEAD
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
=======
/* ====================== DATA ====================== */
const cards = [
  { icon: "📦", title: "GỬI HÀNG", desc: "Tạo đơn nhanh", path: "/gui-hang" },
  { icon: "📊", title: "TRA CỨU CƯỚC PHÍ", desc: "Ước tính nhanh", path: "/tra-cuu-cuoc" },
  { icon: "🏬", title: "QUẢN LÝ KHO TRUNG CHUYỂN", desc: "Dành cho Đối tác Kho hàng", path: "/kho-hub" },
  { icon: "🏍️", title: "TÀI XẾ", desc: "Nhận đơn ngay", path: "/tai-xe" },
  { icon: "📍", title: "TRACKING", desc: "Theo dõi đơn hàng realtime", path: "/tracking" },
  { icon: "🖐️", title: "NHẬN HÀNG", desc: "Xác nhận đã nhận hàng", path: "/nhan-hang" },
];

/* ====================== STYLES ====================== */
const neonLogoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '14px 24px',
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '2px solid #22d3ee',
  borderRadius: '20px',
  cursor: 'pointer',
  boxShadow: '0 0 30px #22d3ee',
  transition: 'all 0.4s ease',
};

const logoTitleStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  margin: 0,
  color: '#e2e8f0',
  textShadow: '0 0 20px #22d3ee',
};

const logoSubtitleStyle = {
  color: '#94a3b8',
  margin: 0,
  fontSize: '14px',
};

const piButtonStyle = {
  padding: '16px 36px',
  background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
  color: 'white',
  border: '2px solid #c026d3',
  borderRadius: '9999px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 0 30px #c026d3',
  transition: 'all 0.4s ease',
};

const neonCardStyle = {
  backgroundColor: '#1e2937',
  padding: '24px 16px',
  borderRadius: '20px',
  border: '2px solid #334155',
>>>>>>> parent of e55601f (Update HomePage.tsx)
  textAlign: 'center' as const,
  border: `2px solid ${color}`,
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  cursor: 'pointer',
<<<<<<< HEAD
  transition: 'transform 0.2s'
});

const emojiStyle = { fontSize: '42px', marginBottom: '12px' };
const cardTitle = { margin: 0, color: '#4c1d95', fontWeight: '700', fontSize: '15.5px' };

export default HomePage;
=======
  transition: 'all 0.4s ease',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  height: '100%',
};

const iconStyle = { 
  fontSize: '48px', 
  marginBottom: '14px' 
};

const titleStyle = { 
  fontSize: '18px', 
  fontWeight: 'bold', 
  margin: '0 0 6px 0', 
  color: '#e2e8f0' 
};

const descStyle = { 
  color: '#94a3b8', 
  fontSize: '13.5px', 
  margin: 0 
};
>>>>>>> parent of e55601f (Update HomePage.tsx)
