// src/pages/DoiSoatPage.tsx
import React, { useState } from 'react';

const DoiSoatPage: React.FC = () => {
  const [maDon, setMaDon] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleDoiSoat = () => {
    if (!maDon.trim()) {
      alert("Vui lòng nhập mã đơn hàng!");
      return;
    }
    setShowResult(true);
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>💰</div>
        <h1 style={title}>ĐỐI SOÁT</h1>
        <p style={subtitle}>Kiểm tra và đối chiếu thanh toán</p>
      </div>

      <div style={formBox}>
        <label style={label}>Mã đơn hàng cần đối soát</label>
        <input 
          type="text" 
          placeholder="Nhập mã đơn hàng" 
          value={maDon} 
          onChange={(e) => setMaDon(e.target.value)}
          style={inputStyle} 
        />

        <button onClick={handleDoiSoat} style={button}>
          Kiểm tra đối soát
        </button>
      </div>

      {showResult && (
        <div style={resultBox}>
          <h3>✅ Kết quả đối soát</h3>
          <p><strong>Mã đơn:</strong> {maDon}</p>
          <p><strong>Trạng thái:</strong> <span style={{ color: '#22d3ee' }}>Đã thanh toán đầy đủ</span></p>
          <p><strong>Số tiền:</strong> 28.450 Pi</p>
          <p><strong>Thời gian thanh toán:</strong> 14/05/2026 14:32</p>
          <button onClick={() => { setShowResult(false); setMaDon(''); }} style={newButton}>
            Đối soát đơn khác
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
const inputStyle = { width: '100%', padding: '16px', border: '1px solid #c4b5fd', borderRadius: '12px', background: '#ede9fe', fontSize: '16px' };

const button = {
  width: '100%',
  padding: '18px',
  marginTop: '20px',
  background: 'linear-gradient(90deg, #eab308, #facc15)',
  color: '#1e2937',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '17px'
};

const resultBox = {
  marginTop: '24px',
  background: '#fff',
  padding: '24px',
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
  borderRadius: '9999px'
};

export default DoiSoatPage;