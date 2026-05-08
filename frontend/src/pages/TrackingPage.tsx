// src/pages/TrackingPage.tsx
import { useNavigate } from 'react-router-dom';

export default function TrackingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/')} style={{color:'#22d3ee', marginBottom:'20px', background:'none', border:'none'}}>← Quay lại Trang chủ</button>
      
      <h1>📍 TRACKING</h1>
      <p style={{color:'#94a3b8', marginBottom:'30px'}}>Theo dõi đơn hàng thời gian thực</p>

      <div style={{backgroundColor:'#1e2937', padding:'40px', borderRadius:'24px', textAlign:'center'}}>
        <div style={{fontSize:'80px', marginBottom:'20px'}}>📍</div>
        <h2>Nhập mã đơn hàng</h2>
        <input 
          type="text" 
          placeholder="Ví dụ: GHN123456" 
          style={{width:'100%', padding:'16px', borderRadius:'12px', border:'1px solid #475569', background:'#0f172a', color:'white', marginBottom:'20px'}}
        />
        <button style={{padding:'16px 40px', background:'#22d3ee', color:'#0f172a', border:'none', borderRadius:'9999px', fontWeight:'bold', width:'100%'}}>
          Theo dõi đơn hàng
        </button>
      </div>
    </div>
  );
}