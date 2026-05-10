// src/pages/CaNhanPage.tsx
import { useNavigate } from 'react-router-dom';

export default function CaNhanPage() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: "📊", title: "Báo cáo - Live", desc: "Thống kê thời gian thực" },
    { icon: "📦", title: "Quản lý đơn hàng", desc: "Xem, chỉnh sửa đơn hàng" },
    { icon: "📤", title: "Lên đơn Excel", desc: "Tạo đơn hàng hàng loạt" },
    { icon: "🏪", title: "Quản lý cửa hàng", desc: "Thông tin shop & kho" },
    { icon: "💰", title: "COD & Đối soát", desc: "Thanh toán & đối chiếu" },
    { icon: "🛡️", title: "Xác thực tài khoản", desc: "Tận hưởng quyền lợi cao hơn" },
    { icon: "👥", title: "Phân quyền", desc: "Quản lý nhân viên" },
    { icon: "📋", title: "Thông tin bảng giá", desc: "Biểu phí vận chuyển" },
    { icon: "🧮", title: "Ước tính chi phí", desc: "Tính phí trước khi lên đơn" },
    { icon: "🚚", title: "Vận đơn & Tiện ích", desc: "Công cụ hỗ trợ vận chuyển" },
    { icon: "❗", title: "Hỗ trợ - Khiếu nại", desc: "Liên hệ hỗ trợ" },
  ];

  return (
    <>
      {/* Header với viền tím lung linh */}
      <div style={headerContainerStyle}>
        <div style={headerStyle}>
          <div style={avatarContainerStyle}>
            👤
          </div>
          <div>
            <h2 style={{ margin: 0 }}>ABC</h2>
            <p style={{ color: '#22d3ee', margin: '4px 0 0 0' }}>Chủ cửa hàng 🏆</p>
          </div>
        </div>
      </div>

      {/* Balance Info */}
      <div style={balanceCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#94a3b8', margin: 0 }}>Số dư Pi</p>
            <h3 style={{ margin: '4px 0 0 0', color: '#67e8f9' }}>0 xu</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#94a3b8', margin: 0 }}>Hạn mức còn lại</p>
            <h3 style={{ margin: '4px 0 0 0', color: '#4ade80' }}>60.000 đ</h3>
          </div>
        </div>
      </div>

      {/* Verification Banner */}
      <div style={verifyBannerStyle}>
        <div style={{ fontSize: '32px' }}>🛡️</div>
        <div style={{ flex: 1, paddingLeft: '16px' }}>
          <strong>Xác thực tài khoản</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
            Xác thực để tận hưởng các quyền lợi đặc biệt từ GHN.PI
          </p>
        </div>
        <button style={verifyButtonStyle}>Xác thực ngay</button>
      </div>

      {/* Menu List */}
      <div style={{ marginTop: '30px' }}>
        {menuItems.map((item, index) => (
          <div key={index} style={menuItemStyle} onClick={() => alert(`Chức năng "${item.title}" đang phát triển`)}>
            <span style={{ fontSize: '24px', width: '40px' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <strong>{item.title}</strong>
              <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>{item.desc}</p>
            </div>
            <span style={{ color: '#64748b' }}>›</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button 
        onClick={() => window.confirm('Đăng xuất khỏi tài khoản?') && navigate('/')}
        style={logoutButtonStyle}
      >
        Đăng xuất
      </button>
    </>
  );
}

/* ====================== STYLES ====================== */
const headerContainerStyle = {
  padding: '20px 0',
  display: 'flex',
  justifyContent: 'center',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 24px',
  backgroundColor: '#1e2937',
  borderRadius: '9999px',
  border: '3px solid #a855f7',
  boxShadow: '0 0 15px #a855f7, 0 0 30px #c026d3, 0 0 45px #db2777',
  animation: 'neonPulse 2s infinite alternate ease-in-out',
};

const avatarContainerStyle = {
  fontSize: '60px',
  width: '80px',
  height: '80px',
  backgroundColor: '#334155',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '3px solid #22d3ee'
};

// Thêm keyframes cho hiệu ứng lung linh
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes neonPulse {
    from { box-shadow: 0 0 15px #a855f7, 0 0 30px #c026d3; }
    to   { box-shadow: 0 0 25px #a855f7, 0 0 45px #c026d3, 0 0 60px #db2777; }
  }
`;
document.head.appendChild(styleSheet);

const balanceCardStyle = {
  backgroundColor: '#1e2937',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #334155',
  marginBottom: '20px'
};

const verifyBannerStyle = {
  backgroundColor: '#1e2937',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #eab308',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '30px'
};

const verifyButtonStyle = {
  backgroundColor: '#f97316',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '18px 20px',
  backgroundColor: '#1e2937',
  borderRadius: '16px',
  marginBottom: '10px',
  border: '1px solid #334155',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const logoutButtonStyle = {
  width: '100%',
  marginTop: '30px',
  padding: '18px',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};