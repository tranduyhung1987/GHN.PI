import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateShipment } from '../hooks/useCreateShipment';
import { useAuth } from '../core/auth/AuthContext';
import { getRoleLabel } from '../utils/constants';
import { useAppController } from '../hooks/useAppController';
import { piService } from '../core/pi/piService';

export default function CreateShipmentPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { createOrder } = useAppController();

  const {
    form,
    setForm,
    paymentMethod,
    setPaymentMethod,
    codAmount,
    setCodAmount,
    shippingFee,
    effectiveWeight,
    volumeWeight,
    isProcessing: hookProcessing,
    totalAmount,
    resetForm,
  } = useCreateShipment();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maDon, setMaDon] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Inline validation errors (functional, replaces alert - no visual redesign)
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) => {
    setErrors(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  // === Role guard (functional only - non-sender/admin still see form but warned + submit disabled) ===
  const canUseForm = !role || role === 'sender' || role === 'admin';
  const roleLabel = getRoleLabel(role);

  // Recipient type moved out for cleanliness
  interface Recipient {
    id: string;
    nguoiNhan: string;
    sdtNhan: string;
    diaChiNhan: string;
  }

  // Sender edit modal (functional editor for mySenderInfo profile)
  const [showSenderEdit, setShowSenderEdit] = useState(false);
  const [senderEdit, setSenderEdit] = useState({ nguoiGui: '', sdtGui: '', diaChiGui: '' });

  const openSenderEdit = () => {
    setSenderEdit({
      nguoiGui: form.nguoiGui || '',
      sdtGui: form.sdtGui || '',
      diaChiGui: form.diaChiGui || '',
    });
    setShowSenderEdit(true);
  };

  const saveSenderEdit = () => {
    // Update form + persist immediately
    setForm(prev => ({
      ...prev,
      nguoiGui: senderEdit.nguoiGui,
      sdtGui: senderEdit.sdtGui,
      diaChiGui: senderEdit.diaChiGui,
    }));
    const mySender = {
      nguoiGui: senderEdit.nguoiGui,
      sdtGui: senderEdit.sdtGui,
      diaChiGui: senderEdit.diaChiGui,
    };
    localStorage.setItem('mySenderInfo', JSON.stringify(mySender));
    setShowSenderEdit(false);
    // Clear related errors
    clearError('nguoiGui');
    clearError('sdtGui');
    clearError('diaChiGui');
  };

  // === DANH BẠ enhancements: edit support ===
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [editRecData, setEditRecData] = useState({ nguoiNhan: '', sdtNhan: '', diaChiNhan: '' });

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

  // === DANH BẠ NGƯỜI NHẬN HÀNG ===
  const [addressBook, setAddressBook] = useState<Recipient[]>([]);
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [addressBookSearch, setAddressBookSearch] = useState('');

  // Load danh bạ từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recipientAddressBook');
    if (saved) {
      setAddressBook(JSON.parse(saved));
    }
  }, []);

  const saveAddressBook = (newBook: Recipient[]) => {
    setAddressBook(newBook);
    localStorage.setItem('recipientAddressBook', JSON.stringify(newBook));
  };

  // Tự động thêm người nhận vào danh bạ khi tạo đơn thành công
  const addToAddressBook = (recipient: { nguoiNhan?: string; sdtNhan?: string; diaChiNhan?: string }) => {
    if (!recipient.nguoiNhan && !recipient.sdtNhan) return;
    const exists = addressBook.some(r => 
      (r.sdtNhan && r.sdtNhan === recipient.sdtNhan) || 
      (r.nguoiNhan === recipient.nguoiNhan && r.diaChiNhan === recipient.diaChiNhan)
    );
    if (exists) return;

    const newEntry: Recipient = {
      id: Date.now().toString(36),
      nguoiNhan: recipient.nguoiNhan || '',
      sdtNhan: recipient.sdtNhan || '',
      diaChiNhan: recipient.diaChiNhan || '',
    };
    const updated = [newEntry, ...addressBook];
    saveAddressBook(updated);
  };

  const selectFromAddressBook = (recipient: Recipient) => {
    setForm(prev => ({
      ...prev,
      nguoiNhan: recipient.nguoiNhan || '',
      sdtNhan: recipient.sdtNhan || '',
      diaChiNhan: recipient.diaChiNhan || '',
    }));
    setShowAddressBook(false);
    setAddressBookSearch('');
  };

  const filteredAddressBook = addressBook.filter((r: Recipient) => {
    const search = addressBookSearch.toLowerCase().trim();
    if (!search) return true;
    return (
      (r.nguoiNhan || '').toLowerCase().includes(search) ||
      (r.sdtNhan || '').toLowerCase().includes(search) ||
      (r.diaChiNhan || '').toLowerCase().includes(search)
    );
  });

  // === NEW: Manual save current receiver to danh bạ (without submitting order) ===
  const saveCurrentToAddressBook = () => {
    addToAddressBook({ 
      nguoiNhan: form.nguoiNhan, 
      sdtNhan: form.sdtNhan, 
      diaChiNhan: form.diaChiNhan 
    });
    // Small functional feedback without new UI elements
    setTimeout(() => {
      // Re-open modal so user sees it added (if was open)
      if (!showAddressBook) {
        setShowAddressBook(true);
      }
    }, 120);
  };

  // Edit support for danh bạ
  const startEditRecipient = (rec: Recipient) => {
    setEditingRecipient(rec);
    setEditRecData({
      nguoiNhan: rec.nguoiNhan || '',
      sdtNhan: rec.sdtNhan || '',
      diaChiNhan: rec.diaChiNhan || '',
    });
    setAddressBookSearch(''); // clean search while editing
  };

  const cancelEditRecipient = () => {
    setEditingRecipient(null);
    setEditRecData({ nguoiNhan: '', sdtNhan: '', diaChiNhan: '' });
  };

  const saveEditRecipient = () => {
    if (!editingRecipient) return;
    const updated = addressBook.map(r =>
      r.id === editingRecipient.id
        ? {
            ...r,
            nguoiNhan: editRecData.nguoiNhan || '',
            sdtNhan: editRecData.sdtNhan || '',
            diaChiNhan: editRecData.diaChiNhan || '',
          }
        : r
    );
    saveAddressBook(updated);
    cancelEditRecipient();
    // If the edited one is currently in form, update form too
    if (
      form.nguoiNhan === editingRecipient.nguoiNhan &&
      form.sdtNhan === editingRecipient.sdtNhan
    ) {
      setForm(prev => ({
        ...prev,
        nguoiNhan: editRecData.nguoiNhan || '',
        sdtNhan: editRecData.sdtNhan || '',
        diaChiNhan: editRecData.diaChiNhan || '',
      }));
    }
  };

  const removeFromAddressBook = (id: string) => {
    if (!window.confirm('Xóa người nhận này khỏi danh bạ?')) return;
    const updated = addressBook.filter(r => r.id !== id);
    saveAddressBook(updated);
    if (editingRecipient?.id === id) cancelEditRecipient();
  };

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

  // COD validity (for disable + hint)
  const codValue = parseFloat(codAmount || '0');
  const isCodValid = paymentMethod !== 'cod' || codValue > 0;

  // Full validation (no alerts - set inline errors)
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.nguoiGui || !form.sdtGui || !form.diaChiGui) {
      if (!form.nguoiGui) newErrors.nguoiGui = 'Vui lòng nhập họ tên người gửi';
      if (!form.sdtGui) newErrors.sdtGui = 'Vui lòng nhập SĐT người gửi';
      if (!form.diaChiGui) newErrors.diaChiGui = 'Vui lòng nhập địa chỉ người gửi';
    }
    if (!form.nguoiNhan || !form.sdtNhan || !form.diaChiNhan) {
      if (!form.nguoiNhan) newErrors.nguoiNhan = 'Vui lòng nhập họ tên người nhận';
      if (!form.sdtNhan) newErrors.sdtNhan = 'Vui lòng nhập SĐT người nhận';
      if (!form.diaChiNhan) newErrors.diaChiNhan = 'Vui lòng nhập địa chỉ nhận';
    }
    if (!form.moTaHang) {
      newErrors.moTaHang = 'Mô tả hàng hóa là bắt buộc (GHN cần để tra cứu/khiếu nại)';
    }
    if (!phoneRegex.test(form.sdtGui || '')) {
      newErrors.sdtGui = 'SĐT không hợp lệ (10 số VN: 03/05/07/08/09...)';
    }
    if (!phoneRegex.test(form.sdtNhan || '')) {
      newErrors.sdtNhan = 'SĐT không hợp lệ (10 số VN: 03/05/07/08/09...)';
    }
    if (form.trongLuong <= 0 || form.dai <= 0 || form.rong <= 0 || form.cao <= 0) {
      if (form.trongLuong <= 0) newErrors.trongLuong = 'Trọng lượng > 0';
      if (form.dai <= 0) newErrors.dai = 'Dài > 0';
      if (form.rong <= 0) newErrors.rong = 'Rộng > 0';
      if (form.cao <= 0) newErrors.cao = 'Cao > 0';
    }
    if (paymentMethod === 'cod' && !isCodValid) {
      newErrors.codAmount = 'Số tiền thu hộ (COD) phải > 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Wrapper: Tạo đơn + Thanh toán Pi thật (nếu prepaid)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!validateForm()) {
      return; // errors shown inline
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

      // 3. Hiển thị thành công + reset form
      setIsProcessing(false);
      saveLastUsedInfo();
      addToAddressBook({ 
        nguoiNhan: form.nguoiNhan, 
        sdtNhan: form.sdtNhan, 
        diaChiNhan: form.diaChiNhan 
      });
      setShowSuccess(true);

    } catch (err: any) {
      console.error('Create shipment error:', err);
      setPaymentError(err?.message || 'Có lỗi xảy ra khi tạo đơn');
      setIsProcessing(false);
    }
  };

  return (
    <div style={pageContainer}>
      {/* Header with functional back (title stays centered, no visual redesign of title size/font) */}
      <div style={{ ...headerStyle, position: 'relative' as const, justifyContent: 'center' as const }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute' as const,
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: '1px solid #c4b5fd',
            color: '#4c1d95',
            fontSize: '15px',
            padding: '4px 10px',
            borderRadius: '9999px',
            cursor: 'pointer',
          }}
          aria-label="Quay lại"
        >
          ←
        </button>
        <h1 style={titleStyle}>GỬI HÀNG</h1>
      </div>

      {/* Role guard banner (functional only - appears for non-sender when testing dev switcher) */}
      {!canUseForm && (
        <div style={{ maxWidth: '360px', margin: '0 auto 12px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', fontSize: '13px', color: '#991b1b', textAlign: 'center' as const }}>
          ⚠️ Bạn đang ở vai trò <strong>{roleLabel}</strong>. Trang này chủ yếu dành cho <strong>Người gửi hàng</strong> (Admin vẫn dùng được). Submit sẽ bị khóa.
          <div style={{ marginTop: 6 }}>
            <button type="button" onClick={() => navigate('/')} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: 9999, border: 'none', background: '#4c1d95', color: 'white', cursor: 'pointer' }}>Về trang chủ</button>
            <button type="button" onClick={() => navigate('/dang-ky')} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: 9999, border: '1px solid #c4b5fd', background: 'white', color: '#4c1d95', marginLeft: 6, cursor: 'pointer' }}>Đổi vai trò</button>
          </div>
        </div>
      )}

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
                onChange={(e) => { setCodAmount(e.target.value); clearError('codAmount'); }} 
                style={inputStyle} 
                min="1000" 
              />
              {errors.codAmount && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.codAmount}</p>}
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                (Cước phí vận chuyển sẽ do người gửi chịu hoặc thỏa thuận)
              </p>
            </div>
          )}
        </div>

        {/* Người gửi - with functional edit profile button (reuses danh bạ button style) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={labelStyle}>Người gửi</label>
            <button
              type="button"
              onClick={openSenderEdit}
              style={{
                padding: '3px 8px',
                fontSize: '11px',
                background: '#f0f0f0',
                color: '#4c1d95',
                border: '1px solid #c4b5fd',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ✏️ Sửa hồ sơ
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Họ tên người gửi" 
            value={form.nguoiGui} 
            onChange={(e) => { setForm({ ...form, nguoiGui: e.target.value }); clearError('nguoiGui'); }} 
            style={inputStyle} 
          />
          {errors.nguoiGui && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.nguoiGui}</p>}
          <input 
            type="tel" 
            placeholder="Số điện thoại" 
            value={form.sdtGui} 
            onChange={(e) => { setForm({ ...form, sdtGui: e.target.value }); clearError('sdtGui'); }} 
            style={{ ...inputStyle, marginTop: '8px' }} 
          />
          {errors.sdtGui && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.sdtGui}</p>}
          <input 
            type="text" 
            placeholder="Địa chỉ người gửi" 
            value={form.diaChiGui} 
            onChange={(e) => { setForm({ ...form, diaChiGui: e.target.value }); clearError('diaChiGui'); }} 
            style={{ ...inputStyle, marginTop: '8px' }} 
          />
          {errors.diaChiGui && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.diaChiGui}</p>}
        </div>

        {/* Người nhận - Danh bạ button (original position) + NEW functional "Lưu hiện tại" */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={labelStyle}>Người nhận</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={saveCurrentToAddressBook}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  background: '#e0d4ff',
                  color: '#4c1d95',
                  border: '1px solid #c4b5fd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                💾 Lưu vào danh bạ
              </button>
              {/* DANH BẠ NGƯỜI NHẬN - đặt ngay đầu, góc phải, ngang bằng label */}
              <button
                type="button"
                onClick={() => setShowAddressBook(true)}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  background: '#f0f0f0',
                  color: '#4c1d95',
                  border: '1px solid #c4b5fd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                📖 Danh bạ ({addressBook.length})
              </button>
            </div>
          </div>
          <input 
            type="text" 
            placeholder="Họ tên người nhận" 
            value={form.nguoiNhan} 
            onChange={(e) => { setForm({ ...form, nguoiNhan: e.target.value }); clearError('nguoiNhan'); }} 
            style={inputStyle} 
          />
          {errors.nguoiNhan && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.nguoiNhan}</p>}
          <input 
            type="tel" 
            placeholder="Số điện thoại" 
            value={form.sdtNhan} 
            onChange={(e) => { setForm({ ...form, sdtNhan: e.target.value }); clearError('sdtNhan'); }} 
            style={{ ...inputStyle, marginTop: '8px' }} 
          />
          {errors.sdtNhan && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.sdtNhan}</p>}
          <input 
            type="text" 
            placeholder="Địa chỉ nhận hàng" 
            value={form.diaChiNhan} 
            onChange={(e) => { setForm({ ...form, diaChiNhan: e.target.value }); clearError('diaChiNhan'); }} 
            style={{ ...inputStyle, marginTop: '8px' }} 
          />
          {errors.diaChiNhan && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.diaChiNhan}</p>}
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
            clearError('nguoiNhan');
            clearError('sdtNhan');
            clearError('diaChiNhan');
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
            marginBottom: '4px',
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
              onChange={(e) => { setForm({ ...form, moTaHang: e.target.value }); clearError('moTaHang'); }} 
              style={inputStyle} 
            />
            {errors.moTaHang && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.moTaHang}</p>}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={smallLabel}>Trọng lượng (kg)</label>
            <input 
              type="number" 
              min="0" 
              step="0.1" 
              value={form.trongLuong || ''} 
              placeholder="Nhập trọng lượng thực tế (kg)" 
              onChange={(e) => { setForm({ ...form, trongLuong: parseFloat(e.target.value) || 0 }); clearError('trongLuong'); }} 
              style={inputStyle} 
            />
            {errors.trongLuong && <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>{errors.trongLuong}</p>}
          </div>
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <label style={smallLabel}>Kích thước (cm) - Dài x Rộng x Cao (dùng tính thể tích nếu cần)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', boxSizing: 'border-box' }}>
              <input 
                type="number" 
                min="0" 
                placeholder="Dài (cm)" 
                value={form.dai || ''} 
                onChange={(e) => { setForm({ ...form, dai: parseFloat(e.target.value) || 0 }); clearError('dai'); }} 
                style={inputStyle} 
              />
              <input 
                type="number" 
                min="0" 
                placeholder="Rộng (cm)" 
                value={form.rong || ''} 
                onChange={(e) => { setForm({ ...form, rong: parseFloat(e.target.value) || 0 }); clearError('rong'); }} 
                style={inputStyle} 
              />
              <input 
                type="number" 
                min="0" 
                placeholder="Cao (cm)" 
                value={form.cao || ''} 
                onChange={(e) => { setForm({ ...form, cao: parseFloat(e.target.value) || 0 }); clearError('cao'); }} 
                style={inputStyle} 
              />
            </div>
            { (errors.dai || errors.rong || errors.cao) && (
              <p style={{ color: '#dc2626', fontSize: '12px', margin: '2px 0 0', paddingLeft: 4 }}>
                {errors.dai || errors.rong || errors.cao}
              </p>
            )}
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
          {/* NEW: functional breakdown (no style change, just added info text) */}
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Cân nặng tính cước: {effectiveWeight.toFixed(2)} kg (max trọng lượng / thể tích {volumeWeight.toFixed(2)})
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
          disabled={isProcessing || hookProcessing || !isCodValid || !canUseForm} 
          style={submitButton}
        >
          {(isProcessing || hookProcessing)
            ? 'Đang xử lý & thanh toán Pi...'
            : paymentMethod === 'prepaid'
              ? `TẠO ĐƠN & THANH TOÁN ${piAmount.toLocaleString()} Pi`
              : `TẠO ĐƠN THU HỘ ${parseFloat(codAmount || '0').toLocaleString()} Pi`}
        </button>
        {!isCodValid && paymentMethod === 'cod' && (
          <p style={{ color: '#dc2626', fontSize: '12px', textAlign: 'center', marginTop: '-6px' }}>
            Vui lòng nhập số tiền thu hộ &gt; 0 để tạo đơn COD
          </p>
        )}
        {!canUseForm && (
          <p style={{ color: '#991b1b', fontSize: '12px', textAlign: 'center', marginTop: '-4px' }}>
            Chỉ Người gửi / Admin mới tạo đơn được (dùng dev switcher hoặc Đổi vai trò)
          </p>
        )}

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
                if (resetForm) resetForm();
                setErrors({});
                navigate('/tracking'); 
              }} 
              style={modalButton}
            >
              Theo dõi đơn hàng
            </button>

            <button 
              onClick={() => { 
                setShowSuccess(false); 
                if (resetForm) resetForm();
                setErrors({});
                navigate('/'); 
              }} 
              style={{ ...modalButton, background: '#64748b', marginTop: '10px' }}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}

      {/* DANH BẠ NGƯỜI NHẬN MODAL - Tìm nhanh, chọn nhanh */}
      {showAddressBook && (
        <div 
          style={modalOverlay}
          onClick={() => {
            setShowAddressBook(false);
            setAddressBookSearch('');
            cancelEditRecipient();
          }}
        >
          <div 
            style={{...modalContent, maxHeight: '70vh', overflowY: 'auto', textAlign: 'left'}}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px', color: '#22d3ee' }}>📖 Danh bạ người nhận</h3>
            
            <input
              type="text"
              placeholder="Tìm theo tên hoặc số điện thoại..."
              value={addressBookSearch}
              onChange={(e) => setAddressBookSearch(e.target.value)}
              style={{ ...inputStyle, marginBottom: '12px', background: '#fff', color: '#000' }}
            />

            {/* Edit form when editing (functional, reuses inputStyle) */}
            {editingRecipient && (
              <div style={{ marginBottom: '12px', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #c4b5fd' }}>
                <div style={{ fontSize: '12px', color: '#4c1d95', marginBottom: '6px', fontWeight: 600 }}>✏️ Đang sửa: {editingRecipient.nguoiNhan}</div>
                <input type="text" placeholder="Tên" value={editRecData.nguoiNhan} onChange={(e) => setEditRecData({ ...editRecData, nguoiNhan: e.target.value })} style={{ ...inputStyle, marginBottom: '6px', background: '#fff', color: '#000' }} />
                <input type="tel" placeholder="SĐT" value={editRecData.sdtNhan} onChange={(e) => setEditRecData({ ...editRecData, sdtNhan: e.target.value })} style={{ ...inputStyle, marginBottom: '6px', background: '#fff', color: '#000' }} />
                <input type="text" placeholder="Địa chỉ" value={editRecData.diaChiNhan} onChange={(e) => setEditRecData({ ...editRecData, diaChiNhan: e.target.value })} style={{ ...inputStyle, marginBottom: '8px', background: '#fff', color: '#000' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={saveEditRecipient} style={{ flex: 1, padding: '8px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Lưu sửa</button>
                  <button type="button" onClick={cancelEditRecipient} style={{ flex: 1, padding: '8px', background: '#64748b', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Hủy</button>
                </div>
              </div>
            )}

            {filteredAddressBook.length > 0 ? (
              filteredAddressBook.map((rec) => (
                <div 
                  key={rec.id}
                  onClick={() => {
                    if (!editingRecipient) selectFromAddressBook(rec);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #e0d4ff',
                    cursor: editingRecipient ? 'default' : 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#fff',
                    opacity: editingRecipient && editingRecipient.id !== rec.id ? 0.6 : 1,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#4c1d95' }}>{rec.nguoiNhan}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {rec.sdtNhan} • {rec.diaChiNhan?.substring(0, 40)}{rec.diaChiNhan?.length > 40 ? '...' : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditRecipient(rec);
                      }}
                      style={{ background: 'none', border: 'none', color: '#4c1d95', fontSize: '16px', cursor: 'pointer', padding: '2px' }}
                      title="Sửa"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromAddressBook(rec.id);
                      }}
                      style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '18px', cursor: 'pointer' }}
                      title="Xóa"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontSize: '13px' }}>
                {addressBook.length === 0 ? 'Chưa có người nhận nào trong danh bạ.' : 'Không tìm thấy kết quả.'}
              </p>
            )}

            <button
              onClick={() => {
                setShowAddressBook(false);
                setAddressBookSearch('');
                cancelEditRecipient();
              }}
              style={{ ...modalButton, marginTop: '16px', background: '#64748b' }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* SENDER PROFILE EDIT MODAL (functional, reuses modalOverlay + inputStyle + modalButton) */}
      {showSenderEdit && (
        <div 
          style={modalOverlay}
          onClick={() => setShowSenderEdit(false)}
        >
          <div 
            style={{...modalContent, maxHeight: '70vh', overflowY: 'auto', textAlign: 'left'}}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px', color: '#22d3ee' }}>✏️ Sửa hồ sơ người gửi</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Thông tin này sẽ tự điền lần sau và lưu vào máy của bạn.</p>

            <label style={{ ...smallLabel, color: '#c4b5fd' }}>Họ tên người gửi</label>
            <input type="text" value={senderEdit.nguoiGui} onChange={(e) => setSenderEdit({ ...senderEdit, nguoiGui: e.target.value })} style={{ ...inputStyle, marginBottom: '10px', background: '#fff', color: '#000' }} />

            <label style={{ ...smallLabel, color: '#c4b5fd' }}>Số điện thoại</label>
            <input type="tel" value={senderEdit.sdtGui} onChange={(e) => setSenderEdit({ ...senderEdit, sdtGui: e.target.value })} style={{ ...inputStyle, marginBottom: '10px', background: '#fff', color: '#000' }} />

            <label style={{ ...smallLabel, color: '#c4b5fd' }}>Địa chỉ người gửi</label>
            <input type="text" value={senderEdit.diaChiGui} onChange={(e) => setSenderEdit({ ...senderEdit, diaChiGui: e.target.value })} style={{ ...inputStyle, marginBottom: '16px', background: '#fff', color: '#000' }} />

            <button onClick={saveSenderEdit} style={modalButton}>
              Lưu hồ sơ người gửi
            </button>
            <button 
              onClick={() => setShowSenderEdit(false)} 
              style={{ ...modalButton, background: '#64748b', marginTop: '10px' }}
            >
              Hủy
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