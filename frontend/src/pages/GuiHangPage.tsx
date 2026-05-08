// src/pages/GuiHangPage.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface DonHangForm {
  loaiDon: 'hoatoc' | 'duongdai';
  nguoiGui: string;
  sdtGui: string;
  nguoiNhan: string;
  sdtNhan: string;
  diaChiNhan: string;
  trongLuong: number;
  ghiChu: string;
}

export default function GuiHangPage() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState<DonHangForm>({
    loaiDon: 'hoatoc',
    nguoiGui: '',
    sdtGui: '',
    nguoiNhan: '',
    sdtNhan: '',
    diaChiNhan: '',
    trongLuong: 1,
    ghiChu: ''
  });

  const piAmount = Math.round(form.trongLuong * 25000);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const maDon = `GHN${Date.now().toString().slice(-6)}`;
    
    alert(`✅ TẠO ĐƠN HÀNG THÀNH CÔNG!\n\n` +
          `Mã đơn: ${maDon}\n` +
          `Loại: ${form.loaiDon === 'hoatoc' ? 'HỎA TỐC' : 'ĐƯỜNG DÀI'}\n` +
          `Trọng lượng: ${form.trongLuong} kg\n` +
          `Thanh toán: ${piAmount.toLocaleString()} Pi\n\n` +
          `Đơn hàng đã được ghi nhận. Tài xế sẽ liên hệ sớm!`);

    setForm({
      loaiDon: 'hoatoc',
      nguoiGui: '',
      sdtGui: '',
      nguoiNhan: '',
      sdtNhan: '',
      diaChiNhan: '',
      trongLuong: 1,
      ghiChu: ''
    });
  };

  return (
    <>
      {/* NÚT QUAY LẠI TRANG CHỦ */}
      <button
        onClick={() => navigate('/')}
        style={{
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '25px',
          padding: '14px 28px',
          backgroundColor: '#1e2937',
          border: '2px solid #22d3ee',
          borderRadius: '9999px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 15px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 25px #22d3ee, 0 0 45px rgba(34, 211, 238, 0.8)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 15px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.5)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        ← Quay lại Trang chủ
      </button>

      {/* Tiêu đề */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>GỬI HÀNG</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Tạo đơn vận chuyển mới</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Loại đơn hàng */}
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#e2e8f0' }}>
            Loại đơn hàng
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })}
              style={{
                flex: 1, padding: '16px', borderRadius: '16px',
                border: form.loaiDon === 'hoatoc' ? '2px solid #22d3ee' : '1px solid #475569',
                background: form.loaiDon === 'hoatoc' ? '#22d3ee' : '#1e2937',
                color: form.loaiDon === 'hoatoc' ? '#0f172a' : 'white',
                fontWeight: 'bold'
              }}>
              ⚡ Hỏa Tốc
            </button>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'duongdai' })}
              style={{
                flex: 1, padding: '16px', borderRadius: '16px',
                border: form.loaiDon === 'duongdai' ? '2px solid #22d3ee' : '1px solid #475569',
                background: form.loaiDon === 'duongdai' ? '#22d3ee' : '#1e2937',
                color: form.loaiDon === 'duongdai' ? '#0f172a' : 'white',
                fontWeight: 'bold'
              }}>
              🛣️ Đường Dài
            </button>
          </div>
        </div>

        {/* Người gửi */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Người gửi</label>
          <input type="text" placeholder="Họ tên người gửi" value={form.nguoiGui} onChange={(e) => setForm({...form, nguoiGui: e.target.value})} style={inputStyle} required />
          <input type="tel" placeholder="Số điện thoại" value={form.sdtGui} onChange={(e) => setForm({...form, sdtGui: e.target.value})} style={inputStyle} required />
        </div>

        {/* Người nhận */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Người nhận</label>
          <input type="text" placeholder="Họ tên người nhận" value={form.nguoiNhan} onChange={(e) => setForm({...form, nguoiNhan: e.target.value})} style={inputStyle} required />
          <input type="tel" placeholder="Số điện thoại người nhận" value={form.sdtNhan} onChange={(e) => setForm({...form, sdtNhan: e.target.value})} style={inputStyle} required />
          <input type="text" placeholder="Địa chỉ nhận hàng chi tiết" value={form.diaChiNhan} onChange={(e) => setForm({...form, diaChiNhan: e.target.value})} style={inputStyle} required />
        </div>

        {/* Trọng lượng + Ghi chú */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0' }}>Trọng lượng (kg)</label>
            <input type="number" min="0.1" step="0.1" value={form.trongLuong} onChange={(e) => setForm({...form, trongLuong: parseFloat(e.target.value) || 1})} style={inputStyle} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0' }}>Ghi chú</label>
            <input type="text" placeholder="Ghi chú cho tài xế..." value={form.ghiChu} onChange={(e) => setForm({...form, ghiChu: e.target.value})} style={inputStyle} />
          </div>
        </div>

        <button 
          type="submit"
          style={{
            marginTop: '20px',
            padding: '18px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: '#22d3ee',
            color: '#0f172a',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)'
          }}
        >
          TẠO ĐƠN & THANH TOÁN {piAmount.toLocaleString()} Pi
        </button>
      </form>
    </>
  );
}

const inputStyle = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#1e2937',
  border: '1px solid #475569',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
  marginBottom: '12px',
  boxSizing: 'border-box' as const
};