import React from 'react';   // Giữ lại vì có thể dùng JSX

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

      {/* Nút test Modal */}
      <div className="p-4">
        <button
          onClick={() => {
            // Gọi từ HomePage thông qua onNavigate (sẽ cải tiến sau)
            alert("Modal sẽ được mở từ App.tsx");
          }}
          className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg"
        >
          🧪       {/* Nút test Modal */}
      <div className="p-4">
        <button
          onClick={() => {
            // Gọi Modal từ App.tsx
            window.dispatchEvent(new CustomEvent('openModal', { 
              detail: {
                title: "Chào mừng đến GHN.PI",
                children: (
                  <div className="text-center">
                    <p className="mb-4">Bạn muốn đăng nhập bằng Pi Network ngay bây giờ?</p>
                    <p className="text-sm text-gray-500">Hệ thống sẽ kết nối ví Pi an toàn.</p>
                  </div>
                ),
                onConfirm: () => alert("✅ Đang chuyển sang đăng nhập Pi...")
              }
            }));
          }}
          className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg"
        >
          🧪 Test Mở Modal
        </button>
      </div>
        </button>
      </div>

      {/* Pi Login Button */}
      <div style={piButtonContainer}>
        <button style={piButton} onClick={() => alert('🔗 Đang kết nối Pi Network...')}>
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

const piButtonContainer = { display: 'flex', justifyContent: 'center', marginBottom: '40px' };
const piButton = {
  padding: '16px 40px',
  background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)'
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