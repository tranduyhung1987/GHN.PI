import React, { useState, useEffect } from 'react';

interface TrackingPageProps {
  onNavigate: (page: string) => void;
}

interface TrackingOrder {
  maDon: string;
  loaiDon: string;
  nguoiNhan: string;
  diaChiNhan: string;
  diaChiGui?: string;
  taiXe?: string;
  trangThai: string;
  totalAmount: number;
  paymentMethod?: 'prepaid' | 'cod';
  piPaymentId?: string;
  piTx?: string;
  viTriHienTai?: string;
  thoiGianCapNhat?: string;
  timeline?: Array<{ time: string; status: string; done: boolean }>;
}

function TrackingPage({ onNavigate }: TrackingPageProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | string>('All');
  const [selectedOrder, setSelectedOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<TrackingOrder[]>([]);

  const loadOrders = () => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mapped = parsed.map((o: any) => ({
          maDon: o.maDon || o.id,
          loaiDon: o.loaiDon || 'hoatoc',
          nguoiNhan: o.nguoiNhan,
          diaChiNhan: o.diaChiNhan,
          diaChiGui: o.diaChiGui,
          taiXe: o.taiXe || 'Chưa phân công',
          trangThai: o.status || 'cho-lay-hang',
          totalAmount: o.totalAmount || 0,
          paymentMethod: 'prepaid',
          piPaymentId: o.piPaymentId,
          piTx: o.piTx,
          viTriHienTai: o.viTriHienTai || 'Kho trung chuyển',
          thoiGianCapNhat: new Date().toLocaleTimeString(),
          timeline: [
            { time: '08:00', status: 'Đã tạo đơn', done: true },
            { time: '09:30', status: 'Đang điều phối', done: o.status !== 'cho-lay-hang' }
          ]
        }));
        setOrders(mapped);
      } catch (e) {
        console.error("Lỗi khi tải đơn hàng:", e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(o => o.trangThai === activeFilter);

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <button type="button" style={backBtnStyle} onClick={() => onNavigate('home')}>⬅ Trở Lại</button>
        <h2 style={headerTitleStyle}>Tracking Đơn Hàng</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={filterContainerStyle}>
        {['All', 'cho-lay-hang', 'dang-giao', 'hoan-thanh'].map(f => (
          <button 
            key={f} 
            onClick={() => setActiveFilter(f)}
            style={activeFilter === f ? activeFilterStyle : filterStyle}
          >
            {f === 'All' ? 'Tất cả' : f.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Đang tải...</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={index} style={orderCardStyle} onClick={() => setSelectedOrder(order)}>
              <div style={orderHeaderStyle}>
                <span style={{ fontWeight: '800', color: '#4c1d95' }}>{order.maDon}</span>
                <span style={statusBadge}>{order.trangThai.replace('-', ' ')}</span>
              </div>
              <div style={infoLineStyle}>🚚 {order.loaiDon === 'hoatoc' ? 'Hỏa tốc' : 'Đường dài'}</div>
              <div style={infoLineStyle}>👤 {order.nguoiNhan}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>📍 {order.diaChiNhan}</div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Chưa có đơn hàng nào ở trạng thái này.</p>
        )}
      </div>

      {selectedOrder && (
        <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#4c1d95', margin: '0 0 15px 0' }}>Chi tiết: {selectedOrder.maDon}</h3>
            <div style={{ textAlign: 'left', fontSize: '14px', lineHeight: '1.8' }}>
              <p><strong>Người nhận:</strong> {selectedOrder.nguoiNhan}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.diaChiNhan}</p>
              <p><strong>Trạng thái:</strong> {selectedOrder.trangThai}</p>
              <p><strong>Tổng tiền:</strong> {selectedOrder.totalAmount} Pi</p>
            </div>
            <button style={closeButtonStyle} onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

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
const statusBadge: React.CSSProperties = { fontSize: '11px', background: '#f3e8ff', color: '#7c3aed', padding: '4px 10px', borderRadius: '9999px', fontWeight: '700', textTransform: 'uppercase' };
const infoLineStyle: React.CSSProperties = { marginBottom: '6px', color: '#1e2937', fontSize: '14px' };

const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(76, 29, 149, 0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalContentStyle: React.CSSProperties = { background: 'white', padding: '32px 24px', borderRadius: '28px', textAlign: 'center', maxWidth: '360px', width: '100%', border: '1px solid #f3e8ff' };
const closeButtonStyle: React.CSSProperties = { width: '100%', padding: '14px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: '9999px', fontWeight: '700', marginTop: '20px', cursor: 'pointer' };

export default TrackingPage;