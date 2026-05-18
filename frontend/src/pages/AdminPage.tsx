import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

const AdminPage: React.FC = () => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');

  // Kiểm tra Pi Connection cho Admin
  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then((user: any) => {
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Admin');
        })
        .catch(() => setIsPiConnected(false));
    }
  }, []);

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={header}>
        <div style={{ fontSize: '48px' }}>👑</div>
        <div>
          <h1 style={title}>BẢNG ĐIỀU KHIỂN ADMIN</h1>
          <p style={subtitle}>Quản trị hệ thống GHN.PI • Pi Network</p>
          {isPiConnected && (
            <p style={{ color: '#22d3ee', fontWeight: '600', marginTop: '8px' }}>
              ✅ Admin @{piUsername} • Connected
            </p>
          )}
        </div>
      </div>

      <div style={grid}>
        <div style={statCard}>
          <h3>📦 Tổng đơn hôm nay</h3>
          <p style={bigNumber}>248</p>
        </div>
        <div style={statCard}>
          <h3>🚚 Đang giao</h3>
          <p style={bigNumber}>87</p>
        </div>
        <div style={statCard}>
          <h3>💰 Doanh thu Pi</h3>
          <p style={bigNumber}>2.845k</p>
        </div>
        <div style={statCard}>
          <h3>👥 Người dùng</h3>
          <p style={bigNumber}>1.294</p>
        </div>
      </div>

      <div style={actionArea}>
        <button style={adminButton}>👤 Quản lý người dùng</button>
        <button style={adminButton}>📦 Quản lý đơn hàng</button>
        <button style={adminButton}>💰 Báo cáo tài chính Pi</button>
        <button style={adminButton}>⚙️ Cài đặt hệ thống</button>
        <button style={adminButton}>📊 Thống kê thanh toán Pi</button>
      </div>
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

const header = { 
  textAlign: 'center' as const, 
  marginBottom: '30px',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center'
};

const title = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle = { color: '#6b21a8', marginTop: '8px' };

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '14px',
  marginBottom: '30px'
};

const statCard = {
  background: '#fff',
  padding: '20px',
  borderRadius: '20px',
  textAlign: 'center' as const,
  border: '1px solid #c4b5fd'
};

const bigNumber = { fontSize: '32px', fontWeight: '700', color: '#22d3ee', margin: '8px 0 0 0' };

const actionArea = { display: 'flex', flexDirection: 'column' as const, gap: '12px' };
const adminButton = {
  padding: '16px',
  background: '#4c1d95',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '16px'
};

export default AdminPage;