// src/pages/NhanHangPage.tsx
import { useNavigate } from 'react-router-dom';

export default function NhanHangPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* NÚT QUAY LẠI - ĐÃ ĐỒNG BỘ */}
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
          e.currentTarget.style.boxShadow = '0 0 25px #22d3ee, 0 0 45px rgba(34, 211, 238, 0.9)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 15px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.5)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        ← Quay lại Trang chủ
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>🖐️</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>NHẬN HÀNG</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Kiểm tra & Xác nhận hàng về kho</p>

      <div style={{ 
        background: '#1e2937', 
        padding: '40px 24px', 
        borderRadius: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🖐️</div>
        
        <h2>Xác nhận nhận hàng</h2>
        <p style={{ color: '#94a3b8', margin: '20px 0' }}>
          Quét mã QR hoặc nhập mã đơn hàng để xác nhận
        </p>

        <input 
          type="text" 
          placeholder="Nhập mã đơn hàng (ví dụ: GHN123456)" 
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#0f172a',
            border: '1px solid #475569',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            marginBottom: '20px'
          }} 
        />

        <button style={{
          padding: '16px 40px',
          background: '#4ade80',
          color: '#0f172a',
          border: 'none',
          borderRadius: '9999px',
          fontWeight: 'bold',
          fontSize: '17px',
          width: '100%'
        }}>
          Xác nhận đã nhận hàng
        </button>
      </div>
    </>
  );
}