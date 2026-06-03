import React, { useState, useEffect } from 'react';
import { useAppController } from '../hooks/useAppController';

export default function ReceivePackagePage() {
  const { updateTracking } = useAppController();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load real orders from localStorage (same as Order/Driver/Tracking flows)
    const all = JSON.parse(localStorage.getItem('ghn_pi_orders') || '[]');
    // For receiver: show recent non-cancelled, prefer those ready to receive
    const relevant = all
      .filter((o: any) => (o.status || o.trangThai || '') !== 'cancelled')
      .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 6);
    setOrders(relevant);
  }, []);

  const handleConfirmReceive = (maDon: string) => {
    const updated = orders.map((o: any) =>
      (o.maDon === maDon || o.id === maDon)
        ? { ...o, status: 'completed', trangThai: 'Hoàn thành', receivedAt: Date.now() }
        : o
    );
    setOrders(updated);
    // Persist + sync to engines/journey like other flows
    localStorage.setItem('ghn_pi_orders', JSON.stringify(updated));
    updateTracking({ maDon, status: 'completed', note: 'Người nhận đã xác nhận nhận hàng' });
    // Refresh from storage in case engine side effects
    setTimeout(() => {
      const refreshed = JSON.parse(localStorage.getItem('ghn_pi_orders') || '[]');
      setOrders(refreshed.filter((o: any) => (o.status || o.trangThai || '') !== 'cancelled').slice(0, 6));
    }, 100);
  };

  return (
    <div style={{ padding: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>📥</div>
        <h1 style={{ color: '#4c1d95', fontSize: 30, margin: 0 }}>ĐƠN CHỜ NHẬN</h1>
        <p style={{ color: '#6b7280', marginTop: 6 }}>Danh sách đơn hàng đang chờ bạn nhận</p>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', display: 'grid', gap: 14 }}>
        {orders.length === 0 && (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: 14 }}>Chưa có đơn chờ nhận. Tạo đơn từ Người gửi để test.</div>
        )}
        {orders.map((order, i) => {
          const ma = order.maDon || order.id || 'N/A';
          const from = order.senderInfo?.address || order.from || 'Không rõ';
          const st = order.status || order.trangThai || 'Chờ';
          const isDone = st.toLowerCase().includes('hoàn') || st.toLowerCase().includes('complete');
          return (
            <div key={i} style={{ background: 'white', padding: '20px 24px', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#1f2937' }}>{ma}</div>
                <div style={{ color: '#6b7280', fontSize: 14 }}>Từ: {from}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#22c55e', fontWeight: 600, fontSize: 15 }}>{st}</div>
                {!isDone && (
                  <button
                    onClick={() => handleConfirmReceive(ma)}
                    style={{ fontSize: '11px', color: '#4c1d95', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2 }}
                  >
                    ✓ Xác nhận đã nhận
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}