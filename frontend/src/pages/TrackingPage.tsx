// src/pages/TrackingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ĐỊNH NGHĨA STYLES LÊN TRÊN ĐỂ TRÁNH LỖI "Cannot find name" ---
const pageContainer: React.CSSProperties = { minHeight: '100vh', padding: '20px', background: '#f8fafc' };
const headerStyle: React.CSSProperties = { marginBottom: '20px', padding: '20px', background: '#4c1d95', borderRadius: '16px', color: 'white' };
const listContainer: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px' };
const orderCardStyle: React.CSSProperties = { padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer' };

interface TrackingOrder {
  maDon: string;
  loaiDon: string;
  nguoiNhan: string;
  diaChiNhan: string;
}

export default function TrackingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<TrackingOrder[]>([]);

  useEffect(() => {
    // Giữ nguyên logic load dữ liệu của bạn ở đây
    setLoading(false);
  }, []);

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h2>Tra cứu đơn hàng</h2>
      </div>

      <div style={listContainer}>
        {orders.map(order => (
          <div 
            key={order.maDon} 
            style={orderCardStyle}
            onClick={() => navigate(`/tracking/${order.maDon}`)}
          >
            <p>Mã đơn: {order.maDon}</p>
            <p>Người nhận: {order.nguoiNhan}</p>
          </div>
        ))}
      </div>
    </div>
  );
}