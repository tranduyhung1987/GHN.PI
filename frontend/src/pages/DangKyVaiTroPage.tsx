import React, { useState, useEffect } from 'react';

interface DangKyVaiTroPageProps {
  onNavigate: (page: string) => void;
}

const DangKyVaiTroPage: React.FC<DangKyVaiTroPageProps> = ({ onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) setSelectedRole(savedRole);
  }, []);

  const handleSelectRole = (role: string) => {
    setIsRegistering(true);
    setSelectedRole(role);

    localStorage.setItem('userRole', role);
    localStorage.setItem('currentPage', 'home');

    setTimeout(() => {
      alert(`🎉 ĐĂNG KÝ VAI TRÒ THÀNH CÔNG!\n\nVai trò: ${getRoleName(role)}\n\nĐang chuyển về Trang chủ...`);
      window.location.reload(); // Reload để BottomNav & Layout cập nhật
      setIsRegistering(false);
    }, 700);
  };

  const getRoleName = (role: string) => {
    switch(role) {
      case 'sender': return 'Người Gửi Hàng';
      case 'driver': return 'Tài Xế';
      case 'warehouse': return 'Kho Trung Chuyển';
      case 'receiver': return 'Người Nhận Hàng';
      default: return role;
    }
  };

  const roles = [
    { role: 'sender', icon: '📦', title: 'Người Gửi Hàng', desc: 'Tạo đơn, thanh toán Pi, quản lý đơn gửi' },
    { role: 'driver', icon: '🏍️', title: 'Tài Xế', desc: 'Nhận đơn, giao hàng, quét QR' },
    { role: 'warehouse', icon: '🏬', title: 'Kho Trung Chuyển', desc: 'Đối tác kho, quản lý đơn đường dài' },
    { role: 'receiver', icon: '📬', title: 'Người Nhận Hàng', desc: 'Nhận hàng, xác nhận, khiếu nại' },
  ];

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>👤</div>
        <h1 style={title}>CHỌN VAI TRÒ CỦA BẠN</h1>
        <p style={subtitle}>Chọn vai trò phù hợp để bắt đầu sử dụng GHN.PI</p>
      </div>

      <div style={cardsContainer}>
        {roles.map((item) => (
          <div
            key={item.role}
            onClick={() => handleSelectRole(item.role)}
            style={{
              ...roleCard,
              border: selectedRole === item.role ? '3px solid #22d3ee' : '2px solid #e0d4ff',
              transform: selectedRole === item.role ? 'scale(1.03)' : 'scale(1)',
            }}
          >
            <div style={iconBig}>{item.icon}</div>
            <h3 style={roleTitle}>{item.title}</h3>
            <p style={roleDesc}>{item.desc}</p>
            
            {selectedRole === item.role && (
              <div style={selectedBadge}>✓ ĐÃ CHỌN</div>
            )}
          </div>
        ))}
      </div>

      <p style={note}>Bạn có thể thay đổi vai trò bất kỳ lúc nào trong phần Cá nhân</p>

      {isRegistering && <div style={loadingOverlay}>Đang lưu vai trò...</div>}
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '20px 14px 100px',
  boxSizing: 'border-box'
};

const header: React.CSSProperties = { 
  textAlign: 'center' as const, 
  marginBottom: '40px' 
};

const title: React.CSSProperties = { 
  fontSize: '28px', 
  fontWeight: '700', 
  color: '#4c1d95', 
  margin: '12px 0 8px 0' 
};

const subtitle: React.CSSProperties = { 
  color: '#6b21a8', 
  fontSize: '16px' 
};

const cardsContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px'
};

const roleCard: React.CSSProperties = {
  background: 'white',
  padding: '28px 20px',
  borderRadius: '20px',
  cursor: 'pointer',
  transition: 'all 0.25s ease',
  textAlign: 'center' as const,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

const iconBig: React.CSSProperties = { 
  fontSize: '68px', 
  marginBottom: '16px' 
};

const roleTitle: React.CSSProperties = { 
  fontSize: '21px', 
  fontWeight: '700', 
  color: '#4c1d95', 
  marginBottom: '8px' 
};

const roleDesc: React.CSSProperties = { 
  color: '#64748b', 
  fontSize: '14.5px', 
  lineHeight: '1.55' 
};

const selectedBadge: React.CSSProperties = {
  marginTop: '12px',
  color: '#22d3ee',
  fontWeight: '700',
  fontSize: '15px'
};

const note: React.CSSProperties = { 
  textAlign: 'center' as const, 
  color: '#6b21a8', 
  marginTop: '40px', 
  fontSize: '14px' 
};

const loadingOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '18px',
  zIndex: 2000
};

export default DangKyVaiTroPage;