import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🚀 GHN.PI</h1>
      <p>Giao Hàng Nhanh - Thanh Toán Bằng Pi</p>
      
      <button 
        onClick={() => navigate('/gui-hang')}
        style={{
          marginTop: '30px',
          padding: '15px 30px',
          fontSize: '18px',
          background: '#22d3ee',
          color: '#0f172a',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer'
        }}
      >
        Tạo Đơn Gửi Hàng
      </button>
    </div>
  );
}