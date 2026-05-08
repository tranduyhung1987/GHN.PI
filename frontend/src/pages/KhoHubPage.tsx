// src/pages/KhoHubPage.tsx
import { useNavigate } from 'react-router-dom';

export default function KhoHubPage() {
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
        <div style={{ fontSize: '48px' }}>🏬</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>KHO TRUNG CHUYỂN</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Quản lý mạng lưới hubs</p>

      <div style={{ backgroundColor: '#1e2937', padding: '30px', borderRadius: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Các kho hiện tại</h3>
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '16px', marginBottom: '16px' }}>
          <strong>Hà Nội Hub (HN01)</strong><br />Đang hoạt động • 245 đơn
        </div>
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '16px', marginBottom: '16px' }}>
          <strong>TP.HCM Hub (SG01)</strong><br />Đang hoạt động • 189 đơn
        </div>
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '16px' }}>
          <strong>Đà Nẵng Hub (DN01)</strong><br />Đang hoạt động • 67 đơn
        </div>
      </div>
    </>
  );
}