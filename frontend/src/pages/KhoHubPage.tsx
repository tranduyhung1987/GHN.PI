// src/pages/KhoHubPage.tsx
import { useNavigate } from 'react-router-dom';

export default function KhoHubPage() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/')} style={{color:'#22d3ee', marginBottom:'20px', background:'none', border:'none'}}>← Quay lại Trang chủ</button>
      
      <h1>🏬 KHO TRUNG CHUYỂN</h1>
      <p style={{color:'#94a3b8', marginBottom:'30px'}}>Quản lý mạng lưới hubs</p>

      <div style={{backgroundColor:'#1e2937', padding:'30px', borderRadius:'24px'}}>
        <h3 style={{marginBottom:'20px'}}>Các kho hiện tại</h3>
        <div style={{background:'#0f172a', padding:'20px', borderRadius:'16px', marginBottom:'16px'}}>
          <strong>Hà Nội Hub (HN01)</strong><br />Đang hoạt động • 245 đơn
        </div>
        <div style={{background:'#0f172a', padding:'20px', borderRadius:'16px', marginBottom:'16px'}}>
          <strong>TP.HCM Hub (SG01)</strong><br />Đang hoạt động • 189 đơn
        </div>
        <div style={{background:'#0f172a', padding:'20px', borderRadius:'16px'}}>
          <strong>Đà Nẵng Hub (DN01)</strong><br />Đang hoạt động • 67 đơn
        </div>
      </div>
    </div>
  );
}