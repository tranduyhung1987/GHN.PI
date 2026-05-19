import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import DangNhapModal from '../components/Modal/DangNhapModal';

interface HomePageProps {
  onNavigate: (page: string) => void;
  userRole?: string;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, userRole = '' }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Load từ localStorage
    const savedRole = localStorage.getItem('userRole') || userRole || '';
    const savedPi = localStorage.getItem('piUsername');
    
    setCurrentRole(savedRole);
    
    if (savedPi) {
      setIsPiConnected(true);
      setPiUsername(savedPi);
    }

    if (window.Pi) {
      window.Pi.init({ version: "2.0" })
        .then(() => console.log("✅ Pi SDK initialized successfully"))
        .catch((err: any) => console.warn("Pi SDK init warning:", err));
    }
  }, [userRole]);

  // ===================== LOGIN SUCCESS =====================
  const handleLoginSuccess = (username: string) => {
    setIsPiConnected(true);
    setPiUsername(username);
    setShowLoginModal(false);

    // Lưu thông tin
    localStorage.setItem('piUsername', username);
    localStorage.setItem('currentPage', 'dang-ky-vai-tro');

    // Force chuyển trang ngay lập tức
    setTimeout(() => {
      window.location.reload();   // ← Đây là chìa khóa
    }, 200);
  };

  const handleCardClick = (page: string) => {
    if (!isPiConnected) {
      alert("⚠️ Vui lòng đăng nhập Pi Network trước khi sử dụng!");
      return;
    }
    onNavigate(page);
  };

  const handleRegisterRoleClick = () => {
    if (isPiConnected) {
      localStorage.setItem('currentPage', 'dang-ky-vai-tro');
      window.location.reload();
    } else {
      setShowLoginModal(true);
    }
  };

  // Card theo role
  const getCardsByRole = () => {
    const allCards = [
      { icon: "📦", title: "GỬI HÀNG", desc: "Tạo đơn & thanh toán Pi", page: "gui-hang" },
      { icon: "📊", title: "TRA CỨU CƯỚC", desc: "Ước tính ngay", page: "tra-cuu-cuoc" },
      { icon: "🏬", title: "KHO TRUNG CHUYỂN", desc: "Đối tác kho", page: "kho-hub" },
      { icon: "🏍️", title: "TÀI XẾ", desc: "Nhận đơn giao hàng", page: "tai-xe" },
      { icon: "📍", title: "TRACKING", desc: "Theo dõi realtime", page: "tracking" },
      { icon: "🖐️", title: "NHẬN HÀNG", desc: "Xác nhận nhận hàng", page: "nhan-hang" },
    ];

    switch (currentRole) {
      case 'sender': return allCards.filter(c => ['gui-hang', 'tra-cuu-cuoc', 'tracking'].includes(c.page));
      case 'driver': return allCards.filter(c => ['tai-xe', 'tracking'].includes(c.page));
      case 'warehouse': return allCards.filter(c => ['kho-hub', 'tracking'].includes(c.page));
      case 'receiver': return allCards.filter(c => ['nhan-hang', 'tracking'].includes(c.page));
      default: return allCards;
    }
  };

  const cards = getCardsByRole();

  return (
    <div style={pageContainer}>
      <div style={logoContainer}>
        <div style={logoStyle}>🚚 GHN.PI</div>
        <p style={subtitleStyle}>Giao hàng nhanh • Thanh toán bằng Pi</p>
        
        {isPiConnected && (
          <p style={{ color: '#22d3ee', fontWeight: '600', marginTop: '8px' }}>
            ✅ Đã kết nối @{piUsername}
          </p>
        )}
      </div>

      <div style={piButtonContainer}>
        <button style={piButton} onClick={() => setShowLoginModal(true)}>
          {isPiConnected ? '🔄 Kết nối lại' : '⭐ Đăng nhập với Pi Network'}
        </button>
      </div>

      <div style={cardsGrid}>
        {cards.map((card, index) => (
          <div key={index} onClick={() => handleCardClick(card.page)} style={cardStyle}>
            <div style={iconStyle}>{card.icon}</div>
            <h3 style={cardTitle}>{card.title}</h3>
            <p style={cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <DangNhapModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <BottomNav 
        onNavigate={(page) => {
          if (page === 'dang-ky-vai-tro') {
            handleRegisterRoleClick();
          } else {
            onNavigate(page);
          }
        }} 
      />
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = { 
  minHeight: '100vh', 
  background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)', 
  padding: '20px 14px 100px', 
  boxSizing: 'border-box' 
};

const logoContainer: React.CSSProperties = { textAlign: 'center' as const, marginBottom: '30px' };
const logoStyle: React.CSSProperties = { fontSize: '52px', fontWeight: '700', color: '#4c1d95' };
const subtitleStyle: React.CSSProperties = { color: '#6b21a8', marginTop: '4px' };

const piButtonContainer: React.CSSProperties = { 
  display: 'flex', justifyContent: 'center', marginBottom: '40px', padding: '0 14px' 
};
const piButton: React.CSSProperties = { 
  padding: '18px 40px', 
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', 
  color: 'white', 
  border: 'none', 
  borderRadius: '9999px', 
  fontWeight: '700', 
  fontSize: '17px', 
  cursor: 'pointer', 
  width: '100%', 
  maxWidth: '340px' 
};

const cardsGrid: React.CSSProperties = { 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '16px' 
};

const cardStyle: React.CSSProperties = { 
  background: 'white', 
  padding: '24px 16px', 
  borderRadius: '20px', 
  textAlign: 'center' as const, 
  border: '1px solid #e0d4ff', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)', 
  cursor: 'pointer' 
};

const iconStyle: React.CSSProperties = { fontSize: '48px', marginBottom: '12px' };
const cardTitle: React.CSSProperties = { fontSize: '17px', fontWeight: '700', color: '#4c1d95', margin: '0 0 6px 0' };
const cardDesc: React.CSSProperties = { fontSize: '13.5px', color: '#64748b', margin: 0 };

export default HomePage;