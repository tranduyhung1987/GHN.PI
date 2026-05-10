// src/pages/TaiXePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaiXePage() {
  const navigate = useNavigate();

  const [availableOrders, setAvailableOrders] = useState([
    { maDon: "GHN17489231", loaiDon: "Hỏa Tốc", nguoiGui: "Nguyễn Thị Lan", diaChi: "123 Đường ABC, Quận 1, TP.HCM", khoangCach: "1.2km", phi: 45000 },
    { maDon: "GHN17488902", loaiDon: "Hỏa Tốc", nguoiGui: "Trần Văn Hải", diaChi: "456 Nguyễn Huệ, Quận 3, TP.HCM", khoangCach: "2.8km", phi: 38000 },
  ]);

  const [myCurrentOrders, setMyCurrentOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMyCurrentOrders(prev => prev.map(order => {
        if (order.trangThai === "Đang giao hàng" && order.khoangCach) {
          const km = parseFloat(order.khoangCach);
          if (km > 0.5) return { ...order, khoangCach: (km - 0.4).toFixed(1) + "km" };
        }
        return order;
      }));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const nhanDon = (order: any) => {
    if (!window.confirm(`Nhận đơn ${order.maDon}?\nKhoảng cách: ${order.khoangCach}`)) return;

    setAvailableOrders(prev => prev.filter(o => o.maDon !== order.maDon));
    setMyCurrentOrders(prev => [...prev, {
      ...order,
      trangThai: "Đang lấy hàng",
      thoiGianNhan: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }]);

    showToast(`✅ ĐÃ NHẬN ĐƠN ${order.maDon}`);
  };

  const tuChoiDon = (maDon: string) => {
    if (window.confirm(`Từ chối đơn ${maDon}?`)) {
      setAvailableOrders(prev => prev.filter(o => o.maDon !== maDon));
      showToast(`Đã từ chối đơn ${maDon}`, 'error');
    }
  };

  const batDauGiao = (maDon: string) => {
    setMyCurrentOrders(prev => prev.map(order => 
      order.maDon === maDon ? { ...order, trangThai: "Đang giao hàng", khoangCach: "2.5km" } : order
    ));
    showToast(`🚀 BẮT ĐẦU GIAO ĐƠN ${maDon}`);
  };

  const hoanThanhDon = (maDon: string) => {
    if (!window.confirm(`Xác nhận đã giao xong đơn ${maDon}?`)) return;
    
    const completed = myCurrentOrders.find(o => o.maDon === maDon);
    if (completed) {
      setCompletedOrders(prev => [...prev, { ...completed, trangThai: "Đã giao" }]);
      setMyCurrentOrders(prev => prev.filter(o => o.maDon !== maDon));
      showToast(`🎉 HOÀN THÀNH ĐƠN ${maDon}`);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>🏍️</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>TÀI XẾ</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Nhận đơn & Giao hàng</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#1e2937', padding: '12px 20px', borderRadius: '16px', flex: 1 }}>
          <div style={{ color: '#22d3ee', fontSize: '22px', fontWeight: 'bold' }}>{availableOrders.length}</div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Đơn chờ nhận</div>
        </div>
        <div style={{ background: '#1e2937', padding: '12px 20px', borderRadius: '16px', flex: 1 }}>
          <div style={{ color: '#eab308', fontSize: '22px', fontWeight: 'bold' }}>{myCurrentOrders.length}</div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Đơn đang làm</div>
        </div>
      </div>

      {availableOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px', color: '#e2e8f0' }}>Đơn hàng đang chờ gần bạn</h3>
          {availableOrders.map((order) => (
            <div key={order.maDon} style={orderCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{order.maDon}</div>
                  <div style={{ color: '#94a3b8', marginTop: '4px' }}>{order.nguoiGui} • {order.diaChi}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{order.khoangCach}</div>
                  <div style={{ color: '#eab308', marginTop: '4px' }}>{order.phi.toLocaleString()} Pi</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => nhanDon(order)} style={nhanDonButtonStyle}>Nhận đơn ngay</button>
                <button onClick={() => tuChoiDon(order.maDon)} style={rejectButtonStyle}>Từ chối</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {myCurrentOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px', color: '#e2e8f0' }}>Đơn tôi đang thực hiện</h3>
          {myCurrentOrders.map((order) => (
            <div key={order.maDon} style={myOrderCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '19px', fontWeight: 'bold' }}>{order.maDon}</div>
                  <div style={{ color: '#94a3b8' }}>{order.nguoiGui}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#22d3ee', fontWeight: '600' }}>{order.trangThai}</div>
                  <small style={{ color: '#64748b' }}>{order.thoiGianNhan}</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                {order.trangThai === "Đang lấy hàng" && (
                  <button onClick={() => batDauGiao(order.maDon)} style={updateButtonStyle}>Bắt đầu giao hàng</button>
                )}
                {order.trangThai === "Đang giao hàng" && (
                  <button onClick={() => hoanThanhDon(order.maDon)} style={completeButtonStyle}>
                    ✅ Hoàn thành giao hàng
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {completedOrders.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '16px', color: '#e2e8f0' }}>Lịch sử đã giao</h3>
          {completedOrders.map(order => (
            <div key={order.maDon} style={{ ...myOrderCardStyle, borderColor: '#22c55e', opacity: 0.9 }}>
              <div style={{ color: '#22c55e', fontWeight: 'bold' }}>✅ ĐÃ GIAO {order.maDon}</div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'success' ? '#22c55e' : '#ef4444',
          color: 'white',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 10000,
          fontWeight: 'bold'
        }}>
          {toast.message}
        </div>
      )}
    </>
  );
}

/* ====================== STYLES ====================== */
const orderCardStyle = {
  backgroundColor: '#1e2937',
  padding: '20px',
  borderRadius: '20px',
  border: '1px solid #334155',
  marginBottom: '16px'
};

const nhanDonButtonStyle = {
  marginTop: '16px',
  width: '100%',
  padding: '16px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)'
};

const rejectButtonStyle = {
  marginTop: '16px',
  width: '100%',
  padding: '16px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const myOrderCardStyle = {
  backgroundColor: '#1e2937',
  padding: '20px',
  borderRadius: '20px',
  border: '2px solid #22d3ee',
  marginBottom: '16px'
};

const updateButtonStyle = {
  marginTop: '12px',
  width: '100%',
  padding: '14px',
  background: '#eab308',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const completeButtonStyle = {
  marginTop: '12px',
  width: '100%',
  padding: '14px',
  background: '#22c55e',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer'
};