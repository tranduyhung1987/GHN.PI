import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', paddingTop: '60px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '40px' }}>
        Chào mừng đến với GHN.PI
      </h2>

      {/* Nút Pi */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <button 
          onClick={() => alert('Đang kết nối Pi...')}
          style={{
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
            color: 'white',
            borderRadius: '9999px',
            fontSize: '18px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ⭐ Đăng nhập với Pi
        </button>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { icon: "📦", title: "GỬI HÀNG", path: "/gui-hang" },
          { icon: "📊", title: "TRA CỨU CƯỚC PHÍ", path: "/tra-cuu-cuoc" },
          { icon: "🏬", title: "QUẢN LÝ KHO", path: "/kho-hub" },
          { icon: "🏍️", title: "TÀI XẾ", path: "/tai-xe" },
        ].map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: '#1e2937',
              padding: '30px 20px',
              borderRadius: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px solid #334155'
            }}
          >
            <div style={{ fontSize: '50px', marginBottom: '12px' }}>{item.icon}</div>
            <h3 style={{ margin: '0 0 8px 0' }}>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}