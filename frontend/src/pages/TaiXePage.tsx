import { useState } from 'react';

interface TaiXePageProps {
  onNavigate: (page: string) => void;
}

function TaiXePage({ onNavigate: _onNavigate }: TaiXePageProps) {
  const [activeTab, setActiveTab] = useState<'near' | 'current' | 'history'>('near');
  const [reputation, setReputation] = useState(87);
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentOrderToScan, setCurrentOrderToScan] = useState<any>(null);

  const [availableOrders, setAvailableOrders] = useState([
    { 
      maDon: "GHN17489231", 
      loaiDon: "Hỏa Tốc", 
      nguoiGui: "Nguyễn Thị Lan", 
      sdtGui: "0912345678",
      diaChiGui: "123 Đường ABC, Quận 1, TP.HCM",
      nguoiNhan: "Trần Thị Hoa",
      sdtNhan: "0987654321",
      diaChiNhan: "456 Nguyễn Văn Linh, Quận 7, TP.HCM",
      khoangCach: "1.2km", 
      phi: 45000 
    },
    { 
      maDon: "GHN17488902", 
      loaiDon: "Đường Dài", 
      nguoiGui: "Phạm Minh Quân", 
      sdtGui: "0978123456",
      diaChiGui: "89 Lê Lợi, Quận 1, TP.HCM",
      nguoiNhan: "Lê Văn Nam",
      sdtNhan: "0933456789",
      diaChiNhan: "112 Pasteur, Quận 3, TP.HCM",
      khoTrungChuyen: "Kho Hub Quận 7 - 789 Nguyễn Văn Linh",
      khoangCach: "2.8km", 
      phi: 38000 
    },
  ]);

  const [myCurrentOrders, setMyCurrentOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);   // ← Tab Lịch sử

  const showToast = (message: string) => {
    alert(message);
  };

  const getRepColor = (score: number): string => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getRepBadge = (score: number): string => {
    if (score >= 90) return "🏆 Xuất Sắc";
    if (score >= 75) return "⭐ Tốt";
    if (score >= 60) return "⚠️ Trung Bình";
    return "🔴 Cảnh Báo";
  };

  const handleNhanDon = (order: any) => {
    setAvailableOrders(prev => prev.filter(o => o.maDon !== order.maDon));
    setMyCurrentOrders(prev => [...prev, {
      ...order,
      trangThai: "Đang di chuyển đến người gửi",
    }]);
    showToast(`✅ ĐÃ NHẬN ĐƠN ${order.maDon}`);
    setActiveTab('current');
  };

  const handleOpenQR = (order: any) => {
    setCurrentOrderToScan(order);
    setShowQRModal(true);
  };

  const handleQRScanSuccess = () => {
    if (!currentOrderToScan) return;

    setMyCurrentOrders(prev => prev.map(o => 
      o.maDon === currentOrderToScan.maDon 
        ? { ...o, trangThai: "Đang lấy hàng / Đang giao" } 
        : o
    ));

    showToast(`✅ ĐÃ NHẬN HÀNG THÀNH CÔNG - Đơn ${currentOrderToScan.maDon}`);
    setShowQRModal(false);
    setCurrentOrderToScan(null);
  };

  const tuChoiDon = (maDon: string) => {
    if (window.confirm(`Từ chối đơn ${maDon}?`)) {
      setAvailableOrders(prev => prev.filter(o => o.maDon !== maDon));
      showToast(`Đã từ chối đơn ${maDon}`);
    }
  };

  const hoanThanhDon = (maDon: string) => {
    if (!window.confirm(`Xác nhận đã giao xong đơn ${maDon}?`)) return;
    
    const order = myCurrentOrders.find(o => o.maDon === maDon);
    if (order) {
      const completedOrder = { 
        ...order, 
        trangThai: "Hoàn thành", 
        ngayHoanThanh: new Date().toLocaleDateString('vi-VN') 
      };
      
      setCompletedOrders(prev => [...prev, completedOrder]);
      setMyCurrentOrders(prev => prev.filter(o => o.maDon !== maDon));
      setReputation(prev => Math.min(100, prev + 3));
      
      showToast(`🎉 HOÀN THÀNH ĐƠN ${maDon} - Đã chuyển vào Lịch sử`);
    }
  };

  return (
    <div style={{ padding: '20px 14px 100px', background: '#f3e8ff', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#4c1d95', margin: 0 }}>🏍️ TÀI XẾ</h1>
      </div>

      {/* Reputation */}
      <div style={reputationHeaderStyle}>
        <div style={{ fontSize: '52px', fontWeight: 'bold', color: getRepColor(reputation), textAlign: 'center' }}>
          {reputation} pts
        </div>
        <div style={{ textAlign: 'center', color: getRepColor(reputation), fontWeight: 'bold', marginTop: '8px' }}>
          {getRepBadge(reputation)}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        <button onClick={() => setActiveTab('near')} style={activeTab === 'near' ? activeTabStyle : inactiveTabStyle}>Đơn gần tôi</button>
        <button onClick={() => setActiveTab('current')} style={activeTab === 'current' ? activeTabStyle : inactiveTabStyle}>Đơn đang làm</button>
        <button onClick={() => setActiveTab('history')} style={activeTab === 'history' ? activeTabStyle : inactiveTabStyle}>Lịch sử</button>
      </div>

      {/* ĐƠN GẦN TÔI */}
      {activeTab === 'near' && availableOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4c1d95' }}>Đơn hàng gần bạn</h3>
          {availableOrders.map((order) => (
            <div key={order.maDon} style={orderCardStyle}>
              <div style={{ fontWeight: 'bold' }}>{order.maDon}</div>
              <div>{order.nguoiGui}</div>
              <div style={{ color: '#64748b' }}>{order.diaChiGui}</div>
              <div style={{ marginTop: '12px', color: '#22d3ee', fontWeight: 'bold' }}>
                {order.khoangCach} • {order.phi.toLocaleString()} Pi
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => handleNhanDon(order)} style={nhanDonButtonStyle}>Nhận đơn</button>
                <button onClick={() => tuChoiDon(order.maDon)} style={rejectButtonStyle}>Từ chối</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ĐƠN ĐANG LÀM */}
      {activeTab === 'current' && myCurrentOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4c1d95' }}>Đơn đang thực hiện</h3>
          {myCurrentOrders.map((order) => (
            <div key={order.maDon} style={myOrderCardStyle}>
              <div style={{ fontWeight: 'bold' }}>{order.maDon} • {order.loaiDon}</div>
              
              <div style={{ margin: '12px 0', fontSize: '15px', lineHeight: '1.6' }}>
                <strong>Người gửi:</strong> {order.nguoiGui} - {order.sdtGui}<br/>
                <strong>Địa chỉ gửi:</strong> {order.diaChiGui}<br/><br/>
                
                <strong>Người nhận:</strong> {order.nguoiNhan} - {order.sdtNhan}<br/>
                <strong>Địa chỉ nhận:</strong> {order.diaChiNhan}
                {order.khoTrungChuyen && (
                  <>
                    <br/><br/>
                    <strong>Kho trung chuyển:</strong> {order.khoTrungChuyen}
                  </>
                )}
              </div>

              <div style={{ color: '#22d3ee', marginBottom: '12px' }}>{order.trangThai}</div>

              {order.trangThai.includes("di chuyển") && (
                <button onClick={() => handleOpenQR(order)} style={qrButtonStyle}>
                  📱 Đã đến - Quét QR nhận hàng
                </button>
              )}

              {order.trangThai.includes("lấy hàng") && (
                <button onClick={() => hoanThanhDon(order.maDon)} style={completeButtonStyle}>
                  ✅ Hoàn thành giao hàng
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LỊCH SỬ ĐƠN HÀNG - MỚI THÊM */}
      {activeTab === 'history' && completedOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4c1d95' }}>Lịch sử hoàn thành</h3>
          {completedOrders.map((order) => (
            <div key={order.maDon} style={myOrderCardStyle}>
              <div style={{ fontWeight: 'bold' }}>{order.maDon}</div>
              <div style={{ color: '#22c55e' }}>Hoàn thành • {order.ngayHoanThanh}</div>
              <div style={{ marginTop: '8px', color: '#94a3b8', fontSize: '14px' }}>
                {order.nguoiNhan} - {order.diaChiNhan}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && currentOrderToScan && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Quét mã QR nhận hàng</h2>
            <p style={{ textAlign: 'center', margin: '20px 0' }}>
              Đơn: <strong>{currentOrderToScan.maDon}</strong>
            </p>
            <div style={qrMock}>
              <div style={{ fontSize: '80px' }}>📱</div>
              <p>Hướng camera vào mã QR trên kiện hàng</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
              <button onClick={() => setShowQRModal(false)} style={cancelBtn}>Hủy</button>
              <button onClick={handleQRScanSuccess} style={confirmBtn}>
                ✅ Xác nhận quét thành công
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES (GIỮ NGUYÊN) ===================== */
const reputationHeaderStyle = {
  backgroundColor: '#1e2937',
  padding: '24px',
  borderRadius: '20px',
  border: '2px solid #eab308',
  marginBottom: '24px',
  textAlign: 'center' as const
};

const orderCardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '20px',
  border: '1px solid #c4b5fd',
  marginBottom: '16px'
};

const myOrderCardStyle = {
  backgroundColor: '#1e2937',
  padding: '20px',
  borderRadius: '20px',
  border: '2px solid #22d3ee',
  marginBottom: '16px',
  color: 'white'
};

const nhanDonButtonStyle = {
  flex: 1,
  padding: '14px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const rejectButtonStyle = {
  flex: 1,
  padding: '14px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const qrButtonStyle = {
  width: '100%',
  padding: '16px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginBottom: '12px'
};

const completeButtonStyle = {
  width: '100%',
  padding: '16px',
  background: '#22c55e',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const modalOverlay = {
  position: 'fixed' as const,
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContent = {
  background: 'white',
  padding: '30px',
  borderRadius: '24px',
  width: '90%',
  maxWidth: '400px',
  textAlign: 'center' as const
};

const qrMock = {
  border: '3px dashed #22d3ee',
  borderRadius: '16px',
  padding: '40px 20px',
  margin: '20px 0'
};

const cancelBtn = {
  flex: 1,
  padding: '14px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const confirmBtn = {
  flex: 1,
  padding: '14px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const activeTabStyle = {
  padding: '12px 20px',
  background: '#22d3ee',
  color: '#0f172a',
  borderRadius: '9999px',
  fontWeight: 'bold',
  whiteSpace: 'nowrap' as const
};

const inactiveTabStyle = {
  padding: '12px 20px',
  background: '#ede9fe',
  color: '#4c1d95',
  borderRadius: '9999px',
  border: '1px solid #c4b5fd',
  whiteSpace: 'nowrap' as const
};

export default TaiXePage;