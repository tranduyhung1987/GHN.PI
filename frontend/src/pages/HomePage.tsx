// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={pageContainer}>
      {/* HEADER - LOGO */}
      <div style={headerContainer}>
        <div 
          onClick={() => navigate('/')}
          style={logoStyle}
        >
          <div style={{ fontSize: '56px' }}>🚚</div>
          <div>
            <h1 style={logoTitle}>GHN.PI</h1>
            <p style={logoSubtitle}>Logistics Ecosystem • Pi Network</p>
          </div>
        </div>
      </div>

      {/* NÚT ĐĂNG NHẬP PI - ĐÃ THAY MÀU TÍM & LOGO π */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px', padding: '0 14px' }}>
        <button 
          onClick={() => alert('🔗 Đang kết nối với Pi Network...')}
          style={piButtonStyle}
        >
          <div style={piLogoCircle}>π</div>
          Đăng nhập với Pi Network
        </button>
      </div>

      {/* SERVICE CARDS */}
      <div style={gridContainer}>
        {cards.map((card) => (
          <div
            key={card.path}
            onClick={() => navigate(card.path)}
            style={cardStyle}
          >
            <div style={iconStyle}>{card.icon}</div>
            <h3 style={titleStyle}>{card.title}</h3>
            <p style={descStyle}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================== DATA ====================== */
const cards = [
  { icon: "📦", title: "GỬI HÀNG", desc: "Tạo đơn nhanh chóng", path: "/gui-hang" },
  { icon: "📊", title: "TRA CỨU CƯỚC", desc: "Ước tính ngay lập tức", path: "/tra-cuu-cuoc" },
  { icon: "🏬", title: "KHO TRUNG CHUYỂN", desc: "Dành cho đối tác kho", path: "/kho-hub" },
  { icon: "🏍️", title: "TÀI XẾ", desc: "Nhận đơn & giao hàng", path: "/tai-xe" },
  { icon: "📍", title: "TRACKING", desc: "Theo dõi realtime", path: "/tracking" },
  { icon: "🖐️", title: "NHẬN HÀNG", desc: "Xác nhận nhận hàng", path: "/nhan-hang" },
];

/* ====================== STYLES ====================== */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  paddingBottom: '120px',
  boxSizing: 'border-box' as const
} as const;

const headerContainer = {
  display: 'flex',
  justifyContent: 'center',
  padding: '30px 0 20px',
} as const;

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 28px',
  background: '#ede9fe',
  borderRadius: '24px',
  border: '2px solid #c4b5fd',
  cursor: 'pointer',
  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease'
} as const;

const logoTitle = {
  fontSize: '38px',
  fontWeight: '700',
  margin: 0,
  color: '#4c1d95'
} as const;

const logoSubtitle = {
  color: '#6b21a8',
  margin: 0,
  fontSize: '14.5px'
} as const;

const piButtonStyle = {
  padding: '14px 32px',
  background: 'linear-gradient(90deg, #6b21a8, #7c3aed)',   // Tím Pi Network
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 8px 25px rgba(107, 33, 168, 0.4)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  transition: 'all 0.3s ease'
} as const;

const piLogoCircle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: '#fff',
  color: '#6b21a8',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  border: '2px solid #c4b5fd'
} as const;

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  padding: '0 14px'
} as const;

const cardStyle = {
  background: '#fff',
  padding: '24px 16px',
  borderRadius: '20px',
  border: '1px solid #c4b5fd',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
} as const;

const iconStyle = { 
  fontSize: '52px', 
  marginBottom: '12px' 
};

const titleStyle = { 
  fontSize: '17.5px', 
  fontWeight: '700', 
  margin: '0 0 6px 0', 
  color: '#4c1d95' 
};

const descStyle = { 
  color: '#64748b', 
  fontSize: '13.5px', 
  margin: 0,
  lineHeight: '1.4'
} as const;