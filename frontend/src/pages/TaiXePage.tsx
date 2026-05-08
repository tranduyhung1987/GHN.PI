// src/pages/TaiXePage.tsx
import { useNavigate } from 'react-router-dom';

export default function TaiXePage() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/')} style={{color:'#22d3ee', marginBottom:'20px', background:'none', border:'none'}}>← Quay lại Trang chủ</button>
      
      <h1>🏍️ TÀI XẾ</h1>
      <p style={{color:'#94a3b8', marginBottom:'30px'}}>Nhận đơn & Giao hàng</p>

      <div style={{backgroundColor:'#1e2937', padding:'40px', borderRadius:'24px', textAlign:'center'}}>
        <div style={{fontSize:'80px', marginBottom:'20px'}}>🏍️</div>
        <h2>Đơn hàng đang chờ</h2>
        <p style={{color:'#94a3b8', margin:'20px 0'}}>Bạn có <strong>3 đơn hỏa tốc</strong> gần vị trí hiện tại</p>
        <button style={{padding:'16px 40px', background:'#22d3ee', color:'#0f172a', border:'none', borderRadius:'9999px', fontWeight:'bold'}}>
          Nhận Đơn Ngay
        </button>
      </div>
    </div>
  );
}