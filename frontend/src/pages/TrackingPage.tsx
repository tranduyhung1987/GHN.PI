import React, { useState } from 'react';

interface TrackingPageProps {
  onNavigate: (page: string) => void;
}

type OrderStatus = 'DangXuLy' | 'DangLayHang' | 'DangGiao' | 'DaGiao' | 'Huy';

interface TrackingOrder {
  maDon: string;
  loai: string;
  nguoiNhan: string;
  diaChi: string;
  taiXe: string;
  trangThai: OrderStatus;
  soPi: number;
  viTriHienTai: string;
  thoiGianCapNhat: string;
  repScore: number;
  timeline: Array<{ time: string; status: string; done: boolean }>;
}

function TrackingPage({ onNavigate }: TrackingPageProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<TrackingOrder | null>(null);

  const [orders] = useState<TrackingOrder[]>([
    {
      maDon: "GHN17489231",
      loai: "Hỏa Tốc",
      nguoiNhan: "Nguyễn Thị Lan",
      diaChi: "123 Đường ABC, Quận 1, TP.HCM",
      taiXe: "Anh Minh • BKS 51H-12345",
      trangThai: 'DangGiao',
      soPi: 45000,
      viTriHienTai: "Cách điểm giao 0.8km",
      thoiGianCapNhat: "15/05/2026 14:30",
      repScore: 92,
      timeline: [
        { time: "08:15", status: "Đơn đã tạo", done: true },
        { time: "09:40", status: "Tài xế nhận đơn", done: true },
        { time: "11:20", status: "Đang lấy hàng", done: true },
        { time: "13:45", status: "Đang giao hàng", done: true },
        { time: "14:30", status: "Gần đến nơi", done: false },
      ]
    },
    {
      maDon: "GHN17488902",
      loai: "Đường Dài",
      nguoiNhan: "Trần Văn Hải",
      diaChi: "456 Nguyễn Văn Linh, Quận 7",
      taiXe: "Chị Ngọc • BKS 79A-56789",
      trangThai: 'DaGiao',
      soPi: 28500,
      viTriHienTai: "Đã giao thành công",
      thoiGianCapNhat: "14/05/2026 14:35",
      repScore: 81,
      timeline: [
        { time: "07:00", status: "Đơn đã tạo", done: true },
        { time: "09:30", status: "Tài xế nhận đơn", done: true },
        { time: "12:15", status: "Đang giao hàng", done: true },
        { time: "14:35", status: "Đã giao thành công", done: true },
      ]
    }
  ]);

  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(o => o.trangThai === activeFilter);

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = { 
      DangXuLy: '#eab308', DangLayHang: '#3b82f6', 
      DangGiao: '#22d3ee', DaGiao: '#22c55e', Huy: '#ef4444' 
    };
    return colors[status];
  };

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>📍 TRACKING</h1>
        <button style={refreshBtn}>🔄 Cập nhật</button>
      </div>

      <p style={subtitle}>Theo dõi đơn hàng thời gian thực • Minh bạch trên blockchain</p>

      {/* FILTER TABS */}
      <div style={filterContainer}>
        {(['All', 'DangGiao', 'DaGiao', 'DangXuLy'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={activeFilter === f ? activeFilterStyle : filterStyle}
          >
            {f === 'All' ? 'Tất cả' : f === 'DangGiao' ? 'Đang giao' : f === 'DaGiao' ? 'Đã giao' : 'Đang xử lý'}
          </button>
        ))}
      </div>

      {/* DANH SÁCH ĐƠN */}
      {filteredOrders.map((order) => (
        <div key={order.maDon} style={orderCard} onClick={() => setSelectedOrder(order)}>
          <div style={orderHeader}>
            <div>
              <span style={{ fontWeight: '700', fontSize: '17px' }}>{order.maDon}</span>
              <span style={{ marginLeft: '10px', color: '#6b21a8' }}>{order.loai}</span>
            </div>
            <span style={{ 
              padding: '4px 12px', 
              borderRadius: '9999px', 
              backgroundColor: getStatusColor(order.trangThai) + '20',
              color: getStatusColor(order.trangThai),
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {order.trangThai === 'DangGiao' ? 'Đang giao' : 
               order.trangThai === 'DaGiao' ? 'Đã giao' : 'Đang xử lý'}
            </span>
          </div>

          <div style={infoLine}><strong>Người nhận:</strong> {order.nguoiNhan}</div>
          <div style={infoLine}><strong>Địa chỉ:</strong> {order.diaChi}</div>

          <div style={driverLine}>
            <div>🏍️ {order.taiXe}</div>
            <div style={{ color: '#eab308' }}>{order.repScore} ★</div>
          </div>

          <div style={{ marginTop: '12px', color: '#64748b', fontSize: '14.5px' }}>
            {order.viTriHienTai}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 90px',
  boxSizing: 'border-box'
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
};

const title: React.CSSProperties = { fontSize: '28px', fontWeight: '700', color: '#4c1d95' };
const subtitle: React.CSSProperties = { color: '#6b21a8', marginBottom: '20px', fontSize: '15px' };

const filterContainer: React.CSSProperties = { 
  display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' 
};

const filterStyle: React.CSSProperties = { 
  padding: '10px 20px', borderRadius: '9999px', background: '#ede9fe', color: '#4c1d95', 
  border: '1px solid #c4b5fd', whiteSpace: 'nowrap' as const 
};

const activeFilterStyle: React.CSSProperties = { 
  ...filterStyle, background: '#22d3ee', color: '#0f172a', fontWeight: '700' 
};

const orderCard: React.CSSProperties = { 
  background: 'white', padding: '20px', borderRadius: '20px', marginBottom: '16px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)', cursor: 'pointer' 
};

const orderHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' };
const infoLine: React.CSSProperties = { marginBottom: '8px', color: '#334155' };
const driverLine: React.CSSProperties = { 
  display: 'flex', justifyContent: 'space-between', background: '#1e2937', color: 'white', 
  padding: '12px', borderRadius: '12px', margin: '12px 0' 
};

const refreshBtn: React.CSSProperties = {
  padding: '8px 16px',
  background: '#ede9fe',
  color: '#4c1d95',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  fontWeight: '600',
  cursor: 'pointer'
};

export default TrackingPage;