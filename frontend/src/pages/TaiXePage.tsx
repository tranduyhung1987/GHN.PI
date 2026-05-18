import React, { useState, useEffect } from 'react';

interface TaiXePageProps {
  onNavigate: (page: string) => void;
}

interface Order {
  maDon: string;
  status: string;
  customer: string;
  address: string;
  fee: string;
  time: string;
  loai: string;
  paymentType?: string;
  ghiChu?: string;
}

const TaiXePage: React.FC<TaiXePageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'completed'>('pending'); // mặc định Chờ nhận
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const mapOrder = (o: any): Order => ({
    maDon: o.maDon || o.id,
    status: o.status === 'cho-lay-hang' ? 'pending' : 
            o.status === 'dang-giao' ? 'shipping' : 
            o.status === 'hoan-thanh' ? 'completed' : 'pending',
    customer: o.nguoiNhan || 'Khách hàng',
    address: o.diaChiNhan || o.diaChiGui || '',
    fee: `${o.totalAmount?.toLocaleString() || '43.000'} Pi`,
    time: o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong',
    loai: o.loaiDon === 'hoatoc' ? '⚡ Hỏa Tốc' : '🛣️ Đường Dài',
    paymentType: o.paymentMethod,
    ghiChu: o.ghiChu,
  });

  useEffect(() => {
    const loadOrders = () => {
      const saved = localStorage.getItem('orders');
      if (saved) setOrders(JSON.parse(saved).map(mapOrder));
    };
    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const updateOrderStatus = (maDon: string, newStatus: string) => {
    const saved = localStorage.getItem('orders');
    if (!saved) return;
    const allOrders = JSON.parse(saved);
    const updated = allOrders.map((o: any) => 
      (o.maDon === maDon || o.id === maDon) 
        ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
        : o
    );
    localStorage.setItem('orders', JSON.stringify(updated));
    setOrders(updated.map(mapOrder));
  };

  const nhanDon = (maDon: string) => {
    updateOrderStatus(maDon, 'dang-giao');
    alert(`✅ Đã nhận đơn ${maDon}!`);
  };

  const huyDon = (maDon: string) => {
    const reason = prompt("Nhập lý do hủy đơn:", "Không liên lạc được khách");
    if (!reason?.trim()) return alert("Vui lòng nhập lý do!");
    updateOrderStatus(maDon, 'cho-lay-hang');
    alert(`❌ Đã hủy đơn ${maDon}`);
  };

  const quetQR = (order: Order) => {
    const isHoatoc = order.loai.includes('Hỏa Tốc');
    const newStatus = isHoatoc ? 'dang-giao-den-nguoi-nhan' : 'dang-den-kho-trung-chuyen';
    const statusText = isHoatoc ? 'Đang giao đến người nhận' : 'Đang đến kho trung chuyển';

    updateOrderStatus(order.maDon, newStatus);

    const fakeCode = 'GHN' + Math.floor(10000000 + Math.random() * 90000000);
    alert(`✅ QUÉT QR THÀNH CÔNG!\nMã: ${fakeCode}\nĐơn: ${order.maDon}\nTrạng thái mới: ${statusText}`);
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={header}>
        <div style={{ fontSize: '46px' }}>🏍️</div>
        <div>
          <h1 style={title}>ĐƠN HÀNG TÀI XẾ</h1>
          <p style={subtitle}>Tổng {orders.length} đơn</p>
        </div>
      </div>

      {/* Tabs - Tất cả ở cuối */}
      <div style={tabContainer}>
        <button onClick={() => setFilter('pending')} style={filter === 'pending' ? activeTab : inactiveTab}>Chờ nhận</button>
        <button onClick={() => setFilter('shipping')} style={filter === 'shipping' ? activeTab : inactiveTab}>Đang giao</button>
        <button onClick={() => setFilter('completed')} style={filter === 'completed' ? activeTab : inactiveTab}>Hoàn thành</button>
        <button onClick={() => setFilter('all')} style={filter === 'all' ? activeTab : inactiveTab}>Tất cả</button>
      </div>

      {/* Danh sách đơn */}
      <div style={listContainer}>
        {filteredOrders.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>Không có đơn hàng nào</p>
        ) : (
          filteredOrders.map(order => (
            <div key={order.maDon} style={orderCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ color: '#4c1d95', fontSize: '18px' }}>{order.maDon}</strong>
                  <p style={{ margin: '6px 0 4px', color: '#6b21a8' }}>{order.customer}</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>{order.address}</p>
                  <p style={{ fontSize: '15px', fontWeight: '600' }}>{order.loai}</p>
                </div>
                <p style={{ color: '#22d3ee', fontWeight: '700', fontSize: '19px' }}>{order.fee}</p>
              </div>

              <div style={statusBadge(order.status)}>
                {order.status === 'pending' && '⏳ Chờ nhận'}
                {order.status === 'shipping' && '🚛 Đang giao'}
                {order.status === 'dang-giao-den-nguoi-nhan' && '🏠 Đang giao đến người nhận'}
                {order.status === 'dang-den-kho-trung-chuyen' && '🏬 Đang đến kho trung chuyển'}
                {order.status === 'completed' && '✅ Hoàn thành'}
              </div>

              <div style={buttonGroup}>
                {order.status === 'pending' && (
                  <button onClick={() => nhanDon(order.maDon)} style={acceptButton}>✅ NHẬN ĐƠN</button>
                )}

                {order.status === 'shipping' && (
                  <>
                    <button onClick={() => huyDon(order.maDon)} style={cancelButton}>❌ HỦY</button>
                    <button onClick={() => quetQR(order)} style={qrButton}>📷 QUÉT QR HOÀN THÀNH</button>
                  </>
                )}

                <button onClick={() => setSelectedOrder(order)} style={detailButton}>Chi tiết</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Chi tiết */}
      {selectedOrder && (
        <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h2>Chi tiết đơn {selectedOrder.maDon}</h2>
            <p><strong>Khách:</strong> {selectedOrder.customer}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
            <p><strong>Loại:</strong> {selectedOrder.loai}</p>
            <p><strong>Phí:</strong> {selectedOrder.fee}</p>
            <button onClick={() => setSelectedOrder(null)} style={closeButton}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f3e8ff', padding: '16px 0 100px' };
const header: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '14px', padding: '0 16px', marginBottom: '16px' };
const title: React.CSSProperties = { fontSize: '22px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle: React.CSSProperties = { color: '#6b21a8', margin: 0, fontSize: '15px' };

const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', padding: '0 16px', marginBottom: '20px', overflowX: 'auto' };
const activeTab: React.CSSProperties = { padding: '10px 20px', background: '#22d3ee', color: '#0f172a', borderRadius: '9999px', fontWeight: '600', whiteSpace: 'nowrap' };
const inactiveTab: React.CSSProperties = { padding: '10px 20px', background: '#fff', color: '#6b21a8', border: '1px solid #c4b5fd', borderRadius: '9999px', whiteSpace: 'nowrap' };

const listContainer: React.CSSProperties = { padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' };
const orderCard: React.CSSProperties = { background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e0d4ff' };

const statusBadge = (status: string): React.CSSProperties => ({
  display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: '600', marginTop: '12px',
  background: status.includes('dang-giao') ? '#dbeafe' : status === 'completed' ? '#d1fae5' : '#fef3c7',
  color: status.includes('dang-giao') ? '#3b82f6' : status === 'completed' ? '#10b981' : '#d97706'
});

const buttonGroup: React.CSSProperties = { marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' };
const acceptButton: React.CSSProperties = { flex: 1, padding: '14px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700' };
const cancelButton: React.CSSProperties = { flex: 1, padding: '14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700' };
const qrButton: React.CSSProperties = { flex: 1, padding: '14px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700' };
const detailButton: React.CSSProperties = { flex: 1, padding: '14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '600' };

const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent: React.CSSProperties = { background: '#fff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '400px' };
const closeButton: React.CSSProperties = { marginTop: '20px', padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '9999px', width: '100%' };

export default TaiXePage;