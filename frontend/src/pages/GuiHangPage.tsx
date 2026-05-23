import React from 'react';
import { useGuiHang } from '../hooks/useGuiHang';

export default function GuiHangPage({ onNavigate }: any) {
  const { 
    form, setForm, paymentMethod, setPaymentMethod, 
    codAmount, setCodAmount, handleSubmit, isProcessing, 
    totalAmount, handleQuickFillSeller, handleQuickFillBuyer, handleQuickFillPi 
  } = useGuiHang();

  // Stepper handler (giữ nguyên)
  const updateWeight = (delta: number) => {
    setForm(prev => ({
      ...prev,
      trongLuong: Math.max(0.1, parseFloat((prev.trongLuong + delta).toFixed(1)))
    }));
  };

  const updateCodAmount = (delta: number) => {
    const current = parseFloat(codAmount) || 0;
    const newValue = Math.max(0, current + delta);
    setCodAmount(newValue.toString());
  };

  const stepperContainer: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%'
  };

  const stepperBtn: React.CSSProperties = {
    width: '44px',
    height: '52px',
    background: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '22px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0
  };

  return (
    <div style={pageContainer}>
      <div style={roleBar}>
        <span>👤 Người Gửi Hàng</span>
        <button onClick={() => onNavigate('ca-nhan')} style={changeRoleBtn}>Đổi vai trò</button>
      </div>

      <h1 style={titleStyle}>📦 TẠO ĐƠN GỬI HÀNG</h1>

      <form style={formContainerStyle}>
        {/* Loại dịch vụ & Thanh toán */}
        <div style={cardStyle}>
          <label style={labelStyle}>Loại dịch vụ</label>
          <div style={toggleContainer}>
            <button type="button" style={form.loaiDon === 'hoatoc' ? activeToggle : inactiveToggle} onClick={() => setForm({...form, loaiDon: 'hoatoc'})}>⚡ Hỏa Tốc</button>
            <button type="button" style={form.loaiDon === 'duongdai' ? activeToggle : inactiveToggle} onClick={() => setForm({...form, loaiDon: 'duongdai'})}>🛣️ Đường Dài</button>
          </div>

          <label style={{...labelStyle, marginTop: '20px'}}>Thanh toán</label>
          <div style={toggleContainer}>
            <button type="button" style={paymentMethod === 'prepaid' ? activeToggle : inactiveToggle} onClick={() => setPaymentMethod('prepaid')}>💳 Trả trước</button>
            <button type="button" style={paymentMethod === 'cod' ? activeToggle : inactiveToggle} onClick={() => setPaymentMethod('cod')}>📦 Thu hộ (COD)</button>
          </div>

          {paymentMethod === 'cod' && (
            <div style={{ marginTop: '15px' }}>
              <label style={labelStyle}>📦 Số tiền thu hộ (Pi)</label>
              <div style={stepperContainer}>
                <button type="button" style={stepperBtn} onClick={() => updateCodAmount(-10000)}>-</button>
                <input 
                  type="number" 
                  style={{...inputStyle, flex: 1, textAlign: 'center'}} 
                  placeholder="Nhập số tiền thu hộ" 
                  value={codAmount} 
                  onChange={(e) => setCodAmount(e.target.value)} 
                />
                <button type="button" style={stepperBtn} onClick={() => updateCodAmount(10000)}>+</button>
              </div>
            </div>
          )}
        </div>

        {/* Thông tin hàng hóa */}
        <div style={cardStyle}>
          <label style={labelStyle}>📦 Thông tin hàng hóa</label>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{...labelStyle, marginBottom: '8px', fontSize: '14px'}}>Khối lượng (kg)</label>
            <div style={stepperContainer}>
              <button type="button" style={stepperBtn} onClick={() => updateWeight(-0.5)}>-</button>
              <input 
                type="number" 
                style={{...inputStyle, flex: 1, textAlign: 'center'}} 
                value={form.trongLuong} 
                onChange={(e) => setForm({...form, trongLuong: parseFloat(e.target.value) || 1})}
              />
              <button type="button" style={stepperBtn} onClick={() => updateWeight(0.5)}>+</button>
            </div>
          </div>

          <div>
            <label style={{...labelStyle, marginBottom: '8px', fontSize: '14px'}}>Kích thước (cm)</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <input type="number" style={inputStyle} placeholder="Dài" value={form.dai} onChange={(e) => setForm({...form, dai: parseFloat(e.target.value) || 0})} />
              </div>
              <div style={{ flex: 1 }}>
                <input type="number" style={inputStyle} placeholder="Rộng" value={form.rong} onChange={(e) => setForm({...form, rong: parseFloat(e.target.value) || 0})} />
              </div>
              <div style={{ flex: 1 }}>
                <input type="number" style={inputStyle} placeholder="Cao" value={form.cao} onChange={(e) => setForm({...form, cao: parseFloat(e.target.value) || 0})} />
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin người gửi */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{...labelStyle, marginBottom: 0}}>👤 Thông tin người gửi</label>
            <button type="button" onClick={handleQuickFillSeller} style={banDoButtonStyle}> Bản đồ </button>
          </div>
          <input style={inputStyle} placeholder="Họ tên" value={form.nguoiGui} onChange={(e) => setForm({...form, nguoiGui: e.target.value})} />
          <input style={inputStyle} placeholder="Số điện thoại" value={form.sdtGui} onChange={(e) => setForm({...form, sdtGui: e.target.value})} />
          <input style={inputStyle} placeholder="Địa chỉ lấy hàng" value={form.diaChiGui} onChange={(e) => setForm({...form, diaChiGui: e.target.value})} />
        </div>

        {/* Thông tin người nhận - ĐÃ THÊM NÚT LẤY NHANH */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{...labelStyle, marginBottom: 0}}>👤 Thông tin người nhận</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={handleQuickFillBuyer} style={danhBaButtonStyle}> Danh bạ </button>
              <button type="button" onClick={handleQuickFillPi} style={piQuickButtonStyle}> Lấy nhanh </button>
            </div>
          </div>
          <input style={inputStyle} placeholder="Họ tên" value={form.nguoiNhan} onChange={(e) => setForm({...form, nguoiNhan: e.target.value})} />
          <input style={inputStyle} placeholder="Số điện thoại" value={form.sdtNhan} onChange={(e) => setForm({...form, sdtNhan: e.target.value})} />
          <input style={inputStyle} placeholder="Địa chỉ chi tiết" value={form.diaChiNhan} onChange={(e) => setForm({...form, diaChiNhan: e.target.value})} />
        </div>

        {/* Ghi chú cho tài xế */}
        <div style={cardStyle}>
          <label style={labelStyle}>📝 Ghi chú cho tài xế</label>
          <textarea 
            style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} 
            placeholder="Ví dụ: Gọi trước khi giao, hàng dễ vỡ, cần chuyển gấp,..." 
            value={form.ghiChu} 
            onChange={(e) => setForm({...form, ghiChu: e.target.value})}
          />
        </div>

        <button type="button" style={submitButton} onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing 
            ? 'ĐANG XỬ LÝ...' 
            : `TẠO ĐƠN (Cước phí tạm tính: ${totalAmount} Pi)`}
        </button>
      </form>
    </div>
  );
}

// Styles
const banDoButtonStyle: React.CSSProperties = { 
  background: '#e0e7ff', border: 'none', borderRadius: '8px', padding: '4px 10px', 
  color: '#4c1d95', fontWeight: '600', cursor: 'pointer', fontSize: '12px' 
};

const danhBaButtonStyle: React.CSSProperties = { 
  background: '#e0e7ff', border: 'none', borderRadius: '8px', padding: '4px 10px', 
  color: '#4c1d95', fontWeight: '600', cursor: 'pointer', fontSize: '12px' 
};

// Nút Lấy nhanh (màu tím nổi bật như trong ảnh)
const piQuickButtonStyle: React.CSSProperties = { 
  background: '#e0e7ff', border: 'none', borderRadius: '8px', padding: '4px 12px', 
  color: '#4c1d95', fontWeight: '600', cursor: 'pointer', fontSize: '12px' 
};

const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '20px' };
const cardStyle: React.CSSProperties = { background: '#ffffff', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px' };
const changeRoleBtn: React.CSSProperties = { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '99px', padding: '4px 12px' };
const titleStyle: React.CSSProperties = { fontSize: '22px', color: '#4c1d95', textAlign: 'center', margin: '20px 0' };
const formContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
const labelStyle: React.CSSProperties = { fontWeight: '700', color: '#4c1d95', marginBottom: '10px', fontSize: '14px', display: 'block' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', boxSizing: 'border-box' };
const toggleContainer: React.CSSProperties = { display: 'flex', gap: '10px' };
const activeToggle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#22d3ee', fontWeight: '700', border: 'none' };
const inactiveToggle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#f3f4f6', fontWeight: '600', border: '1px solid #d1d5db' };
const submitButton: React.CSSProperties = { padding: '18px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '700', marginTop: '10px' };