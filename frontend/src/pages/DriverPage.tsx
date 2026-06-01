import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../services/firebase/orderService';

export default function DriverPage() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'completed'>('pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDriverOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await getAllOrders(100);
      setOrders(allOrders);
    } catch {
      const local = localStorage.getItem('ghn_pi_orders');
      if (local) setOrders(JSON.parse(local));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriverOrders();
  }, []);

  const mapStatus = (status: string) => {
    if (!status) return 'pending';
    if (['created', 'paid'].includes(status)) return 'pending';
    if (['picked_up', 'in_transit'].includes(status)) return 'shipping';
    if (status === 'delivered') return 'completed';
    return status;
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => mapStatus(o.status || o.trangThai) === filter);

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <button onClick={() => navigate('/')} style={backBtn}>⬅ Về trang chủ</button>
        <h2 style={{ color: '#4c1d95', margin: 0 }}>Đơn hàng Tài Xế</h2>
        <div style={{ width: 80 }}></div>
      </div>

      <div style={filterContainer}>
        {(['pending', 'shipping', 'completed', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={filter === f ? activeFilterBtn : filterBtn}
          >
            {f === 'all' ? 'TẤT CẢ' : f.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: 40 }}>Đang tải đơn hàng...</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order: any, index: number) => {
            const displayStatus = order.status || order.trangThai || 'pending';
            const mapped = mapStatus(displayStatus);

            return (
              <div
                key={index}
                style={orderCard}
                onClick={() => navigate(`/tracking/${order.maDon}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#4c1d95', fontSize: 17 }}>{order.maDon}</strong>
                  <span style={getStatusStyle(mapped)}>{mapped}</span>
                </div>
                <p style={{ margin: '8px 0 4px', color: '#334155' }}>
                  👤 {order.nguoiNhan || order.customer || 'N/A'}
                </p>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  📍 {order.diaChiNhan || order.address || 'N/A'}
                </p>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: 40 }}>Không có đơn hàng</p>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 16 }}>
        Nhấn vào đơn để xem &amp; cập nhật chi tiết tại trang Tracking
      </p>
    </div>
  );
}

/* Styles */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8fafc', paddingBottom: 90 };
const headerStyle: React.CSSProperties = { padding: '20px 16px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const backBtn: React.CSSProperties = { padding: '8px 14px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: 999, fontWeight: 600 };
const filterContainer: React.CSSProperties = { display: 'flex', gap: 8, padding: '0 16px 16px', overflowX: 'auto' };
const filterBtn: React.CSSProperties = { padding: '8px 16px', borderRadius: 999, background: 'white', color: '#64748b', border: '1px solid #e9d5ff', fontWeight: 600, whiteSpace: 'nowrap' };
const activeFilterBtn: React.CSSProperties = { ...filterBtn, background: '#4c1d95', color: 'white', border: 'none' };
const orderCard: React.CSSProperties = { background: 'white', padding: 18, borderRadius: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' };

const getStatusStyle = (status: string): React.CSSProperties => ({
  fontSize: 12, padding: '4px 10px', borderRadius: 999, fontWeight: 700,
  background: status === 'pending' ? '#fef3c7' : status === 'shipping' ? '#dcfce7' : '#e0e7ff',
  color: status === 'pending' ? '#d97706' : status === 'shipping' ? '#16a34a' : '#4338ca'
});
