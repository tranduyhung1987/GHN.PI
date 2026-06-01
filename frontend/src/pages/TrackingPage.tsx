import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTracking } from '../hooks/useTracking';
import { useAppController } from '../hooks/useAppController';

const STATUS_FLOW = ['created', 'paid', 'picked_up', 'in_transit', 'delivered'];

const STATUS_LABEL: Record<string, string> = {
  created: 'Đã tạo',
  paid: 'Đã thanh toán',
  picked_up: 'Đã lấy hàng',
  in_transit: 'Đang giao',
  delivered: 'Đã giao',
};

export default function TrackingPage() {
  const navigate = useNavigate();
  const { maDon } = useParams<{ maDon?: string }>();
  const { orders, loading, loadOrders } = useTracking();
  const { updateTracking } = useAppController();

  const [updating, setUpdating] = useState(false);

  const isDetail = !!maDon;
  const currentOrder = isDetail ? orders.find(o => o.maDon === maDon) : null;
  const displayOrders = isDetail ? (currentOrder ? [currentOrder] : []) : orders;

  // Cập nhật trạng thái đơn (gửi qua AppController → Engine)
  const handleUpdateStatus = async (newStatus: string) => {
    if (!currentOrder) return;

    setUpdating(true);
    try {
      await updateTracking({
        maDon: currentOrder.maDon,
        status: newStatus,
        updatedAt: Date.now(),
      });

      // Reload lại data từ localStorage
      loadOrders();
    } catch (e) {
      alert('Cập nhật trạng thái thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={roleBar}>
        <span>🔎 {isDetail ? 'CHI TIẾT ĐƠN HÀNG' : 'TRACKING'}</span>
        <button onClick={() => navigate('/ca-nhan')} style={changeRoleBtn}>Đổi vai trò</button>
      </div>

      <h1 style={titleStyle}>
        {isDetail ? `📦 Đơn ${maDon}` : '🔎 TRA CỨU ĐƠN HÀNG'}
      </h1>

      {/* Nút quay lại danh sách khi ở chế độ chi tiết */}
      {isDetail && (
        <button onClick={() => navigate('/tracking')} style={backToListBtn}>
          ← Quay lại danh sách đơn
        </button>
      )}

      <div style={cardStyle}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</p>
        ) : displayOrders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '60px 20px' }}>
            {maDon ? `Không tìm thấy đơn ${maDon}` : 'Chưa có đơn hàng nào'}
          </p>
        ) : (
          displayOrders.map((order: any) => {
            const currentStatus = order.trangThai || order.status || 'created';
            const nextStatus = getNextStatus(currentStatus);

            return (
              <div key={order.maDon} style={isDetail ? detailCard : orderCardStyle}>
                {/* Thông tin cơ bản */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <strong style={{ color: '#4c1d95', fontSize: 18 }}>{order.maDon}</strong>
                    <div style={{ marginTop: 6, fontSize: 15 }}>{order.nguoiNhan}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{order.diaChiNhan}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={statusBadge(currentStatus)}>
                      {STATUS_LABEL[currentStatus] || currentStatus}
                    </div>
                    {order.totalAmount && (
                      <div style={{ marginTop: 6, fontSize: 13, color: '#22d3ee', fontWeight: 600 }}>
                        {order.totalAmount.toLocaleString()} Pi
                      </div>
                    )}
                  </div>
                </div>

                {/* Chi tiết mở rộng khi ở chế độ Detail */}
                {isDetail && (
                  <>
                    <div style={divider} />

                    <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                      <div><strong>Người gửi:</strong> {order.nguoiGui} - {order.sdtGui}</div>
                      <div><strong>Địa chỉ gửi:</strong> {order.diaChiGui}</div>
                      <div style={{ marginTop: 8 }}><strong>Loại đơn:</strong> {order.loaiDon === 'hoatoc' ? 'Hỏa Tốc' : 'Đường Dài'}</div>
                      <div><strong>Thanh toán:</strong> {order.paymentMethod === 'cod' ? 'Thu hộ (COD)' : 'Trả trước'}</div>
                    </div>

                    {/* Timeline trạng thái */}
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Trạng thái đơn hàng</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {STATUS_FLOW.map((st, idx) => {
                          const isActive = STATUS_FLOW.indexOf(currentStatus) >= idx;
                          return (
                            <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: isActive ? 1 : 0.4 }}>
                              <div style={{ width: 18, textAlign: 'center' }}>{isActive ? '✅' : '○'}</div>
                              <div>{STATUS_LABEL[st]}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nút cập nhật trạng thái (dành cho Driver / Warehouse) */}
                    {nextStatus && (
                      <button
                        onClick={() => handleUpdateStatus(nextStatus)}
                        disabled={updating}
                        style={actionBtn}
                      >
                        {updating ? 'Đang cập nhật...' : `Cập nhật → ${STATUS_LABEL[nextStatus]}`}
                      </button>
                    )}

                    {currentStatus === 'delivered' && (
                      <div style={{ marginTop: 12, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
                        🎉 Đơn hàng đã hoàn thành!
                      </div>
                    )}
                  </>
                )}

                {/* Nút xem chi tiết ở chế độ List */}
                {!isDetail && (
                  <button
                    onClick={() => navigate(`/tracking/${order.maDon}`)}
                    style={viewDetailBtn}
                  >
                    Xem chi tiết & cập nhật →
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ==================== STYLES ==================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '16px 14px 100px' };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px', marginBottom: 12 };
const changeRoleBtn: React.CSSProperties = { background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white', borderRadius: 99, padding: '4px 10px', fontSize: 12 };
const titleStyle: React.CSSProperties = { fontSize: 22, color: '#4c1d95', textAlign: 'center', margin: '12px 0 16px' };

const cardStyle: React.CSSProperties = { background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const orderCardStyle: React.CSSProperties = { background: '#f8f7ff', padding: 14, borderRadius: 12, marginBottom: 10, border: '1px solid #e0e7ff' };
const detailCard: React.CSSProperties = { padding: 4 };

const backToListBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#4c1d95', fontSize: 14, marginBottom: 12, fontWeight: 500 };
const divider: React.CSSProperties = { height: 1, background: '#e0e7ff', margin: '16px 0' };
const actionBtn: React.CSSProperties = { width: '100%', marginTop: 16, padding: '14px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15 };
const viewDetailBtn: React.CSSProperties = { marginTop: 10, width: '100%', padding: '10px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600 };

const statusBadge = (status: string): React.CSSProperties => ({
  background: status === 'delivered' ? '#dcfce7' : '#e0f2fe',
  color: status === 'delivered' ? '#166534' : '#0369a1',
  padding: '2px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  display: 'inline-block',
});