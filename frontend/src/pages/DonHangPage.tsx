import React, { useState, useEffect } from 'react';
import Skeleton from '../components/Skeleton';

interface DonHangPageProps {
  onNavigate: (page: string) => void;
}

interface Order {
  id: string;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
  customer: string;
  address: string;
  fee: string;
  time: string;
  loai: string;
  ghiChu?: string;
  paymentType?: 'prepaid' | 'cod';   // Bổ sung Thu hộ Pi
}

const DonHangPage: React.FC<DonHangPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

  const orders: Order[] = [
    { 
      id: "GHN17489231", 
      status: "shipping", 
      customer: "Nguyễn Thị Lan", 
      address: "123 Đường ABC, Quận 1, TP.HCM", 
      fee: "45.000 Pi", 
      time: "2 giờ trước",
      loai: "Hỏa Tốc",
      ghiChu: "Giao trước 12h trưa",
      paymentType: "prepaid"
    },
    { 
      id: "GHN17488902", 
      status: "completed", 
      customer: "Trần Văn Hải", 
      address: "456 Nguyễn Văn Linh, Quận 7, TP.HCM", 
      fee: "28.500 Pi", 
      time: "Hôm qua",
      loai: "Đường Dài",
      paymentType: "cod"
    },
    { 
      id: "GHN17487654", 
      status: "pending", 
      customer: "Lê Thị Hoa", 
      address: "89 Lê Lợi, Quận 1, TP.HCM", 
      fee: "32.000 Pi", 
      time: "5 giờ trước",
      loai: "Hỏa Tốc",
      paymentType: "prepaid"
    },
    { 
      id: "GHN17486543", 
      status: "cancelled", 
      customer: "Phạm Minh Quân", 
      address: "112 Pasteur, Quận 3, TP.HCM", 
      fee: "38.000 Pi", 
      time: "2 ngày trước",
      loai: "Đường Dài",
      paymentType: "cod"
    },
  ];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [filter]);

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return '⏳ Chờ lấy hàng';
      case 'shipping': return '🚛 Đang giao';
      case 'completed': return '✅ Hoàn thành';
      case 'cancelled': return '❌ Đã hủy';
      default: return '';
    }
  };

  const getPaymentText = (type?: string) => {
    return type === 'cod' ? '📦 Thu hộ Pi' : '💰 Thanh toán trước';
  };

  const handleCancelOrder = (id: string) => {
    setShowCancelConfirm(id);
  };

  const confirmCancel = () => {
    if (showCancelConfirm) {
      alert(`✅ Đơn hàng ${showCancelConfirm} đã được hủy thành công!`);
      setShowCancelConfirm(null);
    }
  };

  return (
    <div style={pageContainer}>
      {/* Header - GIỮ NGUYÊN */}
      <div style={header}>
        <div style={{ fontSize: '46px' }}>📦</div>
        <div>
          <h1 style={title}>ĐƠN HÀNG CỦA TÔI</h1>
          <p style={subtitle}>Tổng {orders.length} đơn • Quản lý & theo dõi</p>
        </div>
      </div>

      {/* Tạo đơn mới - GIỮ NGUYÊN */}
      <div style={{ padding: '0 20px 20px' }}>
        <button 
          onClick={() => onNavigate('gui-hang')}
          style={createButton}
        >
          + TẠO ĐƠN HÀNG MỚI
        </button>
      </div>

      {/* Search - GIỮ NGUYÊN */}
      <div style={{ padding: '0 20px 20px' }}>
        <input
          type="text"
          placeholder="Tìm mã đơn hoặc tên người nhận..."
          style={searchInput}
        />
      </div>

      {/* Filter Tabs - ĐÃ BỔ SUNG ĐÃ HỦY */}
      <div style={tabContainer}>
        <button onClick={() => setFilter('all')} style={filter === 'all' ? activeTab : inactiveTab}>Tất cả</button>
        <button onClick={() => setFilter('pending')} style={filter === 'pending' ? activeTab : inactiveTab}>Chờ lấy</button>
        <button onClick={() => setFilter('shipping')} style={filter === 'shipping' ? activeTab : inactiveTab}>Đang giao</button>
        <button onClick={() => setFilter('completed')} style={filter === 'completed' ? activeTab : inactiveTab}>Hoàn thành</button>
        <button onClick={() => setFilter('cancelled')} style={filter === 'cancelled' ? activeTab : inactiveTab}>Đã hủy</button>
      </div>

      {/* Orders List */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <Skeleton count={3} />
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} style={orderCard}>
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
                {getStatusText(order.status)}
              </div>

              <p style={{ fontSize: '13.5px', color: '#10b981', marginTop: '8px' }}>
                {getPaymentText(order.paymentType)}
              </p>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <button onClick={() => onNavigate('tracking')} style={trackButton}>Theo dõi</button>
                <button onClick={() => setSelectedOrder(order)} style={detailButton}>Chi tiết</button>
                {order.status === 'pending' && (
                  <button onClick={() => handleCancelOrder(order.id)} style={cancelButton}>Hủy đơn</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Chi tiết đơn - ĐÃ BỔ SUNG THU HỘ */}
      {selectedOrder && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ color: '#4c1d95' }}>Chi tiết đơn hàng</h2>
            <p><strong>Mã đơn:</strong> {selectedOrder.id}</p>
            <p><strong>Trạng thái:</strong> {getStatusText(selectedOrder.status)}</p>
            <p><strong>Thanh toán:</strong> {getPaymentText(selectedOrder.paymentType)}</p>
            <p><strong>Người nhận:</strong> {selectedOrder.customer}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
            <p><strong>Loại:</strong> {selectedOrder.loai}</p>
            <p><strong>Phí:</strong> {selectedOrder.fee}</p>
            {selectedOrder.ghiChu && <p><strong>Ghi chú:</strong> {selectedOrder.ghiChu}</p>}
            
            <button onClick={() => setSelectedOrder(null)} style={closeButton}>Đóng</button>
          </div>
        </div>
      )}

      {/* Modal Xác nhận hủy - GIỮ NGUYÊN */}
      {showCancelConfirm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ color: '#ef4444' }}>Xác nhận hủy đơn?</h2>
            <p>Bạn có chắc muốn hủy đơn {showCancelConfirm}?</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setShowCancelConfirm(null)} style={closeButton}>Không</button>
              <button onClick={confirmCancel} style={cancelButtonModal}>Có, hủy đơn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES (GIỮ NGUYÊN) ===================== */
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
  fontSize: '22px', 
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
  background: status === 'completed' ? '#d1fae5' : status === 'shipping' ? '#dbeafe' : status === 'pending' ? '#fef3c7' : '#fee2e2',
  color: status === 'completed' ? '#10b981' : status === 'shipping' ? '#3b82f6' : status === 'pending' ? '#d97706' : '#ef4444'
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

const detailButton = {
  flex: 1,
  padding: '12px',
  background: '#6366f1',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600'
};

const cancelButton = {
  flex: 1,
  padding: '12px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600'
};

const modalOverlay = { 
  position: 'fixed' as const, 
  top: 0, left: 0, right: 0, bottom: 0, 
  background: 'rgba(0,0,0,0.85)', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  zIndex: 1000 
};

const modalContent = { 
  background: '#fff', 
  padding: '30px', 
  borderRadius: '20px', 
  maxWidth: '380px', 
  width: '90%',
  textAlign: 'center' as const 
};

const closeButton = {
  padding: '14px 24px',
  background: '#64748b',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  marginTop: '20px',
  width: '100%'
};

const cancelButtonModal = {
  padding: '14px 24px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  width: '100%'
};

export default DonHangPage;