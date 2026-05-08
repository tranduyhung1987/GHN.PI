// src/pages/NhanHangPage.tsx
import { useNavigate } from 'react-router-dom';

export default function NhanHangPage() {
  const navigate = useNavigate();

  return (
    <div>
      <button 
        onClick={() => navigate('/')}
        style={{ color: '#22d3ee', marginBottom: '20px', background: 'none', border: 'none', fontSize: '16px' }}
      >
        ← Quay lại Trang chủ
      </button>

      <h1 style={{ marginBottom: '8px' }}>NHẬN HÀNG</h1>
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
    </div>
  );
}