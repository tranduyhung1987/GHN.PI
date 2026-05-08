// src/pages/TaiXePage.tsx
import { useNavigate } from 'react-router-dom';

export default function TaiXePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* NÚT QUAY LẠI TRANG CHỦ - LUNG LINH */}
      <button
        onClick={() => navigate('/')}
        style={{
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '25px',
          padding: '14px 28px',
          backgroundColor: '#1e2937',
          border: '2px solid #22d3ee',
          borderRadius: '9999px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 15px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 25px #22d3ee, 0 0 45px rgba(34, 211, 238, 0.8)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 15px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.5)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        ← Quay lại Trang chủ
      </button>

      {/* Tiêu đề trang */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>🏍️</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>TÀI XẾ</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Nhận đơn & Giao hàng</p>

      {/* Nội dung chính */}
      <div style={{
        backgroundColor: '#1e2937',
        padding: '40px 24px',
        borderRadius: '24px',
        textAlign: 'center',
        border: '1px solid #334155'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏍️</div>
        <h2 style={{ marginBottom: '12px' }}>Đơn hàng đang chờ</h2>
        <p style={{ color: '#94a3b8', margin: '20px 0', fontSize: '18px' }}>
          Bạn có <strong style={{ color: '#22d3ee' }}>3 đơn hỏa tốc</strong> gần vị trí hiện tại
        </p>
        
        <button 
          style={{
            padding: '16px 40px',
            background: '#22d3ee',
            color: '#0f172a',
            border: 'none',
            borderRadius: '9999px',
            fontWeight: 'bold',
            fontSize: '17px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)',
            marginTop: '10px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Nhận Đơn Ngay
        </button>
      </div>
    </>
  );
}