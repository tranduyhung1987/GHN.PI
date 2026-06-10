// src/pages/OrderPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { useTracking } from '../hooks/useTracking';
import { useAppController } from '../hooks/useAppController';
import { updateOrderStatus as fbUpdateOrderStatus } from '../services/firebase/orderService';
import Modal from '../components/Modal';
import PullToRefresh from '../components/PullToRefresh';

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Chờ thanh toán Pi',
  pending: 'Chờ xử lý',
  created: 'Đã tạo đơn',
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
  complaint: 'Đang khiếu nại',
  returned: 'Đã hoàn trả',
};

const getStatusLabel = (s?: string) => STATUS_LABELS[s || ''] || (s || 'Không rõ');

const getStatusStyle = (status?: string): React.CSSProperties => {
  const s = (status || '').toLowerCase();
  if (['delivered', 'completed'].includes(s)) {
    return { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' };
  }
  if (['cancelled', 'failed', 'returned', 'complaint'].some(k => s.includes(k))) {
    return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
  }
  if (['in_transit', 'picked_up', 'at_warehouse', 'out_for_delivery'].some(k => s.includes(k))) {
    return { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' };
  }
  return { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' };
};

const CANCELLABLE = ['pending_payment', 'pending', 'created', 'paid', 'confirmed'];
const isCancellable = (status?: string) => CANCELLABLE.includes(status || '');

const TAB_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'delivering', label: 'Đang giao' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'issues', label: 'Vấn đề' },
] as const;

type TabKey = typeof TAB_OPTIONS[number]['key'];

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { orders: allOrders, loading, loadOrders } = useTracking();
  const { updateTracking } = useAppController();

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const isDriverHistory = role === 'driver' || role === 'admin';

  // SỬA LỖI: Thêm mảng dependency chuẩn xác để tránh gán lại tab liên tục khi re-render
  useEffect(() => {
    if (isDriverHistory && activeTab === 'all') {
      setActiveTab('completed');
    }
  }, [isDriverHistory, activeTab]);

  const myOrders = useMemo(() => {
    const uname = (user?.username || '').toLowerCase().trim();

    if (isDriverHistory) {
      return allOrders.filter((o: any) => {
        const s = (o.status || o.trangThai || '').toLowerCase();
        const isDone = ['delivered', 'completed'].some(k => s.includes(k));
        if (!isDone) return false;

        const d = (o.driverUsername || '').toLowerCase();
        if (d) {
          return d === uname || d.includes(uname) || !uname;
        }
        return true;
      });
    }

    if (!uname) return allOrders;
    return allOrders.filter((o: any) => {
      const p = (o.piUsername || '').toLowerCase();
      const g = (o.nguoiGui || '').toLowerCase();
      return p === uname || g.includes(uname) || p.includes(uname);
    });
  }, [allOrders, user?.username, isDriverHistory]);

  const filteredOrders = useMemo(() => {
    let list = [...myOrders];

    if (activeTab !== 'all') {
      list = list.filter((o: any) => {
        const s = (o.status || o.trangThai || 'created').toLowerCase();
        if (activeTab === 'pending') {
          return ['pending_payment', 'pending', 'created', 'paid', 'confirmed'].some(k => s.includes(k));
        }
        if (activeTab === 'delivering') {
          return ['picked_up', 'in_transit', 'at_warehouse', 'out_for_delivery'].some(k => s.includes(k));
        }
        if (activeTab === 'completed') {
          return ['delivered', 'completed'].some(k => s.includes(k));
        }
        if (activeTab === 'issues') {
          return ['cancelled', 'failed', 'complaint', 'returned'].some(k => s.includes(k));
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
        (o.diaChiNhan || '').toLowerCase().includes(q)
      );
    }

    list.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
    return list;
  }, [myOrders, activeTab, search]);

  const stats = useMemo(() => {
    const total = myOrders.length;

    if (isDriverHistory) {
      const codCollected = myOrders.reduce((sum: number, o: any) => {
        const c = parseFloat(String(o.codAmount || 0)) || 0;
        return sum + c;
      }, 0);
      const deliveredToday = myOrders.filter((o: any) => {
        const t = (o.updatedAt || o.createdAt || 0) as number;
        const dayAgo = Date.now() - 24*60*60*1000;
        const s = (o.status || o.trangThai || '').toLowerCase();
        return t > dayAgo && ['delivered','completed'].some(k => s.includes(k));
      }).length;
      return { total, totalFee: 0, pendingCount: 0, codCollected: Math.round(codCollected), deliveredToday, isDriver: true };
    }

    const totalFee = myOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const pendingCount = myOrders.filter((o: any) => {
      const s = (o.status || '').toLowerCase();
      return ['pending_payment', 'pending', 'created', 'paid'].some(k => s.includes(k));
    }).length;
    return { total, totalFee, pendingCount, codCollected: 0, deliveredToday: 0, isDriver: false };
  }, [myOrders, isDriverHistory]);

  const pageTitle = isDriverHistory 
    ? 'LỊCH SỬ GIAO (Tài xế)' 
    : role === 'sender' 
      ? 'ĐƠN HÀNG CỦA TÔI (Người gửi)' 
      : role === 'receiver' 
        ? 'ĐƠN HÀNG CỦA TÔI (Liên quan nhận)' 
        : 'ĐƠN HÀNG CỦA TÔI';

  const copyMaDon = async (maDon: string) => {
    try {
      await navigator.clipboard.writeText(maDon);
      setCopiedId(maDon);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setCopiedId(maDon);
      setTimeout(() => setCopiedId(null), 1600);
    }
  };

  const handleCreateSimilar = (order: any) => {
    if (order.nguoiNhan || order.sdtNhan || order.diaChiNhan) {
      localStorage.setItem('lastReceiverInfo', JSON.stringify({
        nguoiNhan: order.nguoiNhan || '',
        sdtNhan: order.sdtNhan || '',
        diaChiNhan: order.diaChiNhan || '',
      }));
    }
    if (order.moTaHang) {
      localStorage.setItem('lastProductHint', order.moTaHang);
    }
    navigate('/gui-hang');
  };

  const handleCancelOrder = async (maDon: string) => {
    if (!window.confirm('Bạn chắc chắn muốn HỦY đơn này?\nHành động không thể hoàn tác.')) return;

    setIsCancelling(maDon);
    try {
      const now = Date.now();
      const key = 'ghn_pi_orders';
      let list: any[] = [];
      try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
      list = list.map((o: any) => 
        o.maDon === maDon ? { ...o, status: 'cancelled', updatedAt: now } : o
      );
      localStorage.setItem(key, JSON.stringify(list));

      try {
        await fbUpdateOrderStatus(maDon, 'cancelled');
      } catch (e) {
        console.warn('[OrderPage] Firebase cancel update failed (offline ok)', e);
      }

      await updateTracking({ 
        maDon, 
        status: 'cancelled', 
        updatedAt: now,
        note: 'Hủy bởi người gửi' 
      });

      await loadOrders();
      if (selectedOrder?.maDon === maDon) setSelectedOrder(null);
    } catch (err) {
      console.error('Cancel failed', err);
      alert('Hủy đơn thất bại. Vui lòng thử lại.');
    } finally {
      setIsCancelling(null);
    }
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={header}>
        <div>
          <h2 style={title}>{pageTitle}</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>
            {isDriverHistory 
              ? 'Các đơn bạn đã giao hoàn tất • Lịch sử cá nhân của tài xế' 
              : 'Quản lý tất cả đơn bạn đã tạo • Dữ liệu từ local + Firebase'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => loadOrders()} style={refreshBtn}>🔄 Làm mới</button>
          <button onClick={() => navigate('/')} style={backBtn}>Trang chủ</button>
        </div>
      </div>

      {/* Stats */}
      <div style={statsRow}>
        <div style={statCard}>
          <div style={statNum}>{stats.total}</div>
          <div style={statLabel}>{isDriverHistory ? 'Đã giao' : 'Tổng đơn'}</div>
        </div>
        {isDriverHistory ? (
          <>
            <div style={statCard}>
              <div style={statNum}>{(stats as any).deliveredToday || 0}</div>
              <div style={statLabel}>Hôm nay</div>
            </div>
            <div style={statCard}>
              <div style={{...statNum, fontSize: 18}}>{((stats as any).codCollected || 0).toLocaleString()}</div>
              <div style={statLabel}>COD đã thu (đ)</div>
            </div>
          </>
        ) : (
          <>
            <div style={statCard}>
              <div style={statNum}>{stats.pendingCount}</div>
              <div style={statLabel}>Chờ xử lý</div>
            </div>
            <div style={statCard}>
              <div style={{...statNum, fontSize: 18}}>{stats.totalFee.toLocaleString()}</div>
              <div style={statLabel}>Tổng cước (Pi)</div>
            </div>
          </>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder={isDriverHistory ? "Tìm mã đơn, người nhận đã giao..." : "Tìm mã đơn, tên/SĐT..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />
      </div>

      {/* Tabs */}
      <div style={tabsContainer}>
        {TAB_OPTIONS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? activeTabBtn : tabBtn}
          >
            {tab.label}
            {tab.key === 'all' && ` (${filteredOrders.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <PullToRefresh onRefresh={loadOrders}>
        {loading ? (
          <div style={emptyState}>⏳ Đang tải đơn hàng của bạn...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={emptyState}>
            {search || activeTab !== 'all' 
              ? 'Không có đơn khớp bộ lọc.' 
              : 'Bạn chưa có đơn hàng nào.'}
            {!isDriverHistory && (
              <div style={{ marginTop: 16 }}>
                <button onClick={() => navigate('/gui-hang')} style={createBtn}>
                  📦 Tạo đơn gửi hàng mới
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={listContainer}>
            {filteredOrders.map((order: any) => {
              const status = order.status || order.trangThai || 'created';
              const isCopyingThis = copiedId === order.maDon;
              const cod = order.paymentMethod === 'cod' ? (order.codAmount || '0') : null;

              return (
                <div key={order.maDon} style={orderCard}>
                  <div style={cardTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong 
                        onClick={() => copyMaDon(order.maDon)} 
                        style={{ color: '#4c1d95', fontSize: 17, cursor: 'pointer' }}
                      >
                        {order.maDon}
                      </strong>
                      {isCopyingThis && <span style={{ color: '#10b981', fontSize: 11 }}>✓ Đã copy</span>}
                    </div>
                    <div style={{ ...statusBadgeBase, ...getStatusStyle(status) }}>
                      {getStatusLabel(status)}
                    </div>
                  </div>

                  <div style={receiverBlock}>
                    <div><strong>Người nhận:</strong> {order.nguoiNhan || '—'}</div>
                    <div style={{ fontSize: 13, color: '#475569' }}>{order.sdtNhan || ''} • {order.diaChiNhan || ''}</div>
                  </div>

                  <div style={metaRow}>
                    <span>⚡ {order.loaiDon === 'hoatoc' ? 'Hỏa tốc' : 'Đường dài'}</span>
                    <span>⚖️ {order.trongLuong || '?'}kg</span>
                    {order.moTaHang && <span>📦 {order.moTaHang}</span>}
                  </div>

                  <div style={moneyRow}>
                    <div>
                      Cước: <strong style={{ color: '#22d3ee' }}>{(order.totalAmount || 0).toLocaleString()} Pi</strong>
                    </div>
                    {cod && (
                      <div style={{ color: '#10b981' }}>
                        Thu hộ: <strong>{parseFloat(cod).toLocaleString()} Pi</strong>
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {order.paymentMethod === 'cod' ? 'COD' : 'Trả trước'}
                    </div>
                  </div>

                  <div style={cardFooter}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN', { 
                        month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' 
                      }) : ''}
                    </div>

                    <div style={actionRow}>
                      <button onClick={() => setSelectedOrder(order)} style={actionBtn}>Chi tiết</button>
                      <button onClick={() => navigate(`/tracking/${order.maDon}`)} style={actionBtn}>Theo dõi</button>
                      {!isDriverHistory && isCancellable(status) && (
                        <button 
                          onClick={() => handleCancelOrder(order.maDon)} 
                          disabled={isCancelling === order.maDon}
                          style={{...actionBtn, color: '#dc2626', borderColor: '#fecaca'}}
                        >
                          {isCancelling === order.maDon ? 'Đang hủy...' : 'Hủy'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PullToRefresh>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Chi tiết đơn ${selectedOrder.maDon}` : ''}
        confirmText="Theo dõi đơn"
        onConfirm={() => {
          if (selectedOrder) {
            const code = selectedOrder.maDon;
            setSelectedOrder(null);
            navigate(`/tracking/${code}`);
          }
        }}
        cancelText="Đóng"
      >
        {selectedOrder && (
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ ...statusBadgeBase, ...getStatusStyle(selectedOrder.status), display: 'inline-block' }}>
                {getStatusLabel(selectedOrder.status)}
              </span>
            </div>

            <div style={{ marginBottom: 10 }}>
              <strong>Người gửi:</strong> {selectedOrder.nguoiGui} — {selectedOrder.sdtGui}<br />
              <span style={{ color: '#64748b' }}>{selectedOrder.diaChiGui}</span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <strong>Người nhận:</strong> {selectedOrder.nguoiNhan} — {selectedOrder.sdtNhan}<br />
              <span style={{ color: '#64748b' }}>{selectedOrder.diaChiNhan}</span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong>Mô tả hàng:</strong> {selectedOrder.moTaHang || '—'}<br />
              <strong>Loại:</strong> {selectedOrder.loaiDon === 'hoatoc' ? 'Hỏa tốc' : 'Đường dài'} | 
              <strong> Cân nặng:</strong> {selectedOrder.trongLuong} kg
            </div>

            <div style={{ marginBottom: 8, padding: '8px 10px', background: '#f0f9ff', borderRadius: 8 }}>
              <strong>Thanh toán:</strong> {selectedOrder.paymentMethod === 'cod' ? 'Thu hộ (COD)' : 'Trả trước bằng Pi'}<br />
              Cước: <strong>{(selectedOrder.totalAmount || 0).toLocaleString()} Pi</strong><br />
              {selectedOrder.paymentMethod === 'cod' && (
                <>Thu hộ người nhận: <strong>{parseFloat(selectedOrder.codAmount || '0').toLocaleString()} Pi</strong></>
              )}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {!isDriverHistory && isCancellable(selectedOrder.status) && (
                <button 
                  onClick={() => handleCancelOrder(selectedOrder.maDon)} 
                  style={{ ...smallAction, background: '#fee2e2', color: '#991b1b' }}
                  disabled={isCancelling === selectedOrder.maDon}
                >
                  {isCancelling === selectedOrder.maDon ? 'Đang hủy...' : '🚫 Hủy đơn'}
                </button>
              )}
              <button onClick={() => copyMaDon(selectedOrder.maDon)} style={smallAction}>📋 Copy mã đơn</button>
            </div>
          </div>
        )}
      </Modal>

      {!isDriverHistory && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => navigate('/gui-hang')} style={createBtnBig}>
            + TẠO ĐƠN GỬI HÀNG MỚI
          </button>
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = { minHeight: '100vh', background: '#f3e8ff', padding: '16px 16px 110px', boxSizing: 'border-box' as const };
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' };
const title = { color: '#4c1d95', margin: 0, fontSize: 20 };
const backBtn = { background: '#4c1d95', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '9999px', fontSize: 12, fontWeight: 600, cursor: 'pointer' };
const refreshBtn = { background: '#e0d4ff', color: '#4c1d95', border: '1px solid #c4b5fd', padding: '6px 10px', borderRadius: '9999px', fontSize: 12, cursor: 'pointer' };

const statsRow = { display: 'flex', gap: 8, marginBottom: 12 };
const statCard = { flex: 1, background: 'white', borderRadius: 12, padding: '8px 10px', textAlign: 'center' as const, border: '1px solid #e0d4ff' };
const statNum = { fontSize: 20, fontWeight: 700, color: '#4c1d95' };
const statLabel = { fontSize: 11, color: '#64748b' };

const searchInput = { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #c4b5fd', background: '#ede9fe', color: '#4c1d95', fontSize: 14, boxSizing: 'border-box' as const };

const tabsContainer = { display: 'flex', gap: 6, overflowX: 'auto' as const, paddingBottom: 8, marginBottom: 8 };
const tabBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 9999, border: '1px solid #c4b5fd', background: 'white', color: '#4c1d95', fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer' };
const activeTabBtn: React.CSSProperties = { ...tabBtn, background: '#22d3ee', color: '#0f172a', borderColor: '#67e8f9', fontWeight: 600 };

const listContainer = { display: 'flex', flexDirection: 'column' as const, gap: 12 };
const orderCard: React.CSSProperties = { background: 'white', borderRadius: 16, padding: 14, border: '1px solid #e0d4ff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };

const cardTop = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 };
const statusBadgeBase: React.CSSProperties = { fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 9999, whiteSpace: 'nowrap' };

const receiverBlock = { fontSize: 14, lineHeight: 1.35, marginBottom: 6 };
const metaRow = { display: 'flex', gap: 10, fontSize: 12, color: '#475569', marginBottom: 6, flexWrap: 'wrap' as const };
const moneyRow = { display: 'flex', gap: 12, fontSize: 13, marginBottom: 8, alignItems: 'center' };

const cardFooter = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 8, marginTop: 4 };
const actionRow = { display: 'flex', gap: 4, flexWrap: 'wrap' as const };
const actionBtn: React.CSSProperties = { fontSize: 11, padding: '4px 8px', borderRadius: 8, border: '1px solid #c4b5fd', background: '#f8fafc', color: '#4c1d95', cursor: 'pointer', whiteSpace: 'nowrap' };

const emptyState = { textAlign: 'center' as const, color: '#64748b', padding: '40px 20px', background: 'white', borderRadius: 16, border: '1px dashed #c4b5fd' };
const createBtn = { background: '#4c1d95', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 9999, fontWeight: 600, cursor: 'pointer' };
const createBtnBig = { ...createBtn, width: '100%', padding: '14px', fontSize: 15 };

const smallAction: React.CSSProperties = { padding: '6px 10px', fontSize: 12, borderRadius: 9999, border: '1px solid #c4b5fd', background: '#f0f0f0', color: '#4c1d95', cursor: 'pointer' };

export default OrdersPage;