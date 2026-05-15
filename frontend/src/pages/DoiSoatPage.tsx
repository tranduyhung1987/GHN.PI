import React, { useState } from 'react';

interface DoiSoatPageProps {
  onNavigate: (page: string) => void;
}

const DoiSoatPage: React.FC<DoiSoatPageProps> = ({ onNavigate }) => {
  const [maDonHang, setMaDonHang] = useState('');
  const [ketQua, setKetQua] = useState<any>(null);

  const handleDoiSoat = () => {
    if (!maDonHang.trim()) {
      alert('Vui lòng nhập mã đơn hàng!');
      return;
    }

    // Mock kết quả
    setKetQua({
      maDon: maDonHang.toUpperCase(),
      trangThai: 'Đã thanh toán',
      soTien: '245.000 đ',
      thoiGian: '14/05/2026 09:45',
      piNhan: '89.3 Pi'
    });
  };

  return (
    <div style={pageContainer}>
      {/* HEADER - ĐÃ BỎ MŨI TÊN ← */}
      <div style={header}>
        <div style={iconTitle}>💰</div>
        <div>
          <h1 style={title}>ĐỐI SOÁT</h1>
          <p style={subtitle}>Kiểm tra và đối chiếu thanh toán</p>
        </div>
      </div>

      {/* FORM ĐỐI SOÁT */}
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

      {/* KẾT QUẢ */}
      {ketQua && (
        <div style={resultCard}>
          <h3 style={{ margin: '0 0 12px 0', color: '#4c1d95' }}>Kết quả đối soát</h3>
          <p><strong>Mã đơn:</strong> {ketQua.maDon}</p>
          <p><strong>Trạng thái:</strong> <span style={{ color: '#22c55e' }}>{ketQua.trangThai}</span></p>
          <p><strong>Số tiền:</strong> {ketQua.soTien}</p>
          <p><strong>Thời gian:</strong> {ketQua.thoiGian}</p>
          <p><strong>Pi nhận:</strong> <span style={{ color: '#4c1d95', fontWeight: '700' }}>{ketQua.piNhan}</span></p>
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
  padding: '20px',
  border: '1px solid #c4b5fd',
  lineHeight: '1.8'
};

export default DoiSoatPage;