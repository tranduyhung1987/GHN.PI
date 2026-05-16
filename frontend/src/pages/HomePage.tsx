import React from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const cards = [
    { icon: "📦", title: "GỬI HÀNG", desc: "Tạo đơn nhanh chóng", page: "gui-hang" },
    { icon: "📊", title: "TRA CỨU CƯỚC", desc: "Ước tính ngay lập tức", page: "tra-cuu-cuoc" },
    { icon: "🏬", title: "KHO TRUNG CHUYỂN", desc: "Dành cho đối tác kho", page: "kho-hub" },
    { icon: "🏍️", title: "TÀI XẾ", desc: "Nhận đơn & giao hàng", page: "tai-xe" },
    { icon: "📍", title: "TRACKING", desc: "Theo dõi realtime", page: "tracking" },
    { icon: "🖐️", title: "NHẬN HÀNG", desc: "Xác nhận đã nhận", page: "nhan-hang" },
  ];

  return (
    <div style={pageContainer}>
      {/* Logo Header */}
      <div style={logoContainer}>
        <div style={logoStyle}>
          🚚 GHN.PI
        </div>
        <p style={subtitleStyle}>Logistics Ecosystem • Pi Network</p>
      </div>

      {/* Nút Đăng nhập Pi Network - Mở Modal + Toast */}
      <div style={piButtonContainer}>
        <button 
          style={piButton}
          onClick={() => {
            window.dispatchEvent(new CustomEvent('openModal', { 
              detail: {
                title: "Chào mừng đến GHN.PI",
                children: (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '16px', fontSize: '18px' }}>
                      Bạn muốn đăng nhập bằng Pi Network ngay bây giờ?
                    </p>
                    <p style={{ fontSize: '14.5px', color: '#64748b' }}>
                      Hệ thống sẽ kết nối ví Pi an toàn và nhanh chóng.
                    </p>
                  </div>
                ),
                confirmText: "🚀 Đăng nhập Pi Network",
                onConfirm: () => {
                  // Gọi Toast đẹp thay vì alert
                  window.dispatchEvent(new CustomEvent('showToast', { 
                    detail: { 
                      message: "Đang kết nối Pi Network...", 
                      type: "success" 
                    } 
                  }));
                }
              }
            }));
          }}
        >
          ⭐ Đăng nhập với Pi Network
        </button>
      </div>

      {/* 6 Cards */}
      <div style={cardsGrid}>
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => onNavigate(card.page)}
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
const pageContainer = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)',
  padding: '20px 14px 100px',
  boxSizing: 'border-box' as const
};

const logoContainer = { textAlign: 'center' as const, marginBottom: '30px' };
const logoStyle = { fontSize: '52px', fontWeight: '700', color: '#4c1d95' };
const subtitleStyle = { color: '#6b21a8', marginTop: '4px' };

const piButtonContainer = { 
  display: 'flex', 
  justifyContent: 'center', 
  marginBottom: '40px',
  padding: '0 14px'
};

const piButton = {
  padding: '18px 40px',
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '17px',
  cursor: 'pointer',
  boxShadow: '0 6px 20px rgba(76, 29, 149, 0.35)',
  width: '100%',
  maxWidth: '340px'
};

const cardsGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px'
};

const cardStyle = {
  background: 'white',
  padding: '24px 16px',
  borderRadius: '20px',
  textAlign: 'center' as const,
  border: '1px solid #e0d4ff',
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const iconStyle = { fontSize: '48px', marginBottom: '12px' };
const cardTitle = { fontSize: '17px', fontWeight: '700', color: '#4c1d95', margin: '0 0 6px 0' };
const cardDesc = { fontSize: '13.5px', color: '#64748b', margin: 0 };

export default HomePage;