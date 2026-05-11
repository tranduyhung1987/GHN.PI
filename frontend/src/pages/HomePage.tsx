import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div 
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 32px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid #22d3ee',
            borderRadius: '20px',
            cursor: 'pointer',
            boxShadow: '0 0 30px #22d3ee',
          }}
        >
          <div style={{ fontSize: '52px' }}>🚚</div>
          <div>
            <h1 style={{ fontSize: '42px', margin: 0, color: '#e2e8f0' }}>GHN.PI</h1>
            <p style={{ margin: 0, color: '#94a3b8' }}>Giao Hàng Nhanh - Thanh Toán Bằng Pi</p>
          </div>
        </div>
      </div>

      {/* Nút Pi */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <button 
          onClick={() => alert('🔗 Đang kết nối với Pi Network...')}
          style={{
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 30px #c026d3',
          }}
        >
          ⭐ Đăng nhập với Pi
        </button>
      </div>

      {/* Các Card */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            style={{
              backgroundColor: '#1e2937',
              padding: '28px 20px',
              borderRadius: '20px',
              border: '2px solid #334155',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#22d3ee';
              e.currentTarget.style.transform = 'translateY(-6px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#334155';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>{card.icon}</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#e2e8f0' }}>{card.title}</h3>
            <p style={{ color: '#94a3b8', margin: 0 }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Data Cards */
const cards = [
  { icon: "📦", title: "GỬI HÀNG", desc: "Tạo đơn nhanh", path: "/gui-hang" },
  { icon: "📊", title: "TRA CỨU CƯỚC PHÍ", desc: "Ước tính nhanh", path: "/tra-cuu-cuoc" },
  { icon: "🏬", title: "QUẢN LÝ KHO", desc: "Đối tác Kho hàng", path: "/kho-hub" },
  { icon: "🏍️", title: "TÀI XẾ", desc: "Nhận đơn ngay", path: "/tai-xe" },
  { icon: "📍", title: "TRACKING", desc: "Theo dõi realtime", path: "/tracking" },
  { icon: "🖐️", title: "NHẬN HÀNG", desc: "Xác nhận nhận hàng", path: "/nhan-hang" },
];