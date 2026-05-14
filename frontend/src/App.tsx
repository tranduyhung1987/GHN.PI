import { useState } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState<'tim' | 'cuoc'>('cuoc');
  const [ketQua, setKetQua] = useState<number | null>(null);

  const [form, setForm] = useState({
    tinhGui: '', phuongGui: '', thonGui: '',
    tinhNhan: '', phuongNhan: '', thonNhan: '',
    khoiLuong: 500, dai: 20, rong: 15, cao: 10,
  });

  const tinhCuoc = () => {
    const weightKg = form.khoiLuong / 1000;
    const volWeight = (form.dai * form.rong * form.cao) / 5000;
    const chargeWeight = Math.max(weightKg, volWeight);
    let basePrice = chargeWeight * 25000;
    if (form.tinhGui && form.tinhNhan && form.tinhGui !== form.tinhNhan) basePrice *= 1.3;
    setKetQua(Math.round(basePrice + 8000));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f3e8ff', 
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#4c1d95', fontSize: '30px', marginBottom: '24px' }}>
          🔎 TRA CỨU CƯỚC GHN.PI
        </h1>

        <div style={{ display: 'flex', background: '#e0e7ff', borderRadius: '9999px', padding: '6px', marginBottom: '24px' }}>
          <button onClick={() => setActiveTab('tim')} style={activeTab === 'tim' ? activeTabStyle : inactiveTabStyle}>Tìm bưu cục</button>
          <button onClick={() => setActiveTab('cuoc')} style={activeTab === 'cuoc' ? activeTabStyle : inactiveTabStyle}>Ước tính cước phí</button>
        </div>

        {activeTab === 'cuoc' && (
          <div style={cardStyle}>
            <div style={subLabel}>Địa chỉ gửi</div>
            <input placeholder="Tỉnh/Thành phố" style={inputStyle} value={form.tinhGui} onChange={e => setForm({...form, tinhGui: e.target.value})} />
            <input placeholder="Xã/Phường" style={inputStyle} value={form.phuongGui} onChange={e => setForm({...form, phuongGui: e.target.value})} />
            <input placeholder="Thôn/Khu phố" style={inputStyle} value={form.thonGui} onChange={e => setForm({...form, thonGui: e.target.value})} />

            <div style={subLabel}>Địa chỉ nhận</div>
            <input placeholder="Tỉnh/Thành phố" style={inputStyle} value={form.tinhNhan} onChange={e => setForm({...form, tinhNhan: e.target.value})} />
            <input placeholder="Xã/Phường" style={inputStyle} value={form.phuongNhan} onChange={e => setForm({...form, phuongNhan: e.target.value})} />
            <input placeholder="Thôn/Khu phố" style={inputStyle} value={form.thonNhan} onChange={e => setForm({...form, thonNhan: e.target.value})} />

            <div style={subLabel}>Thông tin hàng</div>
            <input type="number" placeholder="Khối lượng (gram)" style={inputStyle} value={form.khoiLuong} onChange={e => setForm({...form, khoiLuong: Number(e.target.value)})} />
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom: '16px'}}>
              <input type="number" placeholder="Dài (cm)" style={inputStyle} value={form.dai} onChange={e => setForm({...form, dai: Number(e.target.value)})} />
              <input type="number" placeholder="Rộng (cm)" style={inputStyle} value={form.rong} onChange={e => setForm({...form, rong: Number(e.target.value)})} />
              <input type="number" placeholder="Cao (cm)" style={inputStyle} value={form.cao} onChange={e => setForm({...form, cao: Number(e.target.value)})} />
            </div>

            <button onClick={tinhCuoc} style={calcButtonStyle}>ƯỚC TÍNH CƯỚC PHÍ</button>

            {ketQua && (
              <div style={resultStyle}>
                <p>Cước phí ước tính</p>
                <p style={{fontSize:'36px', fontWeight:'bold', color:'#22d3ee'}}>
                  {ketQua.toLocaleString()} Pi
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* Styles */
const cardStyle = { background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' };
const subLabel = { color: '#6b21a8', margin: '16px 0 8px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #c4b5fd', borderRadius: '12px', background: '#f8fafc' };
const calcButtonStyle = { width: '100%', padding: '18px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '9999px', fontSize: '17px', fontWeight: '700', marginTop: '12px' };
const resultStyle = { textAlign: 'center' as const, padding: '24px', background: '#ede9fe', borderRadius: '16px', marginTop: '20px' };
const activeTabStyle = { flex: 1, padding: '14px', background: '#22d3ee', color: '#0f172a', borderRadius: '9999px', fontWeight: '700' };
const inactiveTabStyle = { flex: 1, padding: '14px', background: '#e0e7ff', color: '#4c1d95', borderRadius: '9999px' };

export default App;