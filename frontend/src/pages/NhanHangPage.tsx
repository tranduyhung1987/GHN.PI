// src/pages/NhanHangPage.tsx
import { useState } from 'react';

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

export default function NhanHangPage() {
  const [activeTab, setActiveTab] = useState<'nhanHang' | 'danhSach' | 'khieuNai'>('nhanHang');
  
  const [maDon, setMaDon] = useState('');
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [ratingSeller, setRatingSeller] = useState(0);
  const [ratingDriver, setRatingDriver] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [danhSachDonHang] = useState<Order[]>([
    { maDon: "GHN123456", nguoiGui: "Nguyễn Văn A", sanPham: "Điện thoại iPhone 14 Pro 128GB", soLuong: 1, giaTri: "25.000.000 VNĐ", nguoiNhan: "Bạn (Người nhận)", diaChi: "123 Đường ABC, Quận 1, TP.HCM", trangThai: "Đang giao", ngayGui: "08/05/2026", repScore: 88, taiXe: "Anh Minh • BKS 51H-12345" },
    { maDon: "GHN789012", nguoiGui: "Shop TechZone", sanPham: "Tai nghe AirPods Pro 2", soLuong: 2, giaTri: "12.800.000 VNĐ", nguoiNhan: "Bạn (Người nhận)", diaChi: "123 Đường ABC, Quận 1, TP.HCM", trangThai: "Chờ nhận hàng", ngayGui: "07/05/2026", repScore: 76, taiXe: "Chị Ngọc • BKS 79A-56789" },
    { maDon: "GHN555888", nguoiGui: "Laptop World", sanPham: "MacBook Air M2 256GB", soLuong: 1, giaTri: "28.500.000 VNĐ", nguoiNhan: "Bạn (Người nhận)", diaChi: "456 Nguyễn Huệ, Quận 1, TP.HCM", trangThai: "Đã nhận", ngayGui: "05/05/2026", repScore: 95, taiXe: "Anh Tuấn • BKS 50F-11223" }
  ]);

  const [khieuNaiInfo, setKhieuNaiInfo] = useState({ maDon: '', lyDo: '', moTa: '' });

  const getRepColor = (score?: number): string => {
    if (!score) return '#64748b';
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    return '#ef4444';
  };

  const timDonHang = () => {
    if (!maDon.trim()) { alert("Vui lòng nhập mã đơn hàng!"); return; }
    const found = danhSachDonHang.find(o => o.maDon.toUpperCase() === maDon.toUpperCase());
    setOrderInfo(found || null);
  };

  const xacNhanNhanHang = () => {
    if (!orderInfo) return;
    if (window.confirm("Bạn xác nhận đã nhận hàng đầy đủ và không hư hỏng?")) setIsConfirmed(true);
  };

  const submitRating = () => {
    if (ratingSeller === 0 || ratingDriver === 0) {
      alert("Vui lòng đánh giá cả người gửi và tài xế!");
      return;
    }
    alert(`✅ Đánh giá đã được ghi nhận on-chain!\nNgười gửi: ${ratingSeller} sao\nTài xế: ${ratingDriver} sao`);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsConfirmed(false);
      setOrderInfo(null);
      setMaDon('');
      setRatingSeller(0);
      setRatingDriver(0);
    }, 1500);
  };

  const guiKhieuNai = () => {
    if (!khieuNaiInfo.maDon || !khieuNaiInfo.lyDo) {
      alert("Vui lòng chọn mã đơn và lý do khiếu nại!");
      return;
    }
    alert(`🚨 Khiếu nại cho đơn ${khieuNaiInfo.maDon} đã được gửi on-chain!`);
    setKhieuNaiInfo({ maDon: '', lyDo: '', moTa: '' });
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 }}>NHẬN HÀNG</h1>
      </div>
      <p style={{ color: '#6b21a8', marginBottom: '24px' }}>
        Xác nhận nhận hàng • Danh sách • Khiếu nại
      </p>

      {/* Tabs */}
      <div style={tabContainerStyle}>
        <button onClick={() => setActiveTab('nhanHang')} style={activeTab === 'nhanHang' ? activeTabStyle : tabStyle}>Nhận Hàng</button>
        <button onClick={() => setActiveTab('danhSach')} style={activeTab === 'danhSach' ? activeTabStyle : tabStyle}>Danh sách</button>
        <button onClick={() => setActiveTab('khieuNai')} style={activeTab === 'khieuNai' ? activeTabStyle : tabStyle}>Khiếu nại</button>
      </div>

      {activeTab === 'nhanHang' && (
        <>
          {!orderInfo && !isConfirmed && (
            <div style={mainCardStyle}>
              <div style={{ fontSize: '100px', marginBottom: '20px' }}>📦</div>
              <h2 style={{ color: '#4c1d95' }}>Xác nhận nhận hàng</h2>
              <p style={{ color: '#6b21a8', marginBottom: '32px' }}>Nhập mã đơn hàng để kiểm tra và xác nhận</p>
              
              <input
                type="text"
                placeholder="Nhập mã đơn hàng (ví dụ: GHN123456)"
                value={maDon}
                onChange={(e) => setMaDon(e.target.value)}
                style={inputStyle}
              />
              <button onClick={timDonHang} style={primaryButtonStyle}>Tìm đơn hàng</button>
            </div>
          )}

          {orderInfo && !isConfirmed && (
            <div style={mainCardStyle}>
              <h3 style={{ color: '#4c1d95', marginBottom: '20px' }}>Thông tin đơn hàng</h3>
              <div style={infoBoxStyle}>
                <strong>Mã đơn:</strong> {orderInfo.maDon}<br />
                <strong>Người gửi:</strong> {orderInfo.nguoiGui} 
                {orderInfo.repScore && <span style={{ color: getRepColor(orderInfo.repScore) }}> • {orderInfo.repScore}★</span>}<br />
                <strong>Sản phẩm:</strong> {orderInfo.sanPham}<br />
                <strong>Giá trị:</strong> {orderInfo.giaTri}<br />
                <strong>Tài xế:</strong> {orderInfo.taiXe}<br />
                <strong>Địa chỉ:</strong> {orderInfo.diaChi}
              </div>
              <button onClick={xacNhanNhanHang} style={confirmButtonStyle}>✅ Xác nhận đã nhận hàng</button>
            </div>
          )}

          {isConfirmed && (
            <div style={successCardStyle}>
              <div style={{ fontSize: '90px', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ color: '#22c55e' }}>Nhận hàng thành công!</h2>
              <p style={{ margin: '20px 0 30px', color: '#6b21a8' }}>Hãy đánh giá để xây dựng Reputation</p>

              <div style={{ marginBottom: '28px' }}>
                <p style={{ color: '#4c1d95' }}>Đánh giá người gửi hàng</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setRatingSeller(s)} style={starStyle(s <= ratingSeller)}>★</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <p style={{ color: '#4c1d95' }}>Đánh giá tài xế</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setRatingDriver(s)} style={starStyle(s <= ratingDriver)}>★</button>
                  ))}
                </div>
              </div>

              <button onClick={submitRating} style={primaryButtonStyle} disabled={ratingSeller === 0 || ratingDriver === 0}>
                Gửi đánh giá & Hoàn tất
              </button>
            </div>
          )}

          {showSuccess && <div style={successOverlayStyle}>🎉 Đánh giá đã được ghi nhận on-chain!</div>}
        </>
      )}

      {activeTab === 'danhSach' && (
        <div style={mainCardStyle}>
          <h2 style={{ marginBottom: '24px', textAlign: 'center', color: '#4c1d95' }}>📋 Danh sách đơn hàng</h2>
          {danhSachDonHang.map((order, i) => (
            <div key={i} style={orderItemStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#22d3ee' }}>{order.maDon}</div>
                <div>{order.sanPham}</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>{order.nguoiGui} • {order.ngayGui}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#4ade80' }}>{order.giaTri}</div>
                {order.repScore && <div style={{ color: getRepColor(order.repScore) }}>{order.repScore} ★</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'khieuNai' && (
        <div style={mainCardStyle}>
          <h2 style={{ marginBottom: '24px', textAlign: 'center', color: '#4c1d95' }}>🚨 Khiếu nại tranh chấp</h2>
          
          <select value={khieuNaiInfo.maDon} onChange={(e) => setKhieuNaiInfo({ ...khieuNaiInfo, maDon: e.target.value })} style={inputStyle}>
            <option value="">Chọn mã đơn hàng</option>
            {danhSachDonHang.map((o, i) => <option key={i} value={o.maDon}>{o.maDon} - {o.sanPham}</option>)}
          </select>

          <select value={khieuNaiInfo.lyDo} onChange={(e) => setKhieuNaiInfo({ ...khieuNaiInfo, lyDo: e.target.value })} style={inputStyle}>
            <option value="">Chọn lý do khiếu nại</option>
            <option value="Hàng hỏng">Hàng hóa bị hỏng</option>
            <option value="Sai sản phẩm">Nhận sai sản phẩm</option>
            <option value="Thiếu hàng">Thiếu số lượng</option>
            <option value="Khác">Khác</option>
          </select>

          <textarea
            placeholder="Mô tả chi tiết vấn đề..."
            value={khieuNaiInfo.moTa}
            onChange={(e) => setKhieuNaiInfo({ ...khieuNaiInfo, moTa: e.target.value })}
            style={{ ...inputStyle, height: '130px' }}
          />

          <button onClick={guiKhieuNai} style={primaryButtonStyle}>🚨 Gửi Khiếu Nại</button>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  width: '100%',
  background: '#f3e8ff',
  padding: '16px 14px 100px',
  boxSizing: 'border-box' as const
} as const;

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px'
} as const;

const tabContainerStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '32px',
  justifyContent: 'center',
  flexWrap: 'wrap' as const
} as const;

const tabStyle = {
  padding: '14px 28px',
  borderRadius: '9999px',
  border: '2px solid #c4b5fd',
  backgroundColor: '#ede9fe',
  color: '#4c1d95',
  fontWeight: '600',
  cursor: 'pointer'
} as const;

const activeTabStyle = {
  padding: '14px 28px',
  borderRadius: '9999px',
  border: '2px solid #22d3ee',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  fontWeight: '700',
  boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)'
} as const;

const mainCardStyle = {
  background: '#ede9fe',
  padding: '32px 24px',
  borderRadius: '24px',
  border: '1px solid #c4b5fd',
  marginBottom: '20px'
} as const;

const inputStyle = {
  width: '100%',
  padding: '16px 18px',
  background: '#f3e8ff',
  border: '1px solid #c4b5fd',
  borderRadius: '12px',
  color: '#4c1d95',
  fontSize: '16px',
  marginBottom: '18px',
  boxSizing: 'border-box' as const
} as const;

const primaryButtonStyle = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '17px',
  cursor: 'pointer',
  marginTop: '12px'
} as const;

const confirmButtonStyle = { ...primaryButtonStyle, background: '#4ade80' } as const;

const successCardStyle = {
  background: '#ede9fe',
  padding: '50px 30px',
  borderRadius: '24px',
  textAlign: 'center' as const,
  border: '2px solid #22c55e'
} as const;

const successOverlayStyle = {
  position: 'fixed' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0,0,0,0.9)',
  padding: '60px 50px',
  borderRadius: '24px',
  textAlign: 'center' as const,
  border: '3px solid #22c55e',
  color: 'white',
  zIndex: 1000
} as const;

const orderItemStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#f3e8ff',
  padding: '18px',
  borderRadius: '16px',
  marginBottom: '12px',
  border: '1px solid #c4b5fd'
} as const;

const infoBoxStyle = {
  background: '#f3e8ff',
  padding: '20px',
  borderRadius: '16px',
  textAlign: 'left' as const,
  margin: '24px 0',
  lineHeight: '1.8',
  border: '1px solid #c4b5fd'
} as const;

const starStyle = (active: boolean) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: active ? '#fbbf24' : '#cbd5e1',
  fontSize: '52px',
  transition: 'all 0.2s ease',
  transform: active ? 'scale(1.15)' : 'scale(1)'
});