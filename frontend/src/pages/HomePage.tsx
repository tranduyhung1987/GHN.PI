import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

interface HomePageProps {
  onNavigate: (page: string) => void;
  userRole?: string;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, userRole = '' }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>('');

  useEffect(() => {
    // Lấy role từ localStorage
    const savedRole = localStorage.getItem('userRole') || userRole || '';
    setCurrentRole(savedRole);

    if (window.Pi) {
      window.Pi.init({ version: "2.0" })
        .then(() => console.log("✅ Pi SDK initialized successfully"))
        .catch((err: any) => console.warn("Pi SDK init warning:", err));
    }
  }, [userRole]);

  const handlePiLogin = async () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      const mockUser = "ThanhPiUser";
      setIsPiConnected(true);
      setPiUsername(mockUser);
      alert(`🎉 ĐĂNG NHẬP THÀNH CÔNG!\n\nUsername: @${mockUser}`);
      setIsAuthenticating(false);
    }, 800);
  };

  const handleCardClick = (page: string) => {
    if (!isPiConnected) {
      alert("⚠️ Vui lòng đăng nhập Pi Network trước khi sử dụng!");
      return;
    }
    onNavigate(page);
  };

  // ================== DANH SÁCH CARD THEO ROLE ==================
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
      case 'sender':
        return allCards.filter(c => ['gui-hang', 'tra-cuu-cuoc', 'tracking', 'nhan-hang'].includes(c.page));
      
      case 'driver':
        return allCards.filter(c => ['tai-xe', 'tracking', 'nhan-hang'].includes(c.page));
      
      case 'warehouse':
        return allCards.filter(c => ['kho-hub', 'tracking'].includes(c.page));
      
      case 'receiver':
        return allCards.filter(c => ['nhan-hang', 'tracking', 'khieu-nai'].includes(c.page)); // khieu-nai nếu có
      
      default: // Guest hoặc chưa chọn role
        return allCards;
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
        
        {currentRole && (
          <p style={{ color: '#4c1d95', fontWeight: '600', marginTop: '4px' }}>
            Vai trò: <strong>{currentRole === 'sender' ? 'Người Gửi Hàng' : 
                              currentRole === 'driver' ? 'Tài Xế' : 
                              currentRole === 'warehouse' ? 'Kho Trung Chuyển' : 
                              currentRole === 'receiver' ? 'Người Nhận Hàng' : currentRole}</strong>
          </p>
        )}
      </div>

      <div style={piButtonContainer}>
        <button style={piButton} onClick={handlePiLogin} disabled={isAuthenticating}>
          {isAuthenticating ? 'Đang kết nối...' : isPiConnected ? '🔄 Kết nối lại' : '⭐ Đăng nhập với Pi Network'}
        </button>
      </div>

      <div style={cardsGrid}>
        {cards.map((card, index) => (
          <div 
            key={index} 
            onClick={() => handleCardClick(card.page)} 
            style={cardStyle}
          >
            <div style={iconStyle}>{card.icon}</div>
            <h3 style={cardTitle}>{card.title}</h3>
            <p style={cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>
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