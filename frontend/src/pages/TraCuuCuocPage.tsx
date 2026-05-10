import { useState } from 'react';

export default function TraCuuCuocPage() {
  const [activeTab, setActiveTab] = useState<'tim' | 'cuoc'>('cuoc');

  const [form, setForm] = useState({
    tinhGui: '', quanGui: '', phuongGui: '',
    tinhNhan: '', quanNhan: '', phuongNhan: '',
    khoiLuong: 500,
    dai: 10, rong: 10, cao: 10,
  });

  const [ketQua, setKetQua] = useState<number | null>(null);

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
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      
      {/* ==================== VÙNG 1: TIÊU ĐỀ TÍM + NHẤP NHÁY ==================== */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div 
          style={titleContainerStyle}
          onMouseEnter={(e) => e.currentTarget.style.animation = 'glowPulse 0.8s infinite alternate'}
          onMouseLeave={(e) => e.currentTarget.style.animation = 'glowPulse 2s infinite alternate'}
        >
          <h1 style={titleStyle}>TRA CỨU NHANH</h1>
        </div>
      </div>

      {/* ==================== VÙNG 2 & 3: TAB XANH NEON + LUNG LINH ==================== */}
      <div style={tabContainerStyle}>
        <button 
          onClick={() => setActiveTab('tim')}
          style={activeTab === 'tim' ? activeTabStyle : inactiveTabStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 0 40px #22d3ee';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = activeTab === 'tim' ? '0 0 30px #22d3ee' : '0 0 15px rgba(34,211,238,0.3)';
          }}
        >
          Tìm bưu cục
        </button>
        <button 
          onClick={() => setActiveTab('cuoc')}
          style={activeTab === 'cuoc' ? activeTabStyle : inactiveTabStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 0 40px #22d3ee';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = activeTab === 'cuoc' ? '0 0 30px #22d3ee' : '0 0 15px rgba(34,211,238,0.3)';
          }}
        >
          Ước tính cước phí
        </button>
      </div>

      {activeTab === 'cuoc' && (
        <>
          {/* Phần nội dung bên dưới giữ nguyên hoàn toàn */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span>📍</span>
              <h3 style={{ margin: 0 }}>Thông tin địa chỉ</h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={subLabel}>Địa chỉ gửi</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <select style={selectStyle} onChange={(e) => setForm({...form, tinhGui: e.target.value})}>
                  <option value="">Chọn Tỉnh / Thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
                <select style={selectStyle}><option>Quận / Huyện</option></select>
                <select style={selectStyle}><option>Phường / Xã</option></select>
              </div>
            </div>

            <div>
              <p style={subLabel}>Địa chỉ nhận</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <select style={selectStyle} onChange={(e) => setForm({...form, tinhNhan: e.target.value})}>
                  <option value="">Chọn Tỉnh / Thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
                <select style={selectStyle}><option>Quận / Huyện</option></select>
                <select style={selectStyle}><option>Phường / Xã</option></select>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span>📦</span>
              <h3 style={{ margin: 0 }}>Hàng hóa cần gửi</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
              <div>
                <p style={subLabel}>Khối lượng hàng (g)</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setForm({...form, khoiLuong: Math.max(100, form.khoiLuong - 100)})} style={btnSmall}>-</button>
                  <input type="number" value={form.khoiLuong} onChange={(e) => setForm({...form, khoiLuong: parseInt(e.target.value) || 500})} style={inputNumberStyle} />
                  <button onClick={() => setForm({...form, khoiLuong: form.khoiLuong + 100})} style={btnSmall}>+</button>
                </div>
              </div>

              <div>
                <p style={subLabel}>Kích thước hàng (cm)</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" value={form.dai} onChange={(e) => setForm({...form, dai: parseInt(e.target.value) || 10})} style={inputNumberStyle} placeholder="Dài" />
                  <input type="number" value={form.rong} onChange={(e) => setForm({...form, rong: parseInt(e.target.value) || 10})} style={inputNumberStyle} placeholder="Rộng" />
                  <input type="number" value={form.cao} onChange={(e) => setForm({...form, cao: parseInt(e.target.value) || 10})} style={inputNumberStyle} placeholder="Cao" />
                </div>
              </div>
            </div>
          </div>

          <button onClick={tinhCuoc} style={calcButtonStyle}>
            ƯỚC TÍNH CƯỚC PHÍ
          </button>

          {ketQua && (
            <div style={resultStyle}>
              <p style={{ color: '#94a3b8' }}>Cước phí ước tính</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#22d3ee', margin: '10px 0' }}>
                {ketQua.toLocaleString()} <span style={{ fontSize: '22px' }}>Pi</span>
              </p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Thanh toán qua hợp đồng thông minh Pi Network
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ===================== STYLES MỚI ===================== */
const titleContainerStyle = {
  display: 'inline-block',
  background: '#0f172a',
  border: '3px solid #a855f7',
  borderRadius: '9999px',
  padding: '14px 48px',
  boxShadow: '0 0 30px #a855f7, 0 0 60px rgba(168, 85, 247, 0.6)',
  animation: 'glowPulse 2s infinite alternate ease-in-out',
  transition: 'all 0.3s',
  cursor: 'pointer',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: 0,
  color: '#c026d3',           // Màu tím neon
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  textShadow: '0 0 15px #c026d3, 0 0 30px #a855f7',
};

const tabContainerStyle = {
  display: 'flex',
  background: '#1e2937',
  borderRadius: '9999px',
  padding: '6px',
  marginBottom: '30px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
};

const activeTabStyle = {
  flex: 1,
  padding: '14px 20px',
  borderRadius: '9999px',
  background: '#22d3ee',
  color: '#0f172a',
  fontWeight: 'bold',
  boxShadow: '0 0 30px #22d3ee',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
};

const inactiveTabStyle = {
  flex: 1,
  padding: '14px 20px',
  borderRadius: '9999px',
  background: '#22d3ee',           // Nền xanh như tab active
  color: '#0f172a',
  opacity: 0.85,
  boxShadow: '0 0 15px rgba(34,211,238,0.4)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
};

const sectionStyle = { background: '#1e2937', padding: '24px', borderRadius: '16px', marginBottom: '24px' };
const subLabel = { color: '#94a3b8', marginBottom: '10px', fontSize: '15px' };
const selectStyle = { width: '100%', padding: '14px', background: '#334155', border: '1px solid #475569', borderRadius: '10px', color: 'white' };
const inputNumberStyle = { width: '100%', padding: '14px', background: '#334155', border: '1px solid #475569', borderRadius: '10px', color: 'white', textAlign: 'center' as const };
const btnSmall = { padding: '12px 18px', background: '#334155', border: '1px solid #475569', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '18px' };
const calcButtonStyle = { width: '100%', padding: '18px', fontSize: '18px', fontWeight: 'bold', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '9999px', cursor: 'pointer', marginTop: '10px' };
const resultStyle = { background: '#1e2937', padding: '30px', borderRadius: '16px', textAlign: 'center' as const, border: '1px solid #22d3ee', marginTop: '20px' };