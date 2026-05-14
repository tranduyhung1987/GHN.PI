// src/pages/TaiXePage.tsx
import React, { useState } from 'react';

const TaiXePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'doing' | 'history'>('available');

  const availableOrders = [
    { id: "GHN987654", from: "Hà Nội", to: "TP.HCM", fee: "24500 Pi", distance: "1.850km" },
    { id: "GHN123789", from: "Đà Nẵng", to: "Hải Phòng", fee: "18900 Pi", distance: "780km" },
  ];

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>🏍️</div>
        <h1 style={title}>TÀI XẾ</h1>
        <p style={subtitle}>Nhận đơn - Kiếm Pi</p>
      </div>

      {/* Tabs */}
      <div style={tabContainer}>
        <button onClick={() => setActiveTab('available')} style={activeTab === 'available' ? activeTabStyle : inactiveTabStyle}>
          Đơn mới
        </button>
        <button onClick={() => setActiveTab('doing')} style={activeTab === 'doing' ? activeTabStyle : inactiveTabStyle}>
          Đang làm
        </button>
        <button onClick={() => setActiveTab('history')} style={activeTab === 'history' ? activeTabStyle : inactiveTabStyle}>
          Lịch sử
        </button>
      </div>

      {activeTab === 'available' && (
        <div>
          <h3 style={{ margin: '20px 0 12px', color: '#4c1d95' }}>Đơn hàng khả dụng</h3>
          {availableOrders.map((order, index) => (
            <div key={index} style={orderCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{order.id}</strong>
                <span style={{ color: '#22d3ee', fontWeight: '700' }}>{order.fee}</span>
              </div>
              <p>{order.from} → {order.to}</p>
              <p style={{ fontSize: '14px', color: '#6b21a8' }}>Khoảng cách: {order.distance}</p>
              <button style={acceptButton}>Nhận đơn này</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'doing' && (
        <div style={emptyState}>
          <p>Hiện tại bạn chưa có đơn nào đang vận chuyển</p>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={emptyState}>
          <p>Lịch sử nhận đơn sẽ hiển thị ở đây</p>
        </div>
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
const subtitle = { color: '#6b21a8', marginTop: '4px' };

const tabContainer = { display: 'flex', gap: '8px', marginBottom: '24px' };
const activeTabStyle = { flex: 1, padding: '12px', background: '#22d3ee', color: '#0f172a', borderRadius: '9999px', fontWeight: '700' };
const inactiveTabStyle = { flex: 1, padding: '12px', background: '#fff', color: '#4c1d95', border: '1px solid #c4b5fd', borderRadius: '9999px' };

const orderCard = {
  background: '#fff',
  padding: '18px',
  borderRadius: '18px',
  border: '1px solid #c4b5fd',
  marginBottom: '14px'
};

const acceptButton = {
  width: '100%',
  padding: '14px',
  marginTop: '12px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700'
};

const emptyState = {
  textAlign: 'center' as const,
  padding: '60px 20px',
  color: '#6b21a8'
};

export default TaiXePage;