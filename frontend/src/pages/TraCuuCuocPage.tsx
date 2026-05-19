import React, { useState, useEffect } from 'react';

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
  const [ketQua, setKetQua] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [isPiConnected, setIsPiConnected] = useState(false);

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

  // Kiểm tra Pi
  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then(() => setIsPiConnected(true))
        .catch(() => setIsPiConnected(false));
    }
  }, []);

  const tinhCuoc = () => {
    if (!form.tinhGui || !form.tinhNhan) {
      alert("Vui lòng chọn đầy đủ Tỉnh/Thành phố gửi và nhận!");
      return;
    }

    setCalculating(true);

    setTimeout(() => {
      const weightKg = form.khoiLuong / 1000;
      const volWeight = (form.dai * form.rong * form.cao) / 5000;
      const chargeWeight = Math.max(weightKg, volWeight);
      
      let basePrice = chargeWeight * 25000;
      if (form.tinhGui !== form.tinhNhan) basePrice *= 1.35;

      const finalPrice = Math.round(basePrice + 8000);

      setKetQua({
        cuocTamTinh: Math.round(basePrice),
        phiDichVu: 8000,
        tongCong: finalPrice,
        thoiGianGiao: form.tinhGui === form.tinhNhan ? "1-2 ngày" : "2-4 ngày",
        hinhThuc: form.loaiHang === 'devo' ? "Hàng dễ vỡ (+10%)" : "Hàng thường"
      });
      setCalculating(false);
    }, 850);
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🔎 TRA CỨU CƯỚC</h1>
        {isPiConnected && <p style={{ color: '#7c3aed', fontSize: '14px', fontWeight: '600' }}>✅ Pi Connected</p>}
      </div>

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
                <div style={sizeField}><small style={sizeLabel}>Dài</small><input type="number" value={form.dai} onChange={(e) => setForm({...form, dai: parseInt(e.target.value) || 20})} style={sizeInput} /></div>
                <div style={sizeField}><small style={sizeLabel}>Rộng</small><input type="number" value={form.rong} onChange={(e) => setForm({...form, rong: parseInt(e.target.value) || 15})} style={sizeInput} /></div>
                <div style={sizeField}><small style={sizeLabel}>Cao</small><input type="number" value={form.cao} onChange={(e) => setForm({...form, cao: parseInt(e.target.value) || 10})} style={sizeInput} /></div>
              </div>
            </div>
          </div>

          <button 
            onClick={tinhCuoc} 
            disabled={calculating}
            style={calcButtonStyle}
          >
            {calculating ? 'ĐANG TÍNH TOÁN...' : 'ƯỚC TÍNH CƯỚC PHÍ'}
          </button>

          {ketQua && (
            <div style={resultStyle}>
              <h3 style={{ color: '#4c1d95', textAlign: 'center', marginBottom: '16px' }}>📋 Kết quả ước tính</h3>
              <div style={resultRow}><span>Cước tạm tính</span><strong>{ketQua.cuocTamTinh.toLocaleString()} Pi</strong></div>
              <div style={resultRow}><span>Phí dịch vụ</span><strong>{ketQua.phiDichVu.toLocaleString()} Pi</strong></div>
              <div style={resultRow}><span>Hình thức</span><strong>{ketQua.hinhThuc}</strong></div>
              <div style={totalRow}>
                <span>TỔNG CỘNG</span>
                <strong style={{ fontSize: '28px', color: '#7c3aed' }}>{ketQua.tongCong.toLocaleString()} Pi</strong>
              </div>
              <p style={{ textAlign: 'center', marginTop: '12px', color: '#10b981', fontWeight: '600' }}>
                ⏱ Thời gian giao dự kiến: {ketQua.thoiGianGiao}
              </p>

              <button 
                onClick={() => onNavigate('gui-hang')}
                style={createOrderBtn}
              >
                + TẠO ĐƠN HÀNG NGAY
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES ĐỒNG BỘ ===================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)', padding: '16px 14px 100px', boxSizing: 'border-box' };
const headerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' };
const titleStyle: React.CSSProperties = { fontSize: '24px', fontWeight: '800', color: '#4c1d95', margin: '0 0 8px 0' };

const cardStyle: React.CSSProperties = { background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)', border: '1px solid #f3e8ff' };
const subLabel: React.CSSProperties = { color: '#6b21a8', marginBottom: '8px', fontSize: '14.5px', fontWeight: '600' };
const selectStyle: React.CSSProperties = { width: '100%', padding: '13px 12px', background: '#fdfbff', border: '1px solid #e9d5ff', borderRadius: '14px', color: '#4c1d95' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '13px', background: '#fdfbff', border: '1px solid #e9d5ff', borderRadius: '14px', color: '#4c1d95' };

const sizeContainer: React.CSSProperties = { display: 'flex', gap: '10px' };
const sizeField: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column' as const };
const sizeLabel: React.CSSProperties = { fontSize: '12px', color: '#6b21a8', marginBottom: '4px' };
const sizeInput: React.CSSProperties = { width: '100%', padding: '10px 8px', background: '#fdfbff', border: '1px solid #e9d5ff', borderRadius: '10px', textAlign: 'center' as const, fontSize: '15px', color: '#4c1d95' };

const activeTypeBtn: React.CSSProperties = { flex: 1, padding: '12px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', borderRadius: '9999px', fontWeight: '600', border: 'none' };
const inactiveTypeBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#f3e8ff', color: '#4c1d95', border: '1px solid #e9d5ff', borderRadius: '9999px', fontWeight: '600' };

const calcButtonStyle: React.CSSProperties = { 
  width: '100%', padding: '18px', fontSize: '17px', fontWeight: '700', 
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', 
  border: 'none', borderRadius: '9999px', marginTop: '10px', cursor: 'pointer'
};

const resultStyle: React.CSSProperties = { 
  background: 'white', padding: '24px', borderRadius: '28px', 
  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)', border: '1px solid #f3e8ff' 
};
const resultRow: React.CSSProperties = { 
  display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3e8ff' 
};
const totalRow: React.CSSProperties = { 
  display: 'flex', justifyContent: 'space-between', padding: '16px 0', marginTop: '8px', 
  borderTop: '2px solid #f3e8ff', fontSize: '18px', fontWeight: '700' 
};

const createOrderBtn: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  marginTop: '16px',
  background: '#f3e8ff',
  color: '#4c1d95',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer'
};

const tabContainer: React.CSSProperties = { display: 'flex', background: 'white', borderRadius: '9999px', padding: '6px', marginBottom: '24px', border: '1px solid #f3e8ff' };
const activeTabStyle: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: '9999px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', fontWeight: '700' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: '9999px', background: 'transparent', color: '#4c1d95', border: 'none' };