// src/pages/NhanHangPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
};

export default function NhanHangPage() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'nhanHang' | 'danhSach' | 'khieuNai'>('nhanHang');
  
  const [maDon, setMaDon] = useState('');
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Mock danh sách đơn hàng
  const [danhSachDonHang] = useState<Order[]>([
    {
      maDon: "GHN123456",
      nguoiGui: "Nguyễn Văn A",
      sanPham: "Điện thoại iPhone 14 Pro 128GB",
      soLuong: 1,
      giaTri: "25.000.000 VNĐ",
      nguoiNhan: "Bạn (Người nhận)",
      diaChi: "123 Đường ABC, Quận 1, TP.HCM",
      trangThai: "Đang giao",
      ngayGui: "08/05/2026"
    },
    {
      maDon: "GHN789012",
      nguoiGui: "Shop TechZone",
      sanPham: "Tai nghe AirPods Pro 2",
      soLuong: 2,
      giaTri: "12.800.000 VNĐ",
      nguoiNhan: "Bạn (Người nhận)",
      diaChi: "123 Đường ABC, Quận 1, TP.HCM",
      trangThai: "Chờ nhận hàng",
      ngayGui: "07/05/2026"
    },
    {
      maDon: "GHN555888",
      nguoiGui: "Laptop World",
      sanPham: "MacBook Air M2 256GB",
      soLuong: 1,
      giaTri: "28.500.000 VNĐ",
      nguoiNhan: "Bạn (Người nhận)",
      diaChi: "456 Nguyễn Huệ, Quận 1, TP.HCM",
      trangThai: "Đã nhận",
      ngayGui: "05/05/2026"
    }
  ]);

  const [khieuNaiInfo, setKhieuNaiInfo] = useState({
    maDon: '',
    lyDo: '',
    moTa: ''
  });

  const timDonHang = () => {
    if (!maDon.trim()) {
      alert("Vui lòng nhập mã đơn hàng!");
      return;
    }

    const found = danhSachDonHang.find(o => o.maDon.toUpperCase() === maDon.toUpperCase());
    
    if (found) {
      setOrderInfo(found);
    } else {
      setOrderInfo({
        maDon: maDon.toUpperCase(),
        nguoiGui: "Người bán",
        sanPham: "Sản phẩm chưa xác định",
        soLuong: 1,
        giaTri: "Đang kiểm tra",
        nguoiNhan: "Bạn (Người nhận)",
        diaChi: "Đang cập nhật",
        trangThai: "Đang giao"
      });
    }
  };

  const xacNhanNhanHang = () => {
    if (!orderInfo) return;
    
    const confirm = window.confirm("Bạn xác nhận đã nhận hàng đầy đủ, không hư hỏng?");
    if (confirm) {
      setIsConfirmed(true);
      alert(`✅ XÁC NHẬN NHẬN HÀNG THÀNH CÔNG!\nMã đơn: ${orderInfo.maDon}\nHợp đồng thông minh trên Pi Network đã ghi nhận và giải phóng thanh toán.`);
    }
  };

  const guiKhieuNai = () => {
    if (!khieuNaiInfo.maDon || !khieuNaiInfo.lyDo) {
      alert("Vui lòng chọn mã đơn và lý do khiếu nại!");
      return;
    }

    const confirm = window.confirm(
      `Gửi khiếu nại cho đơn ${khieuNaiInfo.maDon}?\n\nHợp đồng thông minh sẽ giữ tiền tạm thời để giải quyết tranh chấp.`
    );
    
    if (confirm) {
      alert(`🚨 KHIẾU NẠI ĐÃ ĐƯỢC GỬI!\nMã đơn: ${khieuNaiInfo.maDon}\nLý do: ${khieuNaiInfo.lyDo}\n\nHợp đồng thông minh Pi đang giữ khoản tiền để xử lý tranh chấp.`);
      setKhieuNaiInfo({ maDon: '', lyDo: '', moTa: '' });
    }
  };

  return (
    <>
      {/* Back Button */}
      <button onClick={() => navigate('/')} style={backButtonStyle}>
        ← Quay lại Trang chủ
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>🖐️</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>NHẬN HÀNG</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
        Xác nhận nhận hàng • Danh sách đơn • Khiếu nại tranh chấp
      </p>

      {/* TAB NAVIGATION */}
      <div style={tabContainerStyle}>
        <button 
          onClick={() => setActiveTab('nhanHang')} 
          style={{...tabStyle, ...(activeTab === 'nhanHang' ? activeTabStyle : {}) }}
        >
          Nhận Hàng
        </button>
        <button 
          onClick={() => setActiveTab('danhSach')} 
          style={{...tabStyle, ...(activeTab === 'danhSach' ? activeTabStyle : {}) }}
        >
          Danh sách đơn hàng
        </button>
        <button 
          onClick={() => setActiveTab('khieuNai')} 
          style={{...tabStyle, ...(activeTab === 'khieuNai' ? activeTabStyle : {}) }}
        >
          Khiếu nại
        </button>
      </div>

      {/* ==================== TAB 1: NHẬN HÀNG ==================== */}
      {activeTab === 'nhanHang' && (
        <>
          {!orderInfo && !isConfirmed && (
            <div style={mainCardStyle}>
              <div style={{ fontSize: '80px', marginBottom: '24px' }}>🖐️</div>
              <h2>Xác nhận nhận hàng</h2>
              <p style={{ color: '#94a3b8', marginBottom: '28px' }}>
                Nhập mã đơn hàng để xác nhận
              </p>

              <input
                type="text"
                placeholder="Nhập mã đơn hàng (ví dụ: GHN123456)"
                value={maDon}
                onChange={(e) => setMaDon(e.target.value)}
                style={inputStyle}
              />

              <button onClick={timDonHang} style={primaryButtonStyle}>
                Tìm đơn hàng
              </button>
            </div>
          )}

          {orderInfo && !isConfirmed && (
            <div style={mainCardStyle}>
              <h3>Thông tin đơn hàng</h3>
              <div style={infoBoxStyle}>
                <strong>Mã đơn:</strong> {orderInfo.maDon}<br />
                <strong>Người gửi:</strong> {orderInfo.nguoiGui}<br />
                <strong>Sản phẩm:</strong> {orderInfo.sanPham}<br />
                <strong>Số lượng:</strong> {orderInfo.soLuong}<br />
                <strong>Giá trị:</strong> {orderInfo.giaTri}<br />
                <strong>Trạng thái:</strong> <span style={{color: '#4ade80'}}>{orderInfo.trangThai}</span><br />
                <strong>Người nhận:</strong> {orderInfo.nguoiNhan}<br />
                <strong>Địa chỉ:</strong> {orderInfo.diaChi}
              </div>

              <button onClick={xacNhanNhanHang} style={confirmButtonStyle}>
                ✅ Xác nhận đã nhận hàng
              </button>

              <button 
                onClick={() => { setOrderInfo(null); setMaDon(''); }} 
                style={cancelButtonStyle}
              >
                Quay lại
              </button>
            </div>
          )}

          {isConfirmed && (
            <div style={successCardStyle}>
              <div style={{ fontSize: '90px', marginBottom: '20px' }}>🎉</div>
              <h2>Nhận hàng thành công!</h2>
              <p style={{ color: '#4ade80', margin: '16px 0', fontSize: '18px' }}>
                Mã đơn: <strong>{orderInfo?.maDon}</strong>
              </p>
              <p>Hợp đồng thông minh Pi Network đã ghi nhận và hoàn tất thanh toán.</p>

              <button onClick={() => navigate('/')} style={primaryButtonStyle}>
                Về Trang chủ
              </button>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB 2: DANH SÁCH ĐƠN HÀNG ==================== */}
      {activeTab === 'danhSach' && (
        <div style={mainCardStyle}>
          <h2 style={{ marginBottom: '24px' }}>📋 Danh sách đơn hàng</h2>
          
          {danhSachDonHang.map((order, index) => (
            <div key={index} style={orderItemStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#22d3ee' }}>{order.maDon}</div>
                <div style={{ margin: '4px 0' }}>{order.sanPham}</div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                  {order.nguoiGui} • {order.ngayGui}
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#4ade80' }}>{order.giaTri}</div>
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  backgroundColor: order.trangThai === 'Đã nhận' ? '#4ade80' : '#eab308',
                  color: '#0f172a',
                  display: 'inline-block'
                }}>
                  {order.trangThai}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== TAB 3: KHIẾU NẠI ==================== */}
      {activeTab === 'khieuNai' && (
        <div style={mainCardStyle}>
          <h2 style={{ marginBottom: '24px' }}>🚨 Khiếu nại tranh chấp</h2>
          
          <select 
            value={khieuNaiInfo.maDon}
            onChange={(e) => setKhieuNaiInfo({...khieuNaiInfo, maDon: e.target.value})}
            style={inputStyle}
          >
            <option value="">Chọn mã đơn hàng</option>
            {danhSachDonHang.map((order, i) => (
              <option key={i} value={order.maDon}>{order.maDon} - {order.sanPham}</option>
            ))}
          </select>

          <select 
            value={khieuNaiInfo.lyDo}
            onChange={(e) => setKhieuNaiInfo({...khieuNaiInfo, lyDo: e.target.value})}
            style={inputStyle}
          >
            <option value="">Chọn lý do khiếu nại</option>
            <option value="Hàng hỏng">Hàng hóa bị hỏng</option>
            <option value="Sai sản phẩm">Nhận sai sản phẩm</option>
            <option value="Thiếu hàng">Thiếu số lượng</option>
            <option value="Không nhận được">Không nhận được hàng</option>
            <option value="Khác">Khác</option>
          </select>

          <textarea
            placeholder="Mô tả chi tiết vấn đề..."
            value={khieuNaiInfo.moTa}
            onChange={(e) => setKhieuNaiInfo({...khieuNaiInfo, moTa: e.target.value})}
            style={{...inputStyle, height: '120px', resize: 'vertical'}}
          />

          <button onClick={guiKhieuNai} style={primaryButtonStyle}>
            🚨 Gửi Khiếu Nại
          </button>
        </div>
      )}
    </>
  );
}

/* ====================== STYLES ====================== */
const backButtonStyle = {
  color: '#ffffff', fontSize: '16px', fontWeight: 'bold', marginBottom: '25px',
  padding: '14px 28px', backgroundColor: '#1e2937', border: '2px solid #22d3ee',
  borderRadius: '9999px', cursor: 'pointer', transition: 'all 0.3s ease',
  boxShadow: '0 0 15px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.5)'
};

const tabContainerStyle = {
  display: 'flex',
  backgroundColor: '#1e2937',
  borderRadius: '9999px',
  padding: '6px',
  marginBottom: '32px',
  border: '2px solid #334155'
};

const tabStyle = {
  flex: 1,
  padding: '14px',
  borderRadius: '9999px',
  border: 'none',
  background: 'transparent',
  color: '#94a3b8',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const activeTabStyle = {
  backgroundColor: '#22d3ee',
  color: '#0f172a',
  boxShadow: '0 0 15px #22d3ee'
};

const mainCardStyle = {
  backgroundColor: '#1e2937',
  padding: '36px 24px',
  borderRadius: '24px',
  border: '2px solid #334155',
  textAlign: 'center' as const
};

const inputStyle = {
  width: '100%',
  padding: '16px 18px',
  backgroundColor: '#0f172a',
  border: '1px solid #475569',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
  marginBottom: '18px',
  boxSizing: 'border-box' as const
};

const primaryButtonStyle = {
  width: '100%',
  padding: '18px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  fontSize: '17px',
  cursor: 'pointer',
  marginTop: '12px'
};

const confirmButtonStyle = { ...primaryButtonStyle, background: '#4ade80' };

const cancelButtonStyle = {
  width: '100%',
  padding: '16px',
  background: 'transparent',
  color: '#94a3b8',
  border: '1px solid #475569',
  borderRadius: '9999px',
  marginTop: '12px',
  cursor: 'pointer'
};

const successCardStyle = {
  backgroundColor: '#1e2937',
  padding: '50px 30px',
  borderRadius: '24px',
  textAlign: 'center' as const,
  border: '2px solid #4ade80'
};

const infoBoxStyle = {
  backgroundColor: '#0f172a',
  padding: '20px',
  borderRadius: '16px',
  textAlign: 'left' as const,
  margin: '24px 0',
  lineHeight: '1.8',
  border: '1px solid #334155'
};

const orderItemStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#0f172a',
  padding: '18px',
  borderRadius: '16px',
  marginBottom: '12px',
  border: '1px solid #334155',
  textAlign: 'left' as const
};