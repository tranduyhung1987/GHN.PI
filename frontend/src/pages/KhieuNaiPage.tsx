import React, { useState, useEffect } from 'react';

interface KhieuNaiPageProps {
  onNavigate: (page: string) => void;
}

interface Order {
  maDon: string;
  nguoiGui: string;
  nguoiNhan: string;
  diaChiNhan: string;
  paymentMethod?: 'prepaid' | 'cod';
  piPaymentId?: string;
  totalAmount?: number;
}

const KhieuNaiPage: React.FC<KhieuNaiPageProps> = ({ onNavigate }) => {
  const [maDonHang, setMaDonHang] = useState('');
  const [loaiKhieuNai, setLoaiKhieuNai] = useState('');
  const [moTa, setMoTa] = useState('');
  const [fileName, setFileName] = useState('Không có tệp nào được chọn');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Load đơn hàng từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      const mapped = parsed.map((o: any) => ({
        maDon: o.maDon || o.id,
        nguoiGui: o.nguoiGui,
        nguoiNhan: o.nguoiNhan,
        diaChiNhan: o.diaChiNhan,
        paymentMethod: o.paymentMethod,
        piPaymentId: o.piPaymentId,
        totalAmount: o.totalAmount
      }));
      setOrders(mapped);
    }
  }, []);

  const timDonHang = () => {
    if (!maDonHang.trim()) return alert("Vui lòng nhập mã đơn hàng!");
    const found = orders.find(o => o.maDon.toUpperCase() === maDonHang.toUpperCase());
    if (found) {
      setSelectedOrder(found);
    } else {
      alert("❌ Không tìm thấy đơn hàng!");
    }
  };

  const handleSubmit = () => {
    if (!maDonHang || !loaiKhieuNai || !moTa) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    alert(`✅ Khiếu nại cho đơn ${maDonHang} đã được gửi thành công!\nChúng tôi sẽ phản hồi trong 24h qua Pi Network.`);
    
    // Reset form
    setMaDonHang('');
    setLoaiKhieuNai('');
    setMoTa('');
    setFileName('Không có tệp nào được chọn');
    setSelectedOrder(null);
  };

  const lyDoOptions = [
    "Đơn hàng bị chậm trễ", "Hàng hóa bị hỏng", "Mất hàng",
    "Sai mô tả sản phẩm", "Tài xế không liên lạc", "Thu hộ sai số tiền",
    "Khác"
  ];

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={warningIcon}>⚠️</div>
        <div>
          <h1 style={title}>KHIẾU NẠI</h1>
          <p style={subtitle}>Hỗ trợ giải quyết tranh chấp • Minh bạch Pi</p>
        </div>
      </div>

      <div style={formContainer}>
        <div style={formGroup}>
          <label style={label}>Mã đơn hàng</label>
          <input
            type="text"
            value={maDonHang}
            onChange={(e) => setMaDonHang(e.target.value)}
            placeholder="GHNxxxxxxxx"
            style={input}
          />
          <button onClick={timDonHang} style={searchButton}>🔍 Tìm đơn</button>
        </div>

        {selectedOrder && (
          <div style={orderInfoBox}>
            <strong>Mã đơn:</strong> {selectedOrder.maDon}<br />
            <strong>Người nhận:</strong> {selectedOrder.nguoiNhan}<br />
            <strong>Thanh toán:</strong> {selectedOrder.paymentMethod === 'cod' ? '📦 Thu hộ Pi' : '💰 Thanh toán trước'}
            {selectedOrder.piPaymentId && <><br /><strong>Pi ID:</strong> {selectedOrder.piPaymentId.slice(0,16)}...</>}
          </div>
        )}

        <div style={formGroup}>
          <label style={label}>Loại khiếu nại</label>
          <select
            value={loaiKhieuNai}
            onChange={(e) => setLoaiKhieuNai(e.target.value)}
            style={input}
          >
            <option value="">Chọn loại khiếu nại</option>
            {lyDoOptions.map((item, i) => (
              <option key={i} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div style={formGroup}>
          <label style={label}>Mô tả chi tiết vấn đề</label>
          <textarea
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
            placeholder="Mô tả chi tiết sự việc..."
            style={textarea}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>Đính kèm hình ảnh / video (nếu có)</label>
          <div style={fileUpload}>
            {fileName}
          </div>
        </div>

        <button onClick={handleSubmit} style={submitButton}>
          🚨 GỬI KHIẾU NẠI
        </button>
      </div>
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

const warningIcon: React.CSSProperties = { fontSize: '42px' };

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

const formContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '20px'
};

const formGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '6px'
};

const label: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#4c1d95'
};

const input: React.CSSProperties = {
  padding: '14px 16px',
  border: '1px solid #c4b5fd',
  borderRadius: '12px',
  background: '#fff',
  fontSize: '16px'
};

const textarea: React.CSSProperties = {
  padding: '14px 16px',
  border: '1px solid #c4b5fd',
  borderRadius: '12px',
  background: '#fff',
  fontSize: '16px',
  minHeight: '120px',
  resize: 'vertical' as const
};

const fileUpload: React.CSSProperties = {
  padding: '14px 16px',
  border: '1px solid #c4b5fd',
  borderRadius: '12px',
  background: '#fff',
  color: '#64748b',
  fontSize: '15px'
};

const submitButton: React.CSSProperties = {
  marginTop: '10px',
  padding: '16px',
  background: 'linear-gradient(135deg, #ef4444, #f87171)',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer'
};

const searchButton: React.CSSProperties = {
  padding: '12px 20px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '8px'
};

const orderInfoBox: React.CSSProperties = {
  background: '#f0fdf4',
  padding: '16px',
  borderRadius: '12px',
  borderLeft: '4px solid #22c55e',
  fontSize: '14.5px',
  lineHeight: '1.7'
};

export default KhieuNaiPage;