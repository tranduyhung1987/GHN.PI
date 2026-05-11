import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ==================== PHẦN HEADER ĐÃ ẨN ==================== */}

      {/* NÚT ĐĂNG NHẬP VỚI PI - GIỮ NGUYÊN VỊ TRÍ */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '40px' }}>
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
        </button>
      </div>

      {/* 6 CARDS - GIỮ NGUYÊN HOÀN TOÀN */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        padding: '0 20px'
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
  { icon: "🏬", title: "QUẢN LÝ KHO TRUNG CHUYỂN", desc: "Dành cho Đối tác Kho hàng", path: "/kho-hub" },
  { icon: "🏍️", title: "TÀI XẾ", desc: "Nhận đơn ngay", path: "/tai-xe" },
  { icon: "📍", title: "TRACKING", desc: "Theo dõi đơn hàng realtime", path: "/tracking" },
  { icon: "🖐️", title: "NHẬN HÀNG", desc: "Xác nhận đã nhận hàng", path: "/nhan-hang" },
];

/* ====================== STYLES ====================== */
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
  padding: '32px 20px',
  borderRadius: '24px',
  border: '2px solid #334155',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.4s ease',
  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)',
};

const iconStyle = { fontSize: '58px', marginBottom: '18px' };
const titleStyle = { fontSize: '21px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#e2e8f0' };
const descStyle = { color: '#94a3b8', fontSize: '15px', margin: 0 };