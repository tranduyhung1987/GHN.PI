// src/pages/KhoHubPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Mode = 'welcome' | 'register' | 'myHub' | 'partnerHub';

export default function KhoHubPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('welcome');

  // Form đăng ký (giữ nguyên từ trước)
  const [formData, setFormData] = useState({ tenKho: '', diaChi: '', tinhThanh: '', soDienThoai: '', email: '', dienTich: '', sucChua: '', moTa: '' });
  const [documents, setDocuments] = useState({ cccd: null as File | null, giayPhep: null as File | null });
  const [previewDocs, setPreviewDocs] = useState({ cccd: '', giayPhep: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (type: 'cccd' | 'giayPhep') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocuments(prev => ({ ...prev, [type]: file }));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewDocs(prev => ({ ...prev, [type]: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  // ==================== RENDER ====================
  return (
    <>
      <button onClick={() => navigate('/')} style={backButtonStyle}>
        ← Quay lại Trang chủ
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '52px' }}>📦</div>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>KHO TRUNG CHUYỂN</h1>
          <p style={{ color: '#94a3b8' }}>Quản lý mạng lưới hubs - Đơn Đường Dài</p>
        </div>
      </div>

      {/* 1. Welcome - Người mới */}
      {mode === 'welcome' && (
        <div style={welcomeContainerStyle}>
          <div style={{ fontSize: '120px', marginBottom: '20px' }}>🏪</div>
          <h1 style={{ fontSize: '34px', color: '#22d3ee', marginBottom: '12px' }}>Mạng lưới Kho Trung Chuyển</h1>
          <h2 style={{ color: '#67e8f9', marginBottom: '32px' }}>GHN.PI</h2>
          <p style={{ color: '#cbd5e1', fontSize: '17px', maxWidth: '620px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Kết nối kho hàng của bạn với hệ sinh thái GHN.PI<br />
            Gửi đơn đường dài nhanh chóng • Thanh toán Pi • Minh bạch tuyệt đối
          </p>
          <button onClick={() => setMode('register')} style={registerButtonStyle}>
            + Đăng ký Kho Trung Chuyển ngay
          </button>
        </div>
      )}

      {/* 2. Form Đăng ký */}
      {mode === 'register' && (
        <div style={formContainerStyle}>
          <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#22d3ee' }}>Đăng ký Kho Trung Chuyển Mới</h2>
          {/* Form đầy đủ sẽ được bổ sung sau nếu bạn muốn */}
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
            Form đăng ký chi tiết đang được hoàn thiện...<br />
            (Bạn có thể click nút dưới để test chuyển sang dashboard)
          </p>
          <button onClick={() => setMode('partnerHub')} style={submitButtonStyle}>Test → Đăng ký thành công</button>
        </div>
      )}

      {/* 3. MyHub - Chủ dự án DApp (bạn) */}
      {mode === 'myHub' && (
        <div style={{ color: '#22d3ee', textAlign: 'center', padding: '60px 20px' }}>
          <h2>👑 Khu vực Chủ Dự Án (My Hub)</h2>
          <p style={{ color: '#67e8f9', marginTop: '20px' }}>Tổng quan hệ thống • Quản lý tất cả đối tác • Doanh thu Pi</p>
          <p style={{ marginTop: '40px', color: '#94a3b8' }}>Đây là giao diện quản trị cao nhất</p>
        </div>
      )}

      {/* 4. PartnerHub - Đối tác Kho hàng đã xác minh */}
      {mode === 'partnerHub' && (
        <>
          <div style={{ display: 'flex', gap: '12px', margin: '28px 0' }}>
            <button onClick={() => setMode('myHub')} style={primaryButtonStyle}>Quản trị hệ thống</button>
            <button style={secondaryButtonStyle}>Kho của tôi</button>
          </div>

          <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Kho của bạn</h3>
          <div style={hubCardStyle}>
            <div>
              <strong>TP.HCM Hub (SG01)</strong>
              <p style={{ color: '#4ade80' }}>Đang hoạt động • 189 đơn đường dài</p>
            </div>
            <div style={{ color: '#22d3ee', fontSize: '32px' }}>→</div>
          </div>

          <h3 style={{ color: '#e2e8f0', margin: '30px 0 16px 0' }}>Đơn đường dài đang xử lý</h3>
          {/* Danh sách đơn hàng */}
          <div style={{ color: '#4ade80', padding: '20px', background: '#1e2937', borderRadius: '16px', textAlign: 'center' }}>
            Bạn đang là đối tác chính thức của GHN.PI
          </div>
        </>
      )}
    </>
  );
}

/* ====================== STYLES ====================== */
const backButtonStyle = {
  color: '#ffffff', fontSize: '16px', fontWeight: 'bold', marginBottom: '25px',
  padding: '14px 28px', backgroundColor: '#1e2937', border: '2px solid #22d3ee',
  borderRadius: '9999px', cursor: 'pointer', boxShadow: '0 0 15px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.5)'
};

const welcomeContainerStyle = {
  textAlign: 'center' as const,
  padding: '60px 20px',
  backgroundColor: '#1e2937',
  borderRadius: '24px',
  border: '2px solid #334155'
};

const registerButtonStyle = {
  padding: '18px 40px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 0 25px rgba(34, 211, 238, 0.7)'
};

const primaryButtonStyle = { ...registerButtonStyle, fontSize: '16px', padding: '16px 24px' };
const secondaryButtonStyle = {
  padding: '16px 24px',
  backgroundColor: '#334155',
  color: '#e2e8f0',
  border: '1px solid #475569',
  borderRadius: '9999px',
  fontWeight: '600',
  cursor: 'pointer'
};

const formContainerStyle = {
  backgroundColor: '#1e2937',
  padding: '50px 30px',
  borderRadius: '24px',
  border: '2px solid #334155'
};

const hubCardStyle = {
  backgroundColor: '#1e2937',
  padding: '20px 24px',
  borderRadius: '16px',
  border: '1px solid #334155',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const submitButtonStyle = {
  padding: '18px 32px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer',
  width: '100%'
};