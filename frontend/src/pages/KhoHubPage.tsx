// src/pages/KhoHubPage.tsx
import React, { useState } from 'react';

const KhoHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'stock' | 'outgoing'>('incoming');

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>🏬</div>
        <h1 style={title}>KHO HUB</h1>
        <p style={subtitle}>Quản lý kho trung chuyển & xe đường dài</p>
      </div>

      {/* Tabs */}
      <div style={tabContainer}>
        <button onClick={() => setActiveTab('incoming')} style={activeTab === 'incoming' ? activeTabStyle : inactiveTabStyle}>
          Hàng về kho
        </button>
        <button onClick={() => setActiveTab('stock')} style={activeTab === 'stock' ? activeTabStyle : inactiveTabStyle}>
          Hàng tồn kho
        </button>
        <button onClick={() => setActiveTab('outgoing')} style={activeTab === 'outgoing' ? activeTabStyle : inactiveTabStyle}>
          Hàng đi
        </button>
      </div>

      {activeTab === 'incoming' && (
        <div style={card}>
          <h3>📦 Hàng đang về kho</h3>
          <p style={{ color: '#22d3ee', fontWeight: '600' }}>GHN872134 - Hà Nội → TP.HCM</p>
          <p>Trọng lượng: 245kg | Dự kiến đến: 2 giờ nữa</p>
          <button style={actionButton}>Xác nhận nhận hàng</button>
        </div>
      )}

      {activeTab === 'stock' && (
        <div style={card}>
          <h3>📦 Hàng tồn kho hiện tại</h3>
          <p>Tổng kiện: <strong>124 kiện</strong></p>
          <p>Không gian còn trống: <strong>68%</strong></p>
        </div>
      )}

      {activeTab === 'outgoing' && (
        <div style={card}>
          <h3>🚛 Hàng đang chờ xuất kho</h3>
          <p>Đang có 8 đơn chờ xe đường dài</p>
          <button style={actionButton}>Lên lịch xuất kho</button>
        </div>
      )}

      <div style={stats}>
        <p><strong>Hoạt động hôm nay:</strong> 47 đơn</p>
        <p><strong>Doanh thu Pi:</strong> 1.245.000 Pi</p>
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

const header = { textAlign: 'center' as const, marginBottom: '24px' };
const title = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle = { color: '#6b21a8', marginTop: '4px' };

const tabContainer = { display: 'flex', gap: '8px', marginBottom: '24px' };
const activeTabStyle = { flex: 1, padding: '12px', background: '#22d3ee', color: '#0f172a', borderRadius: '9999px', fontWeight: '700' };
const inactiveTabStyle = { flex: 1, padding: '12px', background: '#fff', color: '#4c1d95', border: '1px solid #c4b5fd', borderRadius: '9999px' };

const card = {
  background: '#fff',
  padding: '20px',
  borderRadius: '20px',
  border: '1px solid #c4b5fd',
  marginBottom: '16px'
};

const actionButton = {
  width: '100%',
  padding: '14px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  marginTop: '12px'
};

const stats = {
  background: '#ede9fe',
  padding: '16px',
  borderRadius: '16px',
  textAlign: 'center' as const,
  marginTop: '20px',
  border: '1px solid #c4b5fd'
};

export default KhoHubPage;