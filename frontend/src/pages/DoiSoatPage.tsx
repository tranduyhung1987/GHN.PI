// src/pages/DoiSoatPage.tsx
import { useState } from 'react';

export default function DoiSoatPage() {
  const [activeTab, setActiveTab] = useState<'tatca' | 'chodoi' | 'dadoi'>('tatca');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    { maDon: "GHN17489231", ngay: "12/05/2026", soPi: 45000, trangThai: "Đã đối soát", color: "#22c55e" },
    { maDon: "GHN17488902", ngay: "11/05/2026", soPi: 28500, trangThai: "Đã đối soát", color: "#22c55e" },
    { maDon: "GHN17487654", ngay: "10/05/2026", soPi: 32000, trangThai: "Chờ đối soát", color: "#eab308" },
    { maDon: "GHN17486543", ngay: "09/05/2026", soPi: 41500, trangThai: "Chờ đối soát", color: "#eab308" },
    { maDon: "GHN17485432", ngay: "08/05/2026", soPi: 52000, trangThai: "Đã đối soát", color: "#22c55e" },
  ];

  const filteredOrders = orders.filter(order => {
    const matchTab = activeTab === 'tatca' || 
                     (activeTab === 'chodoi' && order.trangThai.includes("Chờ")) ||
                     (activeTab === 'dadoi' && order.trangThai.includes("Đã"));
    const matchSearch = order.maDon.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPi = orders.reduce((sum, o) => sum + o.soPi, 0);
  const pendingPi = orders.filter(o => o.trangThai.includes("Chờ")).reduce((sum, o) => sum + o.soPi, 0);

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: '48px' }}>📊</div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 }}>ĐỐI SOÁT</h1>
          <p style={{ color: '#6b21a8', margin: 0 }}>Đối chiếu thanh toán • Hợp đồng thông minh Pi</p>
        </div>
      </div>

      {/* Quick Stats - ĐÃ GIẢM CHIỀU CAO */}
      <div style={statsContainer}>
        <div style={statCard}>
          <p style={{ color: '#6b21a8', marginBottom: '4px', fontSize: '14.5px' }}>Tổng Pi</p>
          <p style={{ fontSize: '26px', fontWeight: '700', color: '#22d3ee', margin: '2px 0' }}>
            {totalPi.toLocaleString()} <span style={{ fontSize: '17px' }}>Pi</span>
          </p>
        </div>
        <div style={statCard}>
          <p style={{ color: '#6b21a8', marginBottom: '4px', fontSize: '14.5px' }}>Chờ đối soát</p>
          <p style={{ fontSize: '26px', fontWeight: '700', color: '#eab308', margin: '2px 0' }}>
            {pendingPi.toLocaleString()} <span style={{ fontSize: '17px' }}>Pi</span>
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0 14px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm mã đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Tabs */}
      <div style={tabContainerStyle}>
        {[
          { key: 'tatca', label: 'Tất cả' },
          { key: 'chodoi', label: 'Chờ đối soát' },
          { key: 'dadoi', label: 'Đã đối soát' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={activeTab === tab.key ? activeTabStyle : inactiveTabStyle}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div style={{ padding: '0 14px' }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, i) => (
            <div key={i} style={orderCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: '#4c1d95' }}>{order.maDon}</div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>{order.ngay}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#22d3ee' }}>
                    {order.soPi.toLocaleString()} <span style={{ fontSize: '15px' }}>Pi</span>
                  </div>
                  <div style={{ color: order.color, fontWeight: '600' }}>{order.trangThai}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={emptyState}>Không tìm thấy đơn hàng nào</div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '30px 14px' }}>
        <button 
          onClick={() => alert('🔄 Đang thực hiện đối soát tự động qua Pi Network...')}
          style={mainActionBtn}
        >
          ⚡ ĐỐI SOÁT NGAY
        </button>

        <button style={secondaryActionBtn}>
          📤 Xuất báo cáo Excel
        </button>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  width: '100%',
  background: '#f3e8ff',
  padding: '16px 0 100px',
  boxSizing: 'border-box' as const
} as const;

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  padding: '0 14px',
  marginBottom: '20px'
} as const;

const statsContainer = {
  display: 'flex',
  gap: '12px',
  padding: '0 14px',
  marginBottom: '24px'
} as const;

const statCard = {
  flex: 1,
  background: '#ede9fe',
  padding: '16px 14px',     // ← Giảm mạnh chiều cao
  borderRadius: '16px',
  border: '1px solid #c4b5fd',
  textAlign: 'center' as const,
  minHeight: '9px'         // ← Giảm chiều cao tối thiểu
} as const;

const searchInputStyle = {
  width: '100%',
  padding: '16px 20px',
  background: '#f3e8ff',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  fontSize: '16px',
  color: '#4c1d95',
  boxSizing: 'border-box' as const
} as const;

const tabContainerStyle = {
  display: 'flex',
  background: '#ede9fe',
  borderRadius: '9999px',
  padding: '6px',
  margin: '0 14px 24px',
  border: '1px solid #c4b5fd'
} as const;

const activeTabStyle = {
  flex: 1,
  padding: '12px',
  borderRadius: '9999px',
  background: '#22d3ee',
  color: '#0f172a',
  fontWeight: '700',
  border: 'none'
} as const;

const inactiveTabStyle = {
  flex: 1,
  padding: '12px',
  borderRadius: '9999px',
  background: 'transparent',
  color: '#4c1d95',
  border: 'none'
} as const;

const orderCard = {
  background: '#ede9fe',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #c4b5fd',
  marginBottom: '12px'
} as const;

const emptyState = {
  textAlign: 'center' as const,
  padding: '60px 20px',
  color: '#64748b'
} as const;

const mainActionBtn = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer',
  marginBottom: '12px'
} as const;

const secondaryActionBtn = {
  width: '100%',
  padding: '16px',
  background: 'transparent',
  color: '#4c1d95',
  border: '2px solid #c4b5fd',
  borderRadius: '9999px',
  fontWeight: '600',
  cursor: 'pointer'
} as const;