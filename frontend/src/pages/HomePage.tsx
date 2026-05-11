import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER LOGO */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', paddingTop: '20px' }}>
        <div 
          onClick={() => navigate('/')}
          style={neonLogoStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 45px #22d3ee, 0 0 70px rgba(34, 211, 238, 0.8)';
            e.currentTarget.style.borderColor = '#67e8f9';
            e.currentTarget.style.transform = 'scale(1.05)';
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
            <p style={logoSubtitleStyle}>Giao Hàng Nhanh - Thanh Toán Bằng Pi</p>
          </div>
        </div>
      </div>

      {/* NÚT ĐĂNG NHẬP PI */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <button 
          onClick={() => alert('🔗 Đang kết nối với Pi Network...')}
          style={piButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 45px #c026d3, 0 0 70px rgba(192, 38, 211, 0.8)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px #c026d3';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⭐ Đăng nhập với Pi
        </button>
      </div>

      {/* 6 CARDS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '20px',
        padding: '0 20px'
      }}>
        {cards.map((card, index) => (
          <div
            key={index}
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
          >
            <div style={iconStyle}>{card.icon}</div>
            <h3 style={titleStyle}>{card.title}</h3>
            <p style={descStyle}>{card.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

/* ====================== DATA ====================== */
const cards = [
  { icon: "📦", title: "GỬI HÀNG", desc: "Tạo đơn nhanh", path: "/gui-hang" },
  { icon: "📊", title: "TRA CỨU CƯỚC PHÍ", desc: "Ước tính nhanh", path: "/tra-cuu-cuoc" },
  { icon: "🏬", title: "QUẢN LÝ KHO", desc: "Đối tác Kho hàng", path: "/kho-hub" },
  { icon: "🏍️", title: "TÀI XẾ", desc: "Nhận đơn ngay", path: "/tai-xe" },
  { icon: "📍", title: "TRACKING", desc: "Theo dõi realtime", path: "/tracking" },
  { icon: "🖐️", title: "NHẬN HÀNG", desc: "Xác nhận nhận hàng", path: "/nhan-hang" },
];

/* ====================== STYLES ====================== */
const neonLogoStyle = {
  display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 32px',
  backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #22d3ee',
  borderRadius: '20px', cursor: 'pointer', boxShadow: '0 0 30px #22d3ee',
  transition: 'all 0.4s ease',
};

const logoTitleStyle = { fontSize: '42px', fontWeight: 'bold', margin: 0, color: '#e2e8f0', textShadow: '0 0 20px #22d3ee' };
const logoSubtitleStyle = { color: '#94a3b8', margin: 0, fontSize: '15px' };

const piButtonStyle = {
  padding: '16px 40px', background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
  color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 'bold',
  fontSize: '17px', cursor: 'pointer', boxShadow: '0 0 30px #c026d3', transition: 'all 0.4s ease',
};

const neonCardStyle = {
  backgroundColor: '#1e2937', padding: '32px 20px', borderRadius: '24px',
  border: '2px solid #334155', textAlign: 'center' as const, cursor: 'pointer',
  transition: 'all 0.4s ease', boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)',
};

const iconStyle = { fontSize: '58px', marginBottom: '18px' };
const titleStyle = { fontSize: '21px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#e2e8f0' };
const descStyle = { color: '#94a3b8', fontSize: '15px', margin: 0 };