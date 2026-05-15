import React, { useState } from 'react';

interface KhieuNaiPageProps {
  onNavigate: (page: string) => void;
}

const KhieuNaiPage: React.FC<KhieuNaiPageProps> = ({ onNavigate }) => {
  const [maDonHang, setMaDonHang] = useState('');
  const [loaiKhieuNai, setLoaiKhieuNai] = useState('');
  const [moTa, setMoTa] = useState('');
  const [fileName, setFileName] = useState('Không có tệp nào được chọn');

  const handleSubmit = () => {
    if (!maDonHang || !loaiKhieuNai || !moTa) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    alert('✅ Khiếu nại đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.');
    // Reset form
    setMaDonHang('');
    setLoaiKhieuNai('');
    setMoTa('');
    setFileName('Không có tệp nào được chọn');
  };

  return (
    <div style={pageContainer}>
      {/* HEADER - ĐÃ BỎ MŨI TÊN ← */}
      <div style={header}>
        <div style={warningIcon}>⚠️</div>
        <div>
          <h1 style={title}>KHIẾU NẠI</h1>
          <p style={subtitle}>Hỗ trợ giải quyết tranh chấp</p>
        </div>
      </div>

      {/* FORM */}
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
        </div>

        <div style={formGroup}>
          <label style={label}>Loại khiếu nại</label>
          <select
            value={loaiKhieuNai}
            onChange={(e) => setLoaiKhieuNai(e.target.value)}
            style={input}
          >
            <option value="">Chọn loại khiếu nại</option>
            <option value="don-hang">Đơn hàng bị chậm trễ</option>
            <option value="hang-hong">Hàng hóa bị hỏng</option>
            <option value="mat-hang">Mất hàng</option>
            <option value="khac">Khác</option>
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

export default KhieuNaiPage;