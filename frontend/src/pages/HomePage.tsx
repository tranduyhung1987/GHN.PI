// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ==================== HEADER + LOGO LUNG LINH ==================== */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px' 
      }}>
        
        {/* VÙNG LOGO GHN.PI - HIỆU ỨNG LUNG LINH NEON */}
        <div 
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            border: '2px solid #22d3ee',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 35px rgba(34, 211, 238, 0.95)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = '#67e8f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.6)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#22d3ee';
          }}
        >
          <div style={{ fontSize: '48px' }}>🚚</div>
          <div>
            <h1 style={{ 
              fontSize: '34px', 
              fontWeight: 'bold', 
              margin: 0,
              textShadow: '0 0 12px #22d3ee'
            }}>
              GHN.PI
            </h1>
            <p style={{ 
              color: '#94a3b8', 
              margin: 0, 
              fontSize: '14px' 
            }}>
              Logistics Ecosystem v14 Pro
            </p>
          </div>
        </div>

        {/* Nút Đăng nhập Pi lung linh tím */}
        <button 
          onClick={() => alert('🔗 Kết nối Pi Network...\n\nTính năng đang phát triển')}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.7)',
            transition: 'all 0.4s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 0 45px rgba(168, 85, 247, 0.9)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.7)';
          }}
        >
          🌟 Đăng nhập với Pi
        </button>
      </div>
      {/* ================================================================== */}

      {/* Status Bar */}
      <div style={{
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid #4ade80',
        color: '#4ade80',
        padding: '12px 20px',
        borderRadius: '9999px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Hệ thống đang hoạt động • 248 đơn hàng realtime
      </div>

      {/* 4 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { icon: "📦", title: "GỬI HÀNG", path: "/gui-hang", desc: "Tạo đơn nhanh" },
          { icon: "🏍️", title: "TÀI XẾ", path: "/tai-xe", desc: "Nhận đơn ngay" },
          { icon: "🖐️", title: "NHẬN HÀNG", path: "/nhan-hang", desc: "Xác nhận hàng" },
          { icon: "📍", title: "TRACKING", path: "/tracking", desc: "Theo dõi realtime" }
        ].map(item => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              backgroundColor: '#1e2937',
              padding: '32px 20px',
              borderRadius: '24px',
              border: '1px solid #334155',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#22d3ee'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}
          >
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>{item.icon}</div>
            <h3 style={{ fontSize: '21px', fontWeight: 'bold' }}>{item.title}</h3>
            <p style={{ color: '#94a3b8' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Kho Trung Chuyển */}
      <div 
        onClick={() => navigate('/kho-hub')}
        style={{
          marginTop: '40px',
          backgroundColor: '#1e2937',
          padding: '28px',
          borderRadius: '24px',
          border: '2px solid #334155',
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = '#22d3ee'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏬</div>
        <h3>QUẢN LÝ KHO TRUNG CHUYỂN</h3>
        <p style={{ color: '#94a3b8' }}>Giám sát toàn bộ mạng lưới hubs</p>
      </div>
    </>
  );
}