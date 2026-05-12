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
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>👋</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>NHẬN HÀNG</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
        Xác nhận nhận hàng • Danh sách đơn • Khiếu nại tranh chấp
      </p>

      <div style={tabContainerStyle}>
        <button onClick={() => setActiveTab('nhanHang')} style={activeTab === 'nhanHang' ? activeTabStyle : tabStyle}>Nhận Hàng</button>
        <button onClick={() => setActiveTab('danhSach')} style={activeTab === 'danhSach' ? activeTabStyle : tabStyle}>Danh sách đơn hàng</button>
        <button onClick={() => setActiveTab('khieuNai')} style={activeTab === 'khieuNai' ? activeTabStyle : tabStyle}>Khiếu nại</button>
      </div>

      {activeTab === 'nhanHang' && (
        <>
          {!orderInfo && !isConfirmed && (
            <div style={mainCardStyle}>
              <div style={{ fontSize: '110px', marginBottom: '16px' }}>👋</div>
              <h2>Xác nhận nhận hàng</h2>
              <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Nhập mã đơn hàng để kiểm tra và xác nhận</p>
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
              <h3>Thông tin đơn hàng</h3>
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
              <h2>Nhận hàng thành công!</h2>
              <p style={{ margin: '20px 0 30px' }}>Hãy đánh giá để xây dựng Reputation</p>

              <div style={{ marginBottom: '28px' }}>
                <p>Đánh giá người gửi hàng</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setRatingSeller(s)} style={starStyle(s <= ratingSeller)}>★</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <p>Đánh giá tài xế</p>
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
          <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>📋 Danh sách đơn hàng</h2>
          {danhSachDonHang.map((order, i) => (
            <div key={i} style={orderItemStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#22d3ee' }}>{order.maDon}</div>
                <div>{order.sanPham}</div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>{order.nguoiGui} • {order.ngayGui}</div>
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
          <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>🚨 Khiếu nại tranh chấp</h2>
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
    </>
  );
}

/* ====================== STYLES ====================== */
const tabContainerStyle: React.CSSProperties = { display: 'flex', gap: '12px', marginBottom: '32px', justifyContent: 'center', flexWrap: 'wrap' };

const tabStyle: React.CSSProperties = {
  padding: '14px 28px',
  borderRadius: '9999px',
  border: '2px solid #334155',
  backgroundColor: '#1e2937',
  color: '#94a3b8',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const activeTabStyle: React.CSSProperties = {
  padding: '14px 28px',
  borderRadius: '9999px',
  border: '2px solid #22d3ee',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 0 25px rgba(34, 211, 238, 0.6)'
};

const mainCardStyle: React.CSSProperties = {
  backgroundColor: '#1e2937',
  padding: '36px 24px',
  borderRadius: '24px',
  border: '2px solid #334155',
  textAlign: 'center'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px 18px',
  backgroundColor: '#0f172a',
  border: '1px solid #475569',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
  marginBottom: '18px',
  boxSizing: 'border-box'
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(90deg, #22d3ee, #06b6d4)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  fontSize: '17px',
  cursor: 'pointer',
  marginTop: '12px'
};

const confirmButtonStyle: React.CSSProperties = { ...primaryButtonStyle, background: '#4ade80' };

const successCardStyle: React.CSSProperties = {
  backgroundColor: '#1e2937',
  padding: '50px 30px',
  borderRadius: '24px',
  textAlign: 'center',
  border: '2px solid #4ade80'
};

const successOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0,0,0,0.95)', padding: '60px 50px', borderRadius: '24px',
  textAlign: 'center', border: '3px solid #22c55e', zIndex: 1000
};

const orderItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#0f172a',
  padding: '18px',
  borderRadius: '16px',
  marginBottom: '12px',
  border: '1px solid #334155',
  textAlign: 'left'
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  padding: '20px',
  borderRadius: '16px',
  textAlign: 'left',
  margin: '24px 0',
  lineHeight: '1.8',
  border: '1px solid #334155'
};

const starStyle = (active: boolean): React.CSSProperties => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: active ? '#fbbf24' : '#475569',
  fontSize: '70px',
  transition: 'all 0.2s ease',
  transform: active ? 'scale(1.2)' : 'scale(1)'
});