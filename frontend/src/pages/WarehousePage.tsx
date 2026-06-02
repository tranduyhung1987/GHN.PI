import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouse } from '../hooks/useWarehouse';
import { QRScanner } from '../components/QRScanner';

export default function WarehousePage() {
  const navigate = useNavigate();
  const { 
    activeTab, setActiveTab, 
    orders, scanCode, setScanCode, 
    handleScan, addMockOrder, loading, updateOrderStatus
  } = useWarehouse();

  return (
    <div style={pageContainer}>
      <div style={roleBar}>
        <span>📦 Kho Hub</span>
      </div>

      <h1 style={titleStyle}>📦 QUẢN LÝ KHO HUB</h1>

      {/* Tabs */}
      <div style={tabContainer}>
        <button 
          style={activeTab === 'nhap' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('nhap')}
        >Nhập kho</button>
        <button 
          style={activeTab === 'xuat' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('xuat')}
        >Xuất kho</button>
        <button 
          style={activeTab === 'ton' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('ton')}
        >Tồn kho</button>
      </div>

      {/* Card chính */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>
          {activeTab === 'nhap' && '📥 Nhập kho'}
          {activeTab === 'xuat' && '📤 Xuất kho'}
          {activeTab === 'ton' && '📦 Tồn kho'}
        </h3>

        {/* QR Scanner - Chỉ load khi cần (giảm bundle size) */}
        {(activeTab === 'nhap' || activeTab === 'xuat') && (
          <div style={{ marginBottom: '16px' }}>
            <QRScanner onScanSuccess={handleScan} />
          </div>
        )}

        {/* Input manual */}
        <label style={labelStyle}>Mã đơn hàng</label>
        <input 
          style={inputStyle}
          value={scanCode}
          onChange={(e) => setScanCode(e.target.value)}
          placeholder="Nhập hoặc quét mã đơn hàng..."
        />

        <button 
          style={submitButton} 
          onClick={addMockOrder}
        >
          + Thêm đơn mẫu
        </button>

        {/* Danh sách đơn hàng (data thật từ Firebase) */}
        <h4 style={{ margin: '20px 0 10px', color: '#4c1d95' }}>
          Danh sách đơn ({orders.length}) {loading && '(đang tải...)'}
        </h4>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {orders.length === 0 && !loading && (
            <p style={{ color: '#64748b', fontSize: 14 }}>Chưa có đơn nào trong kho.</p>
          )}
          {orders.map((order, index) => (
            <div key={index} style={orderItemStyle}>
              <div>
                <strong>{order.maDon}</strong> - {order.nguoiNhan || 'N/A'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ color: '#22d3ee', fontSize: '13px' }}>{order.status || 'Chưa có trạng thái'}</span>
                <button 
                  onClick={() => updateOrderStatus(order.maDon, 'Đã xử lý tại kho')}
                  style={{ fontSize: 11, padding: '2px 8px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: 6 }}
                >
                  Xử lý
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== STYLES (thống nhất với GuiHangPage) ==================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '20px' };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px' };
const titleStyle: React.CSSProperties = { fontSize: '22px', color: '#4c1d95', textAlign: 'center', margin: '20px 0' };

const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '20px' };
const activeTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#22d3ee', color: '#fff', border: 'none', fontWeight: '700' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#f3f4f6', color: '#4c1d95', border: '1px solid #d1d5db', fontWeight: '600' };

const cardStyle: React.CSSProperties = { background: '#ffffff', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const sectionTitle: React.CSSProperties = { color: '#4c1d95', marginBottom: '15px', fontSize: '18px' };
const labelStyle: React.CSSProperties = { fontWeight: '700', color: '#4c1d95', marginBottom: '8px', display: 'block' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginBottom: '16px' };

const submitButton: React.CSSProperties = { 
  padding: '14px', background: '#4c1d95', color: 'white', border: 'none', 
  borderRadius: '12px', fontWeight: '700', width: '100%', marginBottom: '20px' 
};

const orderItemStyle: React.CSSProperties = {
  padding: '12px',
  background: '#f8f7ff',
  borderRadius: '12px',
  marginBottom: '8px',
  border: '1px solid #e0e7ff'
};