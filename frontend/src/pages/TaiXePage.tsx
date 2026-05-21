// src/pages/TaiXePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook điều hướng mới

// XÓA interface TaiXePageProps cũ

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

const TaiXePage: React.FC = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook
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
                o.status === 'dang-giao' ? 'shipping' : 'completed',
        customer: o.nguoiNhan,
        address: o.diaChiNhan,
        fee: o.totalAmount || '0',
        time: o.createdAt || '',
        loai: o.loaiDon || 'Thường'
      }));
      setOrders(mapped);
    }
  };

  return (
    <div style={pageContainer}>
      {/* HEADER GIỮ NGUYÊN UI */}
      <div style={headerStyle}>
        <h2 style={{ color: '#4c1d95' }}>Đơn hàng tài xế</h2>
        {/* Nút điều hướng mẫu */}
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>

      {/* Danh sách đơn hàng giữ nguyên logic */}
      <div style={listContainer}>
        {orders.filter(o => filter === 'all' || o.status === filter).map(order => (
          <div key={order.maDon} style={orderCardStyle} onClick={() => setSelectedOrder(order)}>
            <p>Đơn: {order.maDon}</p>
          </div>
        ))}
      </div>
      
      {/* ĐÃ XÓA BOTTOMNAV Ở ĐÂY - Layout đã tự xử lý */}
    </div>
  );
};

/* STYLES GIỮ NGUYÊN */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8fafc', paddingBottom: '90px' };
const headerStyle: React.CSSProperties = { padding: '20px', background: 'white' };
const listContainer: React.CSSProperties = { padding: '16px' };
const orderCardStyle: React.CSSProperties = { background: 'white', padding: '18px', borderRadius: '24px', marginBottom: '16px', border: '1px solid #f3e8ff' };

export default TaiXePage;