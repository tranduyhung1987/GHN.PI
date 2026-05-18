import React, { useState, useEffect } from 'react';
import Skeleton from '../components/Skeleton';

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
      const parsed = JSON.parse(saved);
      const mapped = parsed.map((o: any) => ({
        maDon: o.maDon || o.id,
        loaiDon: o.loaiDon,
        nguoiNhan: o.nguoiNhan,
        diaChiNhan: o.diaChiNhan,
        diaChiGui: o.diaChiGui,
        totalAmount: o.totalAmount || o.shippingFee || 0,
        paymentMethod: o.paymentMethod,
        piPaymentId: o.piPaymentId,
        piTx: o.piTx,
        trangThai: o.status || 'DangXuLy',
        viTriHienTai: o.status === 'cho-lay-hang' ? 'Đang chờ tài xế nhận' : 
                     o.status === 'dang-giao' ? 'Đang giao hàng' : 'Đã cập nhật',
        thoiGianCapNhat: o.updatedAt || o.createdAt,
        timeline: [
          { time: "08:15", status: "Đơn đã tạo & thanh toán Pi", done: true },
          { time: "09:40", status: "Tài xế nhận đơn", done: o.status !== 'cho-lay-hang' },
          { time: "11:20", status: "Đang lấy hàng", done: false },
          { time: "13:45", status: "Đang giao hàng", done: false },
        ]
      }));
      setOrders(mapped);
    }
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('storage', loadOrders);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => {
      window.removeEventListener('storage', loadOrders);
      clearTimeout(timer);
    };
  }, []);

  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(o => o.trangThai.includes(activeFilter.toLowerCase()));

  const getStatusColor = (status: string) => {
    if (status.includes('hoan-thanh') || status.includes('completed')) return '#22c55e';
    if (status.includes('dang-giao') || status.includes('shipping')) return '#22d3ee';
    if (status.includes('cho-lay') || status.includes('pending')) return '#eab308';
    return '#ef4444';
  };

  const getPaymentText = (type?: string, piTx?: string) => {
    if (type === 'cod') return '📦 Thu hộ Pi';
    return piTx && piTx !== 'pending' ? '✅ Đã thanh toán Pi' : '💰 Thanh toán trước (Pi)';
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <h1 style={title}>📍 TRACKING</h1>
        <button style={refreshBtn} onClick={loadOrders}>🔄 Cập nhật</button>
      </div>

      <p style={subtitle}>Theo dõi đơn hàng thời gian thực • Thanh toán Pi minh bạch</p>

      <div style={filterContainer}>
        {(['All', 'DangGiao', 'DaGiao'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={activeFilter === f ? activeFilterStyle : filterStyle}
          >
            {f === 'All' ? 'Tất cả' : f === 'DangGiao' ? 'Đang giao' : 'Đã giao'}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton count={2} />
      ) : filteredOrders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '60px 20px' }}>
          Chưa có đơn hàng nào để theo dõi
        </p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.maDon} style={orderCard} onClick={() => setSelectedOrder(order)}>
            <div style={orderHeader}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '17px' }}>{order.maDon}</span>
                <span style={{ marginLeft: '10px', color: '#6b21a8' }}>
                  {order.loaiDon === 'hoatoc' ? '⚡ Hỏa Tốc' : '🛣️ Đường Dài'}
                </span>
              </div>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '9999px', 
                backgroundColor: getStatusColor(order.trangThai) + '20',
                color: getStatusColor(order.trangThai),
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {order.trangThai}
              </span>
            </div>

            <div style={infoLine}><strong>Người nhận:</strong> {order.nguoiNhan}</div>
            <div style={infoLine}><strong>Địa chỉ:</strong> {order.diaChiNhan}</div>

            <div style={{ marginTop: '8px', color: '#10b981', fontSize: '14.5px' }}>
              {getPaymentText(order.paymentMethod, order.piTx)}
            </div>

            {order.piPaymentId && (
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                Pi ID: {order.piPaymentId.slice(0, 16)}...
              </div>
            )}

            <div style={{ marginTop: '12px', color: '#64748b', fontSize: '14.5px' }}>
              {order.viTriHienTai}
            </div>
          </div>
        ))
      )}

      {selectedOrder && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Chi tiết Tracking</h2>
            <p><strong>Mã đơn:</strong> {selectedOrder.maDon}</p>
            <p><strong>Thanh toán:</strong> {getPaymentText(selectedOrder.paymentMethod, selectedOrder.piTx)}</p>
            {selectedOrder.piPaymentId && <p><strong>Pi Payment ID:</strong> {selectedOrder.piPaymentId}</p>}
            <button onClick={() => setSelectedOrder(null)} style={closeButton}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES GIỮ NGUYÊN ===================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f3e8ff', padding: '16px 14px 100px', boxSizing: 'border-box' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' };
const title: React.CSSProperties = { fontSize: '28px', fontWeight: '700', color: '#4c1d95' };
const subtitle: React.CSSProperties = { color: '#6b21a8', marginBottom: '20px', fontSize: '15px' };

const filterContainer: React.CSSProperties = { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' };
const filterStyle: React.CSSProperties = { padding: '10px 20px', borderRadius: '9999px', background: '#ede9fe', color: '#4c1d95', border: '1px solid #c4b5fd', whiteSpace: 'nowrap' as const };
const activeFilterStyle: React.CSSProperties = { ...filterStyle, background: '#22d3ee', color: '#0f172a', fontWeight: '700' };

const orderCard: React.CSSProperties = { background: 'white', padding: '20px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', cursor: 'pointer' };
const orderHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' };
const infoLine: React.CSSProperties = { marginBottom: '8px', color: '#334155' };

const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent: React.CSSProperties = { background: '#fff', padding: '30px', borderRadius: '20px', maxWidth: '380px', width: '90%', textAlign: 'center' as const };
const closeButton: React.CSSProperties = { padding: '14px 24px', background: '#64748b', color: 'white', border: 'none', borderRadius: '9999px', marginTop: '20px', width: '100%' };

const refreshBtn: React.CSSProperties = { padding: '8px 16px', background: '#ede9fe', color: '#4c1d95', border: '1px solid #c4b5fd', borderRadius: '9999px', fontWeight: '600', cursor: 'pointer' };

export default TrackingPage;