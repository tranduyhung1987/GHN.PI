// src/pages/TraCuuCuocPage.tsx
import React, { useState } from 'react';

interface FormData {
  tinhGui: string;
  phuongGui: string;
  tinhNhan: string;
  phuongNhan: string;
  khoiLuong: number;
  dai: number;
  rong: number;
  cao: number;
  loaiHang: string;
}

const TraCuuCuocPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tim' | 'cuoc'>('cuoc');
  const [ketQua, setKetQua] = useState<number | null>(null);

  const [form, setForm] = useState<FormData>({
    tinhGui: '', phuongGui: '',
    tinhNhan: '', phuongNhan: '',
    khoiLuong: 500,
    dai: 20, rong: 15, cao: 10,
    loaiHang: 'hangthuong',
  });

  const tinhCuoc = () => {
    const weightKg = form.khoiLuong / 1000;
    const volWeight = (form.dai * form.rong * form.cao) / 5000;
    const chargeWeight = Math.max(weightKg, volWeight);
    let basePrice = chargeWeight * 25000;
    if (form.tinhGui && form.tinhNhan && form.tinhGui !== form.tinhNhan) {
      basePrice *= 1.3;
    }
    const finalPrice = Math.round(basePrice + 8000);
    setKetQua(finalPrice);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      background: '#f3e8ff', 
      padding: '16px 14px 120px',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ fontSize: '42px' }}>🔎</div>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#4c1d95', margin: 0 }}>TRA CỨU CƯỚC</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#e0e7ff', borderRadius: '9999px', padding: '6px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('tim')} style={activeTab === 'tim' ? activeTabStyle : inactiveTabStyle}>Tìm bưu cục</button>
        <button onClick={() => setActiveTab('cuoc')} style={activeTab === 'cuoc' ? activeTabStyle : inactiveTabStyle}>Ước tính cước phí</button>
      </div>

      {activeTab === 'cuoc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Thông tin địa chỉ */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>📍</span>
              <h3 style={{ margin: 0, color: '#4c1d95' }}>Thông tin địa chỉ</h3>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={subLabel}>Địa chỉ gửi</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <select style={selectStyle} value={form.tinhGui} onChange={(e) => setForm({...form, tinhGui: e.target.value})}>
                  <option value="">Tỉnh/Thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
                <select style={selectStyle} value={form.phuongGui} onChange={(e) => setForm({...form, phuongGui: e.target.value})}>
                  <option value="">Phường/Xã</option>
                </select>
              </div>
            </div>

            <div>
              <p style={subLabel}>Địa chỉ nhận</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <select style={selectStyle} value={form.tinhNhan} onChange={(e) => setForm({...form, tinhNhan: e.target.value})}>
                  <option value="">Tỉnh/Thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
                <select style={selectStyle} value={form.phuongNhan} onChange={(e) => setForm({...form, phuongNhan: e.target.value})}>
                  <option value="">Phường/Xã</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hàng hóa cần gửi */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>📦</span>
              <h3 style={{ margin: 0, color: '#4c1d95' }}>Hàng hóa cần gửi</h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={subLabel}>Loại hàng</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setForm({...form, loaiHang: 'hangthuong'})} style={form.loaiHang === 'hangthuong' ? activeTypeBtn : inactiveTypeBtn}>Hàng thường</button>
                <button onClick={() => setForm({...form, loaiHang: 'devo'})} style={form.loaiHang === 'devo' ? activeTypeBtn : inactiveTypeBtn}>Dễ vỡ</button>
                <button onClick={() => setForm({...form, loaiHang: 'docu'})} style={form.loaiHang === 'docu' ? activeTypeBtn : inactiveTypeBtn}>Đồ cũ</button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={subLabel}>Khối lượng (gram)</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => setForm({...form, khoiLuong: Math.max(100, form.khoiLuong - 100)})} style={smallBtn}>-</button>
                <input type="number" value={form.khoiLuong} onChange={(e) => setForm({...form, khoiLuong: parseInt(e.target.value) || 500})} style={inputStyle} />
                <button onClick={() => setForm({...form, khoiLuong: form.khoiLuong + 100})} style={smallBtn}>+</button>
              </div>
            </div>

            {/* KÍCH THƯỚC - 3 ô nhỏ gọn, đều, đẹp như ảnh */}
            <div>
              <p style={subLabel}>Kích thước (cm)</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number" 
                  placeholder="Dài" 
                  value={form.dai} 
                  onChange={(e) => setForm({...form, dai: parseInt(e.target.value) || 20})} 
                  style={sizeInputStyle} 
                />
                <input 
                  type="number" 
                  placeholder="Rộng" 
                  value={form.rong} 
                  onChange={(e) => setForm({...form, rong: parseInt(e.target.value) || 15})} 
                  style={sizeInputStyle} 
                />
                <input 
                  type="number" 
                  placeholder="Cao" 
                  value={form.cao} 
                  onChange={(e) => setForm({...form, cao: parseInt(e.target.value) || 10})} 
                  style={sizeInputStyle} 
                />
              </div>
            </div>
          </div>

          <button onClick={tinhCuoc} style={calcButtonStyle}>
            ƯỚC TÍNH CƯỚC PHÍ
          </button>

          {ketQua && (
            <div style={resultStyle}>
              <p style={{ color: '#6b21a8', marginBottom: '8px' }}>Cước phí ước tính</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#22d3ee' }}>
                {ketQua.toLocaleString()} <span style={{ fontSize: '20px' }}>Pi</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES ===================== */
const cardStyle = { background: '#ede9fe', padding: '20px', borderRadius: '16px', border: '1px solid #c4b5fd' };
const subLabel = { color: '#6b21a8', marginBottom: '8px', fontSize: '14.5px', fontWeight: '600' };
const selectStyle = { width: '100%', padding: '13px 12px', background: '#f3e8ff', border: '1px solid #c4b5fd', borderRadius: '12px', color: '#4c1d95', fontSize: '14.5px' };
const inputStyle = { flex: 1, padding: '12px 10px', background: '#f3e8ff', border: '1px solid #c4b5fd', borderRadius: '10px', color: '#4c1d95', fontSize: '14.5px', textAlign: 'center' as const };

// Ô kích thước nhỏ gọn, vừa khung như ảnh
const sizeInputStyle = { 
  flex: 1, 
  padding: '11px 10px', 
  background: '#f3e8ff', 
  border: '1px solid #c4b5fd', 
  borderRadius: '10px', 
  color: '#4c1d95', 
  fontSize: '14.5px', 
  textAlign: 'center' as const,
  minWidth: '0' 
};

const smallBtn = { padding: '10px 14px', background: '#e0e7ff', border: '1px solid #c4b5fd', borderRadius: '10px', color: '#4c1d95', fontSize: '17px', cursor: 'pointer' };

const activeTypeBtn = { flex: 1, padding: '11px', background: '#22d3ee', color: '#0f172a', borderRadius: '9999px', fontWeight: '600' };
const inactiveTypeBtn = { flex: 1, padding: '11px', background: '#e0e7ff', color: '#4c1d95', borderRadius: '9999px', border: '1px solid #c4b5fd' };

const calcButtonStyle = { width: '100%', padding: '18px', fontSize: '17px', fontWeight: '700', background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a', border: 'none', borderRadius: '9999px', marginTop: '10px' };
const resultStyle = { background: '#ede9fe', padding: '24px', borderRadius: '16px', textAlign: 'center' as const, border: '1px solid #22d3ee' };

const activeTabStyle = { flex: 1, padding: '14px', borderRadius: '9999px', background: '#22d3ee', color: '#0f172a', fontWeight: '700' };
const inactiveTabStyle = { flex: 1, padding: '14px', borderRadius: '9999px', background: '#e0e7ff', color: '#4c1d95' };

export default TraCuuCuocPage;