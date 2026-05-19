import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

interface GuiHangPageProps {
  onNavigate: (page: string) => void;
}

interface DonHangForm {
  loaiDon: 'hoatoc' | 'duongdai';
  nguoiGui: string;
  sdtGui: string;
  diaChiGui: string;
  nguoiNhan: string;
  sdtNhan: string;
  diaChiNhan: string;
  piUsernameNhan: string;
  trongLuong: number;
  dai: number;
  rong: number;
  cao: number;
  ghiChu: string;
}

function GuiHangPage({ onNavigate }: GuiHangPageProps) {
  const [userRole, setUserRole] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maDon, setMaDon] = useState('');
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [piPaymentId, setPiPaymentId] = useState<string>('');
  const [savedCustomers, setSavedCustomers] = useState<Array<{ten: string, sdt: string, diachi: string}>>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [form, setForm] = useState<DonHangForm>({
    loaiDon: 'hoatoc',
    nguoiGui: 'Thanh Pi User',
    sdtGui: '0912345678',
    diaChiGui: '123 Đường Pi, Quận 1, TP.HCM',
    nguoiNhan: '',
    sdtNhan: '',
    diaChiNhan: '',
    piUsernameNhan: '',
    trongLuong: 1,
    dai: 20,
    rong: 15,
    cao: 10,
    ghiChu: ''
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'khachhang';
    setUserRole(role);
    const savedOrdersStr = localStorage.getItem('orders');
    if (savedOrdersStr) {
      try {
        const orders = JSON.parse(savedOrdersStr);
        const customersMap: { [key: string]: any } = {};
        orders.forEach((o: any) => {
          if (o.nguoiNhan && o.sdtNhan) {
            customersMap[o.sdtNhan] = { ten: o.nguoiNhan, sdt: o.sdtNhan, diachi: o.diaChiNhan || '' };
          }
        });
        setSavedCustomers(Object.values(customersMap));
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleGetAutoLocation = async () => {
    if (!navigator.geolocation) {
      alert("Thiết bị không hỗ trợ định vị.");
      return;
    }
    setForm(prev => ({ ...prev, diaChiGui: "⏳ Đang lấy địa chỉ..." }));
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`);
          const data = await response.json();
          if (data && data.display_name) {
            setForm(prev => ({ ...prev, diaChiGui: data.display_name }));
          } else {
            setForm(prev => ({ ...prev, diaChiGui: "Không tìm thấy địa chỉ cụ thể" }));
          }
        } catch (error) {
          setForm(prev => ({ ...prev, diaChiGui: "Lỗi kết nối API" }));
        }
      },
      () => {
        alert("Vui lòng cho phép quyền truy cập vị trí!");
        setForm(prev => ({ ...prev, diaChiGui: "" }));
      }
    );
  };

  const tinhGiaCuoc = () => {
    let base = form.loaiDon === 'hoatoc' ? 1.5 : 3.0;
    let weightSurcharge = Math.max(0, form.trongLuong - 2) * 0.5;
    let volumeWeight = (form.dai * form.rong * form.cao) / 5000;
    let volumeSurcharge = Math.max(0, volumeWeight - 2) * 0.5;
    return parseFloat((base + weightSurcharge + volumeSurcharge).toFixed(2));
  };

  const giaCuoc = tinhGiaCuoc();

  const handlePayAndCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nguoiNhan || !form.sdtNhan || !form.diaChiNhan) {
      alert('Vui lòng điền đầy đủ thông tin người nhận!');
      return;
    }
    try {
      setIsProcessing(true);
      const ghenhMa = 'GHN' + Math.floor(100000 + Math.random() * 900000);
      setMaDon(ghenhMa);
      const newOrder = { id: ghenhMa, maDon: ghenhMa, ...form, totalAmount: giaCuoc, status: 'cho-lay-hang', createdAt: new Date().toISOString() };
      saveOrderToLocal(newOrder);
      setCurrentOrder(newOrder);
      setShowSuccess(true);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      alert('Lỗi: ' + err.message);
    }
  };

  const saveOrderToLocal = (newOrder: any) => {
    const existingOrdersStr = localStorage.getItem('orders');
    let existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    existingOrders.unshift(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
  };

  const selectQuickCustomer = (c: any) => {
    setForm(prev => ({ ...prev, nguoiNhan: c.ten, sdtNhan: c.sdt, diaChiNhan: c.diachi }));
    setShowCustomerDropdown(false);
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <button type="button" style={backBtnStyle} onClick={() => onNavigate('home')}>⬅ Trở Lại</button>
        <h2 style={headerTitleStyle}>Tạo Đơn Gửi Hàng</h2>
        <div style={{ width: '80px', textAlign: 'right', fontSize: '12px', color: '#7c3aed', fontWeight: '700' }}>Role: {userRole}</div>
      </div>

      <form onSubmit={handlePayAndCreateOrder} style={formContainerStyle}>
        <div style={sectionCardStyle}>
          <label style={sectionTitleStyle}>Hình thức vận chuyển</label>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" style={form.loaiDon === 'hoatoc' ? activeTabBtn : inactiveTabBtn} onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })}>🚀 Hỏa Tốc</button>
            <button type="button" style={form.loaiDon === 'duongdai' ? activeTabBtn : inactiveTabBtn} onClick={() => setForm({ ...form, loaiDon: 'duongdai' })}>🚚 Đường Dài</button>
          </div>
        </div>

        <div style={sectionCardStyle}>
          <label style={sectionTitleStyle}>Thông tin người gửi</label>
          <div style={inputGroupStyle}>
            <input type="text" placeholder="Tên người gửi" style={inputStyle} value={form.nguoiGui} onChange={(e) => setForm({ ...form, nguoiGui: e.target.value })} required />
            <input type="text" placeholder="Số điện thoại" style={inputStyle} value={form.sdtGui} onChange={(e) => setForm({ ...form, sdtGui: e.target.value })} required />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Địa chỉ lấy hàng" style={{ ...inputStyle, flex: 1 }} value={form.diaChiGui} onChange={(e) => setForm({ ...form, diaChiGui: e.target.value })} required />
              <button type="button" onClick={handleGetAutoLocation} style={mapLocationBtnStyle}>🗺️</button>
            </div>
          </div>
        </div>

        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label style={sectionTitleStyle}>Thông tin người nhận</label>
            {savedCustomers.length > 0 && (
                <button type="button" onClick={() => setShowCustomerDropdown(!showCustomerDropdown)} style={quickSelectLabelBtn}>👤 Danh bạ ({savedCustomers.length})</button>
            )}
          </div>
          {showCustomerDropdown && (
            <div style={dropdownListStyle}>
              {savedCustomers.map((c, idx) => (
                <div key={idx} onClick={() => selectQuickCustomer(c)} style={dropdownItemStyle}>
                  <strong>{c.ten}</strong> - {c.sdt} <br/> <span style={{fontSize: '12px'}}>{c.diachi}</span>
                </div>
              ))}
            </div>
          )}
          <div style={inputGroupStyle}>
            <input type="text" placeholder="Tên người nhận (*)" style={inputStyle} value={form.nguoiNhan} onChange={(e) => setForm({ ...form, nguoiNhan: e.target.value })} required />
            <input type="text" placeholder="SĐT người nhận (*)" style={inputStyle} value={form.sdtNhan} onChange={(e) => setForm({ ...form, sdtNhan: e.target.value })} required />
            <input type="text" placeholder="Địa chỉ giao hàng (*)" style={inputStyle} value={form.diaChiNhan} onChange={(e) => setForm({ ...form, diaChiNhan: e.target.value })} required />
          </div>
        </div>

        <div style={checkoutCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', color: '#64748b' }}>Tổng phí:</span>
            <span style={{ fontSize: '24px', color: '#7c3aed', fontWeight: '800' }}>🔮 {giaCuoc} Pi</span>
          </div>
          <button type="submit" style={submitButton} disabled={isProcessing}>{isProcessing ? '🔄...' : '⚡ Xác Nhận Thanh Toán'}</button>
        </div>
      </form>
    </div>
  );
}

const pageContainer: React.CSSProperties = { minHeight: '100vh', background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)', padding: '16px 14px 100px', boxSizing: 'border-box' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const backBtnStyle: React.CSSProperties = { padding: '10px 16px', background: 'white', border: '1px solid #f3e8ff', borderRadius: '9999px', color: '#4c1d95', fontWeight: '700', fontSize: '14px', cursor: 'pointer' };
const headerTitleStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '800', color: '#4c1d95', margin: 0 };
const sectionCardStyle: React.CSSProperties = { background: 'white', padding: '20px 16px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)', border: '1px solid #f3e8ff', marginBottom: '16px', position: 'relative' };
const sectionTitleStyle: React.CSSProperties = { fontSize: '15px', fontWeight: '700', color: '#4c1d95', marginBottom: '4px' };
const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '14px 16px', background: '#fdfbff', border: '1px solid #e9d5ff', borderRadius: '14px', fontSize: '14.5px' };
const mapLocationBtnStyle: React.CSSProperties = { padding: '0 16px', background: '#f3e8ff', border: '1px solid #e9d5ff', borderRadius: '14px', fontSize: '20px', cursor: 'pointer' };
const quickSelectLabelBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#7c3aed', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' };
const dropdownListStyle: React.CSSProperties = { position: 'absolute', top: '45px', right: '16px', background: 'white', border: '1px solid #e9d5ff', borderRadius: '14px', zIndex: 10, width: 'calc(100% - 32px)', maxHeight: '150px', overflowY: 'auto', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' };
const dropdownItemStyle: React.CSSProperties = { padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', fontSize: '14px' };
const activeTabBtn: React.CSSProperties = { flex: 1, padding: '14px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' };
const inactiveTabBtn: React.CSSProperties = { flex: 1, padding: '14px', background: '#fdfbff', color: '#64748b', border: '1px solid #e9d5ff', borderRadius: '14px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' };
const checkoutCardStyle: React.CSSProperties = { background: 'white', padding: '20px 16px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)', border: '1px solid #f3e8ff' };
const submitButton: React.CSSProperties = { width: '100%', padding: '18px', fontSize: '17px', fontWeight: '700', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', marginTop: '16px' };
const formContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '16px' };

export default GuiHangPage;