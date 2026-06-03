// src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook điều hướng mới

const AdminPage: React.FC = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook

  // Minimal order shape to reduce `any` usage (logic only)
  interface SimpleOrder { maDon?: string; nguoiNhan?: string; status?: string; trangThai?: string; totalAmount?: number; [k: string]: unknown; }
  const [orders, setOrders] = useState<SimpleOrder[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, totalPi: 0 });

  useEffect(() => {
    // Load from localStorage (primary for testnet)
    try {
      const saved = localStorage.getItem('ghn_pi_orders');
      const loaded: SimpleOrder[] = saved ? JSON.parse(saved) : [];
      setOrders(loaded.slice(0, 10)); // limit for admin view

      const total = loaded.length;
      const pending = loaded.filter((o) => !['delivered', 'completed'].some(s => (o.status || o.trangThai || '').includes(s))).length;
      const completed = total - pending;
      const totalPi = loaded.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      setStats({ total, pending, completed, totalPi: Math.round(totalPi) });
    } catch {}
  }, []);

  return (
    <div style={pageContainer}>
      {/* HEADER GIỮ NGUYÊN UI */}
      <div style={header}>
        <div style={{ fontSize: '48px' }}>👑</div>
        <div>
          <h1 style={title}>BẢNG ĐIỀU KHIỂN ADMIN</h1>
          <p style={subtitle}>Quản trị hệ thống GHN.PI • Pi Network</p>
        </div>
      </div>

      {/* BASIC ADMIN STATS - real data from local */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ ...adminButton, cursor: 'default' }}>Tổng đơn: <strong>{stats.total}</strong></div>
        <div style={{ ...adminButton, cursor: 'default' }}>Chờ xử lý: <strong>{stats.pending}</strong></div>
        <div style={{ ...adminButton, cursor: 'default' }}>Hoàn tất: <strong>{stats.completed}</strong></div>
        <div style={{ ...adminButton, cursor: 'default' }}>Tổng Pi: <strong>{stats.totalPi}</strong></div>
      </div>

      {/* RECENT ORDERS LIST */}
      <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <h3 style={{ margin: 0, color: '#4c1d95' }}>Đơn hàng gần đây (10)</h3>
        {orders.length === 0 ? <p>Chưa có dữ liệu.</p> : orders.map((o, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 13 }}>
            {o.maDon} | {String(o.nguoiNhan || '')} | {o.status || o.trangThai} | {o.totalAmount || 0} Pi
          </div>
        ))}
      </div>

      {/* CÁC NÚT BẤM ĐIỀU HƯỚNG - giữ UI */}
      <div style={grid}>
        <button style={adminButton} onClick={() => navigate('/admin/don-hang')}>
          📦 Quản lý đơn hàng
        </button>
        <button style={adminButton} onClick={() => navigate('/admin/bao-cao')}>
          💰 Báo cáo tài chính Pi
        </button>
        <button style={adminButton} onClick={() => navigate('/admin/cai-dat')}>
          ⚙️ Cài đặt hệ thống
        </button>
        <button style={adminButton} onClick={() => navigate('/admin/thong-ke')}>
          📊 Thống kê thanh toán Pi
        </button>
      </div>
    </div>
  );
};

/* STYLES GIỮ NGUYÊN 100% */
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

const adminButton = {
  padding: '20px',
  background: 'white',
  border: '1px solid #e9d5ff',
  borderRadius: '20px',
  fontWeight: '600',
  color: '#4c1d95',
  cursor: 'pointer'
};

export default AdminPage;