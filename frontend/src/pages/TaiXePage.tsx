import { useState } from 'react';   // ← Đã bỏ React thừa

interface TaiXePageProps {
  onNavigate: (page: string) => void;
}

function TaiXePage({ onNavigate: _onNavigate }: TaiXePageProps) {
  const [reputation, setReputation] = useState(87);
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentOrderToReceive, setCurrentOrderToReceive] = useState<any>(null);

  const [availableOrders, setAvailableOrders] = useState([
    { maDon: "GHN17489231", loaiDon: "Hỏa Tốc", nguoiGui: "Nguyễn Thị Lan", diaChi: "123 Đường ABC, Quận 1, TP.HCM", khoangCach: "1.2km", phi: 45000 },
    { maDon: "GHN17488902", loaiDon: "Hỏa Tốc", nguoiGui: "Trần Văn Hải", diaChi: "456 Nguyễn Huệ, Quận 3, TP.HCM", khoangCach: "2.8km", phi: 38000 },
  ]);

  const [myCurrentOrders, setMyCurrentOrders] = useState<any[]>([]);
  const [_completedOrders, setCompletedOrders] = useState<any[]>([]);   // ← Fix lỗi completedOrders unused

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
    setCurrentOrderToReceive(order);
    setShowQRModal(true);
  };

  const handleQRScanSuccess = () => {
    if (!currentOrderToReceive) return;

    setAvailableOrders(prev => prev.filter(o => o.maDon !== currentOrderToReceive.maDon));
    setMyCurrentOrders(prev => [...prev, {
      ...currentOrderToReceive,
      trangThai: "Đang lấy hàng",
      thoiGianNhan: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }]);

    showToast(`✅ ĐÃ NHẬN ĐƠN ${currentOrderToReceive.maDon}`);
    setShowQRModal(false);
    setCurrentOrderToReceive(null);
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
      setCompletedOrders(prev => [...prev, { ...order, ngayHoanThanh: new Date().toLocaleDateString('vi-VN') }]);
      setMyCurrentOrders(prev => prev.filter(o => o.maDon !== maDon));
      setReputation(prev => Math.min(100, prev + 3));
      showToast(`🎉 HOÀN THÀNH ĐƠN ${maDon}`);
    }
  };

  return (
    <div style={{ padding: '20px 14px 100px', background: '#f3e8ff', minHeight: '100vh' }}>
      {/* HEADER - Không có mũi tên */}
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

      {/* Available Orders */}
      {availableOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4c1d95' }}>Đơn hàng gần bạn</h3>
          {availableOrders.map((order) => (
            <div key={order.maDon} style={orderCardStyle}>
              <div style={{ fontWeight: 'bold' }}>{order.maDon}</div>
              <div>{order.nguoiGui}</div>
              <div style={{ color: '#64748b' }}>{order.diaChi}</div>
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

      {/* My Current Orders */}
      {myCurrentOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4c1d95' }}>Đơn đang thực hiện</h3>
          {myCurrentOrders.map((order) => (
            <div key={order.maDon} style={myOrderCardStyle}>
              <div style={{ fontWeight: 'bold' }}>{order.maDon}</div>
              <div style={{ color: '#22d3ee' }}>{order.trangThai}</div>
              <button onClick={() => hoanThanhDon(order.maDon)} style={completeButtonStyle}>
                ✅ Hoàn thành
              </button>
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && currentOrderToReceive && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Quét mã QR đơn hàng</h2>
            <p style={{ textAlign: 'center', margin: '20px 0' }}>
              Đơn: <strong>{currentOrderToReceive.maDon}</strong>
            </p>
            <div style={qrMock}>
              <div style={{ fontSize: '80px' }}>📱</div>
              <p>Hướng camera vào mã QR trên đơn hàng</p>
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

/* ===================== STYLES ===================== */
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

const completeButtonStyle = {
  width: '100%',
  padding: '16px',
  background: '#22c55e',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '12px'
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

export default TaiXePage;