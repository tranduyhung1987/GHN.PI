import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateShipment } from '../hooks/useCreateShipment';
import { useAuth } from '../core/auth/AuthContext';
import { useAppController } from '../hooks/useAppController';
import { piService } from '../core/pi/piService';

export default function CreateShipmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrder } = useAppController();

  const {
    form,
    setForm,
    paymentMethod,
    setPaymentMethod,
    codAmount,
    setCodAmount,
    handleSubmit: baseHandleSubmit,
    shippingFee,
    isProcessing: hookProcessing,
    totalAmount,
    handleQuickFillSeller,
    handleQuickFillBuyer,
    handleQuickFillPi,
  } = useCreateShipment();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maDon, setMaDon] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // === TỐT NHẤT: Auto-prefill sender + last used receiver (tránh gõ tay) ===
  useEffect(() => {
    if (!user?.username) return;

    // 1. Load "My Sender Info" từ localStorage (lưu profile người gửi)
    const mySender = localStorage.getItem('mySenderInfo');
    let senderInfo = mySender ? JSON.parse(mySender) : {};

    // 2. Ưu tiên từ Pi user hiện tại
    const fromPi = {
      nguoiGui: user.name || user.username,
      sdtGui: senderInfo.sdtGui || '09xxxxxxxx', // TODO: lấy từ profile thật sau
      diaChiGui: senderInfo.diaChiGui || '',
    };

    // 3. Load last receiver (người nhận thường dùng)
    const lastReceiver = localStorage.getItem('lastReceiverInfo');
    let receiverInfo = lastReceiver ? JSON.parse(lastReceiver) : {};

    // Chỉ set nếu form còn trống (tránh ghi đè khi user đã sửa)
    setForm(prev => ({
      ...prev,
      nguoiGui: prev.nguoiGui || fromPi.nguoiGui,
      sdtGui: prev.sdtGui || fromPi.sdtGui,
      diaChiGui: prev.diaChiGui || fromPi.diaChiGui,
      nguoiNhan: prev.nguoiNhan || receiverInfo.nguoiNhan || '',
      sdtNhan: prev.sdtNhan || receiverInfo.sdtNhan || '',
      diaChiNhan: prev.diaChiNhan || receiverInfo.diaChiNhan || '',
    }));
  }, [user?.username]);

  // Tự động lưu thông tin người gửi mỗi khi thay đổi (để lần sau mở form là có sẵn)
  useEffect(() => {
    if (form.nguoiGui || form.sdtGui || form.diaChiGui) {
      const mySender = {
        nguoiGui: form.nguoiGui,
        sdtGui: form.sdtGui,
        diaChiGui: form.diaChiGui,
      };
      localStorage.setItem('mySenderInfo', JSON.stringify(mySender));
    }
  }, [form.nguoiGui, form.sdtGui, form.diaChiGui]);

  // Lưu thông tin khi submit thành công (để lần sau tự điền)
  const saveLastUsedInfo = () => {
    // Lưu sender của người dùng (my profile)
    const mySender = {
      nguoiGui: form.nguoiGui,
      sdtGui: form.sdtGui,
      diaChiGui: form.diaChiGui,
    };
    localStorage.setItem('mySenderInfo', JSON.stringify(mySender));

    // Lưu người nhận lần cuối (frequent receiver)
    if (form.nguoiNhan || form.sdtNhan || form.diaChiNhan) {
      const lastReceiver = {
        nguoiNhan: form.nguoiNhan,
        sdtNhan: form.sdtNhan,
        diaChiNhan: form.diaChiNhan,
      };
      localStorage.setItem('lastReceiverInfo', JSON.stringify(lastReceiver));
    }
  };

  const piAmount = shippingFee;

  // Wrapper: Tạo đơn + Thanh toán Pi thật (nếu prepaid)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    // Validation thực tế hơn (số điện thoại VN, cân nặng >0, COD nếu chọn)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!form.nguoiGui || !form.sdtGui || !form.diaChiGui ||
        !form.nguoiNhan || !form.sdtNhan || !form.diaChiNhan ||
        !form.moTaHang) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (bao gồm mô tả hàng)!");
      return;
    }
    if (!phoneRegex.test(form.sdtGui) || !phoneRegex.test(form.sdtNhan)) {
      alert("Số điện thoại không hợp lệ (phải là 10 số VN bắt đầu bằng 03,05,07,08,09)!");
      return;
    }
    if (form.trongLuong <= 0 || form.dai <= 0 || form.rong <= 0 || form.cao <= 0) {
      alert("Trọng lượng và kích thước phải lớn hơn 0!");
      return;
    }
    if (paymentMethod === 'cod' && (!codAmount || parseFloat(codAmount) <= 0)) {
      alert("Vui lòng nhập số tiền thu hộ (COD) > 0!");
      return;
    }

    setIsProcessing(true);

    try {
      const newMaDon = `GHN${Date.now().toString().slice(-8)}`;
      setMaDon(newMaDon);

      const orderPayload = {
        maDon: newMaDon,
        ...form,
        paymentMethod,
        codAmount: paymentMethod === 'cod' ? codAmount : '0',
        totalAmount: piAmount,
        piUsername: user?.username || 'unknown',
        createdAt: Date.now(),
        status: paymentMethod === 'prepaid' ? 'pending_payment' : 'pending',
      };

      // 1. Gọi AppController (sẽ emit event → OrderEngine → SyncEngine)
      await createOrder(orderPayload);

      // 2. Nếu thanh toán trước → gọi Pi Payment thật
      if (paymentMethod === 'prepaid') {
        const paymentResult = await piService.createPayment?.({
          identifier: newMaDon,
          amount: piAmount,
          memo: `GHN.PI - Thanh toán đơn ${newMaDon}`,
          metadata: {
            orderId: newMaDon,
            type: 'shipment',
            from: form.nguoiGui,
            to: form.nguoiNhan,
          },
        });

        if (!paymentResult?.success) {
          setPaymentError(paymentResult?.error || 'Thanh toán Pi thất bại');
          setIsProcessing(false);
          return;
        }

        // Cập nhật order đã thanh toán
        await createOrder({
          ...orderPayload,
          status: 'paid',
          paymentTxId: paymentResult.transactionId,
        });
      }

      // 3. Hiển thị thành công
      setIsProcessing(false);
      saveLastUsedInfo();  // Lưu để lần sau tự điền
      setShowSuccess(true);

    } catch (err: any) {
      console.error('Create shipment error:', err);
      setPaymentError(err?.message || 'Có lỗi xảy ra khi tạo đơn');
      setIsProcessing(false);
    }
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>GỬI HÀNG</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '360px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Loại đơn */}
        <div>
          <label style={labelStyle}>Loại đơn hàng</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })}
              style={form.loaiDon === 'hoatoc' ? activeToggle : inactiveToggle}>
              ⚡ Hỏa Tốc
            </button>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'duongdai' })}
              style={form.loaiDon === 'duongdai' ? activeToggle : inactiveToggle}>
              🛣️ Đường Dài
            </button>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <label style={labelStyle}>Phương thức thanh toán</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setPaymentMethod('prepaid')}
              style={paymentMethod === 'prepaid' ? activeToggle : inactiveToggle}>
              💰 Thanh toán trước
            </button>
            <button type="button" onClick={() => setPaymentMethod('cod')}
              style={paymentMethod === 'cod' ? activeToggle : inactiveToggle}>
              📦 Thu hộ (COD Pi)
            </button>
          </div>
          {/* Input số tiền thu hộ - chỉ hiện khi COD (thực tế GHN) */}
          {paymentMethod === 'cod' && (
            <div style={{ marginTop: '8px' }}>
              <label style={smallLabel}>Số tiền thu hộ (Pi) - giá trị hàng hóa người nhận sẽ thanh toán</label>
              <input 
                type="number" 
                placeholder="Nhập số tiền thu hộ (ví dụ: 150000)" 
                value={codAmount} 
                onChange={(e) => setCodAmount(e.target.value)} 
                style={inputStyle} 
                min="1000" 
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                (Cước phí vận chuyển sẽ do người gửi chịu hoặc thỏa thuận)
              </p>
            </div>
          )}
        </div>

        {/* Người gửi */}
        <div>
          <label style={labelStyle}>Người gửi</label>
          <input type="text" placeholder="Họ tên người gửi" value={form.nguoiGui} onChange={(e) => setForm({ ...form, nguoiGui: e.target.value })} style={inputStyle} />
          <input type="tel" placeholder="Số điện thoại" value={form.sdtGui} onChange={(e) => setForm({ ...form, sdtGui: e.target.value })} style={{ ...inputStyle, marginTop: '8px' }} />
          <input type="text" placeholder="Địa chỉ người gửi" value={form.diaChiGui} onChange={(e) => setForm({ ...form, diaChiGui: e.target.value })} style={{ ...inputStyle, marginTop: '8px' }} />
        </div>

        {/* Người nhận */}
        <div>
          <label style={labelStyle}>Người nhận</label>
          <input type="text" placeholder="Họ tên người nhận" value={form.nguoiNhan} onChange={(e) => setForm({ ...form, nguoiNhan: e.target.value })} style={inputStyle} />
          <input type="tel" placeholder="Số điện thoại" value={form.sdtNhan} onChange={(e) => setForm({ ...form, sdtNhan: e.target.value })} style={{ ...inputStyle, marginTop: '8px' }} />
          <input type="text" placeholder="Địa chỉ nhận hàng" value={form.diaChiNhan} onChange={(e) => setForm({ ...form, diaChiNhan: e.target.value })} style={{ ...inputStyle, marginTop: '8px' }} />
        </div>

        {/* Quick action cho người nhận - rất thực tế trong app GHN */}
        <button
          type="button"
          onClick={() => {
            setForm(prev => ({
              ...prev,
              nguoiNhan: prev.nguoiGui,
              sdtNhan: prev.sdtGui,
              diaChiNhan: prev.diaChiGui,
            }));
          }}
          style={{
            alignSelf: 'flex-start',
            padding: '6px 12px',
            fontSize: '13px',
            background: '#e0d4ff',
            color: '#4c1d95',
            border: '1px solid #c4b5fd',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '-8px',
            marginBottom: '8px',
          }}
        >
          📋 Dùng thông tin người gửi (giao cho chính mình / người thân)
        </button>

        {/* Thông tin kiện hàng */}
        <div>
          <label style={labelStyle}>Thông tin kiện hàng</label>
          <div style={{ marginBottom: '8px' }}>
            <label style={smallLabel}>Mô tả hàng hóa (bắt buộc - thực tế GHN cần để tra cứu, khiếu nại, phân loại)</label>
            <input 
              type="text" 
              placeholder="Ví dụ: Quần áo, điện thoại, tài liệu..." 
              value={form.moTaHang} 
              onChange={(e) => setForm({ ...form, moTaHang: e.target.value })} 
              style={inputStyle} 
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={smallLabel}>Trọng lượng (kg)</label>
            <input type="number" min="0.1" step="0.1" value={form.trongLuong} onChange={(e) => setForm({ ...form, trongLuong: parseFloat(e.target.value) || 1 })} style={inputStyle} />
          </div>
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <label style={smallLabel}>Kích thước (cm) - Dài x Rộng x Cao (dùng tính thể tích nếu cần)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', boxSizing: 'border-box' }}>
              <input type="number" min="1" placeholder="Dài" value={form.dai} onChange={(e) => setForm({ ...form, dai: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              <input type="number" min="1" placeholder="Rộng" value={form.rong} onChange={(e) => setForm({ ...form, rong: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              <input type="number" min="1" placeholder="Cao" value={form.cao} onChange={(e) => setForm({ ...form, cao: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Thực tế GHN dùng cân nặng thực hoặc thể tích (tùy loại hàng)
            </p>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Ghi chú</label>
          <input type="text" placeholder="Ghi chú cho tài xế..." value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} style={inputStyle} />
        </div>

        {/* Ước tính cước (thực tế GHN: dựa cân nặng, loại dịch vụ, khoảng cách - ở đây dùng công thức đơn giản) */}
        <div style={feeBoxStyle}>
          <p style={{ color: '#6b21a8', marginBottom: '6px' }}>Ước tính cước vận chuyển (người gửi chịu)</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22d3ee' }}>
            {piAmount.toLocaleString()} <span style={{ fontSize: '18px' }}>Pi</span>
          </p>
          {paymentMethod === 'cod' && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#10b981' }}>
              <p>📦 Thu hộ: {parseFloat(codAmount || '0').toLocaleString()} Pi (người nhận thanh toán khi nhận)</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Cước phí vận chuyển do người gửi chịu (thực tế GHN có thể trừ vào COD hoặc thu riêng)</p>
            </div>
          )}
          {paymentMethod === 'prepaid' && (
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
              Thanh toán trước bằng Pi (đã bao gồm cước)
            </p>
          )}
        </div>

        {/* Hiển thị lỗi thanh toán nếu có */}
        {paymentError && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '12px', fontSize: '14px' }}>
            ❌ {paymentError}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isProcessing || hookProcessing} 
          style={submitButton}
        >
          {(isProcessing || hookProcessing)
            ? 'Đang xử lý & thanh toán Pi...'
            : paymentMethod === 'prepaid'
              ? `TẠO ĐƠN & THANH TOÁN ${piAmount.toLocaleString()} Pi`
              : `TẠO ĐƠN THU HỘ ${parseFloat(codAmount || '0').toLocaleString()} Pi`}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '-8px' }}>
          {piService.isAuthenticated?.() ? '✓ Đã kết nối Pi' : '⚠️ Chưa kết nối Pi (dùng Mock Payment)'}
        </p>
        {typeof window !== 'undefined' && !window.Pi && (
          <p style={{ fontSize: '11px', color: '#f59e0b', textAlign: 'center', marginTop: 4 }}>
            Thanh toán Pi thật chỉ hoạt động khi mở trong <strong>Pi Browser</strong>
          </p>
        )}
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ color: '#22d3ee', marginBottom: '16px' }}>✅ Tạo đơn thành công!</h2>
            <p><strong>Mã đơn hàng:</strong> <span style={{ color: '#22d3ee', fontSize: '18px' }}>{maDon}</span></p>
            <p style={{ marginTop: '8px' }}>
              {paymentMethod === 'prepaid'
                ? '✅ Đã thanh toán trước bằng Pi (cước vận chuyển).'
                : `📦 Thu hộ (COD Pi) - Người nhận sẽ thanh toán ${parseFloat(codAmount || '0').toLocaleString()} Pi khi nhận hàng (cước do người gửi chịu).`}
            </p>
            <p style={{ marginTop: '12px', color: '#94a3b8' }}>Đơn hàng đã được ghi nhận. Hệ thống sẽ thông báo cho tài xế gần nhất.</p>

            <button 
              onClick={() => { 
                setShowSuccess(false); 
                navigate('/tracking'); 
              }} 
              style={modalButton}
            >
              Theo dõi đơn hàng
            </button>

            <button 
              onClick={() => { 
                setShowSuccess(false); 
                navigate('/'); 
              }} 
              style={{ ...modalButton, background: '#64748b', marginTop: '10px' }}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES (GIỮ NGUYÊN) ===================== */
const pageContainer = { minHeight: '100vh', background: '#f3e8ff', padding: '16px 20px 100px', boxSizing: 'border-box' as const };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' };
const titleStyle = { fontSize: '26px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4c1d95' };
const smallLabel = { display: 'block', marginBottom: '5px', color: '#6b21a8', fontSize: '13.5px' };
const inputStyle = {
  width: '100%', padding: '14px 16px', backgroundColor: '#ede9fe',
  border: '1px solid #c4b5fd', borderRadius: '12px', color: '#4c1d95', fontSize: '15.5px',
  boxSizing: 'border-box' as const
};
const activeToggle = { flex: 1, padding: '13px', borderRadius: '9999px', background: '#22d3ee', color: '#0f172a', fontWeight: '700' };
const inactiveToggle = { flex: 1, padding: '13px', borderRadius: '9999px', background: '#e0e7ff', color: '#4c1d95', border: '1px solid #c4b5fd', fontWeight: '600' };
const feeBoxStyle = { backgroundColor: '#ede9fe', padding: '20px', borderRadius: '16px', border: '1px solid #c4b5fd', textAlign: 'center' as const };
const submitButton = {
  width: '100%', padding: '18px', fontSize: '17px', fontWeight: '700',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a',
  border: 'none', borderRadius: '9999px', boxShadow: '0 8px 25px rgba(34,211,238,0.5)'
};
const modalOverlay = { position: 'fixed' as const, top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.95)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 };
const modalContent = { background:'#1e2937', padding:'40px', borderRadius:'24px', textAlign:'center' as const, maxWidth:'380px', border:'1px solid #22d3ee' };
const modalButton = { padding:'16px', background:'#22d3ee', color:'#0f172a', border:'none', borderRadius:'9999px', fontWeight:'700', width:'100%', marginTop:'20px' };