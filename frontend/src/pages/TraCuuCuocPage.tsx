import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTraCuuCuoc } from '../hooks/useTraCuuCuoc';

export default function TraCuuCuocPage() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, form, setForm, ketQua, calculating, calculateFee } = useTraCuuCuoc();

  return (
    <div style={pageContainer}>
      <div style={roleBar}>
        <span>💰 Tra cứu cước</span>
        <button onClick={() => navigate('/ca-nhan')} style={changeRoleBtn}>Đổi vai trò</button>
      </div>

      <h1 style={titleStyle}>💰 TRA CỨU CƯỚC PHÍ</h1>

      <div style={cardStyle}>
        <div style={tabContainer}>
          <button style={activeTab === 'cuoc' ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab('cuoc')}>Tính cước</button>
          <button style={activeTab === 'tim' ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab('tim')}>Tìm bưu cục</button>
        </div>

        {activeTab === 'cuoc' && (
          <>
            {/* Form tính cước - có thể mở rộng sau */}
            <button 
              style={submitButton} 
              onClick={calculateFee}
              disabled={calculating}
            >
              {calculating ? 'Đang tính...' : 'Tính cước phí'}
            </button>

            {ketQua && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f0fdf4', borderRadius: '12px', textAlign: 'center' }}>
                <h4>Cước phí tạm tính: <strong>{ketQua.cuocPhi} Pi</strong></h4>
                <p>Thời gian dự kiến: {ketQua.thoiGian}</p>
              </div>
            )}

            <button 
              style={createOrderBtn}
              onClick={() => navigate('/gui-hang')}
            >
              Tạo đơn hàng ngay
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* Styles thống nhất */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '20px' };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px' };
const changeRoleBtn: React.CSSProperties = { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '99px', padding: '4px 12px' };
const titleStyle: React.CSSProperties = { fontSize: '22px', color: '#4c1d95', textAlign: 'center', margin: '20px 0' };
const cardStyle: React.CSSProperties = { background: '#ffffff', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '20px' };
const activeTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#22d3ee', color: '#fff', border: 'none', fontWeight: '700' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#f3f4f6', color: '#4c1d95', border: '1px solid #d1d5db', fontWeight: '600' };
const submitButton: React.CSSProperties = { padding: '16px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', width: '100%' };
const createOrderBtn: React.CSSProperties = { width: '100%', padding: '16px', marginTop: '16px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700' };