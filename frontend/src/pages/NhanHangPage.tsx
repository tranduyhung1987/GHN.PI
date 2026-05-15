import React, { useState, useRef } from 'react';

interface NhanHangPageProps {
  onNavigate: (page: string) => void;
}

type Order = {
  maDon: string;
  nguoiGui: string;
  sanPham: string;
  soLuong: number;
  giaTri: string;
  nguoiNhan: string;
  diaChi: string;
  trangThai: string;
  ngayGui?: string;
  repScore?: number;
  taiXe?: string;
};

function NhanHangPage({ onNavigate }: NhanHangPageProps) {
  const [activeTab, setActiveTab] = useState<'nhanHang' | 'danhSach' | 'khieuNai' | 'doiTra'>('nhanHang');
  
  const [maDon, setMaDon] = useState('');
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showDoiTraForm, setShowDoiTraForm] = useState(false);

  const [doiTraInfo, setDoiTraInfo] = useState({
    lyDo: '',
    moTa: '',
    fileName: 'Chưa chọn tệp'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [danhSachDonHang] = useState<Order[]>([
    { maDon: "GHN123456", nguoiGui: "Nguyễn Văn A", sanPham: "Điện thoại iPhone 14 Pro", soLuong: 1, giaTri: "25.000.000 VNĐ", nguoiNhan: "Bạn", diaChi: "123 Đường ABC", trangThai: "Đang giao", ngayGui: "08/05/2026", repScore: 88, taiXe: "Anh Minh" },
    { maDon: "GHN789012", nguoiGui: "Shop TechZone", sanPham: "AirPods Pro 2", soLuong: 2, giaTri: "12.800.000 VNĐ", nguoiNhan: "Bạn", diaChi: "123 Đường ABC", trangThai: "Chờ nhận", ngayGui: "07/05/2026", repScore: 76, taiXe: "Chị Ngọc" },
  ]);

  const lyDoOptions = [
    "Hàng bể vỡ, hư hỏng", "Hàng lỗi kỹ thuật", "Hàng hết hạn sử dụng",
    "Khác với mô tả", "Hàng đã qua sử dụng", "Hàng giả, hàng nhái",
    "Sai kích cỡ/màu sắc", "Tài xế giao chậm", "Khác"
  ];

  const timDonHang = () => {
    if (!maDon.trim()) return alert("Vui lòng nhập mã đơn hàng!");
    const found = danhSachDonHang.find(o => o.maDon.toUpperCase() === maDon.toUpperCase());
    setOrderInfo(found || null);
  };

  const xacNhanNhanHang = () => {
    if (!orderInfo) return;
    if (window.confirm("Xác nhận đã nhận hàng đầy đủ?")) setIsConfirmed(true);
  };

  const guiYeuCauDoiTra = () => {
    if (!doiTraInfo.lyDo || !doiTraInfo.moTa) return alert("Vui lòng điền đầy đủ!");
    alert("✅ Yêu cầu đổi trả đã được gửi thành công!");
    setShowDoiTraForm(false);
    setDoiTraInfo({ lyDo: '', moTa: '', fileName: 'Chưa chọn tệp' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDoiTraInfo(prev => ({ ...prev, fileName: file.name }));
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>🖐️</div>
        <h1 style={title}>NHẬN HÀNG</h1>
      </div>

      <p style={subtitle}>Xác nhận nhận hàng • Danh sách đơn • Khiếu nại • Đổi trả</p>

      <div style={tabContainer}>
        <button onClick={() => setActiveTab('nhanHang')} style={activeTab === 'nhanHang' ? activeTabBtn : tabBtn}>Nhận Hàng</button>
        <button onClick={() => setActiveTab('danhSach')} style={activeTab === 'danhSach' ? activeTabBtn : tabBtn}>Danh sách đơn</button>
        <button onClick={() => setActiveTab('khieuNai')} style={activeTab === 'khieuNai' ? activeTabBtn : tabBtn}>Khiếu nại</button>
        <button onClick={() => setActiveTab('doiTra')} style={activeTab === 'doiTra' ? activeTabBtn : tabBtn}>Đổi trả</button>
      </div>

      {/* TAB NHẬN HÀNG */}
      {activeTab === 'nhanHang' && (
        <div style={mainCard}>
          {!orderInfo && !isConfirmed && (
            <>
              <div style={{ fontSize: '100px', marginBottom: '16px' }}>👋</div>
              <h2>Xác nhận nhận hàng</h2>
              <input
                type="text"
                placeholder="Nhập mã đơn hàng..."
                value={maDon}
                onChange={(e) => setMaDon(e.target.value)}
                style={inputField}
              />
              <button onClick={timDonHang} style={cyanButton}>Tìm đơn hàng</button>
            </>
          )}

          {orderInfo && !isConfirmed && (
            <>
              <h3>Thông tin đơn hàng</h3>
              <div style={infoBox}>
                <strong>Mã đơn:</strong> {orderInfo.maDon}<br />
                <strong>Sản phẩm:</strong> {orderInfo.sanPham}<br />
                <strong>Giá trị:</strong> {orderInfo.giaTri}<br />
                <strong>Tài xế:</strong> {orderInfo.taiXe}
              </div>
              <button onClick={xacNhanNhanHang} style={confirmButton}>✅ Xác nhận đã nhận hàng</button>
            </>
          )}

          {isConfirmed && (
            <div style={successCard}>
              <div style={{ fontSize: '80px' }}>🎉</div>
              <h2>Nhận hàng thành công!</h2>
              <button onClick={() => setShowDoiTraForm(true)} style={redButton}>Yêu cầu đổi trả</button>
            </div>
          )}
        </div>
      )}

      {/* TAB ĐỔI TRẢ */}
      {activeTab === 'doiTra' && (
        <div style={mainCard}>
          <h3>Yêu cầu đổi trả</h3>
          <select value={doiTraInfo.lyDo} onChange={(e) => setDoiTraInfo(p => ({...p, lyDo: e.target.value}))} style={inputField}>
            <option value="">Chọn lý do</option>
            {lyDoOptions.map((item, i) => <option key={i} value={item}>{item}</option>)}
          </select>

          <textarea
            placeholder="Mô tả chi tiết vấn đề..."
            value={doiTraInfo.moTa}
            onChange={(e) => setDoiTraInfo(p => ({...p, moTa: e.target.value}))}
            style={textareaStyle}
          />

          <div onClick={() => fileInputRef.current?.click()} style={fileUploadBox}>
            📎 {doiTraInfo.fileName}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" style={{ display: 'none' }} />

          <button onClick={guiYeuCauDoiTra} style={cyanButton}>🚀 Gửi yêu cầu đổi trả</button>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 90px',
  boxSizing: 'border-box'
};

const header: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' };
const title: React.CSSProperties = { fontSize: '28px', fontWeight: '700', color: '#4c1d95' };
const subtitle: React.CSSProperties = { color: '#64748b', textAlign: 'center' as const, marginBottom: '24px' };

const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '28px', justifyContent: 'center', flexWrap: 'wrap' as const };
const tabBtn: React.CSSProperties = { padding: '10px 20px', borderRadius: '9999px', border: '2px solid #c4b5fd', background: '#fff', color: '#64748b', fontWeight: '600', cursor: 'pointer' };
const activeTabBtn: React.CSSProperties = { ...tabBtn, borderColor: '#22d3ee', background: '#22d3ee', color: '#0f172a' };

const mainCard: React.CSSProperties = { background: 'white', padding: '32px 24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' as const };
const inputField: React.CSSProperties = { width: '100%', padding: '16px', border: '1px solid #c4b5fd', borderRadius: '12px', marginBottom: '16px' };
const textareaStyle: React.CSSProperties = { ...inputField, height: '110px', resize: 'vertical' as const };

const cyanButton: React.CSSProperties = { width: '100%', padding: '16px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer' };
const confirmButton: React.CSSProperties = { ...cyanButton, background: '#4ade80' };
const redButton: React.CSSProperties = { ...cyanButton, background: '#ef4444', color: 'white' };

const successCard: React.CSSProperties = { background: 'white', padding: '40px 24px', borderRadius: '24px', border: '2px solid #4ade80' };
const infoBox: React.CSSProperties = { background: '#f8fafc', padding: '20px', borderRadius: '16px', textAlign: 'left', margin: '20px 0', lineHeight: '1.8' };
const fileUploadBox: React.CSSProperties = { padding: '16px', border: '2px dashed #22d3ee', borderRadius: '12px', textAlign: 'center' as const, cursor: 'pointer', margin: '12px 0' };

export default NhanHangPage;