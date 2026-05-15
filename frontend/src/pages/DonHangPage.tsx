import React, { useState, useEffect } from 'react';
import Skeleton from '../components/Skeleton';

interface DonHangPageProps {
  onNavigate: (page: string) => void;
}

const DonHangPage: React.FC<DonHangPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'completed'>('all');
  const [loading, setLoading] = useState(true);   // ← Thêm loading

  const orders = [
    { 
      id: "GHN17489231", 
      status: "shipping", 
      customer: "Nguyễn Thị Lan", 
      address: "123 Đường ABC, Quận 1, TP.HCM", 
      fee: "45.000 Pi", 
      time: "2 giờ trước",
      loai: "Hỏa Tốc"
    },
    { 
      id: "GHN17488902", 
      status: "completed", 
      customer: "Trần Văn Hải", 
      address: "456 Nguyễn Văn Linh, Quận 7, TP.HCM", 
      fee: "28.500 Pi", 
      time: "Hôm qua",
      loai: "Đường Dài"
    },
    { 
      id: "GHN17487654", 
      status: "pending", 
      customer: "Lê Thị Hoa", 
      address: "89 Lê Lợi, Quận 1, TP.HCM", 
      fee: "32.000 Pi", 
      time: "5 giờ trước",
      loai: "Hỏa Tốc"
    },
  ];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  // Giả lập loading khi vào trang
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1600); // 1.6 giây loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={header}>
        <div style={{ fontSize: '46px' }}>📦</div>
        <div>
          <h1 style={title}>ĐƠN HÀNG CỦA TÔI</h1>
          <p style={subtitle}>Tổng {orders.length} đơn • Quản lý & theo dõi</p>
        </div>
      </div>

      {/* Tạo đơn mới */}
      <div style={{ padding: '0 20px 20px' }}>
        <button 
          onClick={() => onNavigate('gui-hang')}
          style={createButton}
        >
          + TẠO ĐƠN HÀNG MỚI
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0 20px 20px' }}>
        <input
          type="text"
          placeholder="Tìm mã đơn hoặc tên người nhận..."
          style={searchInput}
        />
      </div>

      {/* Filter Tabs */}
      <div style={tabContainer}>
        <button onClick={() => setFilter('all')} style={filter === 'all' ? activeTab : inactiveTab}>Tất cả</button>
        <button onClick={() => setFilter('pending')} style={filter === 'pending' ? activeTab : inactiveTab}>Chờ xử lý</button>
        <button onClick={() => setFilter('shipping')} style={filter === 'shipping' ? activeTab : inactiveTab}>Đang giao</button>
        <button onClick={() => setFilter('completed')} style={filter === 'completed' ? activeTab : inactiveTab}>Hoàn thành</button>
      </div>

      {/* Orders List + Skeleton */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <Skeleton count={3} />
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} style={orderCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ color: '#4c1d95', fontSize: '17px' }}>{order.id}</strong>
                  <p style={{ margin: '6px 0 4px', color: '#6b21a8' }}>{order.customer}</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>{order.address}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#22d3ee', fontWeight: '700', fontSize: '18px' }}>{order.fee}</p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{order.time}</p>
                </div>
              </div>

              <div style={statusBadge(order.status)}>
                {order.status === 'pending' && '⏳ Chờ xử lý'}
                {order.status === 'shipping' && '🚛 Đang giao'}
                {order.status === 'completed' && '✅ Hoàn thành'}
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <button onClick={() => onNavigate('tracking')} style={trackButton}>Theo dõi</button>
                <button onClick={() => onNavigate('khieu-nai')} style={complainButton}>Khiếu nại</button>
              </div>
            </div>
          ))
        )}
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
  display: 'flex', 
  alignItems: 'center', 
  gap: '14px', 
  marginBottom: '20px',
  padding: '0 10px'
};

const title = { 
  fontSize: '26px', 
  fontWeight: '700', 
  color: '#4c1d95', 
  margin: 0 
};

const subtitle = { 
  color: '#6b21a8', 
  margin: 0, 
  fontSize: '15px' 
};

const createButton = {
  width: '100%',
  padding: '17px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)'
};

const searchInput = {
  width: '100%',
  padding: '16px 20px',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  background: 'white',
  fontSize: '16px'
};

const tabContainer = { 
  display: 'flex', 
  gap: '8px', 
  marginBottom: '24px', 
  padding: '0 14px',
  overflowX: 'auto' as const 
};

const activeTab = { 
  padding: '10px 20px', 
  background: '#22d3ee', 
  color: '#0f172a', 
  borderRadius: '9999px', 
  fontWeight: '600',
  whiteSpace: 'nowrap' as const
};

const inactiveTab = { 
  padding: '10px 20px', 
  background: '#fff', 
  color: '#6b21a8', 
  border: '1px solid #c4b5fd', 
  borderRadius: '9999px',
  whiteSpace: 'nowrap' as const
};

const orderCard = {
  background: '#fff',
  padding: '20px',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e0d4ff'
};

const statusBadge = (status: string) => ({
  display: 'inline-block',
  padding: '6px 16px',
  borderRadius: '9999px',
  fontSize: '14px',
  marginTop: '12px',
  fontWeight: '600',
  background: status === 'completed' ? '#d1fae5' : status === 'shipping' ? '#dbeafe' : '#fef3c7',
  color: status === 'completed' ? '#10b981' : status === 'shipping' ? '#3b82f6' : '#d97706'
});

const trackButton = {
  flex: 1,
  padding: '12px',
  background: '#22d3ee',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600'
};

const complainButton = {
  flex: 1,
  padding: '12px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600'
};

export default DonHangPage;