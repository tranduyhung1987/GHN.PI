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

  const filteredOrders = orders
    .filter(order => {
      const matchTab = activeTab === 'tatca' || 
                       (activeTab === 'chodoi' && order.trangThai.includes("Chờ")) ||
                       (activeTab === 'dadoi' && order.trangThai.includes("Đã"));
      const matchSearch = order.maDon.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTab && matchSearch;
    });

  const totalPi = orders.reduce((sum, o) => sum + o.soPi, 0);
  const pendingPi = orders.filter(o => o.trangThai.includes("Chờ")).reduce((sum, o) => sum + o.soPi, 0);

  return (
    <div style={{ padding: '20px 0', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>📊</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#fff' }}>ĐỐI SOÁT</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Đối chiếu thanh toán • Hợp đồng thông minh Pi Network</p>

      {/* THỐNG KÊ NHANH */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', padding: '0 20px' }}>
        <div style={{ flex: 1, background: '#1e2937', padding: '20px', borderRadius: '16px', border: '1px solid #22d3ee' }}>
          <p style={{ color: '#94a3b8' }}>Tổng Pi</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22d3ee' }}>{totalPi.toLocaleString()} Pi</p>
        </div>
        <div style={{ flex: 1, background: '#1e2937', padding: '20px', borderRadius: '16px', border: '1px solid #eab308' }}>
          <p style={{ color: '#94a3b8' }}>Chờ đối soát</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#eab308' }}>{pendingPi.toLocaleString()} Pi</p>
        </div>
      </div>

      {/* TABS + SEARCH */}
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm mã đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%', padding: '14px 20px', background: '#1e2937',
            border: '1px solid #475569', borderRadius: '999px', color: 'white',
            fontSize: '16px', marginBottom: '16px'
          }}
        />

        <div style={{ display: 'flex', background: '#1e2937', borderRadius: '9999px', padding: '6px' }}>
          {[
            { key: 'tatca', label: 'Tất cả' },
            { key: 'chodoi', label: 'Chờ đối soát' },
            { key: 'dadoi', label: 'Đã đối soát' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                flex: 1, padding: '12px', borderRadius: '9999px',
                background: activeTab === tab.key ? '#22d3ee' : 'transparent',
                color: activeTab === tab.key ? '#0f172a' : '#94a3b8',
                fontWeight: 'bold', border: 'none', cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH ĐƠN */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: '#1e2937', borderRadius: '20px', overflow: 'hidden', border: '1px solid #334155' }}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, i) => (
              <div key={i} style={{
                padding: '20px',
                borderBottom: i < filteredOrders.length - 1 ? '1px solid #334155' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#22d3ee', fontSize: '17px' }}>{order.maDon}</div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>{order.ngay}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#22d3ee' }}>
                    {order.soPi.toLocaleString()} <span style={{ fontSize: '16px' }}>Pi</span>
                  </div>
                  <div style={{ color: order.color, fontWeight: 'bold' }}>{order.trangThai}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Không tìm thấy đơn hàng nào
            </div>
          )}
        </div>
      </div>

      {/* NÚT HÀNH ĐỘNG */}
      <div style={{ padding: '30px 20px' }}>
        <button 
          onClick={() => alert('🔄 Đang thực hiện đối soát tự động qua Pi Network...')}
          style={{
            width: '100%', padding: '18px', background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
            color: '#0f172a', border: 'none', borderRadius: '999px',
            fontSize: '17px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)'
          }}
        >
          ⚡ ĐỐI SOÁT NGAY
        </button>

        <button style={{
          width: '100%', marginTop: '12px', padding: '16px',
          background: 'transparent', color: '#94a3b8', border: '2px solid #475569',
          borderRadius: '999px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          📤 Xuất báo cáo Excel
        </button>
      </div>
    </div>
  );
}