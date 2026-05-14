// src/pages/NhanHangPage.tsx
import React, { useState } from 'react';

const NhanHangPage: React.FC = () => {
  const [maDon, setMaDon] = useState('');
  const [isReceived, setIsReceived] = useState(false);

  const handleConfirm = () => {
    if (!maDon.trim()) {
      alert("Vui lòng nhập mã đơn hàng!");
      return;
    }
    setIsReceived(true);
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>📥</div>
        <h1 style={title}>NHẬN HÀNG</h1>
        <p style={subtitle}>Xác nhận giao hàng thành công</p>
      </div>

      <div style={formBox}>
        <label style={label}>Mã đơn hàng</label>
        <input 
          type="text" 
          placeholder="Nhập mã đơn (GHN...)" 
          value={maDon} 
          onChange={(e) => setMaDon(e.target.value)}
          style={inputStyle} 
        />

        <button onClick={handleConfirm} style={confirmButton}>
          Xác nhận đã nhận hàng
        </button>
      </div>

      {isReceived && (
        <div style={successBox}>
          <h3>✅ Xác nhận thành công!</h3>
          <p>Mã đơn: <strong>{maDon}</strong></p>
          <p>Người nhận đã xác nhận giao hàng lúc {new Date().toLocaleTimeString()}</p>
          <button onClick={() => { setIsReceived(false); setMaDon(''); }} style={newButton}>
            Nhận đơn khác
          </button>
        </div>
      )}
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

const formBox = { background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #c4b5fd' };
const label = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4c1d95' };
const inputStyle = { width: '100%', padding: '16px', border: '1px solid #c4b5fd', borderRadius: '12px', fontSize: '16px', background: '#ede9fe' };

const confirmButton = {
  width: '100%',
  padding: '18px',
  marginTop: '20px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '17px'
};

const successBox = {
  marginTop: '24px',
  background: '#fff',
  padding: '30px 20px',
  borderRadius: '20px',
  border: '2px solid #22d3ee',
  textAlign: 'center' as const
};

const newButton = {
  marginTop: '20px',
  padding: '14px 32px',
  background: '#4c1d95',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600'
};

export default NhanHangPage;