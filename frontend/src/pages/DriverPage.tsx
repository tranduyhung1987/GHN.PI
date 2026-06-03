import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { useTracking } from '../hooks/useTracking';
import { useAppController } from '../hooks/useAppController';
import { updateOrderStatus as fbUpdateOrderStatus } from '../services/firebase/orderService';
import Modal from '../components/Modal';
import PullToRefresh from '../components/PullToRefresh';
import { journeyStore } from '../core/journey/journeyStore';

/* ==================== STATUS & TABS (GHN realistic) - hoisted for component use ==================== */
const STATUS_LABELS: Record<string, string> = {
  created: 'Đã tạo đơn',
  pending_payment: 'Chờ thanh toán Pi',
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
  returned: 'Đã hoàn trả',
};

const DRIVER_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'to_pick', label: 'Chờ lấy hàng' },
  { key: 'delivering', label: 'Đang giao' },
  { key: 'completed', label: 'Đã giao' },
  { key: 'issues', label: 'Vấn đề' },
] as const;

type TabKey = typeof DRIVER_TABS[number]['key'];

const getStatusStyle = (status?: string): React.CSSProperties => {
  const s = (status || '').toLowerCase();
  if (['delivered', 'completed'].includes(s)) {
    return { background: '#dcfce7', color: '#166534', border: '1px solid #86efac', padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700 };
  }
  if (['cancelled', 'failed', 'returned', 'complaint'].some(k => s.includes(k))) {
    return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700 };
  }
  if (['in_transit', 'picked_up', 'at_warehouse', 'out_for_delivery'].some(k => s.includes(k))) {
    return { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700 };
  }
  return { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700 };
};

export default function DriverPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { orders: allOrders, loading, loadOrders } = useTracking();
  const { updateTracking } = useAppController();

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Driver-focused orders: actionable delivery pipeline (realistic for GHN driver app)
  // In testnet/local we show relevant statuses so driver has work to do
  const driverOrders = useMemo(() => {
    return allOrders.filter((o: any) => {
      const s = (o.status || o.trangThai || 'created').toLowerCase();
      // Include ready-to-pick + in-progress + recently completed for history on this screen
      return !['cancelled'].some(k => s.includes(k));
    });
  }, [allOrders]);

  // Quick stats (GHN driver dashboard style)
  const stats = useMemo(() => {
    const now = Date.now();
    const dayStart = now - (24 * 60 * 60 * 1000);

    const todayOrders = driverOrders.filter((o: any) => (o.createdAt || o.updatedAt || 0) > dayStart);
    const delivering = driverOrders.filter((o: any) => {
      const s = (o.status || o.trangThai || '').toLowerCase();
      return ['picked_up', 'in_transit', 'at_warehouse', 'out_for_delivery'].some(k => s.includes(k));
    }).length;
    const completed = driverOrders.filter((o: any) => {
      const s = (o.status || o.trangThai || '').toLowerCase();
      return ['delivered', 'completed'].some(k => s.includes(k));
    }).length;
    const codTotal = driverOrders.reduce((sum: number, o: any) => {
      const c = parseFloat(String(o.codAmount || 0)) || 0;
      return sum + c;
    }, 0);

    return {
      total: driverOrders.length,
      today: todayOrders.length,
      delivering,
      completed,
      codTotal: Math.round(codTotal),
    };
  }, [driverOrders]);

  // Tab + search filter (full like sender OrderPage)
  const filteredOrders = useMemo(() => {
    let list = [...driverOrders];

    const s = (activeTab);
    if (s !== 'all') {
      list = list.filter((o: any) => {
        const st = (o.status || o.trangThai || 'created').toLowerCase();
        if (s === 'to_pick') {
          return ['created', 'paid', 'confirmed', 'pending', 'pending_payment'].some(k => st.includes(k));
        }
        if (s === 'delivering') {
          return ['picked_up', 'in_transit', 'at_warehouse', 'out_for_delivery'].some(k => st.includes(k));
        }
        if (s === 'completed') {
          return ['delivered', 'completed'].some(k => st.includes(k));
        }
        if (s === 'issues') {
          return ['failed', 'complaint', 'returned'].some(k => st.includes(k));
        }
        return true;
      });
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((o: any) =>
        (o.maDon || '').toLowerCase().includes(q) ||
        (o.nguoiNhan || '').toLowerCase().includes(q) ||
        (o.sdtNhan || '').toLowerCase().includes(q) ||
        (o.diaChiNhan || '').toLowerCase().includes(q) ||
        (o.nguoiGui || '').toLowerCase().includes(q)
      );
    }

    // Newest first (realistic)
    return list.sort((a: any, b: any) => ((b.createdAt || b.updatedAt || 0) as number) - ((a.createdAt || a.updatedAt || 0) as number));
  }, [driverOrders, activeTab, search]);

  // Driver next logical action (real GHN flow)
  const getNextDriverStatus = (current: string): string | null => {
    const st = (current || '').toLowerCase();
    if (['created', 'paid', 'confirmed', 'pending', 'pending_payment'].some(k => st.includes(k))) return 'picked_up';
    if (st.includes('picked_up')) return 'in_transit';
    if (st.includes('in_transit') || st.includes('at_warehouse')) return 'out_for_delivery';
    if (st.includes('out_for_delivery')) return 'delivered';
    return null;
  };

  const getStatusLabel = (s?: string) => STATUS_LABELS[s || ''] || (s || 'Không rõ');

  // Update status - full pipeline like OrderPage + Tracking (local + fb + engine + journey)
  const handleDriverUpdate = async (maDon: string, newStatus: string, order: any) => {
    setUpdatingId(maDon);
    try {
      const now = Date.now();

      // 1. Immediate localStorage (used by tracking + engines + offline)
      const key = 'ghn_pi_orders';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.map((o: any) => {
        if (o.maDon !== maDon) return o;
        const patch: any = { status: newStatus, trangThai: newStatus, updatedAt: now };
        // Tag driver who completed the delivery so "Lịch sử giao" for driver is personal
        if (newStatus === 'delivered' || newStatus === 'completed') {
          patch.driverUsername = user?.username || o.driverUsername || '';
        }
        return { ...o, ...patch };
      });
      localStorage.setItem(key, JSON.stringify(updated));

      // 2. Firebase (best effort)
      try {
        await fbUpdateOrderStatus(maDon, newStatus);
      } catch (e) {
        console.warn('[DriverPage] Firebase status update failed (offline-first ok)');
      }

      // 3. Engine + journey (for realtime projections + tracking consistency)
      const enginePayload: any = { ...order, maDon, status: newStatus, trangThai: newStatus, updatedAt: now };
      if (newStatus === 'delivered' || newStatus === 'completed') {
        enginePayload.driverUsername = user?.username || order.driverUsername || '';
      }
      await updateTracking(enginePayload);
      journeyStore.addStep(maDon, newStatus.toUpperCase());

      // 4. Refresh list
      await loadOrders();

      // Keep modal in sync if open
      if (selectedOrder && selectedOrder.maDon === maDon) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, trangThai: newStatus, updatedAt: now });
      }
    } catch (e) {
      console.error('[DriverPage] update failed', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetail = (order: any) => setSelectedOrder(order);
  const closeDetail = () => setSelectedOrder(null);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1400);
    }).catch(() => {});
  };

  const callCustomer = (phone?: string) => {
    if (!phone) return;
    const clean = phone.replace(/[^0-9+]/g, '');
    if (clean) window.location.href = `tel:${clean}`;
  };

  const handleRefresh = async () => {
    await loadOrders();
  };

  const isDriverOrAdmin = !role || role === 'driver' || role === 'admin';

  return (
    <div style={pageContainer}>
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Header (match OrderPage style language) */}
        <div style={header}>
          <div>
            <button onClick={() => navigate(-1)} style={backBtn}>← Quay lại</button>
            <h2 style={{ color: '#4c1d95', margin: '4px 0 0 0', fontSize: 22 }}>Đơn hàng của tôi</h2>
            <div style={{ fontSize: 12, color: '#64748b' }}>Tài xế • Các đơn cần lấy/giao</div>
          </div>
          <div style={{ fontSize: 11, background: '#f0fdfa', color: '#166534', padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap' }}>
            {role === 'driver' ? 'Tài xế' : role === 'admin' ? 'Admin (xem)' : 'Khách'}
          </div>
        </div>

        {!isDriverOrAdmin && (
          <div style={{ margin: '0 16px 12px', padding: '10px 14px', background: '#fef2f2', color: '#991b1b', borderRadius: 12, fontSize: 13 }}>
            ⚠️ Trang này dành cho Tài xế (hoặc Admin xem demo).
          </div>
        )}

        {/* Stats cards - realistic GHN driver overview */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', boxSizing: 'border-box' }}>
          <div style={statCard}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.today}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>Hôm nay</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1e40af' }}>{stats.delivering}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>Đang giao</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#166534' }}>{stats.completed}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>Đã giao</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.codTotal.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>COD (đ)</div>
          </div>
        </div>

        {/* Search - containment fix (same pattern as Tracking/Order) */}
        <div style={{ padding: '0 16px 8px', boxSizing: 'border-box' }}>
          <input
            aria-label="Tìm kiếm đơn hàng của tài xế theo mã, người nhận, SĐT hoặc địa chỉ"
            placeholder="Tìm mã đơn, người nhận, SĐT, địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        {/* Tabs (5 tabs full GHN driver filter) */}
        <div style={tabsContainer}>
          {DRIVER_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={activeTab === t.key ? activeTabBtn : tabBtn}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Order list */}
        <div style={{ padding: '0 12px 120px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>Đang tải đơn hàng...</p>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '30px 20px' }}>
              Không có đơn phù hợp.<br />
              <span style={{ fontSize: 12 }}>Kéo xuống làm mới hoặc kiểm tra trạng thái tại Theo dõi.</span>
            </div>
          ) : (
            filteredOrders.map((order: any) => {
              const st = (order.status || order.trangThai || 'created');
              const nextStatus = getNextDriverStatus(st);
              const isUpd = updatingId === order.maDon;
              const cod = order.codAmount ? String(order.codAmount) : '';

              return (
                <div key={order.maDon} style={orderCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#4c1d95', fontSize: 16, cursor: 'pointer' }} onClick={() => openDetail(order)}>
                      {order.maDon}
                    </strong>
                    <span style={getStatusStyle(st)}>{getStatusLabel(st)}</span>
                  </div>

                  <div style={{ margin: '6px 0 2px', fontSize: 13.5, color: '#334155' }}>
                    📥 {order.nguoiNhan || 'Người nhận'}
                    {order.sdtNhan && (
                      <>
                        <span style={{ marginLeft: 8, color: '#22d3ee', cursor: 'pointer', fontSize: 13 }} onClick={() => callCustomer(order.sdtNhan)}>📞</span>
                        <span style={{ marginLeft: 4, fontSize: 11, color: '#64748b', cursor: 'pointer' }} onClick={() => copyToClipboard(order.sdtNhan, 'p' + order.maDon)}>
                          {copiedId === 'p' + order.maDon ? '✓' : 'copy'}
                        </span>
                      </>
                    )}
                  </div>

                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                    📍 {(order.diaChiNhan || '—').slice(0, 58)}{(order.diaChiNhan || '').length > 58 ? '…' : ''}
                  </div>

                  <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#64748b', margin: '2px 0 8px' }}>
                    {order.trongLuong != null && <span>⚖ {order.trongLuong}kg</span>}
                    {cod && <span>💰 COD {cod}</span>}
                    {order.paymentMethod && <span>{order.paymentMethod === 'cod' ? 'Thu hộ' : 'Trả trước'}</span>}
                  </div>

                  {/* Driver action row - functional full combo */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => openDetail(order)} style={smallAction}>Chi tiết</button>

                    {nextStatus && (
                      <button
                        onClick={() => handleDriverUpdate(order.maDon, nextStatus, order)}
                        disabled={isUpd}
                        style={{ ...smallAction, background: '#22d3ee', color: '#0f172a', borderColor: '#67e8f9', fontWeight: 600 }}
                      >
                        {isUpd ? 'Đang cập nhật...' : `→ ${STATUS_LABELS[nextStatus] || nextStatus}`}
                      </button>
                    )}

                    <button onClick={() => callCustomer(order.sdtNhan)} style={smallAction}>Gọi KH</button>
                    <button onClick={() => copyToClipboard(order.maDon, 'm' + order.maDon)} style={smallAction}>
                      {copiedId === 'm' + order.maDon ? 'Đã copy' : 'Copy mã'}
                    </button>

                    {cod && parseFloat(cod) > 0 && (st.toLowerCase().includes('delivered') || st.toLowerCase().includes('completed')) && (
                      <button
                        onClick={() => { /* functional: just acknowledge */ alert('Đã ghi nhận thu COD thành công (demo)'); }}
                        style={{ ...smallAction, borderColor: '#86efac', color: '#166534' }}
                      >
                        Thu COD ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PullToRefresh>

      {/* Full detail modal - driver actions + journey */}
      <Modal isOpen={!!selectedOrder} onClose={closeDetail} title={selectedOrder ? `Đơn ${selectedOrder.maDon}` : ''}>
        {selectedOrder && (
          <div style={{ fontSize: 14, lineHeight: 1.45 }}>
            <div style={{ marginBottom: 8 }}><strong>Người nhận:</strong> {selectedOrder.nguoiNhan} • {selectedOrder.sdtNhan}</div>
            <div style={{ marginBottom: 8 }}><strong>Địa chỉ nhận:</strong> {selectedOrder.diaChiNhan}</div>
            <div style={{ marginBottom: 8 }}><strong>Người gửi:</strong> {selectedOrder.nguoiGui} ({selectedOrder.sdtGui || '—'})</div>
            <div style={{ marginBottom: 8 }}><strong>Mô tả hàng:</strong> {selectedOrder.moTaHang || 'Không có mô tả'}</div>
            <div style={{ marginBottom: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span>⚖ {selectedOrder.trongLuong || '?'} kg</span>
              {selectedOrder.codAmount && <span>💵 COD: {selectedOrder.codAmount}</span>}
              <span>Thanh toán: {selectedOrder.paymentMethod || '—'}</span>
            </div>

            <div style={{ margin: '10px 0 6px', fontWeight: 600 }}>Trạng thái hiện tại</div>
            <div style={{ ...getStatusStyle(selectedOrder.status || selectedOrder.trangThai), display: 'inline-block', marginBottom: 12 }}>
              {getStatusLabel(selectedOrder.status || selectedOrder.trangThai)}
            </div>

            {/* Journey timeline */}
            <div style={{ margin: '4px 0 6px', fontWeight: 600 }}>Hành trình đơn hàng</div>
            <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: 10, fontSize: 12, marginBottom: 12, maxHeight: 140, overflow: 'auto' }}>
              {(() => {
                const j = selectedOrder.journeySteps || journeyStore.getJourney(selectedOrder.maDon)?.steps || [];
                if (j.length === 0) return <div style={{ color: '#64748b' }}>Chưa có cập nhật hành trình chi tiết.</div>;
                return j.slice().reverse().map((step: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: 3 }}>• {step.status} — {new Date(step.timestamp).toLocaleString()}</div>
                ));
              })()}
            </div>

            {/* Primary driver actions in modal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {(() => {
                const nxt = getNextDriverStatus(selectedOrder.status || selectedOrder.trangThai);
                if (!nxt) return null;
                return (
                  <button
                    onClick={() => {
                      handleDriverUpdate(selectedOrder.maDon, nxt, selectedOrder);
                      // keep modal open or close? close for simplicity after action
                      closeDetail();
                    }}
                    disabled={updatingId === selectedOrder.maDon}
                    style={{ width: '100%', padding: '13px 16px', background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15 }}
                  >
                    {updatingId === selectedOrder.maDon ? 'Đang cập nhật...' : `CẬP NHẬT → ${STATUS_LABELS[nxt]}`}
                  </button>
                );
              })()}

              <button onClick={() => { navigate(`/tracking/${selectedOrder.maDon}`); closeDetail(); }} style={{ ...smallAction, width: '100%', padding: '10px', background: '#4c1d95', color: 'white', border: 'none' }}>
                Xem trang Theo dõi chi tiết
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => callCustomer(selectedOrder.sdtNhan)} style={{ ...smallAction, flex: 1 }}>📞 Gọi người nhận</button>
                <button onClick={() => copyToClipboard(selectedOrder.maDon, 'modal' + selectedOrder.maDon)} style={{ ...smallAction, flex: 1 }}>{copiedId?.startsWith('modal') ? 'Đã copy mã' : 'Copy mã đơn'}</button>
              </div>
            </div>

            <p style={{ fontSize: 11, color: '#64748b', marginTop: 14, textAlign: 'center' }}>
              Cập nhật sẽ được ghi nhận vào hành trình & đồng bộ cho người gửi.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}


/* ==================== STYLES (exact numeric values reused from OrderPage / Tracking for visual consistency, no "new design") ==================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f3e8ff', padding: '16px 0 110px', boxSizing: 'border-box' as const };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 16px 8px', marginBottom: '4px' };
const backBtn: React.CSSProperties = { padding: '6px 12px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: 999, fontWeight: 600, fontSize: 13 };
const statCard: React.CSSProperties = { flex: 1, background: 'white', borderRadius: 12, padding: '8px 10px', textAlign: 'center' as const, border: '1px solid #e0d4ff' };
const searchInput: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #c4b5fd', background: '#ede9fe', color: '#4c1d95', fontSize: 14, boxSizing: 'border-box' as const };
const tabsContainer: React.CSSProperties = { display: 'flex', gap: 6, overflowX: 'auto' as const, padding: '0 16px 8px' };
const tabBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 9999, border: '1px solid #c4b5fd', background: 'white', color: '#4c1d95', fontSize: 12, whiteSpace: 'nowrap' as const, cursor: 'pointer' };
const activeTabBtn: React.CSSProperties = { ...tabBtn, background: '#22d3ee', color: '#0f172a', borderColor: '#67e8f9', fontWeight: 600 };
const orderCard: React.CSSProperties = { background: 'white', borderRadius: 16, padding: 14, border: '1px solid #e0d4ff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 12 };
const smallAction: React.CSSProperties = { padding: '4px 10px', fontSize: 11, borderRadius: 999, border: '1px solid #c4b5fd', background: 'white', color: '#4c1d95', cursor: 'pointer' };
