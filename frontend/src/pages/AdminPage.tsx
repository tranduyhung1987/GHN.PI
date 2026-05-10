// src/pages/AdminPage.tsx
import { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'orders' | 'revenue'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const stats = {
    totalOrders: 1248,
    totalRevenue: 45280000,
    activeDrivers: 87,
    activeWarehouses: 12,
  };

  const users = [
    { id: 1, name: "Nguyễn Văn A", role: "Shop", email: "shop1@gmail.com", status: "Hoạt động", balance: "245,000 Pi" },
    { id: 2, name: "Trần Thị B", role: "Driver", email: "driver2@gmail.com", status: "Hoạt động", balance: "89,500 Pi" },
    { id: 3, name: "Lê Văn C", role: "Warehouse", email: "kho3@gmail.com", status: "Tạm khóa", balance: "12,000 Pi" },
    { id: 4, name: "Phạm Thị D", role: "Shop", email: "shop4@gmail.com", status: "Hoạt động", balance: "156,000 Pi" },
  ];

  const recentOrders = [
    { maDon: "GHN17489231", shop: "Shop Hoa Lan", status: "Đang giao", pi: 45000, time: "5 phút trước", nguoiNhan: "Nguyễn Thị Lan" },
    { maDon: "GHN17488902", shop: "Shop Thời Trang", status: "Đã giao", pi: 28500, time: "17 phút trước", nguoiNhan: "Trần Văn Hải" },
    { maDon: "GHN17487654", shop: "Shop Điện Máy", status: "Chờ xác nhận", pi: 62000, time: "42 phút trước", nguoiNhan: "Lê Thị Hoa" },
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontSize: '42px' }}>👑</span>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>ADMIN DASHBOARD</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Quản trị hệ thống GHN.PI • Chào Chủ dự án</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* SIDEBAR */}
        <div style={sidebarStyle}>
          {[
            { key: 'dashboard', label: '📊 Dashboard' },
            { key: 'users', label: '👥 Quản lý Người dùng' },
            { key: 'orders', label: '📦 Tất cả Đơn hàng' },
            { key: 'revenue', label: '💰 Doanh thu Pi' },
          ].map(tab => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                marginBottom: '6px',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.key ? '#ef444420' : 'transparent',
                color: activeTab === tab.key ? '#ef4444' : '#e2e8f0',
                fontWeight: activeTab === tab.key ? 'bold' : 'normal'
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* NỘI DUNG */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {activeTab === 'dashboard' && (
            <>
              {/* Thống kê */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                <div style={statCard}><div style={{ color: '#22d3ee', fontSize: '36px', fontWeight: 'bold' }}>{stats.totalOrders}</div><div>Tổng đơn hàng</div></div>
                <div style={statCard}><div style={{ color: '#22c55e', fontSize: '36px', fontWeight: 'bold' }}>{(stats.totalRevenue/1000000).toFixed(1)}M</div><div>Doanh thu Pi</div></div>
                <div style={statCard}><div style={{ color: '#eab308', fontSize: '36px', fontWeight: 'bold' }}>{stats.activeDrivers}</div><div>Tài xế online</div></div>
                <div style={statCard}><div style={{ color: '#a855f7', fontSize: '36px', fontWeight: 'bold' }}>{stats.activeWarehouses}</div><div>Kho hoạt động</div></div>
              </div>

              {/* Biểu đồ */}
              <div style={{ backgroundColor: '#1e2937', padding: '20px', borderRadius: '20px', marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '16px' }}>Doanh thu 7 ngày gần nhất</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '8px' }}>
                  {[4.2, 5.8, 3.9, 7.1, 6.5, 8.3, 9.7].map((v, i) => (
                    <div key={i} style={{ flex: 1, background: '#22d3ee', height: `${v * 18}px`, borderRadius: '8px 8px 0 0' }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div>
              <h3>👥 Quản lý Người dùng</h3>
              <div style={{ background: '#1e2937', borderRadius: '16px', overflow: 'hidden' }}>
                {users.map(user => (
                  <div key={user.id} style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '14px' }}>{user.email}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: user.status === 'Hoạt động' ? '#22c55e' : '#ef4444' }}>{user.status}</div>
                      <div style={{ fontSize: '13px' }}>{user.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3>📦 Tất cả Đơn hàng</h3>
              {recentOrders.map((order, i) => (
                <div key={i} style={orderCard} onClick={() => setSelectedOrder(order)}>
                  <strong>{order.maDon}</strong> - {order.shop}<br />
                  <span style={{ color: '#94a3b8' }}>{order.status} • {order.time}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'revenue' && (
            <div>
              <h3>💰 Doanh thu Pi</h3>
              <p style={{ fontSize: '28px', color: '#22c55e', fontWeight: 'bold' }}>
                {(stats.totalRevenue / 1000000).toFixed(1)}M Pi
              </p>
              <p style={{ color: '#94a3b8' }}>Tổng doanh thu hệ thống</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN */}
      {selectedOrder && (
        <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h2>Chi tiết đơn hàng</h2>
            <p><strong>Mã đơn:</strong> {selectedOrder.maDon}</p>
            <p><strong>Cửa hàng:</strong> {selectedOrder.shop}</p>
            <p><strong>Người nhận:</strong> {selectedOrder.nguoiNhan}</p>
            <p><strong>Số Pi:</strong> {selectedOrder.pi.toLocaleString()} Pi</p>
            <button onClick={() => setSelectedOrder(null)} style={modalBtn}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== STYLES ====================== */
const statCard = {
  backgroundColor: '#1e2937',
  padding: '24px',
  borderRadius: '20px',
  border: '1px solid #334155',
  textAlign: 'center' as const
};

const sidebarStyle = {
  width: '260px',
  backgroundColor: '#1e2937',
  borderRadius: '16px',
  padding: '12px',
  height: 'fit-content',
  border: '1px solid #334155'
};

const orderCard = {
  backgroundColor: '#1e2937',
  padding: '18px',
  borderRadius: '16px',
  marginBottom: '12px',
  border: '1px solid #334155',
  cursor: 'pointer'
};

const modalOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.9)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 2000
};

const modalContent = {
  background: '#1e2937', padding: '30px', borderRadius: '20px',
  maxWidth: '420px', width: '90%', border: '2px solid #ef4444'
};

const modalBtn = {
  marginTop: '20px', width: '100%', padding: '14px',
  background: '#ef4444', color: 'white', border: 'none',
  borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer'
};