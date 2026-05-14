// src/pages/KhieuNaiPage.tsx
import React, { useState } from 'react';

const KhieuNaiPage: React.FC = () => {
  const [form, setForm] = useState({
    maDon: '',
    loaiKhieuNai: '',
    moTa: '',
    file: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.maDon || !form.loaiKhieuNai || !form.moTa) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    alert("✅ Khiếu nại đã được gửi! Chúng tôi sẽ phản hồi trong 24h.");
    // Reset form
    setForm({ maDon: '', loaiKhieuNai: '', moTa: '', file: null });
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>⚠️</div>
        <h1 style={title}>KHIẾU NẠI</h1>
        <p style={subtitle}>Hỗ trợ giải quyết khiếu nại</p>
      </div>

      <form onSubmit={handleSubmit} style={formContainer}>
        <div>
          <label style={label}>Mã đơn hàng</label>
          <input 
            type="text" 
            placeholder="GHNxxxxxxxx" 
            value={form.maDon} 
            onChange={(e) => setForm({...form, maDon: e.target.value})}
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={label}>Loại khiếu nại</label>
          <select 
            value={form.loaiKhieuNai} 
            onChange={(e) => setForm({...form, loaiKhieuNai: e.target.value})}
            style={inputStyle}
          >
            <option value="">Chọn loại khiếu nại</option>
            <option value="delay">Trễ hẹn giao hàng</option>
            <option value="damage">Hàng hóa hư hỏng</option>
            <option value="lost">Mất hàng</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <label style={label}>Mô tả chi tiết vấn đề</label>
          <textarea 
            placeholder="Mô tả chi tiết..." 
            value={form.moTa} 
            onChange={(e) => setForm({...form, moTa: e.target.value})}
            style={textareaStyle}
            rows={5}
          />
        </div>

        <div>
          <label style={label}>Đính kèm hình ảnh (nếu có)</label>
          <input 
            type="file" 
            onChange={(e) => setForm({...form, file: e.target.files?.[0] || null})}
            style={inputStyle} 
          />
        </div>

        <button type="submit" style={submitButton}>
          GỬI KHIẾU NẠI
        </button>
      </form>
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 100px',
  boxSizing: 'border-box' as const
};

const header = { textAlign: 'center' as const, marginBottom: '30px' };
const title = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle = { color: '#6b21a8', marginTop: '6px' };

const formContainer = { display: 'flex', flexDirection: 'column' as const, gap: '20px' };
const label = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4c1d95' };
const inputStyle = { width: '100%', padding: '14px 16px', background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: '12px', fontSize: '15.5px' };
const textareaStyle = { ...inputStyle, resize: 'vertical' as const, minHeight: '120px' };

const submitButton = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(90deg, #ef4444, #f87171)',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '17px',
  marginTop: '10px'
};

export default KhieuNaiPage;