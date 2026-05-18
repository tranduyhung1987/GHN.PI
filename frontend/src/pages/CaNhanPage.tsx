import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

interface CaNhanPageProps {
  onNavigate: (page: string) => void;
}

const CaNhanPage: React.FC<CaNhanPageProps> = ({ onNavigate }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('Thành Viên GHN.PI');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Kiểm tra Pi Connection
  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then((user: any) => {
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Thành Viên GHN.PI');
        })
        .catch(() => setIsPiConnected(false));
    }

    // Load recent orders từ localStorage
    const saved = localStorage.getItem('orders');
    if (saved) {
      const parsed = JSON.parse(saved).slice(0, 3); // 3 đơn gần nhất
      setRecentOrders(parsed);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      alert('✅ Đã đăng xuất thành công!');
      onNavigate('home');
    }
  };

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>👤 TÀI KHOẢN</h1>
      </div>

      {/* Profile Card */}
      <div style={profileCard}>
        <div style={avatar}>🧑‍💼</div>
        <h2 style={name}>{piUsername}</h2>
        <p style={role}>
          Vai trò: <strong>Sender</strong> 
          {isPiConnected && <span style={{ color: '#22d3ee' }}> • ✅ Pi Connected</span>}
        </p>
        <p style={wallet}>Ví Pi: <strong>@{piUsername}</strong></p>
        
        <div style={reputationBox}>
          <span>Reputation Score</span>
          <span style={reputationScore}>92 ★</span>
        </div>
      </div>

      {/* Ví Pi Balance */}
      <div style={balanceCard}>
        <p style={{ color: '#6b21a8', marginBottom: '8px' }}>Số dư ví Pi</p>
        <p style={balanceAmount}>1.245.680 <span style={{ fontSize: '20px' }}>Pi</span></p>
        <p style={{ fontSize: '14px', color: '#10b981' }}>✅ Có thể dùng để thanh toán & thu hộ</p>
      </div>

      {/* Lịch sử gần đây */}
      <div style={section}>
        <h3 style={sectionTitle}>📋 Lịch sử đơn hàng gần đây</h3>
        {recentOrders.length === 0 ? (
          <p>Chưa có đơn hàng nào</p>
        ) : (
          recentOrders.map((order, idx) => (
            <div key={idx} style={historyItem}>
              <div>
                <strong>{order.maDon}</strong>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  {order.loaiDon === 'hoatoc' ? '⚡ Hỏa Tốc' : '🛣️ Đường Dài'} • {order.nguoiNhan}
                </p>
              </div>
              <div style={{ textAlign: 'right', color: '#22c55e' }}>
                {order.totalAmount?.toLocaleString() || order.shippingFee?.toLocaleString()} Pi
              </div>
            </div>
          ))
        )}
      </div>

      {/* Menu */}
      <div style={menuContainer}>
        <button onClick={() => onNavigate('don-hang')} style={menuButton}>📦 Đơn hàng của tôi</button>
        <button onClick={() => onNavigate('tracking')} style={menuButton}>📍 Theo dõi đơn hàng</button>
        <button onClick={() => onNavigate('doi-soat')} style={menuButton}>💰 Đối soát thanh toán</button>
        <button style={menuButton}>⭐ Đánh giá & Phản hồi</button>
        <button style={menuButton}>⚙️ Cài đặt</button>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={logoutButton}>
        Đăng xuất
      </button>
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 100px',
  boxSizing: 'border-box' as const
};

const header = { display: 'flex', justifyContent: 'center', marginBottom: '20px' };
const title = { fontSize: '26px', fontWeight: '700', color: '#4c1d95' };

const profileCard = {
  background: 'white',
  padding: '24px',
  borderRadius: '20px',
  textAlign: 'center' as const,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: '20px'
};

const avatar = { fontSize: '64px', marginBottom: '12px' };
const name = { fontSize: '22px', fontWeight: '700', color: '#4c1d95', margin: '8px 0' };
const role = { color: '#6b21a8', marginBottom: '8px' };
const wallet = { fontSize: '14px', color: '#64748b' };

const reputationBox = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  background: '#f3e8ff',
  padding: '12px',
  borderRadius: '9999px',
  marginTop: '16px'
};

const reputationScore = { fontSize: '24px', fontWeight: '700', color: '#eab308' };

const balanceCard = {
  background: 'white',
  padding: '20px',
  borderRadius: '20px',
  textAlign: 'center' as const,
  marginBottom: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

const balanceAmount = { fontSize: '32px', fontWeight: '700', color: '#22d3ee', margin: '8px 0' };

const section = { background: 'white', padding: '20px', borderRadius: '20px', marginBottom: '20px' };
const sectionTitle = { color: '#4c1d95', marginBottom: '16px', fontSize: '18px' };

const historyItem = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid #e0d4ff'
};

const menuContainer = { display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '30px' };

const menuButton = {
  padding: '16px',
  background: 'white',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  textAlign: 'left' as const,
  fontSize: '16px',
  color: '#4c1d95'
};

const logoutButton = {
  width: '100%',
  padding: '16px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '17px'
};

export default CaNhanPage;