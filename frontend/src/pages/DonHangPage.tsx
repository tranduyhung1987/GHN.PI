// src/pages/DonHangPage.tsx
import React, { useState } from 'react';

const DonHangPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'completed'>('all');

  const orders = [
    { id: "GHN872134", status: "shipping", customer: "Nguyễn Văn A", address: "TP.HCM", fee: "28.500 Pi", time: "2 giờ trước" },
    { id: "GHN654987", status: "pending", customer: "Trần Thị B", address: "Hà Nội", fee: "19.200 Pi", time: "5 giờ trước" },
    { id: "GHN321456", status: "completed", customer: "Lê Văn C", address: "Đà Nẵng", fee: "32.100 Pi", time: "Hôm qua" },
  ];

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>📋</div>
        <h1 style={title}>ĐƠN HÀNG</h1>
      </div>

      {/* Filter Tabs */}
      <div style={tabContainer}>
        <button onClick={() => setFilter('all')} style={filter === 'all' ? activeTab : inactiveTab}>Tất cả</button>
        <button onClick={() => setFilter('pending')} style={filter === 'pending' ? activeTab : inactiveTab}>Chờ xử lý</button>
        <button onClick={() => setFilter('shipping')} style={filter === 'shipping' ? activeTab : inactiveTab}>Đang giao</button>
        <button onClick={() => setFilter('completed')} style={filter === 'completed' ? activeTab : inactiveTab}>Hoàn thành</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredOrders.map((order, index) => (
          <div key={index} style={orderCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ color: '#4c1d95' }}>{order.id}</strong>
                <p style={{ margin: '4px 0', color: '#6b21a8' }}>{order.customer}</p>
                <p style={{ fontSize: '14px' }}>{order.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#22d3ee', fontWeight: '700' }}>{order.fee}</p>
                <p style={{ fontSize: '13px', color: '#64748b' }}>{order.time}</p>
              </div>
            </div>
            
            <div style={statusBadge(order.status)}>
              {order.status === 'pending' && '⏳ Chờ xử lý'}
              {order.status === 'shipping' && '🚛 Đang giao'}
              {order.status === 'completed' && '✅ Hoàn thành'}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b21a8', marginTop: '40px' }}>Không có đơn hàng nào</p>
      )}
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

const header = { textAlign: 'center' as const, marginBottom: '24px' };
const title = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 };

const tabContainer = { display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' as const };
const activeTab = { padding: '8px 16px', background: '#22d3ee', color: '#0f172a', borderRadius: '9999px', fontWeight: '600' };
const inactiveTab = { padding: '8px 16px', background: '#fff', color: '#4c1d95', border: '1px solid #c4b5fd', borderRadius: '9999px' };

const orderCard = {
  background: '#fff',
  padding: '18px',
  borderRadius: '18px',
  border: '1px solid #c4b5fd'
};

const statusBadge = (status: string) => ({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '9999px',
  fontSize: '13px',
  marginTop: '12px',
  background: status === 'completed' ? '#d1fae5' : status === 'shipping' ? '#dbeafe' : '#fef3c7',
  color: status === 'completed' ? '#10b981' : status === 'shipping' ? '#3b82f6' : '#d97706'
});

export default DonHangPage;