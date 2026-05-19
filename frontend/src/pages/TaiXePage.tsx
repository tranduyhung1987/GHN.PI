import React, { useState, useEffect } from 'react';

interface TaiXePageProps {
  onNavigate: (page: string) => void;
}

interface Order {
  maDon: string;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
  customer: string;
  address: string;
  fee: string;
  time: string;
  loai: string;
  paymentType?: string;
  ghiChu?: string;
}

const TaiXePage: React.FC<TaiXePageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'completed'>('pending');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  const loadOrders = () => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      const mapped = parsed.map((o: any) => ({
        maDon: o.maDon || o.id,
        status: o.status === 'cho-lay-hang' ? 'pending' : 
                o.status === 'dang-giao' ? 'shipping' : 
                o.status === 'hoan-thanh' ? 'completed' : 'pending',
        customer: o.nguoiNhan || 'Khách hàng',
        address: o.diaChiNhan || o.diaChiGui || '',
        fee: `${o.totalAmount?.toLocaleString() || '43.000'} Pi`,
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString() : 'N/A',
        loai: o.loaiDon === 'hoatoc' ? 'Hỏa Tốc' : 'Đường Dài',
        paymentType: o.paymentMethod || 'Prepaid',
        ghiChu: o.ghiChu || ''
      }));
      setOrders(mapped);
    }
  };

  const handleUpdateStatus = (maDon: string, newStatus: 'shipping' | 'completed' | 'cancelled') => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      const allOrders = JSON.parse(saved);
      const updated = allOrders.map((o: any) => 
        (o.maDon === maDon || o.id === maDon) 
          ? { ...o, status: newStatus === 'shipping' ? 'dang-giao' : newStatus === 'completed' ? 'hoan-thanh' : 'huy' }
          : o
      );
      localStorage.setItem('orders', JSON.stringify(updated));
      loadOrders();
      setSelectedOrder(null);
      alert(`Đã cập nhật trạng thái đơn ${maDon} thành ${newStatus}`);
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <button type="button" style={backBtnStyle} onClick={() => onNavigate('home')}>⬅ Trở Lại</button>
        <h2 style={headerTitleStyle}>Dashboard Tài Xế</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={filterContainerStyle}>
        {(['pending', 'shipping', 'completed', 'all'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            style={filter === f ? activeFilterStyle : filterStyle}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, idx) => (
            <div key={idx} style={orderCardStyle} onClick={() => setSelectedOrder(order)}>
              <div style={orderHeaderStyle}>
                <span style={{ fontWeight: '800', color: '#4c1d95' }}>{order.maDon}</span>
                <span style={getStatusStyle(order.status)}>{order.status}</span>
              </div>
              <div style={infoLineStyle}>👤 {order.customer}</div>
              <div style={infoLineStyle}>📍 {order.address}</div>
              <div style={{...infoLineStyle, fontWeight: '700', color: '#7c3aed'}}>💰 {order.fee}</div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Không có đơn hàng nào.</p>
        )}
      </div>

      {selectedOrder && (
        <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#4c1d95', marginBottom: '20px' }}>Đơn: {selectedOrder.maDon}</h3>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <p><strong>Khách:</strong> {selectedOrder.customer}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
              <p><strong>Ghi chú:</strong> {selectedOrder.ghiChu || 'Không có'}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedOrder.status === 'pending' && (
                <button onClick={() => handleUpdateStatus(selectedOrder.maDon, 'shipping')} style={purpleButton}>🚀 Nhận Đơn (Giao)</button>
              )}
              {selectedOrder.status === 'shipping' && (
                <button onClick={() => handleUpdateStatus(selectedOrder.maDon, 'completed')} style={successButton}>✅ Hoàn Thành</button>
              )}
              <button onClick={() => setSelectedOrder(null)} style={closeButtonStyle}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==================== STYLES ĐỒNG BỘ TÍM ==================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)', padding: '16px 14px 100px', boxSizing: 'border-box' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const backBtnStyle: React.CSSProperties = { padding: '10px 16px', background: 'white', border: '1px solid #f3e8ff', borderRadius: '9999px', color: '#4c1d95', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.04)' };
const headerTitleStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '800', color: '#4c1d95', margin: 0 };

const filterContainerStyle: React.CSSProperties = { display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px' };
const filterStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: '9999px', background: 'white', color: '#64748b', border: '1px solid #e9d5ff', fontWeight: '600', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' };
const activeFilterStyle: React.CSSProperties = { ...filterStyle, background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none' };

const orderCardStyle: React.CSSProperties = { background: 'white', padding: '18px', borderRadius: '24px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)', border: '1px solid #f3e8ff', cursor: 'pointer' };
const orderHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' };
const infoLineStyle: React.CSSProperties = { marginBottom: '6px', color: '#1e2937', fontSize: '14px' };

const getStatusStyle = (status: string): React.CSSProperties => ({
  fontSize: '11px', 
  padding: '4px 10px', 
  borderRadius: '9999px', 
  fontWeight: '700', 
  textTransform: 'uppercase',
  background: status === 'pending' ? '#f3e8ff' : status === 'shipping' ? '#dcfce7' : '#e0e7ff',
  color: status === 'pending' ? '#7c3aed' : status === 'shipping' ? '#16a34a' : '#4338ca'
});

const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(76, 29, 149, 0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalContentStyle: React.CSSProperties = { background: 'white', padding: '32px 24px', borderRadius: '28px', textAlign: 'center', maxWidth: '360px', width: '100%', border: '1px solid #f3e8ff' };

const purpleButton: React.CSSProperties = { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer' };
const successButton: React.CSSProperties = { ...purpleButton, background: '#16a34a' };
const closeButtonStyle: React.CSSProperties = { width: '100%', padding: '14px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: '9999px', fontWeight: '700', marginTop: '10px', cursor: 'pointer' };

export default TaiXePage;