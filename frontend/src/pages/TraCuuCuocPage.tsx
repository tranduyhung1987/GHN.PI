// src/pages/TraCuuCuocPage.tsx
import React, { useState } from 'react';

const TraCuuCuocPage: React.FC = () => {
  const [fromProvince, setFromProvince] = useState('');
  const [toProvince, setToProvince] = useState('');
  const [weight, setWeight] = useState(1);
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(15);
  const [height, setHeight] = useState(10);
  const [result, setResult] = useState<number | null>(null);

  const calculateFee = () => {
    if (!fromProvince || !toProvince) {
      alert("Vui lòng chọn tỉnh/thành phố!");
      return;
    }

    const volWeight = (length * width * height) / 5000;
    const chargeWeight = Math.max(weight, volWeight);
    const baseFee = chargeWeight * 25000;
    const finalFee = Math.round(baseFee + 12000);

    setResult(finalFee);
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>🔎</div>
        <h1 style={title}>TRA CỨU CƯỚC</h1>
        <p style={subtitle}>Ước tính chi phí vận chuyển</p>
      </div>

      <div style={formContainer}>
        <div>
          <label style={label}>Từ Tỉnh/Thành phố</label>
          <input 
            type="text" 
            placeholder="Ví dụ: Hà Nội" 
            value={fromProvince} 
            onChange={(e) => setFromProvince(e.target.value)} 
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={label}>Đến Tỉnh/Thành phố</label>
          <input 
            type="text" 
            placeholder="Ví dụ: TP.HCM" 
            value={toProvince} 
            onChange={(e) => setToProvince(e.target.value)} 
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={label}>Trọng lượng (kg)</label>
          <input 
            type="number" 
            value={weight} 
            onChange={(e) => setWeight(parseFloat(e.target.value) || 1)} 
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={label}>Kích thước (cm)</label>
          <div style={sizeGrid}>
            <input type="number" placeholder="Dài" value={length} onChange={(e) => setLength(parseFloat(e.target.value) || 0)} style={inputStyle} />
            <input type="number" placeholder="Rộng" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 0)} style={inputStyle} />
            <input type="number" placeholder="Cao" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} style={inputStyle} />
          </div>
        </div>

        <button onClick={calculateFee} style={calcButton}>
          Tính cước vận chuyển
        </button>

        {result && (
          <div style={resultBox}>
            <p style={{ margin: '0 0 8px 0', color: '#6b21a8' }}>Ước tính cước:</p>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#22d3ee', margin: 0 }}>
              {result.toLocaleString()} <span style={{ fontSize: '18px' }}>Pi</span>
            </p>
          </div>
        )}
      </div>
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

const formContainer = { display: 'flex', flexDirection: 'column' as const, gap: '20px' };
const label = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4c1d95' };
const inputStyle = { width: '100%', padding: '14px 16px', background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: '12px', fontSize: '16px' };

const sizeGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' };

const calcButton = {
  width: '100%',
  padding: '18px',
  fontSize: '17px',
  fontWeight: '700',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  marginTop: '10px'
};

const resultBox = {
  background: '#ede9fe',
  padding: '24px',
  borderRadius: '20px',
  border: '2px solid #22d3ee',
  textAlign: 'center' as const,
  marginTop: '20px'
};

export default TraCuuCuocPage;