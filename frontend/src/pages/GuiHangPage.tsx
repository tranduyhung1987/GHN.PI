// src/pages/GuiHangPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface DonHangForm {
  loaiDon: 'hoatoc' | 'duongdai';
  nguoiGui: string;
  sdtGui: string;
  diaChiGui: string;
  nguoiNhan: string;
  sdtNhan: string;
  diaChiNhan: string;
  trongLuong: number;
  dai: number;
  rong: number;
  cao: number;
  ghiChu: string;
}

const GuiHangPage: React.FC = () => {
  const navigate = useNavigate();
  const { role: _role } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maDon, setMaDon] = useState('');

  const [form, setForm] = useState<DonHangForm>({
    loaiDon: 'hoatoc',
    nguoiGui: '',
    sdtGui: '',
    diaChiGui: '',
    nguoiNhan: '',
    sdtNhan: '',
    diaChiNhan: '',
    trongLuong: 1,
    dai: 20,
    rong: 15,
    cao: 10,
    ghiChu: ''
  });

  const calculateFee = (): number => {
    const weight = form.trongLuong;
    const volWeight = (form.dai * form.rong * form.cao) / 5000;
    const chargeWeight = Math.max(weight, volWeight);
    const baseFee = form.loaiDon === 'hoatoc' ? chargeWeight * 35000 : chargeWeight * 22000;
    return Math.round(baseFee + 8000);
  };

  const piAmount = calculateFee();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nguoiGui || !form.sdtGui || !form.diaChiGui || 
        !form.nguoiNhan || !form.sdtNhan || !form.diaChiNhan) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newMaDon = `GHN${Date.now().toString().slice(-8)}`;
      setMaDon(newMaDon);
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1200);
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '46px' }}>📦</div>
        <h1 style={pageTitle}>GỬI HÀNG</h1>
        <p style={subtitle}>Tạo đơn vận chuyển mới</p>
      </div>

      <form onSubmit={handleSubmit} style={formContainer}>
        <div>
          <label style={labelStyle}>Loại đơn hàng</label>
          <div style={toggleContainer}>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })} style={form.loaiDon === 'hoatoc' ? activeToggle : inactiveToggle}>⚡ Hỏa Tốc</button>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'duongdai' })} style={form.loaiDon === 'duongdai' ? activeToggle : inactiveToggle}>🛣️ Đường Dài</button>
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={sectionTitle}>Người gửi</label>
          <input type="text" placeholder="Họ tên người gửi" value={form.nguoiGui} onChange={(e) => setForm({ ...form, nguoiGui: e.target.value })} style={inputStyle} />
          <input type="tel" placeholder="Số điện thoại" value={form.sdtGui} onChange={(e) => setForm({ ...form, sdtGui: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Địa chỉ chi tiết" value={form.diaChiGui} onChange={(e) => setForm({ ...form, diaChiGui: e.target.value })} style={inputStyle} />
        </div>

        <div style={sectionStyle}>
          <label style={sectionTitle}>Người nhận</label>
          <input type="text" placeholder="Họ tên người nhận" value={form.nguoiNhan} onChange={(e) => setForm({ ...form, nguoiNhan: e.target.value })} style={inputStyle} />
          <input type="tel" placeholder="Số điện thoại" value={form.sdtNhan} onChange={(e) => setForm({ ...form, sdtNhan: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Địa chỉ chi tiết" value={form.diaChiNhan} onChange={(e) => setForm({ ...form, diaChiNhan: e.target.value })} style={inputStyle} />
        </div>

        <div style={sectionStyle}>
          <label style={sectionTitle}>Thông tin kiện hàng</label>
          <div style={{ marginBottom: '12px' }}>
            <label style={smallLabel}>Trọng lượng (kg)</label>
            <input type="number" value={form.trongLuong} onChange={(e) => setForm({ ...form, trongLuong: parseFloat(e.target.value) || 1 })} style={inputStyle} />
          </div>
          <div>
            <label style={smallLabel}>Kích thước (cm)</label>
            <div style={sizeGrid}>
              <input type="number" placeholder="Dài" value={form.dai} onChange={(e) => setForm({ ...form, dai: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              <input type="number" placeholder="Rộng" value={form.rong} onChange={(e) => setForm({ ...form, rong: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              <input type="number" placeholder="Cao" value={form.cao} onChange={(e) => setForm({ ...form, cao: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Ghi chú cho tài xế</label>
          <input type="text" placeholder="Ghi chú thêm..." value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} style={inputStyle} />
        </div>

        <div style={feeBox}>
          <p style={{ color: '#6b21a8', marginBottom: '6px' }}>Ước tính cước vận chuyển</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#22d3ee', margin: 0 }}>
            {piAmount.toLocaleString()} <span style={{ fontSize: '18px' }}>Pi</span>
          </p>
        </div>

        <button type="submit" disabled={isProcessing} style={submitButton}>
          {isProcessing ? 'Đang xử lý...' : `TẠO ĐƠN - ${piAmount.toLocaleString()} Pi`}
        </button>
      </form>

      {showSuccess && (
        <div style={successOverlay}>
          <div style={successModal}>
            <h2 style={{ color: '#22d3ee', marginBottom: '12px' }}>✅ Tạo đơn thành công!</h2>
            <p><strong>Mã đơn:</strong> {maDon}</p>
            <button onClick={() => { setShowSuccess(false); navigate('/tracking'); }} style={successButton}>
              Theo dõi đơn hàng ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = { minHeight: '100vh', background: '#f3e8ff', padding: '16px 14px 140px', boxSizing: 'border-box' as const };
const header = { textAlign: 'center' as const, marginBottom: '24px' };
const pageTitle = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle = { color: '#6b21a8', marginTop: '4px' };

const formContainer = { display: 'flex', flexDirection: 'column' as const, gap: '24px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4c1d95' };
const smallLabel = { display: 'block', marginBottom: '6px', color: '#6b21a8', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '14px 16px', background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: '12px', color: '#4c1d95', fontSize: '15.5px' };

const toggleContainer = { display: 'flex', gap: '10px' };
const activeToggle = { flex: 1, padding: '14px', borderRadius: '9999px', background: '#22d3ee', color: '#0f172a', fontWeight: '700' };
const inactiveToggle = { flex: 1, padding: '14px', borderRadius: '9999px', background: '#fff', color: '#4c1d95', border: '1px solid #c4b5fd' };

const sectionStyle = { background: '#ede9fe', padding: '20px', borderRadius: '20px', border: '1px solid #c4b5fd' };
const sectionTitle = { color: '#4c1d95', fontWeight: '700', marginBottom: '12px' };
const sizeGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' };

const feeBox = { background: '#ede9fe', padding: '24px', borderRadius: '20px', border: '2px solid #22d3ee', textAlign: 'center' as const };
const submitButton = { width: '100%', padding: '18px', fontSize: '17px', fontWeight: '700', background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a', border: 'none', borderRadius: '9999px', boxShadow: '0 8px 25px rgba(34,211,238,0.4)', marginTop: '10px' };

const successOverlay = { position: 'fixed' as const, top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000 };
const successModal = { background:'#fff', padding:'40px 24px', borderRadius:'24px', textAlign:'center' as const, maxWidth:'360px', border:'2px solid #22d3ee' };
const successButton = { padding:'16px', background:'#22d3ee', color:'#0f172a', border:'none', borderRadius:'9999px', fontWeight:'700', width:'100%', marginTop:'20px' };

export default GuiHangPage;