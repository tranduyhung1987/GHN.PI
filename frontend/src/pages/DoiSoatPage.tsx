import React, { useState, useEffect } from 'react';

interface DoiSoatPageProps {
  onNavigate: (page: string) => void;
}

interface Order {
  maDon: string;
  nguoiGui: string;
  nguoiNhan: string;
  totalAmount?: number;
  paymentMethod?: 'prepaid' | 'cod';
  piPaymentId?: string;
  piTx?: string;
  status?: string;
  createdAt?: string;
}

const DoiSoatPage: React.FC<DoiSoatPageProps> = ({ onNavigate }) => {
  const [maDonHang, setMaDonHang] = useState('');
  const [ketQua, setKetQua] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      const mapped = parsed.map((o: any) => ({
        maDon: o.maDon || o.id,
        nguoiGui: o.nguoiGui,
        nguoiNhan: o.nguoiNhan,
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod,
        piPaymentId: o.piPaymentId,
        piTx: o.piTx,
        status: o.status,
        createdAt: o.createdAt
      }));
      setOrders(mapped);
    }
  }, []);

  const handleDoiSoat = () => {
    if (!maDonHang.trim()) {
      alert('Vui lòng nhập mã đơn hàng!');
      return;
    }

    const found = orders.find(o => 
      o.maDon.toUpperCase() === maDonHang.toUpperCase()
    );

    if (found) {
      setKetQua(found);
    } else {
      alert('❌ Không tìm thấy đơn hàng!');
      setKetQua(null);
    }
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={iconTitle}>💰</div>
        <div>
          <h1 style={title}>ĐỐI SOÁT</h1>
          <p style={subtitle}>Kiểm tra thanh toán Pi • Minh bạch on-chain</p>
        </div>
      </div>

      <div style={card}>
        <p style={label}>Mã đơn hàng cần đối soát</p>
        
        <input
          type="text"
          value={maDonHang}
          onChange={(e) => setMaDonHang(e.target.value)}
          placeholder="Nhập mã đơn hàng (ví dụ: GHN17489231)"
          style={input}
        />

        <button onClick={handleDoiSoat} style={button}>
          🔍 KIỂM TRA ĐỐI SOÁT
        </button>
      </div>

      {ketQua && (
        <div style={resultCard}>
          <h3 style={{ margin: '0 0 16px 0', color: '#4c1d95' }}>Kết quả đối soát</h3>
          
          <p><strong>Mã đơn:</strong> {ketQua.maDon}</p>
          <p><strong>Người gửi:</strong> {ketQua.nguoiGui}</p>
          <p><strong>Người nhận:</strong> {ketQua.nguoiNhan}</p>
          
          <p>
            <strong>Thanh toán:</strong>{' '}
            <span style={{ color: '#22c55e', fontWeight: '600' }}>
              {ketQua.paymentMethod === 'cod' ? '📦 Thu hộ Pi' : '💰 Thanh toán trước'}
            </span>
          </p>
          
          {ketQua.totalAmount && (
            <p><strong>Số tiền:</strong> {ketQua.totalAmount.toLocaleString()} Pi</p>
          )}
          
          {ketQua.piPaymentId && (
            <p><strong>Pi Payment ID:</strong> {ketQua.piPaymentId.slice(0, 16)}...</p>
          )}
          
          {ketQua.piTx && (
            <p><strong>Trạng thái Pi:</strong> <span style={{ color: '#22c55e' }}>{ketQua.piTx === 'pending' ? 'Đang xử lý' : 'Hoàn tất'}</span></p>
          )}
          
          <p><strong>Thời gian:</strong> {ketQua.createdAt}</p>
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 90px',
  boxSizing: 'border-box'
};

const header: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center' as const,
  gap: '12px',
  marginBottom: '30px'
};

const iconTitle: React.CSSProperties = { fontSize: '42px' };

const title: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: '700',
  color: '#4c1d95',
  margin: 0
};

const subtitle: React.CSSProperties = {
  color: '#6b21a8',
  fontSize: '14px',
  textAlign: 'center' as const
};

const card: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '20px',
  border: '1px solid #e0d4ff'
};

const label: React.CSSProperties = {
  fontSize: '15px',
  color: '#4c1d95',
  marginBottom: '8px',
  fontWeight: '600'
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  background: '#f8fafc',
  fontSize: '16px',
  marginBottom: '20px'
};

const button: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  background: '#eab308',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer'
};

const resultCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '24px',
  border: '1px solid #c4b5fd',
  lineHeight: '1.8'
};

export default DoiSoatPage;