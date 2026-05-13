// src/pages/TaiXePage.tsx
import { useState, useEffect } from 'react';

export default function TaiXePage() {
  const [reputation, setReputation] = useState(87);
  const [recentRatings] = useState([
    { don: "GHN17488902", sao: 4, comment: "Giao nhanh, cẩn thận" },
    { don: "GHN17488754", sao: 2, comment: "Hàng bị móp nhẹ" },
  ]);

  const [availableOrders, setAvailableOrders] = useState([
    { maDon: "GHN17489231", loaiDon: "Hỏa Tốc", nguoiGui: "Nguyễn Thị Lan", diaChi: "123 Đường ABC, Quận 1, TP.HCM", khoangCach: "1.2km", phi: 45000 },
    { maDon: "GHN17488902", loaiDon: "Hỏa Tốc", nguoiGui: "Trần Văn Hải", diaChi: "456 Nguyễn Huệ, Quận 3, TP.HCM", khoangCach: "2.8km", phi: 38000 },
  ]);

  const [myCurrentOrders, setMyCurrentOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]); // Đã dùng ở dưới
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  const updateReputation = (isGood: boolean) => {
    setReputation(prev => {
      const change = isGood ? Math.floor(Math.random() * 3) + 1 : -Math.floor(Math.random() * 4) - 1;
      return Math.max(30, Math.min(100, prev + change));
    });
  };

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
      updateReputation(true);
      showToast(`🎉 HOÀN THÀNH ĐƠN ${maDon} (+ Reputation)`);
    }
  };

  return (
    <div style={pageContainer}>
      
      {/* Reputation Header */}
      <div style={reputationHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '58px' }}>🏍️</div>
          <div>
            <h1 style={{ fontSize: '27px', fontWeight: '700', color: '#4c1d95', margin: '0 0 4px 0' }}>
              TÀI XẾ GHN.PI
            </h1>
            <p style={{ color: '#6b21a8', margin: 0, fontSize: '15px' }}>
              Reputation • Minh bạch On-chain
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '62px', fontWeight: '800', color: '#22d3ee', lineHeight: '1' }}>
            {reputation}
            <span style={{ fontSize: '26px', color: '#4c1d95' }}> pts</span>
          </div>
          <div style={{ color: getRepColor(reputation), fontSize: '19px', fontWeight: '700', marginTop: '6px' }}>
            {getRepBadge(reputation)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={statCard}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22d3ee' }}>{availableOrders.length}</div>
          <div style={{ color: '#6b21a8', fontSize: '14px' }}>Đơn chờ nhận</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#eab308' }}>{myCurrentOrders.length}</div>
          <div style={{ color: '#6b21a8', fontSize: '14px' }}>Đơn đang làm</div>
        </div>
      </div>

      {/* Recent Ratings */}
      <div style={cardStyle}>
        <h4 style={{ color: '#4c1d95', marginBottom: '12px' }}>Đánh giá gần đây</h4>
        {recentRatings.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: idx === 0 ? '1px solid #e0e7ff' : 'none' }}>
            <div>
              <div style={{ fontWeight: '600' }}>{item.don}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{item.comment}</div>
            </div>
            <div style={{ color: '#fbbf24', fontSize: '18px' }}>{'★'.repeat(item.sao)}</div>
          </div>
        ))}
      </div>

      {/* Available Orders */}
      {availableOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#4c1d95', marginBottom: '16px' }}>Đơn hàng gần bạn</h3>
          {availableOrders.map(order => (
            <div key={order.maDon} style={orderCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#4c1d95' }}>{order.maDon}</div>
                  <div style={{ color: '#6b21a8' }}>{order.nguoiGui}</div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>{order.diaChi}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{order.khoangCach}</div>
                  <div style={{ color: '#eab308', fontWeight: '600' }}>{order.phi.toLocaleString()} Pi</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => nhanDon(order)} style={acceptBtn}>Nhận đơn ngay</button>
                <button onClick={() => tuChoiDon(order.maDon)} style={rejectBtn}>Từ chối</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Orders */}
      {myCurrentOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#4c1d95', marginBottom: '16px' }}>Đơn đang thực hiện</h3>
          {myCurrentOrders.map((order) => (
            <div key={order.maDon} style={myOrderCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700' }}>{order.maDon}</div>
                  <div style={{ color: '#6b21a8' }}>{order.nguoiGui}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#22d3ee', fontWeight: '600' }}>{order.trangThai}</div>
                  <small>{order.thoiGianNhan}</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                {order.trangThai === "Đang lấy hàng" && (
                  <button onClick={() => batDauGiao(order.maDon)} style={updateBtn}>Bắt đầu giao</button>
                )}
                {order.trangThai === "Đang giao hàng" && (
                  <button onClick={() => hoanThanhDon(order.maDon)} style={completeBtn}>
                    ✅ Hoàn thành
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div>
          <h3 style={{ color: '#4c1d95', marginBottom: '16px' }}>Lịch sử đã giao</h3>
          {completedOrders.map(order => (
            <div key={order.maDon} style={{ ...myOrderCard, borderColor: '#22c55e' }}>
              <div style={{ color: '#22c55e', fontWeight: 'bold' }}>✅ ĐÃ GIAO {order.maDon}</div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div style={toastStyle}>
          {toast.message}
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
  padding: '16px 14px 120px',
  boxSizing: 'border-box' as const
};

const reputationHeader = {
  background: '#ede9fe',
  padding: '28px 20px',
  borderRadius: '24px',
  border: '2px solid #c4b5fd',
  marginBottom: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
};

const statCard = {
  background: '#ede9fe',
  padding: '16px',
  borderRadius: '16px',
  border: '1px solid #c4b5fd',
  flex: 1,
  textAlign: 'center' as const
};

const cardStyle = {
  background: '#ede9fe',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #c4b5fd',
  marginBottom: '24px'
};

const orderCard = {
  background: '#ede9fe',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #c4b5fd',
  marginBottom: '16px'
};

const myOrderCard = {
  background: '#ede9fe',
  padding: '20px',
  borderRadius: '16px',
  border: '2px solid #22d3ee',
  marginBottom: '16px'
};

const acceptBtn = {
  flex: 1,
  padding: '16px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  cursor: 'pointer'
};

const rejectBtn = {
  flex: 1,
  padding: '16px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600',
  cursor: 'pointer'
};

const updateBtn = {
  flex: 1,
  padding: '14px',
  background: '#eab308',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  cursor: 'pointer'
};

const completeBtn = {
  flex: 1,
  padding: '14px',
  background: '#22c55e',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  cursor: 'pointer'
};

const toastStyle = {
  position: 'fixed' as const,
  bottom: '90px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#22c55e',
  color: 'white',
  padding: '14px 28px',
  borderRadius: '9999px',
  fontWeight: '600',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  zIndex: 1000
};