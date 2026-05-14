// src/pages/TrackingPage.tsx
import React, { useState } from 'react';

const TrackingPage: React.FC = () => {
  const [maDon, setMaDon] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrack = () => {
    if (!maDon.trim()) {
      alert("Vui lòng nhập mã đơn hàng!");
      return;
    }

    // Demo data
    setTrackingResult({
      maDon: maDon.toUpperCase(),
      status: "Đang vận chuyển",
      location: "Kho trung chuyển Hà Nội",
      time: "14/05/2026 19:45",
      progress: 75
    });
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>🚚</div>
        <h1 style={title}>THEO DÕI ĐƠN HÀNG</h1>
      </div>

      <div style={searchBox}>
        <input 
          type="text" 
          placeholder="Nhập mã đơn hàng (ví dụ: GHN12345678)" 
          value={maDon} 
          onChange={(e) => setMaDon(e.target.value)}
          style={inputStyle} 
        />
        <button onClick={handleTrack} style={trackButton}>
          Tra cứu
        </button>
      </div>

      {trackingResult && (
        <div style={resultCard}>
          <h3>Mã đơn: {trackingResult.maDon}</h3>
          <p style={{ color: '#22d3ee', fontWeight: '700', fontSize: '18px' }}>
            {trackingResult.status}
          </p>
          <p>Vị trí hiện tại: {trackingResult.location}</p>
          <p>Thời gian cập nhật: {trackingResult.time}</p>

          <div style={progressBarContainer}>
            <div style={{ ...progressBar, width: `${trackingResult.progress}%` }}></div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '8px', color: '#6b21a8' }}>
            {trackingResult.progress}% hoàn thành
          </p>
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

const searchBox = { marginBottom: '30px' };
const inputStyle = {
  width: '100%',
  padding: '16px',
  fontSize: '16px',
  border: '1px solid #c4b5fd',
  borderRadius: '12px',
  background: '#ede9fe',
  marginBottom: '12px'
};

const trackButton = {
  width: '100%',
  padding: '16px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '17px'
};

const resultCard = {
  background: '#fff',
  padding: '24px',
  borderRadius: '20px',
  border: '2px solid #22d3ee'
};

const progressBarContainer = {
  height: '12px',
  background: '#e0e7ff',
  borderRadius: '9999px',
  overflow: 'hidden',
  margin: '20px 0'
};

const progressBar = {
  height: '100%',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  borderRadius: '9999px'
};

export default TrackingPage;