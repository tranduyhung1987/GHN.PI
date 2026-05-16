import React, { useState } from 'react';

interface TraCuuCuocPageProps {
  onNavigate: (page: string) => void;
}

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

export default function TraCuuCuocPage({ onNavigate }: TraCuuCuocPageProps) {
  const [activeTab, setActiveTab] = useState<'tim' | 'cuoc'>('cuoc');
  const [ketQua, setKetQua] = useState<number | null>(null);

  const [form, setForm] = useState<FormData>({
    tinhGui: '', 
    phuongGui: '',
    tinhNhan: '', 
    phuongNhan: '',
    khoiLuong: 500,
    dai: 20, 
    rong: 15, 
    cao: 10,
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
    <div style={pageContainer}>
      {/* HEADER - ĐÃ BỎ MŨI TÊN ← */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>🔎 TRA CỨU CƯỚC</h1>
      </div>

      {/* TABS */}
      <div style={tabContainer}>
        <button 
          onClick={() => setActiveTab('cuoc')} 
          style={activeTab === 'cuoc' ? activeTabStyle : inactiveTabStyle}
        >
          Ước tính cước phí
        </button>
        <button 
          onClick={() => setActiveTab('tim')} 
          style={activeTab === 'tim' ? activeTabStyle : inactiveTabStyle}
        >
          Tìm bưu cục
        </button>
      </div>

      {activeTab === 'cuoc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Phần còn lại giữ nguyên như code trước */}
          <div style={cardStyle}>
            <h3 style={{ color: '#4c1d95', marginBottom: '16px' }}>📍 Thông tin địa chỉ</h3>
            
            <div style={{ marginBottom: '20px' }}>
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

          <div style={cardStyle}>
            <h3 style={{ color: '#4c1d95', marginBottom: '16px' }}>📦 Hàng hóa cần gửi</h3>

            <div style={{ marginBottom: '20px' }}>
              <p style={subLabel}>Loại hàng</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setForm({...form, loaiHang: 'hangthuong'})} style={form.loaiHang === 'hangthuong' ? activeTypeBtn : inactiveTypeBtn}>Hàng thường</button>
                <button onClick={() => setForm({...form, loaiHang: 'devo'})} style={form.loaiHang === 'devo' ? activeTypeBtn : inactiveTypeBtn}>Dễ vỡ</button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={subLabel}>Khối lượng (gram)</p>
              <input type="number" value={form.khoiLuong} onChange={(e) => setForm({...form, khoiLuong: parseInt(e.target.value) || 500})} style={inputStyle} />
            </div>

            <div>
              <p style={subLabel}>Kích thước (cm)</p>
              <div style={sizeContainer}>
                <div style={sizeField}>
                  <small style={sizeLabel}>Dài</small>
                  <input type="number" value={form.dai} onChange={(e) => setForm({...form, dai: parseInt(e.target.value) || 20})} style={sizeInput} />
                </div>
                <div style={sizeField}>
                  <small style={sizeLabel}>Rộng</small>
                  <input type="number" value={form.rong} onChange={(e) => setForm({...form, rong: parseInt(e.target.value) || 15})} style={sizeInput} />
                </div>
                <div style={sizeField}>
                  <small style={sizeLabel}>Cao</small>
                  <input type="number" value={form.cao} onChange={(e) => setForm({...form, cao: parseInt(e.target.value) || 10})} style={sizeInput} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={tinhCuoc} style={calcButtonStyle}>
            ƯỚC TÍNH CƯỚC PHÍ
          </button>

          {ketQua && (
            <div style={resultStyle}>
              <p style={{ color: '#6b21a8' }}>Cước phí ước tính</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#22d3ee' }}>
                {ketQua.toLocaleString()} <span style={{ fontSize: '20px' }}>Pi</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = { 
  minHeight: '100vh', background: '#f3e8ff', padding: '16px 14px 120px', boxSizing: 'border-box' as const 
};

const headerStyle: React.CSSProperties = { 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',   // Căn giữa title
  marginBottom: '20px' 
};
const titleStyle: React.CSSProperties = { 
  fontSize: '26px', 
  fontWeight: '700', 
  color: '#4c1d95', 
  margin: 0 
};

const cardStyle: React.CSSProperties = { 
  background: '#ede9fe', padding: '20px', borderRadius: '16px', border: '1px solid #c4b5fd' 
};
const subLabel: React.CSSProperties = { 
  color: '#6b21a8', marginBottom: '8px', fontSize: '14.5px', fontWeight: '600' 
};
const selectStyle: React.CSSProperties = { 
  width: '100%', padding: '13px 12px', background: '#f3e8ff', border: '1px solid #c4b5fd', borderRadius: '12px', color: '#4c1d95' 
};
const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '13px', background: '#f3e8ff', border: '1px solid #c4b5fd', borderRadius: '12px', color: '#4c1d95' 
};

const sizeContainer: React.CSSProperties = { display: 'flex', gap: '10px' };
const sizeField: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column' as const };
const sizeLabel: React.CSSProperties = { fontSize: '12px', color: '#6b21a8', marginBottom: '4px' };
const sizeInput: React.CSSProperties = { 
  width: '100%', padding: '10px 8px', background: '#f3e8ff', border: '1px solid #c4b5fd', 
  borderRadius: '10px', textAlign: 'center' as const, fontSize: '15px' 
};

const activeTypeBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#22d3ee', color: '#0f172a', borderRadius: '9999px', fontWeight: '600' };
const inactiveTypeBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#e0e7ff', color: '#4c1d95', border: '1px solid #c4b5fd', borderRadius: '9999px' };

const calcButtonStyle: React.CSSProperties = { 
  width: '100%', padding: '18px', fontSize: '17px', fontWeight: '700', 
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a', border: 'none', 
  borderRadius: '9999px', marginTop: '10px' 
};
const resultStyle: React.CSSProperties = { 
  background: '#ede9fe', padding: '24px', borderRadius: '16px', textAlign: 'center' as const, border: '1px solid #22d3ee' 
};

const tabContainer: React.CSSProperties = { 
  display: 'flex', background: '#e0e7ff', borderRadius: '9999px', padding: '6px', marginBottom: '24px' 
};
const activeTabStyle: React.CSSProperties = { 
  flex: 1, padding: '14px', borderRadius: '9999px', background: '#22d3ee', color: '#0f172a', fontWeight: '700' 
};
const inactiveTabStyle: React.CSSProperties = { 
  flex: 1, padding: '14px', borderRadius: '9999px', background: '#e0e7ff', color: '#4c1d95' 
};