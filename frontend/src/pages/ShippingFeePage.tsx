import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShippingFee, PROVINCES, FeeForm } from '../hooks/useShippingFee';
import { useAuth } from '../core/auth/AuthContext';

/* ===================== BEAUTIFUL FULL-FEATURED SHIPPING FEE PAGE =====================
 * - Realistic GHN calc (zone, vol weight, tiers, COD, insurance)
 * - Beautiful UI consistent with app (purple #4c1d95, cyan accents, rounded cards)
 * - Clean code using enhanced hook
 * - Full features: prefill sender, history, apply-to-create, breakdown, etc.
 * - Mobile/Pi Browser friendly
 */

export default function ShippingFeePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    form,
    setForm,
    ketQua,
    calculating,
    calculateFee,
    history,
    loadFromHistory,
    clearHistory,
    applyToCreateShipment,
  } = useShippingFee();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [codEnabled, setCodEnabled] = useState(false);

  // Sync COD enabled when loading from history or prefill (if codAmount > 0)
  useEffect(() => {
    if (form.codAmount > 0) {
      setCodEnabled(true);
    }
  }, [form.codAmount]);

  // Prefill sender from mySenderInfo (same as Create form)
  const loadMySender = () => {
    try {
      const raw = localStorage.getItem('mySenderInfo');
      if (!raw) {
        alert('Chưa có hồ sơ người gửi. Hãy tạo đơn lần đầu để lưu.');
        return;
      }
      const s = JSON.parse(raw);
      const addr = s.diaChiGui || '';
      const parts = addr.split(',').map((p: string) => p.trim());
      const guessed = parts[parts.length - 1] || 'Hà Nội';
      const match = PROVINCES.find(p => guessed.toLowerCase().includes(p.toLowerCase().substring(0, 4))) || 'Hà Nội';

      setForm((prev: FeeForm) => ({
        ...prev,
        tinhGui: match,
        quanGui: parts[parts.length - 2] || prev.quanGui || 'Quận 1',
      }));
      clearError('tinhGui');
    } catch {
      // ignore
    }
  };

  const clearError = (k: string) => setErrors(prev => { const { [k]: _, ...rest } = prev; return rest; });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.tinhGui) e.tinhGui = 'Chọn tỉnh/thành gửi';
    if (!form.tinhNhan) e.tinhNhan = 'Chọn tỉnh/thành nhận';
    if (form.khoiLuong <= 0) e.khoiLuong = 'Khối lượng > 0';
    if (form.dai <= 0 || form.rong <= 0 || form.cao <= 0) e.dims = 'Kích thước phải > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    // Explicit action: save current live result to history
    calculateFee();
  };

  // Apply estimate + go to create shipment (prefills receiver + last fee)
  const handleUseForShipment = () => {
    applyToCreateShipment();
    navigate('/gui-hang');
  };

  const updateField = (key: keyof FeeForm, value: any) => {
    setForm((prev: FeeForm) => ({ ...prev, [key]: value }));
    clearError(key as string);
    if (key === 'dai' || key === 'rong' || key === 'cao' || key === 'khoiLuong') clearError('dims');
  };

  // Simple inline input style (consistent with CreateShipmentPage)
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: '#ede9fe',
    border: '1px solid #c4b5fd', borderRadius: 12, color: '#4c1d95', fontSize: 15,
    boxSizing: 'border-box' as const,
  };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontWeight: 600, color: '#4c1d95', fontSize: 14 };
  const sectionStyle: React.CSSProperties = { background: 'white', borderRadius: 16, padding: 16, marginBottom: 14, border: '1px solid #e0d4ff' };

  const isSender = !user || user.role === 'sender' || user.role === 'admin';

  return (
    <div style={{ minHeight: '100vh', background: '#f3e8ff', padding: '16px 16px 100px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#4c1d95' }}>📊 TRA CỨU CƯỚC</div>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Ước tính phí GHN chính xác • Dành cho Người gửi
        </p>
        {isSender && (
          <button onClick={loadMySender} style={{
            marginTop: 8, fontSize: 12, padding: '4px 12px', borderRadius: 9999,
            border: '1px solid #c4b5fd', background: '#f0f0f0', color: '#4c1d95', cursor: 'pointer'
          }}>
            📥 Lấy từ hồ sơ người gửi của tôi
          </button>
        )}
      </div>

      {/* ĐỊA CHỈ GỬI */}
      <div style={sectionStyle}>
        <div style={labelStyle}>📍 Địa chỉ gửi</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <select value={form.tinhGui} onChange={e => updateField('tinhGui', e.target.value)} style={inputStyle}>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.tinhGui && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 2 }}>{errors.tinhGui}</p>}
          </div>
          <input
            type="text"
            placeholder="Quận / Huyện"
            value={form.quanGui}
            onChange={e => updateField('quanGui', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* ĐỊA CHỈ NHẬN */}
      <div style={sectionStyle}>
        <div style={labelStyle}>📍 Địa chỉ nhận</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <select value={form.tinhNhan} onChange={e => updateField('tinhNhan', e.target.value)} style={inputStyle}>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.tinhNhan && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 2 }}>{errors.tinhNhan}</p>}
          </div>
          <input
            type="text"
            placeholder="Quận / Huyện nhận"
            value={form.quanNhan}
            onChange={e => updateField('quanNhan', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* THÔNG TIN KIỆN HÀNG */}
      <div style={sectionStyle}>
        <div style={labelStyle}>📦 Thông tin kiện hàng</div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 13, color: '#6b21a8' }}>Trọng lượng (kg)</label>
          <input
            type="number" step="0.1" min="0"
            value={form.khoiLuong || ''}
            placeholder="Nhập trọng lượng thực tế (kg)"
            onChange={e => updateField('khoiLuong', parseFloat(e.target.value) || 0)}
            style={inputStyle}
          />
          {errors.khoiLuong && <p style={{ color: '#dc2626', fontSize: 12 }}>{errors.khoiLuong}</p>}
        </div>

        <div>
          <label style={{ fontSize: 13, color: '#6b21a8' }}>Kích thước (cm) - Dài × Rộng × Cao</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <input type="number" placeholder="Dài (cm)" value={form.dai || ''} onChange={e => updateField('dai', parseFloat(e.target.value) || 0)} style={inputStyle} />
            <input type="number" placeholder="Rộng (cm)" value={form.rong || ''} onChange={e => updateField('rong', parseFloat(e.target.value) || 0)} style={inputStyle} />
            <input type="number" placeholder="Cao (cm)" value={form.cao || ''} onChange={e => updateField('cao', parseFloat(e.target.value) || 0)} style={inputStyle} />
          </div>
          {errors.dims && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.dims}</p>}
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>GHN tính cước theo cân nặng thực hoặc thể tích (chia 6000)</p>
        </div>
      </div>

      {/* LOẠI DỊCH VỤ */}
      <div style={sectionStyle}>
        <div style={labelStyle}>🚀 Loại dịch vụ</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { val: 'hoatoc', label: '⚡ Hỏa Tốc' },
            { val: 'tietkiem', label: '💰 Tiết kiệm' },
            { val: 'duongdai', label: '🛣️ Đường dài' },
          ].map(opt => (
            <button
              key={opt.val}
              type="button"
              onClick={() => updateField('loaiDichVu', opt.val as any)}
              style={{
                flex: 1, padding: '11px 8px', borderRadius: 9999, fontWeight: 600, fontSize: 13,
                border: form.loaiDichVu === opt.val ? '2px solid #22d3ee' : '1px solid #c4b5fd',
                background: form.loaiDichVu === opt.val ? '#22d3ee' : '#ede9fe',
                color: form.loaiDichVu === opt.val ? '#0f172a' : '#4c1d95',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* PHỤ PHÍ (COD + KHAI GIÁ) */}
      <div style={sectionStyle}>
        <div style={labelStyle}>💳 Phụ phí &amp; Khai giá</div>

        {/* COD - no default value, fully customizable to real COD amount */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <input
              type="checkbox"
              checked={codEnabled}
              onChange={e => {
                const enabled = e.target.checked;
                setCodEnabled(enabled);
                updateField('codAmount', enabled ? 0 : 0);
              }}
            />
            <span style={{ fontSize: 13, color: '#6b21a8' }}>Có thu hộ (COD)</span>
          </div>
          {codEnabled && (
            <input
              type="number"
              placeholder="Nhập số tiền thu hộ thực tế (Pi)"
              value={form.codAmount || ''}
              onChange={e => updateField('codAmount', parseFloat(e.target.value) || 0)}
              style={inputStyle}
            />
          )}
          {codEnabled && (
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Phụ phí COD sẽ được tính tự động theo giá trị thực tế bạn nhập
            </p>
          )}
        </div>

        {/* Khai giá */}
        <div>
          <label style={{ fontSize: 13, color: '#6b21a8' }}>Khai giá bảo hiểm (nếu có)</label>
          <input
            type="number"
            placeholder="Giá trị khai báo (Pi)"
            value={form.khaiGia || ''}
            onChange={e => updateField('khaiGia', parseFloat(e.target.value) || 0)}
            style={inputStyle}
          />
          <p style={{ fontSize: 11, color: '#64748b' }}>Phí bảo hiểm ~0.45% giá trị</p>
        </div>
      </div>

      {/* LIVE CALC INDICATOR + EXPLICIT HISTORY BUTTON */}
      <button
        onClick={handleCalculate}
        disabled={calculating}
        style={{
          width: '100%', padding: '16px', fontSize: 17, fontWeight: 700,
          background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a',
          border: 'none', borderRadius: 9999, boxShadow: '0 8px 25px rgba(34,211,238,0.5)',
          cursor: calculating ? 'wait' : 'pointer', marginBottom: 16,
        }}
      >
        {calculating ? 'Đang lưu lịch sử...' : '💾 LƯU ƯỚC TÍNH VÀO LỊCH SỬ'}
      </button>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '12px' }}>
        Cước phí tự động cập nhật khi bạn thay đổi Trọng lượng, Kích thước, COD hoặc Bảo hiểm
      </p>

      {/* Live status hint for incomplete inputs (edge case handling) */}
      {!ketQua && (form.khoiLuong > 0 || form.dai > 0 || form.codAmount > 0 || form.khaiGia > 0) && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#f59e0b', marginBottom: '8px' }}>
          Nhập đầy đủ Trọng lượng &amp; Kích thước &gt; 0 để xem cước tự động
        </p>
      )}

      {/* RESULT - LIVE AUTO UPDATING (as per real GHN apps) */}
      {ketQua && (
        <div style={{ background: 'white', borderRadius: 20, padding: 18, border: '1px solid #c4b5fd', marginBottom: 16 }}>
          <div style={{ color: '#6b21a8', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            KẾT QUẢ TỰ ĐỘNG 
            <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '9999px' }}>Cập nhật khi thay đổi</span>
          </div>

          <div style={{ fontSize: 34, fontWeight: 800, color: '#22d3ee', textAlign: 'center', margin: '8px 0' }}>
            {ketQua.tongCong.toLocaleString()} <span style={{ fontSize: 18 }}>Pi</span>
          </div>

          <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 12 }}>
            Thời gian dự kiến: <strong style={{ color: '#4c1d95' }}>{ketQua.thoiGian}</strong>
          </div>

          {/* Breakdown */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12, fontSize: 13, lineHeight: 1.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cước cơ bản (cân nặng)</span>
              <span>{ketQua.cuocCoBan.toLocaleString()} Pi</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Thể tích (effective {ketQua.effectiveWeight}kg)</span>
              <span>{ketQua.cuocTheTich.toLocaleString()} Pi</span>
            </div>
            {ketQua.codAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                <span>Thu hộ COD (người nhận thanh toán)</span>
                <span>{ketQua.codAmount.toLocaleString()} Pi</span>
              </div>
            )}
            {ketQua.phuPhiCOD > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                <span>Phụ phí COD (phí thu hộ)</span>
                <span>+{ketQua.phuPhiCOD.toLocaleString()} Pi</span>
              </div>
            )}
            {ketQua.phuPhiKhaiGia > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
                <span>Phí bảo hiểm khai giá</span>
                <span>+{ketQua.phuPhiKhaiGia.toLocaleString()} Pi</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid #e0d4ff', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>TỔNG CỘNG (người gửi chịu)</span>
              <span>{ketQua.tongCong.toLocaleString()} Pi</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#64748b', marginTop: 8, fontStyle: 'italic' }}>
            {ketQua.ghiChu}. Giá tạm tính, thực tế GHN có thể điều chỉnh theo vùng.
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={handleUseForShipment} style={{
              flex: 1, padding: '12px', borderRadius: 9999, fontWeight: 700, fontSize: 14,
              background: '#4c1d95', color: 'white', border: 'none', cursor: 'pointer'
            }}>
              📦 Tạo đơn với cước này
            </button>
            <button onClick={handleCalculate} style={{
              flex: 1, padding: '12px', borderRadius: 9999, fontWeight: 600, fontSize: 14,
              background: '#ede9fe', color: '#4c1d95', border: '1px solid #c4b5fd', cursor: 'pointer'
            }}>
              Lưu lịch sử
            </button>
          </div>
        </div>
      )}

      {/* HISTORY - previous calculations (great UX) */}
      {history.length > 0 && (
        <div style={{ ...sectionStyle, marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ ...labelStyle, margin: 0 }}>🕒 Lịch sử ước tính gần đây</div>
            <button onClick={clearHistory} style={{ fontSize: 11, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Xóa</button>
          </div>

          {history.map((h: any, idx: number) => (
            <div
              key={idx}
              onClick={() => loadFromHistory(h)}
              style={{
                padding: '10px 12px', background: '#f8fafc', borderRadius: 10, marginBottom: 6,
                cursor: 'pointer', border: '1px solid #e0d4ff', fontSize: 13,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{h.form.tinhGui}</strong> → <strong>{h.form.tinhNhan}</strong></span>
                <span style={{ color: '#22d3ee', fontWeight: 700 }}>{h.result.tongCong.toLocaleString()} Pi</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                {h.time} • {h.form.loaiDichVu} • {h.form.khoiLuong}kg
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 20 }}>
        Giá chỉ mang tính tham khảo. Sử dụng chức năng "Tạo đơn" để có cước chính xác khi thanh toán Pi.
      </p>
    </div>
  );
}