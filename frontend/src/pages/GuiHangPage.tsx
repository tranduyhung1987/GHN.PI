// src/pages/GuiHangPage.tsx
import { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const maDon = `GHN${Date.now().toString().slice(-6)}`;
    
    alert(`✅ TẠO ĐƠN HÀNG THÀNH CÔNG!\n\n` +
          `Mã đơn: ${maDon}\n` +
          `Loại: ${form.loaiDon === 'hoatoc' ? 'HỎA TỐC' : 'ĐƯỜNG DÀI'}\n` +
          `Trọng lượng: ${form.trongLuong} kg\n` +
          `Thanh toán: ${piAmount.toLocaleString()} Pi\n\n` +
          `Đơn hàng đã được ghi nhận. Tài xế sẽ liên hệ sớm!`);

    // Reset form
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
    <div>
      <button 
        onClick={() => navigate('/')}
        style={{ color: '#22d3ee', marginBottom: '20px', background: 'none', border: 'none', fontSize: '16px' }}
      >
        ← Quay lại Trang chủ
      </button>

      <h1 style={{ marginBottom: '8px' }}>📦 GỬI HÀNG</h1>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Tạo đơn vận chuyển mới</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Loại đơn hàng */}
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Loại đơn hàng</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '16px',
                border: form.loaiDon === 'hoatoc' ? '2px solid #22d3ee' : '1px solid #475569',
                background: form.loaiDon === 'hoatoc' ? '#22d3ee' : '#1e2937',
                color: form.loaiDon === 'hoatoc' ? '#0f172a' : 'white',
                fontWeight: 'bold'
              }}
            >
              ⚡ Hỏa Tốc
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, loaiDon: 'duongdai' })}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '16px',
                border: form.loaiDon === 'duongdai' ? '2px solid #22d3ee' : '1px solid #475569',
                background: form.loaiDon === 'duongdai' ? '#22d3ee' : '#1e2937',
                color: form.loaiDon === 'duongdai' ? '#0f172a' : 'white',
                fontWeight: 'bold'
              }}
            >
              🛣️ Đường Dài
            </button>
          </div>
        </div>

        {/* Thông tin người gửi */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Người gửi</label>
          <input 
            type="text" 
            placeholder="Họ tên người gửi" 
            value={form.nguoiGui}
            onChange={(e) => setForm({...form, nguoiGui: e.target.value})}
            style={inputStyle}
            required 
          />
          <input 
            type="tel" 
            placeholder="Số điện thoại" 
            value={form.sdtGui}
            onChange={(e) => setForm({...form, sdtGui: e.target.value})}
            style={inputStyle}
            required 
          />
        </div>

        {/* Thông tin người nhận */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Người nhận</label>
          <input 
            type="text" 
            placeholder="Họ tên người nhận" 
            value={form.nguoiNhan}
            onChange={(e) => setForm({...form, nguoiNhan: e.target.value})}
            style={inputStyle}
            required 
          />
          <input 
            type="tel" 
            placeholder="Số điện thoại người nhận" 
            value={form.sdtNhan}
            onChange={(e) => setForm({...form, sdtNhan: e.target.value})}
            style={inputStyle}
            required 
          />
          <input 
            type="text" 
            placeholder="Địa chỉ nhận hàng chi tiết" 
            value={form.diaChiNhan}
            onChange={(e) => setForm({...form, diaChiNhan: e.target.value})}
            style={inputStyle}
            required 
          />
        </div>

        {/* Trọng lượng + Ghi chú */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Trọng lượng (kg)</label>
            <input 
              type="number" 
              min="0.1" 
              step="0.1"
              value={form.trongLuong}
              onChange={(e) => setForm({...form, trongLuong: parseFloat(e.target.value) || 1})}
              style={inputStyle}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Ghi chú</label>
            <input 
              type="text" 
              placeholder="Ghi chú cho tài xế..." 
              value={form.ghiChu}
              onChange={(e) => setForm({...form, ghiChu: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Nút tạo đơn */}
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
            cursor: 'pointer'
          }}
        >
          TẠO ĐƠN & THANH TOÁN {piAmount.toLocaleString()} Pi
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#1e2937',
  border: '1px solid #475569',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px'
};