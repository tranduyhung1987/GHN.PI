import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTracking } from '../hooks/useTracking';
import { useAppController } from '../hooks/useAppController';
import { useAuth } from '../core/auth/AuthContext';
import PullToRefresh from '../components/PullToRefresh';
import { journeyStore } from '../core/journey/journeyStore';

// Expanded for real GHN-like flow (from CreateShipment + engines)
const STATUS_FLOW = ['created', 'paid', 'confirmed', 'picked_up', 'in_transit', 'at_warehouse', 'out_for_delivery', 'delivered'];

const STATUS_LABEL: Record<string, string> = {
  created: 'Đã tạo',
  pending_payment: 'Chờ thanh toán',
  pending: 'Chờ xử lý',
  paid: 'Đã thanh toán',
  confirmed: 'Đã xác nhận',
  picked_up: 'Đã lấy hàng',
  in_transit: 'Đang giao',
  at_warehouse: 'Tại kho trung chuyển',
  out_for_delivery: 'Đang phát hàng',
  delivered: 'Đã giao thành công',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
  failed: 'Giao thất bại',
  complaint: 'Khiếu nại',
};

export default function TrackingPage() {
  const navigate = useNavigate();
  const { maDon } = useParams<{ maDon?: string }>();
  const { orders: allOrders, loading, loadOrders, getOrdersWithJourney } = useTracking();
  const { updateTracking } = useAppController();
  const { user, role } = useAuth();

  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'issues'>('all');

  // Role-aware filter for realistic "my orders" tracking (sender sees own shipments, etc.)
  const getFilteredOrders = () => {
    let filtered = [...allOrders];

    const uname = user?.username?.toLowerCase() || '';

    if (role === 'sender' && uname) {
      filtered = filtered.filter((o: any) =>
        (o.piUsername || '').toLowerCase() === uname ||
        (o.nguoiGui || '').toLowerCase().includes(uname)
      );
    } else if (role === 'receiver' && uname) {
      // For receiver, show orders that may match receiver info or recent (demo: show all or by sdt if available)
      filtered = filtered.filter((o: any) =>
        (o.sdtNhan || '').toLowerCase().includes(uname) ||
        (o.nguoiNhan || '').toLowerCase().includes(uname) ||
        true // fallback show relevant
      );
    } else if (role === 'driver') {
      // Drivers see orders ready for delivery or in transit
      filtered = filtered.filter((o: any) => {
        const s = (o.trangThai || o.status || '').toLowerCase();
        return ['picked_up', 'in_transit', 'at_warehouse', 'out_for_delivery'].some(k => s.includes(k)) || s === 'created';
      });
    }
    // warehouse/admin see all

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((o: any) =>
        (o.maDon || '').toLowerCase().includes(q) ||
        (o.nguoiNhan || '').toLowerCase().includes(q) ||
        (o.sdtNhan || '').toLowerCase().includes(q) ||
        (o.nguoiGui || '').toLowerCase().includes(q)
      );
    }

    // Status filter groups (realistic GHN)
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o: any) => {
        const s = (o.trangThai || o.status || 'created').toLowerCase();
        if (statusFilter === 'active') {
          return !['delivered', 'completed', 'cancelled', 'failed'].some(k => s.includes(k));
        }
        if (statusFilter === 'completed') {
          return ['delivered', 'completed'].some(k => s.includes(k));
        }
        if (statusFilter === 'issues') {
          return ['cancelled', 'failed', 'complaint'].some(k => s.includes(k));
        }
        return true;
      });
    }

    // Newest first
    filtered.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

    return filtered;
  };

  const orders = getOrdersWithJourney(); // with journey attached
  const filteredOrders = getFilteredOrders();

  const isDetail = !!maDon;
  const currentOrder = isDetail ? filteredOrders.find((o: any) => o.maDon === maDon) || allOrders.find((o: any) => o.maDon === maDon) : null;
  const displayOrders = isDetail ? (currentOrder ? [currentOrder] : []) : filteredOrders;

  // Backfill helper defined early
  const ensureJourneyForOrder = (order: any) => {
    const existing = journeyStore.getJourney(order.maDon);
    if (existing && existing.steps.length > 0) return;

    const currentStatus = (order.trangThai || order.status || 'created').toLowerCase();
    const flowUpTo = STATUS_FLOW.slice(0, STATUS_FLOW.indexOf(currentStatus) + 1 || 1);
    flowUpTo.forEach((st) => {
      journeyStore.addStep(order.maDon, st.toUpperCase());
    });
  };

  // Ensure realistic journey timeline for the viewed order(s)
  if (currentOrder) ensureJourneyForOrder(currentOrder);

  // Cập nhật trạng thái đơn (gửi qua AppController → Engine) + realistic journey tracking
  const handleUpdateStatus = async (newStatus: string) => {
    if (!currentOrder) return;

    setUpdating(true);
    try {
      const payload = {
        status: newStatus,
        updatedAt: Date.now(),
        // preserve other data (including maDon from spread)
        ...currentOrder,
      };

      await updateTracking(payload);

      // Also add to journeyStore for full realistic timeline (like GHN events)
      journeyStore.addStep(currentOrder.maDon, newStatus.toUpperCase());

      // If early status for sender, allow cancel via update too (but handled in actions)

      // Reload data
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

  const isCancellable = (status: string) => ['created', 'paid', 'confirmed', 'pending', 'pending_payment'].includes((status || '').toLowerCase());

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={roleBar}>
        <span>🔎 {isDetail ? 'CHI TIẾT ĐƠN HÀNG' : 'TRACKING'}</span>
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

      {/* Functional search + status filters (added for full GHN-like tracking, logic only) */}
      {!isDetail && (
        <div style={{ marginBottom: 12, width: '100%', padding: '0 16px', boxSizing: 'border-box' as const }}>
          <input
            type="text"
            placeholder="Tìm mã đơn, người nhận/gửi, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #c4b5fd', background: '#f8f7ff', fontSize: 14, marginBottom: 8, boxSizing: 'border-box' as const }}
          />
          {/* Status filter tabs (minimal, functional) */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'active', label: 'Đang xử lý' },
              { key: 'completed', label: 'Hoàn thành' },
              { key: 'issues', label: 'Vấn đề' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as any)}
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  borderRadius: 999,
                  border: statusFilter === tab.key ? '1px solid #22d3ee' : '1px solid #e0e7ff',
                  background: statusFilter === tab.key ? '#e0f2fe' : 'white',
                  color: '#4c1d95',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <PullToRefresh onRefresh={loadOrders}>
      <div style={cardStyle}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</p>
        ) : displayOrders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '60px 20px' }}>
            {maDon ? `Không tìm thấy đơn ${maDon}` : 'Chưa có đơn hàng nào (thử tìm kiếm hoặc đổi filter)'}
          </p>
        ) : (
          displayOrders.map((order: any) => {
            const currentStatus = order.trangThai || order.status || 'created';
            const nextStatus = getNextStatus(currentStatus);

            // Use attached journey or backfill for full realistic GHN timeline
            const journeySteps = order.journeySteps && order.journeySteps.length > 0 
              ? order.journeySteps 
              : (() => { ensureJourneyForOrder(order); return journeyStore.getJourney(order.maDon)?.steps || []; })();

            return (
              <div key={order.maDon} style={isDetail ? detailCard : orderCardStyle}>
                {/* Thông tin cơ bản - enriched with real order data */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <strong style={{ color: '#4c1d95', fontSize: 18 }}>{order.maDon}</strong>
                    <div style={{ marginTop: 6, fontSize: 15 }}>{order.nguoiNhan}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{order.diaChiNhan}</div>
                    {order.codAmount && parseFloat(order.codAmount) > 0 && (
                      <div style={{ fontSize: 12, color: '#10b981', marginTop: 2 }}>📦 Thu hộ: {parseFloat(order.codAmount).toLocaleString()} Pi</div>
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

                {/* Chi tiết mở rộng khi ở chế độ Detail - full real data */}
                {isDetail && (
                  <>
                    <div style={divider} />

                    <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                      <div><strong>Người gửi:</strong> {order.nguoiGui} - {order.sdtGui}</div>
                      <div><strong>Địa chỉ gửi:</strong> {order.diaChiGui}</div>
                      <div style={{ marginTop: 8 }}><strong>Loại đơn:</strong> {order.loaiDon === 'hoatoc' ? 'Hỏa Tốc' : 'Đường Dài'}</div>
                      <div><strong>Thanh toán:</strong> {order.paymentMethod === 'cod' ? 'Thu hộ (COD)' : 'Trả trước'}</div>
                      {order.moTaHang && <div><strong>Hàng hóa:</strong> {order.moTaHang} ({order.trongLuong || '?'}kg)</div>}
                      {order.sdtNhan && <div><strong>SĐT nhận:</strong> {order.sdtNhan}</div>}
                    </div>

                    {/* Timeline trạng thái - now uses real journey + flow for GHN-like full tracking */}
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Trạng thái đơn hàng (lịch sử)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(journeySteps.length > 0 ? journeySteps.map((step: any) => step.status.toLowerCase()) : STATUS_FLOW).map((st: string, idx: number) => {
                          const normSt = st.toLowerCase();
                          const isActive = STATUS_FLOW.indexOf(currentStatus) >= STATUS_FLOW.indexOf(normSt) || journeySteps.some((js: any) => js.status.toLowerCase() === normSt);
                          const label = STATUS_LABEL[normSt] || normSt;
                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: isActive ? 1 : 0.4 }}>
                              <div style={{ width: 18, textAlign: 'center' }}>{isActive ? '✅' : '○'}</div>
                              <div>{label} {journeySteps[idx] ? `(${new Date(journeySteps[idx].timestamp).toLocaleTimeString()})` : ''}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nút cập nhật trạng thái (dành cho Driver / Warehouse / sender cancel) */}
                    {nextStatus && (
                      <button
                        onClick={() => handleUpdateStatus(nextStatus)}
                        disabled={updating}
                        style={actionBtn}
                      >
                        {updating ? 'Đang cập nhật...' : `Cập nhật → ${STATUS_LABEL[nextStatus]}`}
                      </button>
                    )}

                    {/* Sender can cancel early statuses (realistic) */}
                    {!nextStatus && isCancellable(currentStatus) && role === 'sender' && (
                      <button
                        onClick={() => handleUpdateStatus('cancelled')}
                        disabled={updating}
                        style={{ ...actionBtn, background: '#fee2e2', color: '#991b1b' }}
                      >
                        {updating ? 'Đang hủy...' : 'Hủy đơn (nếu chưa lấy hàng)'}
                      </button>
                    )}

                    {currentStatus === 'delivered' && (
                      <div style={{ marginTop: 12, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
                        🎉 Đơn hàng đã hoàn thành!
                      </div>
                    )}
                    {currentStatus === 'cancelled' && (
                      <div style={{ marginTop: 12, color: '#dc2626', fontWeight: 600, textAlign: 'center' }}>
                        Đơn đã bị hủy.
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
      </PullToRefresh>
    </div>
  );
}

/* ==================== STYLES ==================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '16px 14px 110px', boxSizing: 'border-box' as const };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px', marginBottom: 12 };
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