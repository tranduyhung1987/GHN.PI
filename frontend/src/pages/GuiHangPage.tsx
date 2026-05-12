// src/pages/GuiHangPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DonHangForm {
  loaiDon: 'hoatoc' | 'duongdai';
  
  // Người gửi
  nguoiGui: string;
  sdtGui: string;
  tinhGui: string;
  quanGui: string;
  phuongGui: string;
  diaChiGui: string;

  // Người nhận
  nguoiNhan: string;
  sdtNhan: string;
  tinhNhan: string;
  quanNhan: string;
  phuongNhan: string;
  diaChiNhan: string;

  // Kiện hàng
  trongLuong: number;
  dai: number;
  rong: number;
  cao: number;
  giaTriHang: number;

  // Dịch vụ bổ sung
  coBaoHiem: boolean;
  codAmount: number;
  ghiChu: string;
}

const provinces = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Lâm Đồng', 'Nghệ An'
];

// Dữ liệu mẫu (bạn có thể thay bằng API sau)
const districts: Record<string, string[]> = {
  'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Cầu Giấy'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh'],
  // ... thêm sau
};

export default function GuiHangPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maDon, setMaDon] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<DonHangForm>({
    loaiDon: 'hoatoc',
    nguoiGui: '', sdtGui: '', tinhGui: '', quanGui: '', phuongGui: '', diaChiGui: '',
    nguoiNhan: '', sdtNhan: '', tinhNhan: '', quanNhan: '', phuongNhan: '', diaChiNhan: '',
    trongLuong: 1, dai: 20, rong: 15, cao: 10,
    giaTriHang: 500000,
    coBaoHiem: false,
    codAmount: 0,
    ghiChu: ''
  });

  // ==================== TÍNH PHÍ ====================
  const calculateFee = () => {
    const weight = form.trongLuong;
    const volWeight = (form.dai * form.rong * form.cao) / 5000;
    const chargeWeight = Math.max(weight, volWeight);

    let baseFee = form.loaiDon === 'hoatoc' 
      ? chargeWeight * 35000 
      : chargeWeight * 22000;

    let insuranceFee = form.coBaoHiem ? form.giaTriHang * 0.005 : 0;
    let codFee = form.codAmount > 0 ? 15000 : 0;

    const total = Math.round(baseFee + insuranceFee + codFee + 8000); // phí cố định

    return {
      baseFee: Math.round(baseFee),
      insuranceFee: Math.round(insuranceFee),
      codFee,
      fixedFee: 8000,
      total
    };
  };

  const fee = calculateFee();

  // ==================== VALIDATION ====================
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.nguoiGui.trim()) newErrors.nguoiGui = "Vui lòng nhập họ tên người gửi";
    if (!form.sdtGui.trim() || !/^[0-9]{10}$/.test(form.sdtGui)) newErrors.sdtGui = "SĐT người gửi không hợp lệ";
    
    if (!form.tinhGui) newErrors.tinhGui = "Vui lòng chọn tỉnh/thành";
    if (!form.diaChiGui.trim()) newErrors.diaChiGui = "Vui lòng nhập địa chỉ chi tiết";

    if (!form.nguoiNhan.trim()) newErrors.nguoiNhan = "Vui lòng nhập họ tên người nhận";
    if (!form.sdtNhan.trim() || !/^[0-9]{10}$/.test(form.sdtNhan)) newErrors.sdtNhan = "SĐT người nhận không hợp lệ";
    if (!form.tinhNhan) newErrors.tinhNhan = "Vui lòng chọn tỉnh/thành";
    if (!form.diaChiNhan.trim()) newErrors.diaChiNhan = "Vui lòng nhập địa chỉ chi tiết";

    if (form.trongLuong <= 0) newErrors.trongLuong = "Trọng lượng phải > 0";
    if (form.giaTriHang < 0) newErrors.giaTriHang = "Giá trị hàng không hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation khi blur
  const handleBlur = (field: string) => {
    validateForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newMaDon = `GHN${Date.now().toString().slice(-8)}`;
      setMaDon(newMaDon);
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1800);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>GỬI HÀNG</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Tạo đơn vận chuyển • Thanh toán bằng Pi Network</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* LOẠI ĐƠN */}
        <div>
          <label style={labelStyle}>Loại đơn hàng</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })}
              style={form.loaiDon === 'hoatoc' ? activeToggle : inactiveToggle}>
              ⚡ Hỏa Tốc (2-4 giờ)
            </button>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'duongdai' })}
              style={form.loaiDon === 'duongdai' ? activeToggle : inactiveToggle}>
              🛣️ Đường Dài (1-3 ngày)
            </button>
          </div>
        </div>

        {/* NGƯỜI GỬI */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#22d3ee', marginBottom: '16px' }}>📤 Người gửi</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input type="text" placeholder="Họ tên người gửi" value={form.nguoiGui}
              onChange={e => setForm({...form, nguoiGui: e.target.value})}
              onBlur={() => handleBlur('nguoiGui')}
              style={inputStyle} />
            <input type="tel" placeholder="Số điện thoại" value={form.sdtGui}
              onChange={e => setForm({...form, sdtGui: e.target.value})}
              onBlur={() => handleBlur('sdtGui')}
              style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <select value={form.tinhGui} onChange={e => setForm({...form, tinhGui: e.target.value, quanGui: '', phuongGui: ''})}
              style={inputStyle}>
              <option value="">Tỉnh/Thành</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={form.quanGui} onChange={e => setForm({...form, quanGui: e.target.value})} style={inputStyle}>
              <option value="">Quận/Huyện</option>
              {(districts[form.tinhGui] || []).map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <input type="text" placeholder="Phường/Xã" value={form.phuongGui}
              onChange={e => setForm({...form, phuongGui: e.target.value})} style={inputStyle} />
          </div>

          <input type="text" placeholder="Địa chỉ chi tiết (số nhà, ngõ, đường...)" value={form.diaChiGui}
            onChange={e => setForm({...form, diaChiGui: e.target.value})}
            style={{...inputStyle, marginTop: '12px'}} />
        </div>

        {/* NGƯỜI NHẬN */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#22d3ee', marginBottom: '16px' }}>📥 Người nhận</h3>
          {/* Tương tự người gửi - code rút gọn */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input type="text" placeholder="Họ tên người nhận" value={form.nguoiNhan}
              onChange={e => setForm({...form, nguoiNhan: e.target.value})} style={inputStyle} />
            <input type="tel" placeholder="Số điện thoại" value={form.sdtNhan}
              onChange={e => setForm({...form, sdtNhan: e.target.value})} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <select value={form.tinhNhan} onChange={e => setForm({...form, tinhNhan: e.target.value, quanNhan: '', phuongNhan: ''})}
              style={inputStyle}>
              <option value="">Tỉnh/Thành</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={form.quanNhan} onChange={e => setForm({...form, quanNhan: e.target.value})} style={inputStyle}>
              <option value="">Quận/Huyện</option>
              {(districts[form.tinhNhan] || []).map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <input type="text" placeholder="Phường/Xã" value={form.phuongNhan}
              onChange={e => setForm({...form, phuongNhan: e.target.value})} style={inputStyle} />
          </div>

          <input type="text" placeholder="Địa chỉ nhận hàng chi tiết" value={form.diaChiNhan}
            onChange={e => setForm({...form, diaChiNhan: e.target.value})} 
            style={{...inputStyle, marginTop: '12px'}} />
        </div>

        {/* THÔNG TIN KIỆN HÀNG */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#22d3ee', marginBottom: '16px' }}>📦 Thông tin kiện hàng</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={smallLabel}>Trọng lượng (kg)</label>
              <input type="number" step="0.1" min="0.1" value={form.trongLuong}
                onChange={e => setForm({...form, trongLuong: parseFloat(e.target.value) || 1})} style={inputStyle} />
            </div>
            <div>
              <label style={smallLabel}>Giá trị hàng hóa (đ)</label>
              <input type="number" value={form.giaTriHang}
                onChange={e => setForm({...form, giaTriHang: parseInt(e.target.value) || 0})} style={inputStyle} />
            </div>
          </div>

          <label style={smallLabel}>Kích thước (cm)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <input type="number" placeholder="Dài" value={form.dai} onChange={e => setForm({...form, dai: parseFloat(e.target.value) || 0})} style={inputStyle} />
            <input type="number" placeholder="Rộng" value={form.rong} onChange={e => setForm({...form, rong: parseFloat(e.target.value) || 0})} style={inputStyle} />
            <input type="number" placeholder="Cao" value={form.cao} onChange={e => setForm({...form, cao: parseFloat(e.target.value) || 0})} style={inputStyle} />
          </div>
        </div>

        {/* DỊCH VỤ BỔ SUNG */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#22d3ee', marginBottom: '12px' }}>Dịch vụ bổ sung</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.coBaoHiem} 
              onChange={e => setForm({...form, coBaoHiem: e.target.checked})} />
            <span>Bảo hiểm hàng hóa (0.5% giá trị)</span>
          </label>

          <div style={{ marginTop: '12px' }}>
            <label style={smallLabel}>Số tiền thu hộ (COD)</label>
            <input type="number" placeholder="0 (không thu hộ)" value={form.codAmount}
              onChange={e => setForm({...form, codAmount: parseInt(e.target.value) || 0})} style={inputStyle} />
          </div>
        </div>

        {/* GHI CHÚ */}
        <div>
          <label style={labelStyle}>Ghi chú cho tài xế</label>
          <input type="text" placeholder="Ghi chú..." value={form.ghiChu}
            onChange={e => setForm({...form, ghiChu: e.target.value})} style={inputStyle} />
        </div>

        {/* ƯỚC TÍNH PHÍ CHI TIẾT */}
        <div style={feeBoxStyle}>
          <p style={{ color: '#94a3b8', marginBottom: '12px' }}>Ước tính cước vận chuyển</p>
          
          <div style={{ textAlign: 'left', fontSize: '15px', lineHeight: '1.8' }}>
            <div>Cước cơ bản: <strong>{fee.baseFee.toLocaleString()} Pi</strong></div>
            {fee.insuranceFee > 0 && <div>Bảo hiểm: <strong>{fee.insuranceFee.toLocaleString()} Pi</strong></div>}
            {fee.codFee > 0 && <div>Phí COD: <strong>{fee.codFee.toLocaleString()} Pi</strong></div>}
            <div>Phí cố định: <strong>8.000 Pi</strong></div>
          </div>

          <hr style={{ borderColor: '#334155', margin: '12px 0' }} />

          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#22d3ee', margin: '8px 0' }}>
            {fee.total.toLocaleString()} <span style={{ fontSize: '20px' }}>Pi</span>
          </p>
        </div>

        {/* XÁC NHẬN */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#cbd5e1' }}>
          <input type="checkbox" required style={{ marginTop: '4px' }} />
          Tôi xác nhận thông tin chính xác và đồng ý với <span style={{ color: '#22d3ee', cursor: 'pointer' }}>Điều khoản dịch vụ</span>
        </label>

        <button type="submit" disabled={isProcessing || Object.keys(errors).length > 0}
          style={{...submitButtonStyle, opacity: Object.keys(errors).length > 0 ? 0.6 : 1}}>
          {isProcessing ? 'Đang ký hợp đồng Pi...' : `TẠO ĐƠN & THANH TOÁN ${fee.total.toLocaleString()} Pi`}
        </button>
      </form>

      {/* MODAL THÀNH CÔNG */}
      {showSuccess && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ color: '#22d3ee', marginBottom: '20px' }}>✅ Tạo đơn thành công!</h2>
            <p><strong>Mã đơn:</strong> <span style={{ color: '#22d3ee' }}>{maDon}</span></p>
            <p><strong>Số Pi đã thanh toán:</strong> {fee.total.toLocaleString()} Pi</p>

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
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' };
const smallLabel = { display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '14px' };
const sectionStyle = { backgroundColor: '#1e2937', padding: '20px', borderRadius: '16px', border: '1px solid #334155' };

const inputStyle = {
  width: '100%', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #475569',
  borderRadius: '12px', color: 'white', fontSize: '16px', boxSizing: 'border-box' as const
};

const activeToggle = {
  flex: 1, padding: '16px', borderRadius: '16px',
  border: '2px solid #22d3ee', background: '#22d3ee', color: '#0f172a', fontWeight: 'bold'
} as const;

const inactiveToggle = {
  flex: 1, padding: '16px', borderRadius: '16px',
  border: '1px solid #475569', background: '#1e2937', color: 'white', fontWeight: 'bold'
} as const;

const feeBoxStyle = {
  backgroundColor: '#1e2937', padding: '24px', borderRadius: '16px',
  border: '1px solid #334155', textAlign: 'center' as const
};

const submitButtonStyle = {
  padding: '18px', fontSize: '18px', fontWeight: 'bold',
  background: '#22d3ee', color: '#0f172a', border: 'none',
  borderRadius: '9999px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)'
} as const;

const modalOverlay = { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent = { background: '#1e2937', padding: '40px', borderRadius: '20px', textAlign: 'center', maxWidth: '380px', border: '1px solid #22d3ee' } as const;
const modalButton = { padding: '16px 32px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '9999px', fontWeight: 'bold', width: '100%', marginTop: '20px', cursor: 'pointer' } as const;