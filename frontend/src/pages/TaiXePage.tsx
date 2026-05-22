import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaiXe } from '../hooks/useTaiXe';

export default function TaiXePage() {
  const navigate = useNavigate();
  const { 
    filter, setFilter, 
    orders, selectedOrder, setSelectedOrder 
  } = useTaiXe();

  return (
    <div style={pageContainer}>
      {/* Role Bar */}
      <div style={roleBar}>
        <span>🚚 Tài xế</span>
        <button onClick={() => navigate('/ca-nhan')} style={changeRoleBtn}>Đổi vai trò</button>
      </div>

      <h1 style={titleStyle}>🚚 ĐƠN HÀNG TÀI XẾ</h1>

      {/* Filter Tabs */}
      <div style={tabContainer}>
        <button 
          style={filter === 'pending' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setFilter('pending')}
        >Chờ lấy</button>
        <button 
          style={filter === 'shipping' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setFilter('shipping')}
        >Đang giao</button>
        <button 
          style={filter === 'completed' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setFilter('completed')}
        >Hoàn thành</button>
        <button 
          style={filter === 'all' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setFilter('all')}
        >Tất cả</button>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Danh sách đơn hàng ({orders.length})</h3>

        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px 20px' }}>
            Chưa có đơn hàng nào
          </p>
        ) : (
          orders.map((order) => (
            <div 
              key={order.maDon} 
              style={orderCardStyle} 
              onClick={() => setSelectedOrder(order)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#4c1d95' }}>{order.maDon}</strong>
                  <p style={{ margin: '4px 0', fontSize: '15px' }}>{order.customer}</p>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{order.address}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={statusStyle(order.status)}>{order.status.toUpperCase()}</span>
                  <p style={{ margin: '6px 0 0', fontWeight: '700', color: '#22d3ee' }}>
                    {order.fee}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chi tiết đơn hàng (nếu có chọn) */}
      {selectedOrder && (
        <div style={cardStyle}>
          <h4 style={sectionTitle}>Chi tiết đơn: {selectedOrder.maDon}</h4>
          <p><strong>Khách hàng:</strong> {selectedOrder.customer}</p>
          <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
          <p><strong>Phí:</strong> {selectedOrder.fee}</p>
          <p><strong>Loại:</strong> {selectedOrder.loai}</p>
          {selectedOrder.ghiChu && <p><strong>Ghi chú:</strong> {selectedOrder.ghiChu}</p>}
          <button 
            style={submitButton} 
            onClick={() => alert(`Đã nhận đơn ${selectedOrder.maDon}`)}
          >
            Nhận đơn / Bắt đầu giao
          </button>
        </div>
      )}
    </div>
  );
}

/* ==================== STYLES THỐNG NHẤT ==================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '20px' };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px' };
const changeRoleBtn: React.CSSProperties = { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '99px', padding: '4px 12px' };
const titleStyle: React.CSSProperties = { fontSize: '22px', color: '#4c1d95', textAlign: 'center', margin: '20px 0' };

const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' };
const activeTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#22d3ee', color: '#fff', border: 'none', fontWeight: '700' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#f3f4f6', color: '#4c1d95', border: '1px solid #d1d5db', fontWeight: '600' };

const cardStyle: React.CSSProperties = { background: '#ffffff', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const sectionTitle: React.CSSProperties = { color: '#4c1d95', marginBottom: '15px', fontSize: '18px' };

const orderCardStyle: React.CSSProperties = {
  background: '#f8f7ff',
  padding: '16px',
  borderRadius: '12px',
  marginBottom: '12px',
  border: '1px solid #e0e7ff',
  cursor: 'pointer'
};

const statusStyle = (status: string): React.CSSProperties => {
  let color = '#eab308';
  if (status === 'shipping') color = '#22d3ee';
  if (status === 'completed') color = '#22c55e';
  return { 
    padding: '4px 10px', 
    borderRadius: '99px', 
    fontSize: '12px', 
    fontWeight: '700',
    background: '#f1f5f9',
    color 
  };
};

const submitButton: React.CSSProperties = { 
  padding: '16px', 
  background: '#4c1d95', 
  color: 'white', 
  border: 'none', 
  borderRadius: '12px', 
  fontWeight: '700', 
  width: '100%',
  marginTop: '10px'
};