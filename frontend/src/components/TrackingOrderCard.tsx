// src/components/TrackingOrderCard.tsx
import React from 'react';

interface TrackingOrderCardProps {
  order: any;
  isDetail?: boolean;
  onViewDetail?: (maDon: string) => void;
  onUpdateStatus?: (newStatus: string) => void;
  nextStatus?: string | null;
  updating?: boolean;
  canCancel?: boolean;
  onCancel?: () => void;
  STATUS_LABEL: Record<string, string>;
}

export const TrackingOrderCard: React.FC<TrackingOrderCardProps> = ({
  order,
  isDetail = false,
  onViewDetail,
  onUpdateStatus,
  nextStatus,
  updating = false,
  canCancel = false,
  onCancel,
  STATUS_LABEL,
}) => {
  const currentStatus = order.trangThai || order.status || 'created';

  return (
    <div style={isDetail ? detailCardStyle : orderCardStyle}>
      {/* Thông tin cơ bản */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <strong style={{ color: '#4c1d95', fontSize: 18 }}>{order.maDon}</strong>
          <div style={{ marginTop: 6, fontSize: 15 }}>{order.nguoiNhan}</div>
          <div style={{ fontSize: 13, color: '#666' }}>{order.diaChiNhan}</div>
          {order.codAmount && parseFloat(order.codAmount) > 0 && (
            <div style={{ fontSize: 12, color: '#10b981', marginTop: 2 }}>
              📦 Thu hộ: {parseFloat(order.codAmount).toLocaleString()} Pi
            </div>
          )}
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

      {/* Chi tiết mở rộng (chỉ hiện khi ở chế độ Detail) */}
      {isDetail && (
        <div style={{ fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>
          <div><strong>Người gửi:</strong> {order.nguoiGui} - {order.sdtGui}</div>
          <div><strong>Địa chỉ gửi:</strong> {order.diaChiGui}</div>
          <div style={{ marginTop: 8 }}>
            <strong>Loại đơn:</strong> {order.loaiDon === 'hoatoc' ? 'Hỏa Tốc' : 'Đường Dài'}
          </div>
          <div>
            <strong>Thanh toán:</strong> {order.paymentMethod === 'cod' ? 'Thu hộ (COD)' : 'Trả trước'}
          </div>
          {order.moTaHang && (
            <div><strong>Hàng hóa:</strong> {order.moTaHang} ({order.trongLuong || '?'}kg)</div>
          )}
          {order.sdtNhan && <div><strong>SĐT nhận:</strong> {order.sdtNhan}</div>}
        </div>
      )}

      {/* Nút hành động */}
      {isDetail && nextStatus && onUpdateStatus && (
        <button
          onClick={() => onUpdateStatus(nextStatus)}
          disabled={updating}
          style={actionBtn}
        >
          {updating ? 'Đang cập nhật...' : `Cập nhật → ${STATUS_LABEL[nextStatus]}`}
        </button>
      )}

      {isDetail && canCancel && onCancel && (
        <button
          onClick={onCancel}
          disabled={updating}
          style={{ ...actionBtn, background: '#fee2e2', color: '#991b1b', marginTop: 8 }}
        >
          {updating ? 'Đang hủy...' : 'Hủy đơn (nếu chưa lấy hàng)'}
        </button>
      )}

      {/* Nút xem chi tiết (chỉ ở chế độ List) */}
      {!isDetail && onViewDetail && (
        <button
          onClick={() => onViewDetail(order.maDon)}
          style={viewDetailBtn}
        >
          Xem chi tiết & cập nhật →
        </button>
      )}
    </div>
  );
};

/* ==================== Styles ==================== */
const orderCardStyle: React.CSSProperties = {
  background: '#f8f7ff',
  padding: 14,
  borderRadius: 12,
  marginBottom: 10,
  border: '1px solid #e0e7ff',
};

const detailCardStyle: React.CSSProperties = {
  padding: 4,
};

const statusBadge = (status: string): React.CSSProperties => ({
  background: status === 'delivered' || status === 'completed' ? '#dcfce7' : '#e0f2fe',
  color: status === 'delivered' || status === 'completed' ? '#166534' : '#0369a1',
  padding: '2px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  display: 'inline-block',
});

const actionBtn: React.CSSProperties = {
  width: '100%',
  marginTop: 16,
  padding: '14px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 15,
};

const viewDetailBtn: React.CSSProperties = {
  marginTop: 10,
  width: '100%',
  padding: '10px',
  background: '#4c1d95',
  color: 'white',
  border: 'none',
  borderRadius: 10,
  fontWeight: 600,
};