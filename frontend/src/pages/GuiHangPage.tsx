// src/pages/GuiHangPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DonHangForm {
  loaiDon: 'hoatoc' | 'duongdai';
  nguoiGui: string;
  sdtGui: string;
  nguoiNhan: string;
  sdtNhan: string;
  diaChiNhan: string;
  trongLuong: number;
  dai: number;
  rong: number;
  cao: number;
  ghiChu: string;
}

export default function GuiHangPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maDon, setMaDon] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<DonHangForm>({
    loaiDon: 'hoatoc',
    nguoiGui: '',
    sdtGui: '',
    nguoiNhan: '',
    sdtNhan: '',
    diaChiNhan: '',
    trongLuong: 1,
    dai: 20,
    rong: 15,
    cao: 10,
    ghiChu: ''
  });

  const calculateFee = (): number => {
    const weight = form.trongLuong;
    const volWeight = (form.dai * form.rong * form.cao) / 5000;
    const chargeWeight = Math.max(weight, volWeight);
    let baseFee = form.loaiDon === 'hoatoc' ? chargeWeight * 35000 : chargeWeight * 22000;
    return Math.round(baseFee + 8000);
  };

  const piAmount = calculateFee();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.nguoiGui.trim()) newErrors.nguoiGui = "Vui lòng nhập họ tên người gửi";
    if (!form.sdtGui.trim() || !/^[0-9]{10}$/.test(form.sdtGui)) newErrors.sdtGui = "Số điện thoại không hợp lệ (10 số)";
    if (!form.nguoiNhan.trim()) newErrors.nguoiNhan = "Vui lòng nhập họ tên người nhận";
    if (!form.sdtNhan.trim() || !/^[0-9]{10}$/.test(form.sdtNhan)) newErrors.sdtNhan = "Số điện thoại không hợp lệ (10 số)";
    if (!form.diaChiNhan.trim()) newErrors.diaChiNhan = "Vui lòng nhập địa chỉ nhận hàng";
    if (form.trongLuong <= 0) newErrors.trongLuong = "Trọng lượng phải lớn hơn 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newMaDon = `GHN${Date.now().toString().slice(-8)}`;
      setMaDon(newMaDon);
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>GỬI HÀNG</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Tạo đơn vận chuyển mới</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* LOẠI ĐƠN HÀNG */}
        <div>
          <label style={labelStyle}>Loại đơn hàng</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })} style={form.loaiDon === 'hoatoc' ? activeToggle : inactiveToggle}>
              ⚡ Hỏa Tốc
            </button>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'duongdai' })} style={form.loaiDon === 'duongdai' ? activeToggle : inactiveToggle}>
              🛣️ Đường Dài
            </button>
          </div>
        </div>

        {/* NGƯỜI GỬI */}
        <div>
          <label style={labelStyle}>Người gửi</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input type="text" placeholder="Họ tên người gửi" value={form.nguoiGui} onChange={(e) => setForm({...form, nguoiGui: e.target.value})} style={inputStyle} />
            {errors.nguoiGui && <p style={{ color: 'red', fontSize: '13px' }}>{errors.nguoiGui}</p>}
            <input type="tel" placeholder="Số điện thoại" value={form.sdtGui} onChange={(e) => setForm({...form, sdtGui: e.target.value})} style={inputStyle} />
            {errors.sdtGui && <p style={{ color: 'red', fontSize: '13px' }}>{errors.sdtGui}</p>}
          </div>
        </div>

        {/* NGƯỜI NHẬN */}
        <div>
          <label style={labelStyle}>Người nhận</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input type="text" placeholder="Họ tên người nhận" value={form.nguoiNhan} onChange={(e) => setForm({...form, nguoiNhan: e.target.value})} style={inputStyle} />
            {errors.nguoiNhan && <p style={{ color: 'red', fontSize: '13px' }}>{errors.nguoiNhan}</p>}
            <input type="tel" placeholder="Số điện thoại người nhận" value={form.sdtNhan} onChange={(e) => setForm({...form, sdtNhan: e.target.value})} style={inputStyle} />
            {errors.sdtNhan && <p style={{ color: 'red', fontSize: '13px' }}>{errors.sdtNhan}</p>}
          </div>
          <input type="text" placeholder="Địa chỉ nhận hàng chi tiết" value={form.diaChiNhan} onChange={(e) => setForm({...form, diaChiNhan: e.target.value})} style={{...inputStyle, marginTop: '12px'}} />
          {errors.diaChiNhan && <p style={{ color: 'red', fontSize: '13px' }}>{errors.diaChiNhan}</p>}
        </div>

        {/* THÔNG TIN KIỆN HÀNG */}
        <div>
          <label style={labelStyle}>Thông tin kiện hàng</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label style={smallLabel}>Trọng lượng (kg)</label>
              <input type="number" min="0.1" step="0.1" value={form.trongLuong} onChange={(e) => setForm({...form, trongLuong: parseFloat(e.target.value) || 1})} style={inputStyle} />
            </div>
            <div>
              <label style={smallLabel}>Kích thước (cm)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <input type="number" placeholder="Dài" value={form.dai} onChange={(e) => setForm({...form, dai: parseFloat(e.target.value) || 0})} style={inputStyle} />
                <input type="number" placeholder="Rộng" value={form.rong} onChange={(e) => setForm({...form, rong: parseFloat(e.target.value) || 0})} style={inputStyle} />
                <input type="number" placeholder="Cao" value={form.cao} onChange={(e) => setForm({...form, cao: parseFloat(e.target.value) || 0})} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* GHI CHÚ */}
        <div>
          <label style={labelStyle}>Ghi chú cho tài xế</label>
          <input type="text" placeholder="Ghi chú..." value={form.ghiChu} onChange={(e) => setForm({...form, ghiChu: e.target.value})} style={inputStyle} />
        </div>

        {/* ƯỚC TÍNH PHÍ */}
        <div style={feeBoxStyle}>
          <p style={{ color: '#94a3b8', marginBottom: '8px' }}>Ước tính cước vận chuyển</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 8px 0' }}>
            {piAmount.toLocaleString()} <span style={{ fontSize: '20px' }}>Pi</span>
          </p>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Thanh toán 100% qua hợp đồng thông minh Pi Network
          </p>
        </div>

        <button type="submit" disabled={isProcessing} style={submitButtonStyle}>
          {isProcessing ? 'Đang ký hợp đồng Pi...' : `TẠO ĐƠN & THANH TOÁN ${piAmount.toLocaleString()} Pi`}
        </button>
      </form>

      {/* MODAL THÀNH CÔNG */}
      {showSuccess && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ color: '#22d3ee', marginBottom: '20px' }}>✅ Tạo đơn thành công!</h2>
            <p><strong>Mã đơn:</strong> <span style={{ color: '#22d3ee' }}>{maDon}</span></p>
            <p><strong>Số Pi đã thanh toán:</strong> {piAmount.toLocaleString()} Pi</p>

            <button 
              onClick={() => { setShowSuccess(false); navigate('/tracking'); }}
              style={modalButton}
            >
              Theo dõi đơn hàng ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ====================== STYLES ====================== */
const labelStyle = { display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#e2e8f0' };
const smallLabel = { display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '14px' };

const inputStyle = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#1e2937',
  border: '1px solid #475569',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
  boxSizing: 'border-box' as const
};

const activeToggle = {
  flex: 1, padding: '16px', borderRadius: '16px',
  border: '2px solid #22d3ee', background: '#22d3ee', color: '#0f172a',
  fontWeight: 'bold'
} as const;

const inactiveToggle = {
  flex: 1, padding: '16px', borderRadius: '16px',
  border: '1px solid #475569', background: '#1e2937', color: 'white',
  fontWeight: 'bold'
} as const;

const feeBoxStyle = {
  backgroundColor: '#1e2937',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #334155',
  textAlign: 'center' as const
};

const submitButtonStyle = {
  padding: '18px',
  fontSize: '18px',
  fontWeight: 'bold',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)'
} as const;

const modalOverlay = {
  position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.9)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

const modalContent = {
  background: '#1e2937', padding: '40px', borderRadius: '20px',
  textAlign: 'center', maxWidth: '380px', border: '1px solid #22d3ee'
} as const;

const modalButton = {
  padding: '16px 32px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  width: '100%',
  marginTop: '20px',
  cursor: 'pointer'
} as const;